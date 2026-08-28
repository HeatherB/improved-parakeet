class Launcher::UsersController < LauncherController
  include Extensions::SessionsControllerEx

  #before_filter :launcher_force_logout, :only => [:new, :create]
  #before_filter :set_global_alerts, :only => [:new]
  #skip_after_filter :mark_user_active, :only => [:keepalive]
  #skip_before_filter :verify_authenticity_token, :only => [:new, :create]
  #skip_before_filter :check_game_maintenance, :only => [:login_form, :keepalive]

  # exclude :set_game filter for :keepalive since it incurs unnecessary database queries.
  # because a game object can be shared by lots of users, locking for the game object may incurs lots of lock conflicts.
  skip_before_filter :set_game, :only => [:keepalive]
  
  def new
    @user = User.new
    @mailing_lists = load_mailing_lists
    @game = Game.find(params[:launcher_id])
    if @game
      render "/launcher/users/#{@game.name.downcase}/new"
    end
  end
  
  def create
    params[:user][:date_of_birth] = nil
    params[:user][:terms] = "1"
    if params[:in_steam] == "true"
      params[:user][:signed_up_page] = "#{@game.name} Steam Launcher"
    else
      params[:user][:signed_up_page] = "#{@game.name} Launcher"
    end

    @user = User.create_user_phase1(:email                 => params[:user][:email],
                                    :password              => params[:user][:password],
                                    :password_confirmation => params[:user][:password_confirmation],
                                    :date_of_birth         => params[:user][:date_of_birth],
                                    :terms                 => params[:user][:terms],
                                    :signed_up_page        => params[:user][:signed_up_page],
                                    :io_black_box          => params[:user][:io_black_box],
                                    :referrer              => session[:original_referrer],
                                    :registration_ip       => request.remote_ip
    )
    User.create_user_phase2(@user,
                            :cookies                       => cookies,
                            :auto_subscribing_mailing_list => (params[:disable_auto_subscribing] == '1') ? false : true,
                            :mailing_list_ids              => MailingList.all.map { |mailing_list| mailing_list.id if params["receive_news_#{mailing_list.id}".to_sym] == '1' }.compact,
                            :referral_id                   => params[:rid]
    )
    render "/launcher/users/#{@game.name.downcase}/verify", :object => @user
  rescue ActiveRecord::RecordNotSaved
    @mailing_lists = load_mailing_lists
    @game = Game.find(params[:launcher_id])

    if @user.errors["email"] && @user.errors["email"].include?("has already been taken")
      flash.now[:error] = "Email already registered. Log in to your exisiting En Masse account."
    else
      errors = @user.errors.full_messages.clone
      errors.delete(" Failed to save record, retry later.")
      flash.now[:error] = errors.to_sentence
    end
    render "/launcher/users/#{@game.name.downcase}/new"
  end

  def activate
    @user = User.find(params[:account_id])
    if @user && @user.activation_code == params[:activation_code] && params[:secret_question_answer].present?
      if cookies[:steam_app_id].present?
        creation_path = 'auto_creation_steam'
      else
        creation_path = nil
      end
      notice, redir_path = User.create_user_phase3(
        @user,
        :secret_question_id => params[:secret_question_id],
        :secret_answer      => params[:secret_question_answer],
        :redir_path         => "none",
        :tslt_proc          => Proc.new { |x| tslt(x) },
        :is_logged_in       => logged_in?,
        :creation_path      => creation_path
      )
      flash[:notice] = "Account verified! Sign in to play!"
      return redirect_to "/launcher/#{@game.id}/signin"
    elsif @user && @user.activation_code != params[:activation_code]
      flash.now[:error] = "Incorrect activation code, type carefully or request new code."
      return render "/launcher/users/#{@game.name.downcase}/verify", :object => @user
    elsif @user && !params[:secret_question_answer].present?
      flash.now[:error] = "Empty secret answer, type carefully."
      return render "/launcher/users/#{@game.name.downcase}/verify", :object => @user
    else
      flash[:error] = "Could not activate that user."
      return redirect_to "/launcher/#{@game.id}/signin"
    end
  end

  def resend_activation
    screen_name = params[:screen_name]
    ticket = params[:ticket]

    @user = User.find_by_screen_name(screen_name)
    if @user && ticket == @user.resend_activation_ticket
      @user.resend_activation
      flash.now[:notice] = "#{tslt("your account activation mail has been resent please check your email")} #{@user.email} #{tslt("inluding spam junk folder for activation link")}"
      render "/launcher/users/#{@game.name.downcase}/verify", :object => @user
    else
      flash[:error] = tslt("there was a problem resending")
      redirect_to "/launcher/#{@game.id}/signin"
    end
  end

  def not_activated
    # Re-display account verification page when the user has not been activated
    @user = User.find_by_screen_name(params[:screen_name])
    if @user.nil? || @user.resend_activation_ticket != params[:ticket]
      flash[:error] = tslt("you do not have access to this resource")
      redirect_to "/launcher/#{@game.id}/signin"
    else
      render "/launcher/users/#{@game.name.downcase}/verify", :object => @user
    end
  end

  private

  def load_mailing_lists
    mailing_lists = []
    if ANTI_SPAM_TERRITORIES.include?(GeoIp.get_country_code(request.remote_ip)) || params[:show_newsletter_checkboxes] == '1'
      _m = MailingList.where(:auto_sign_up_for_game => @game.name).order(:position).all
      mailing_lists = _m.map do |mailing_list|
        {:name => mailing_list.name, :id => mailing_list.id, :tag => "receive_news_#{mailing_list.id}"}
      end
    end
    mailing_lists
  end

end
