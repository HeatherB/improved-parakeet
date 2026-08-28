class AuthorizationsController < ApplicationController
  layout "blank"

  skip_before_filter :check_io_result
  skip_before_filter :validate_engarde
  skip_before_filter :validate_additional_requirements
  skip_after_filter :store_location

  def create
    in_launcher = params[:in_launcher] == "true"
    in_steam = params[:in_steam] == "true"
    if in_launcher
      if params[:game_id]
        @game = Game.nolock.find(params[:game_id])
        redir = launcher_url(@game.id)
      end
    else
      @game = Game.nolock.find_by_name(params[:game_name]) if params[:game_name]
      if params["redir"] && params["redir"].length > 0
        redir = params["redir"]
      else
        redir = session[:sso_portal_next] || users_account_url(:login => true)
      end
    end

    if params[:campaign]
      signed_up_campaign = params[:campaign].to_json
    else
      signed_up_campaign = {}.to_json
    end

    if @game.present?
      game_name = @game.name
    else
      game_name = ""
    end

    if logged_in?
      u = current_user
      error = nil
    else
      u, error = nil
    end
    reset_and_rebuild_session
    session[:ip_address] = request.remote_ip

    if params[:encrypted_token]
      token = Authorization.decrypted_token(params[:encrypted_token])
      auth_hash = { 'provider' => params[:provider], 'credentials' => { 'token' => token } }
      authorization = Authorization.find_by_provider_and_token(auth_hash['provider'], auth_hash['credentials']['token'])
      initial_authorization = false
      new_user = false
    else
      auth_hash = request.env['omniauth.auth']
      if auth_hash
        auth_hash.merge!({'extra' => {'ip_address' => request.remote_ip}})
        authorization = Authorization.find_by_provider_and_uid(auth_hash['provider'], auth_hash['uid'])

        if authorization
          initial_authorization = false
          new_user = false
        else
          logger.info "Creating User using hash=#{auth_hash}, game=#{game_name}, auto_subscribe_newsletters=#{params[:auto_subscribe_newsletters]}, newsletter_ids=#{params[:newsletter_ids]}, in_launcher=#{in_launcher}, in_steam=#{in_steam}"
          authorization, new_user = Authorization.create_from_hash(auth_hash,
                                                                   :cookies => cookies,
                                                                   :game => game_name,
                                                                   :user => u,
                                                                   :auto_subscribe_newsletters => params[:auto_subscribe_newsletters],
                                                                   :newsletter_ids => params[:newsletter_ids],
                                                                   :io_black_box => params[:blackbox],
                                                                   :original_referrer => session[:original_referrer],
                                                                   :in_launcher => in_launcher,
                                                                   :in_steam => in_steam,
                                                                   :signed_up_campaign => signed_up_campaign
          )
          initial_authorization = true
        end
      end
    end

    if authorization
      u = authorization.user

      # Rails.logger.warn "REQUEST DATA!!!!!"
      # Rails.logger.warn redir
      # Rails.logger.warn request.env.inspect

      # Facebook-specific actions
      if authorization.provider == 'facebook'
        authorization.extend_token!(auth_hash['credentials']['token'])
      end

      if params[:blackbox]
        if in_launcher == false
          io_type = "login"
        else
          if game_name.downcase == "tera"
            io_type = "game-login"
          else
            io_type = "game-login_#{game_name.downcase}"
          end
        end
        u.update_iovation!(request.remote_ip, params[:blackbox], io_type)
      end

      # setup redirect path
      if new_user
        if in_launcher
          #if game_name.downcase == "battleplans"
          #  render :partial => "launcher/battleplans/no_accounts", :layout => "blank" and return
          #end
          redir = additional_requirements_users_path(:in_launcher => true, :game_id => @game.id)
        else
          redir = additional_requirements_users_path
        end
        self.current_user = u
        persist_ams_cookie
      else
        if u.activation_code.present?
          error, error_msg = User.auth_error_code_for(:not_activated), tslt("this account has not been activated")
          if in_launcher
            self.current_user = u
            persist_ams_cookie
            #if game_name.downcase == "battleplans"
            #  render :partial => "launcher/battleplans/no_accounts", :layout => "blank" and return
            #end
            redir = additional_requirements_users_url(:in_launcher => true, :game_id => @game.id)
          else
            redir = not_activated_users_url(:u => u.screen_name, :ticket => u.resend_activation_ticket)
          end
        elsif u.deleted?
          error, error_msg = User.auth_error_code_for(:not_found), tslt("account has been disabled")
          if in_launcher
            redir = launcher_signin_url(@game.id)
          else
            redir = index_url
          end
        elsif u.legacy_account?
          error, error_msg = User.auth_error_code_for(:legacy_account), tslt("please complete the setup of your new En Masse account")
          redir = complete_password_reset_user_url(u.screen_name, :ticket => u.forgot_password_key)
        elsif in_launcher && u.suspended_from_game?
          error, error_msg = User.auth_error_code_for(:suspended), tslt("this account is currently banned or suspended")
          redir = launcher_signin_url(@game.id)
        else
          self.current_user = u
          persist_ams_cookie
        end
      end
    else
      error, error_msg = User.auth_error_code_for(:provider_failure), tslt("invalid authorization")
      if in_launcher
        redir = launcher_signin_url(@game.id)
      else
        redir = index_url
      end
    end

    respond_to do |format|
      format.json do
        result = { :redir => redir, :success => logged_in? }
        if error
          result[:error] = error_msg
        else
          result[:initial_authorization] = initial_authorization
          result[:new_user] = new_user
          if in_launcher
            result[:encrypted_token] = authorization.encrypted_token
          else
            result[:notice] = tslt("you are now logged in")
          end
        end
        render :json => result
      end
      format.html do
        if error
          flash[:error] = error_msg
        else
          flash[:notice] = tslt("you are now logged in")
        end
        redirect_to redir
      end
    end
  ensure
    options = { :ip_address => request.remote_ip, :success => logged_in?, :error_code => error,
                :in_launcher => in_launcher, :in_steam => in_steam, :game_name => game_name}
    options.merge!(:user_id => u.id) if u.present?
    WebAuthenticationRecord.create(options)
  end

  def redirect
    @provider = params[:provider]
  end

  def failure
    flash[:error] = tslt("invalid authorization")
    redirect_back_or_default index_path
  end

  def picture
    result = {}
    if params[:encrypted_token]
      token = Authorization.decrypted_token(params[:encrypted_token])
      authorization = Authorization.find_by_provider_and_token(params[:provider], token)

      if authorization
        if authorization.provider == "facebook"
          result[:picture] = "//graph.facebook.com/v2.6/#{authorization.uid}/picture"
        else
          result[:error] = "No picture for this provider"
        end
      else
        result[:error] = "Invalid token"
      end
    else
      result[:error] = "Invalid token"
    end

    respond_to do |format|
      format.json do
        render :json => result
      end
    end
  end

end
