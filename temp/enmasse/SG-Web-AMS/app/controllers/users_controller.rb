class UsersController < ApplicationController
  skip_after_filter :store_location
  before_filter :form_dupe_protection, :only => [:update]
  before_filter :check_country_permitted, :only => [:new, :create]
  before_filter :set_cache_buster, :only => [:new]
  before_filter :set_current_app
  before_filter :set_global_alerts, :only => [:new, :activate, :complete_activation, :password_reset, :submit_password_reset_1, :submit_password_reset_2, :validate_password_reset, :complete_password_reset, :additional_requirements, :submit_additional_requirements, :verified]

  skip_before_filter :validate_additional_requirements, :only => [:additional_requirements, :submit_additional_requirements]
  skip_before_filter :verify_authenticity_token, :only => [:update_iovation]

  def new
    if params[:rid].present?
      @referral = Referral.find_by_id(Referral.unobfuscated_id(params[:rid]))
      @user = User.find_by_email(@referral.email) if @referral.present?

      if @user.present?
        flash[:notice] = tslt('referral already has an account please log in')
        return redirect_to signin_path(:rid => params[:rid])
      end
    end

    @game = (params[:game] || "").downcase
    @game_obj = Game.where(seo_id: @game.downcase).first
    if current_user && current_user != :false
      @beta_app = BetaApplication.where(game_id: @game_obj.id, user_id: current_user.id).first
    end
    if @game && params[:campaign]
      campaign = params[:campaign].downcase
      revision = params[:v].downcase if params[:v]
    end
    @campaign = SignupCampaign.fetch_page_info(@game, campaign, revision)

    if logged_in? && ["zmr"].include?(@game)
      flash[:warning] = tslt("you are already logged in")
      return redirect_to users_account_path
    elsif !logged_in?
      @user = User.new(:receive_news => true)
      @secret_questions = SecretQuestion.active
      @referral = Referral.find_by_id(Referral.unobfuscated_id(params[:rid])) if params[:rid]
      session[:new_facebook_redir] = "/#{@game}"
    else
      @user = current_user
    end
    session[:game] = @game

    @mailing_lists = []
    if ANTI_SPAM_TERRITORIES.include?(GeoIp.get_country_code(request.remote_ip)) || params[:show_newsletter_checkboxes] == '1'
      if !params[:game].nil? && !params[:game].empty?
        mailing_lists = MailingList.where(:auto_sign_up_for_game => params[:game]).order(:position).all
      else
        mailing_lists = MailingList.order(:position).all
      end
      @mailing_lists = mailing_lists.map do |mailing_list|
        {:name => mailing_list.name, :id => mailing_list.id, :tag => "receive_news_#{mailing_list.id}"}
      end
    end

    if ['tera', 'zmr', 'battleplans', 'kritika'].include?((params[:game] || "").downcase)
      if params[:game].downcase == "zmr"
        @zmr_newsletter_id = MailingList.where(:name => "ZMR newsletter").pluck(:id).first
      elsif params[:game].downcase == "battleplans"
        @bp_newsletter_id = MailingList.where(:name => "Battleplans newsletter").pluck(:id).first
      end
      #render :layout => "landing", :template => "users/#{params[:game]}-new"
      render :layout => "signup", :template => "users/new"
    else
      render :layout => "signup", :template => "users/new"
    end
  end

  def set_global_alerts
    # if on a sign up page, use home page 'global alert'
    # else use the 'global alert' for the request.path
    if (request.path.end_with? "/sign-up")
      @global_alerts = GlobalAlert.for_path('/')
    else
      @global_alerts = GlobalAlert.for_path(request.path)
    end
  end

  def create
     # Disable iovation check for before-signup step temporarily
    #
    ## check iovation before creation, if "(@denyAction)" is included in iovation status, then kick him out.
    #io_check =
    # (nil,                      # since user_id is unknown for now, set the first parameter as nil
    #                                          params[:user][:email],
    #                                          request.remote_ip,
    #                                          params[:user][:io_black_box],
    #                                          { :io_type => "login" })
    #io_response = io_check.io_response
    #
    #if iovation_denied_by_deny_action?
    #  error_message = tslt("banned iovation sign up error")
    #  if request.xhr?
    #    json = {}
    #    if error_message != ""
    #      json[:errors] = [error_message]
    #    end
    #    render :json => json.to_json
    #    return
    #  else
    #    if error_message != ""
    #      flash[:error] = error_message
    #    end
    #    redirect_to index_path
    #    return
    #  end
    #end

    if params[:user]
      # receiving date_of_birth was disabled.
      #
      #unless params[:user][:date_of_birth] # manually merge multiparameter dob
      #  params[:user][:date_of_birth] = Date.new(params[:user][:date_of_birth_year].to_i, params[:user][:date_of_birth_month].to_i, params[:user][:date_of_birth_day].to_i)
      #
      #  params[:user].delete(:date_of_birth_year)
      #  params[:user].delete(:date_of_birth_month)
      #  params[:user].delete(:date_of_birth_day)
      #end

      # reconstruct campaign object from the parameter
      campaign_params = (params[:campaign] || {}) rescue {}
      @campaign = SignupCampaign.fetch_page_info(campaign_params[:game], campaign_params[:campaign], campaign_params[:revision])

      params[:user][:date_of_birth] = nil
      params[:user][:terms] = "1"
      params[:user][:signed_up_page] = params[:game]
      params[:user][:signed_up_campaign] = {
        game:     @campaign.game,
        campaign: @campaign.loaded_campaign,
        revision: @campaign.loaded_revision
      }.to_json
      #params[:user][:receive_news] = "1"

      if params[:ticket].present? # legacy acct "creation"
        email = params[:user].delete(:email)
        @user = User.find_by_email(email)

        unless @user.present? && @user.can_reset_password?(params[:ticket])
          if request.xhr?
            json = {}
            json[:errors] = ['invalid ticket or email has already been taken']
            return render :json => json.to_json
          else
            flash[:error] = tslt("invalid ticket or email has already been taken")
            return redirect_to index_path
          end
        else
          @user.attributes      = params[:user]
          @user.account_status  = User.account_status_for(:not_activated)
          @user.referrer        = session[:original_referrer]
          @user.registration_ip = request.remote_ip
        end
      else
        @user = User.create_user_phase1(:email                 => params[:user][:email],
                                        :password              => params[:user][:password],
                                        :password_confirmation => params[:user][:password_confirmation],
                                        :date_of_birth         => params[:user][:date_of_birth],
                                        :terms                 => params[:user][:terms],
                                        :signed_up_page        => params[:user][:signed_up_page],
                                        :signed_up_campaign    => params[:user][:signed_up_campaign],
                                        :io_black_box          => params[:user][:io_black_box],
                                        :referrer              => session[:original_referrer],
                                        :registration_ip       => request.remote_ip
        )
      end

      User.create_user_phase2(@user,
                              :cookies                       => cookies,
                              :auto_subscribing_mailing_list => (params[:disable_auto_subscribing] == '1') ? false : true,
                              :mailing_list_ids              => MailingList.all.map { |mailing_list| mailing_list.id if params["receive_news_#{mailing_list.id}".to_sym] == '1' }.compact,
                              :referral_id                   => params[:rid],
                              :send_activation_email         => true
      )

      if request.xhr?
        if params[:ticket].present? # legacy account createion
          flash.now[:notice] = tslt("your password has been successfully updated")
          json = {}
          json[:redirect_url] = index_path
          render :json => json.to_json
        else
          esp_hash = @user.email_service_provider_hash
          esp_hash[:activation_ticket_link] = "#{resend_activation_user_path(@user.screen_name, :ticket => @user.resend_activation_ticket)}"
          render :json => esp_hash.to_json
        end
      else
        render "registration_success", :object => user
      end

    else
      if request.xhr?
        json = {}
        json[:errors] = ['invalid parameters']
        return render :json => json.to_json
      else
        flash[:error] = tslt("invalid parameters")
        return redirect_to index_path
      end
    end
  rescue ActiveRecord::RecordNotSaved
    if request.xhr?
      json = {}
      errors = []
      @user.errors.each do |attribute, error|
        unless attribute.empty?
          errors << "#{attribute}: #{error.to_s}"
        else
          errors << "#{error.to_s}"
        end
      end
      json[:errors] = errors
      render :json => json.to_json
    else
      flash[:error] = @user.errors.full_messages.clone.to_sentence
      redirect_to index_path
    end
  end

  def game_newsletter
    if !logged_in?
      flash[:notice] = "You need to be logged in to sign up for a newsletter."
      return redirect_to "/users/new"
    end
    session[:game] ||= (params[:game] || "").downcase
    if (session[:game] || params[:newsletter_id]) && current_user
      mls = MailingList.where(:auto_sign_up_for_game => (session[:game] || params[:newsletter_id]), :active => true).all
      puts "AUTO Subscribing to: #{mls[0]}"
      if mls[0]
        if current_user.mailing_lists.include?(mls[0])
          flash[:notice] = "You were already subscribed to #{mls[0].name}"
        else
          flash[:notice] = "You are now subscribed to #{mls[0].name}"
          mls[0].subscribe(current_user.id)
          #send email
          UserMailer.queue(:welcome_to_game, current_user, mls[0].auto_sign_up_for_game) unless mls[0].auto_sign_up_for_game.empty?
        end
      end
    end
    redirect_to verified_users_path
  end

  def resend_activation
    u = params[:id]
    ticket = params[:ticket]

    user = User.find_by_screen_name(u)
    @campaign = SignupCampaign.fetch_page_info_by_user(user)
    if user && ticket == user.resend_activation_ticket
      user.resend_activation
      @page_copy = "Your account activation email has been resent, please check your email, including spam junk folders for your activation link."
      #flash[:notice] = "#{tslt("your account activation mail has been resent please check your email")} #{user.email} #{tslt("including spam junk folders for your activation link")}"
    else
      @page_copy = tslt("there was a problem resending")
      #flash[:error] = tslt("there was a problem resending")
    end
    #redirect_to index_url
    render :layout => "signup", :template => "users/resend_activation"
  end

  def not_activated
    @user = User.find_by_screen_name(params[:u])
    if @user.nil? || @user.resend_activation_ticket != params[:ticket]
      flash[:error] = tslt("you do not have access to this resource")
      return redirect_to index_path
    end
    @campaign = SignupCampaign.fetch_page_info_by_user(@user)
    render :layout => "signup", :template => "users/not_activated"
  end

  def activate
    logout_user if logged_in?

    @campaign = SignupCampaign.fetch_page_info_by_user(User.find_by_screen_name(params[:id]))
    if params[:id].nil? || params[:ticket].nil?
      #render 'users/activation_failure'
      render :layout => "signup", :template => "users/activation_failure"
    else
      @user = User.nolock.find(:first, :conditions => ["screen_name = ? and activation_code = ?", params[:id], params[:ticket]])
      if @user.nil?
        #render 'users/activation_failure'
        render :layout => "signup", :template => "users/activation_failure"
      elsif @user.expired_activation_code?
        @user.resend_activation
        flash[:notice] = "#{tslt("your account activation mail has been resent please check your email")} #{@user.email} #{tslt("inluding spam junk folder for activation link")}"
        #render 'users/activation_failure'
        render :layout => "signup", :template => "users/activation_failure"
      else
        @id = params[:id]
        @ticket = params[:ticket]
        @secret_questions = SecretQuestion.active
        #render 'users/activate'
        render :layout => "signup", :template => "users/activate"
      end
    end
  end

  def complete_activation
    logout_user if logged_in?

    @campaign = SignupCampaign.fetch_page_info_by_user(User.find_by_screen_name(params[:id]))
    if params[:id].nil? || params[:ticket].nil? || params[:user].nil?
      #render 'users/activation_failure'
      render :layout => "signup", :template => "users/activation_failure"
    else
      @user = User.nolock.find(:first, :conditions => ["screen_name = ? and activation_code = ?", params[:id], params[:ticket]])

      if @user.nil?
        #render 'users/activation_failure'
        render :layout => "signup", :template => "users/activation_failure"
      else
        notice, redir_path = User.create_user_phase3(
          @user,
          :secret_question_id => params[:user][:secret_question_id],
          :secret_answer      => params[:user][:secret_answer],
          :redir_path         => verified_users_path,
          :tslt_proc          => Proc.new { |x| tslt(x) },
          :is_logged_in       => logged_in?
        )
        if redir_path.nil?
          flash.now[:notice] = notice if notice
          render :layout => "signup", :template => "users/activation_failure"
        else
          flash[:notice] = notice if notice
          session[:user_id] = @user.id
          session[:game] = @user.signed_up_game_name
          redirect_to redir_path
        end
      end

    end
  end

  def verified
    @game = (params[:game] || "").downcase
    @game_obj = Game.where(seo_id: @game.downcase).first
    if current_user && current_user != :false
      @beta_app = BetaApplication.where(game_id: @game_obj.id, user_id: current_user.id).first
    end
    user = User.find_by_id(session[:user_id]) rescue nil
    @campaign = SignupCampaign.fetch_page_info_by_user(user)
    @game_obj = Game.where(seo_id: @campaign.game).first if @game_obj.nil? && @campaign
    render :layout => "signup", :template => "users/activation_success"
    # redirect for beta - currently does not work, right landing page but we lose the login and cant apply
    #if @game_obj && @game_obj.beta_applications_open
    #  render :layout => "signup", :template => "users/beta_final"
    #else
    #  render :layout => "signup", :template => "users/activation_success"
    #end
  end

  def confirm_email_change
    logout_user if logged_in?
    @user = User.find_by_screen_name(params[:id])

    if @user && @user.confirm_email_change(params[:ticket])
      flash[:notice] = "Your email address has been updated to '#{@user.email}' and can now be used to login."
      UserMailer.queue(:email_changed_notice, @user)
    else
      flash[:error] = tslt("invalid ticket or email has already been taken")
    end
    redirect_to signin_path
  end

  def submit_password_reset
    @account_pages = "acct_pages"
    logout_user if logged_in?
    @user = User.find_by_screen_name(params[:id])

    unless @user && @user.can_reset_password?(params[:ticket])
      flash[:error] = tslt("you cannot reset your password at this time")
      return redirect_to signin_path
    else
      @user.password = params[:user][:new_password]
      @user.password_confirmation = params[:user][:new_password_confirmation]
      if @user.password.blank?
        flash[:error] = tslt("password is invalid")
      elsif @user.save
        flash[:notice] = tslt("your password has been successfully updated")
        UserMailer.queue(:password_changed_notice, @user)
        return redirect_to signin_path
      else
        flash[:error] = @user.errors.full_messages.to_sentence
      end
    end
    redirect_to complete_password_reset_user_path(
      @user.screen_name,
      :ticket => @user.forgot_password_key
    )
  end

  def complete_password_reset
    @account_pages = "acct_pages"
    logout_user if logged_in?
    @user = User.find_by_screen_name(params[:id])

    if @user && @user.can_reset_password?(params[:ticket])
      if @user.legacy_account?
        redirect_to legacy_registration_user_path(
          @user.screen_name,
          :ticket => @user.forgot_password_key
        )
      end
    else
      flash[:error] = tslt("you cannot reset your password at this time")
      redirect_to signin_path
    end
  end

  def password_reset
    @account_pages = "acct_pages"
  end

  def submit_password_reset_1
    @account_pages = "acct_pages"
    @user = User.find_by_email(params[:email])
    if @user.present?
      if @user.legacy_account?
        # skip secret question validation for legacy accounts since we don't know it
        @user.request_password_reset
        redirect_to validate_password_reset_users_path
      else
        @secret_question = SecretQuestion.find(@user.secret_question_id)
        render "users/password_reset_step_2"
      end
    else
      flash[:error] = tslt("could not find account matching that email address")
      redirect_to password_reset_users_path
    end
  rescue Exception => ex
    flash[:error] = ex.message
    redirect_to password_reset_users_path
  end

  def submit_password_reset_2
    @account_pages = "acct_pages"
    @user = User.find_by_email(params[:email])
    if @user.present?
      # matching secret_answer using decrypting
      # if fails, matching it using encrypting
      #
      # Most of the cases, the first method works well. But, some non-ascii character in the secret answer like 'El Niño',
      # then the first method fails. In this case, the second method works as a backup method.
      #
      # The reason why the first method fails is that it modifies the unicode encoding of the original string.
      # PS) we can test using the second method only, but it is not case insensitive. So, we use it as a backup method.
      if @user.secret_answer_matched? params[:secret_answer]
        @user.request_password_reset
        redirect_to validate_password_reset_users_path
      else
        flash.now[:error] = tslt("the answer you provided does not match our records")
        @secret_question = SecretQuestion.find(@user.secret_question_id)
        render "users/password_reset_step_2"
      end
    else
      flash[:error] = tslt("could not find account matching that email address")
      redirect_to password_reset_users_path
    end
  rescue Exception => ex
    flash[:error] = ex.message
    redirect_to password_reset_users_path
  end

  def validate_password_reset 
    @account_pages = "acct_pages"
  end

  def legacy_registration
    logout_user if logged_in?
    @user = User.find_by_screen_name(params[:id])
    @campaign = SignupCampaign.fetch_page_info_by_user(@user)

    if @user && @user.legacy_account? && @user.can_reset_password?(params[:ticket])
      @mailing_lists = []
      if ANTI_SPAM_TERRITORIES.include?(GeoIp.get_country_code(request.remote_ip)) || params[:show_newsletter_checkboxes] == '1'
        if !params[:game].nil? && !params[:game].empty?
          mailing_lists = MailingList.where(:auto_sign_up_for_game => params[:game]).order(:position).all
        else
          mailing_lists = MailingList.order(:position).all
        end
        @mailing_lists = mailing_lists.map do |mailing_list|
          {:name => mailing_list.name, :id => mailing_list.id, :tag => "receive_news_#{mailing_list.id}"}
        end
      end

      @secret_questions = SecretQuestion.active
      render :layout => "landing", :action => "new"
    else
      flash[:error] = nil
      redirect_to signin_path
    end
  end

  # action for form validation calls
  def ajax_check_field
    field_name = params["field_name"]
    field_val = params[field_name]

    # don't check all fields... only the ones we explicitly specify
    # add special check for beta key registration (as usage isn't stored in the user model)
    if ["screen_name","email","user_email"].include?(field_name)
      errs = User.validate_field(field_name, field_val)
      field_display = User.human_attribute_name(field_name)
      additional_content = find_available_names(field_val) if field_name == "screen_name" && errs.size > 0
      ourerror = 'does not appear to be valid'
      ##
      if errs.include?(ourerror)
        errs = 'is invalid'
        render :text => (errs.size > 0 ? "#{field_display} #{errs}#{additional_content.present? ? additional_content : '.'}" : "")
      else
        render :text => (errs.size > 0 ? "#{field_display} #{errs.join(',')}#{additional_content.present? ? additional_content : '.'}" : "")
      end
      ##
      #render :text => (errs.size > 0 ? "#{field_display} #{errs.join(',')}#{additional_content.present? ? additional_content : '.'}" : "")
    else
      render :text => ""
    end
  end

  def change_language
    code = params[:language_code]
    if code.present? && ACTIVE_LANGUAGES.collect(&:iso6391).include?(code)
      # assign to cookie
      cookies[:language_code] = {:value => code, :expires => 5.years.from_now}

      # update user's stored language if user is logged in
      @user.update_attribute(:language, code) if logged_in?
    end
    render :nothing => true, :status => 200
  end

  # update iovation information for the given user, this handler was made for services.auth's authenticate api
  def update_iovation
    begin
      screen_name = params[:id]
      user_client_ip = params[:user_client_ip]
      io_blackbox = params[:io_blackbox]
      email = params[:email]
      if email.nil?
        raise ArgumentError.new "email is missing"
      end
      password = params[:password]
      if password.nil?
        raise ArgumentError.new "password is missing"
      end
      if io_blackbox.nil?
        raise ArgumentError.new "io_blackbox is missing"
      end
      io_type = params[:io_type]
      if io_type.nil?
        raise ArgumentError.new "io_type is missing"
      end

      user = User.find_by_screen_name(screen_name)
      if user.present?
        if user.email != email
          raise ArgumentError.new "email is mismatched"
        end
        if not user.authenticated?(password)
          raise ArgumentError.new "password is mismatched"
        end

        user.update_iovation!(user_client_ip, io_blackbox, io_type)

        result = {:io_result => user.io_result,
                  :io_reason => user.io_reason,
                  :io_device_alias => user.io_device_alias,
                  :io_tracking_number => user.io_tracking_number,
                  :exception_class => nil,
                  :exception_message => nil}

        render :json => result.to_json
      else
        raise ArgumentError.new "the given user cannot be found"
      end
    rescue => e
      render :json => {:exception_class => e.class.to_s, :exception_message => e.message}.to_json
    end
  end

  def additional_requirements
    @user = current_user
    if @user == :false || @user.secret_question_id.present?
      redirect_to index_path
    else
      @campaign = SignupCampaign.fetch_page_info_by_user(@user)
      in_launcher = params[:in_launcher] == "true"
      @secret_questions = SecretQuestion.active
      if in_launcher
        @game = Game.find(params[:game_id])
        render "users/#{@game.name.downcase}/launcher_additional_requirements", :layout => 'signup'
      else
        #render 'users/additional_requirements'
        render :layout => "signup", :template => "users/additional_requirements"
      end
    end
  end

  def submit_additional_requirements
    @user = current_user
    if @user == :false || @user.secret_question_id.present?
      redirect_to index_path
    else
      @campaign = SignupCampaign.fetch_page_info_by_user(@user)
      in_launcher = params[:in_launcher] == "true"
      if in_launcher
        game = Game.nolock.find(params[:game_id])
        if game
          success_redir = launcher_path(game.id)
        else
          success_redir = index_path
        end
      else
        success_redir = verified_users_path
      end

      notice, redir_path = User.create_user_phase3(
        @user,
        :secret_question_id => params[:user][:secret_question_id],
        :secret_answer      => params[:user][:secret_answer],
        :redir_path         => success_redir,
        :tslt_proc          => Proc.new { |x| tslt(x) },
        :is_logged_in       => logged_in?
      )

      if redir_path.nil?
        flash.now[:notice] = notice if notice
        @secret_questions = SecretQuestion.active
        if in_launcher
          render "users/#{game.name.downcase}/launcher_additional_requirements", :layout => 'signup'
        else
          #render 'users/additional_requirements'
          render :layout => "signup", :template => "users/additional_requirements"
        end
      else
        flash[:notice] = notice if notice
        session[:user_id] = @user.id
        session[:game] = @user.signed_up_game_name
        redirect_to redir_path
      end
    end
  end

  protected

  def set_current_app
    @current_app = "account"
  end

  def find_available_names(name)
    return "" unless User.exists?(:screen_name => name)
    out = ""

    alt_names = User.alternate_names(name)
    if alt_names.size > 0
      out = "<script>AlternateNames = ["
      out << alt_names.collect { |n| "'#{n}'" }.join(",")
      out << "];</script>"
    end
    out
  end

  def check_country_permitted
    country_code = GeoIp.get_country_code(request.remote_ip)
    if NON_LICENSED_TERRITORIES.include?(country_code)
      flash[:warning] = tslt("login country limited")
      redirect_to index_path
    end
  end

  def set_cache_buster
    response.headers["Cache-Control"] = "no-cache, no-store, max-age=0, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "Fri, 01 Jan 1990 00:00:00 GMT"
  end

end
