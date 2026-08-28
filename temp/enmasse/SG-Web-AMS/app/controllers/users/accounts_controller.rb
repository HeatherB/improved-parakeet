class Users::AccountsController < ApplicationController
  include ApplicationHelper
  before_filter :login_required
  before_filter :set_user_instance, :except => [:ajax_check_field]
  before_filter :set_current_app
  before_filter :list_genre, :list_type, :list_platform
  before_filter :set_global_alerts, :only => [:show, :profile]
  skip_after_filter :store_location, :except => [:show, :profile]

  # TODO : make a separate engarde controller... also refactor for the
  # name change to "Account Armor"
  ENGARDE_ACTIONS = [:engarde_verification, :submit_engarde_verification, :resend_engarde_ticket]

  before_filter :ensure_engarde_applicable, :only => ENGARDE_ACTIONS
  skip_before_filter :check_site_maintenance, :only => ENGARDE_ACTIONS
  skip_before_filter :check_game_maintenance, :only => ENGARDE_ACTIONS
  skip_before_filter :validate_engarde, :only => ENGARDE_ACTIONS
  skip_before_filter :validate_additional_requirements, :only => ENGARDE_ACTIONS

  def show
    flash.now[:warning] = tslt(params[:msg]) if params[:msg].present?

    # added things
    if @user.temp_screen_name
      @account_pages = "acct_pages show_nicknamer"
    else
      @account_pages = "acct_pages"
    end
    
    @facebook_authorization = current_user.authorizations.find_by_provider("facebook")
    @steam_authorization = current_user.authorizations.find_by_provider("steam")
    # coming soon, may need naming change
    @xbox_authorization = current_user.authorizations.find_by_provider("xbox")
    @playstation_authorization = current_user.authorizations.find_by_provider("playstation")
    @mailing_lists = MailingList.where(:active => true)

    # yesmail specific
    sync_with_yesmail

    billing_info = Payletter::Client.new.get_billing_information(current_user.id)
    unless billing_info.user_name.empty?
      @billing_info = billing_info
    else
      @billing_info = nil
    end

    user_id = current_user.id
    @emp_wallet_balance = User.get_emp_wallet_balance(user_id)
    # end added things
    @game_accounts = current_user.game_accounts.order("created_at DESC").nolock.all(:include => [:game_account_type, { :game => :game_image }])

    @games_all = Game.active.all
    games = Game.active.all
    all_game_ids = games.collect{|g| g.id }
    have_game_ids = @game_accounts.collect{|x| x.game_id }
    dont_have_game_ids = all_game_ids - have_game_ids

    @games_without_accounts = if dont_have_game_ids.length > 0
      Game.where(:id => dont_have_game_ids).order("created_at DESC")
    else
      []
    end

    @migratable_games_without_accounts = @games_without_accounts.select { |game| game.setting(:allow_migration).to_s == 'true' }

    @subscriptions = Subscription.find_all_active_for_master_account_id(current_user.id)
    @subscriptions = @subscriptions.select { |subscription| @game_accounts.collect(&:id).include? subscription.game_account_id }
    
    # find unredeemed codes where the codes were external group promo codes or non-group promo codes
    # (that is, unredeemed internal group promo codes will be excldued)
    @unredeemed_codes = current_user.promo_codes.includes(:promo_code_batch => [:group_promo_codes]).where(:fulfillment_complete => false).where("group_promo_codes.internal_only = 0 or promo_code_batches.group_code = ''")
    @unredeemed_rewards = current_user.progressive_goal_rewards.all(:include => [:promotion], :conditions => { :fulfillment_complete => false })

    @free_play_settings = FreePlaySetting.all_from_cache

    # hard-coded for TERA. need to fix.
    de_acct_id = GameAccountType.first(:select => 'id', :conditions => { :name => 'Standard' }).id
    @de_num = @game_accounts.count { |row| row.game_account_type_id === de_acct_id }
    @valid_ext_promo = @game_accounts.any? { |acct| acct.game.ext_macct_cmpn_id != -1 }

    @games_in_beta = Game.where(beta_applications_open: true).all
    @beta_applications = BetaApplication.where(user_id: current_user.id, game_id: @games_in_beta.map{|g| g.id }).all
  end

  def profile
    @facebook_authorization = current_user.authorizations.find_by_provider("facebook")
    @steam_authorization = current_user.authorizations.find_by_provider("steam")
    @mailing_lists = MailingList.where(:active => true)

    # yesmail specific
    sync_with_yesmail

    billing_info = Payletter::Client.new.get_billing_information(current_user.id)
    unless billing_info.user_name.empty?
      @billing_info = billing_info
    else
      @billing_info = nil
    end
  end

  def sync_with_yesmail
    # 1. try to get profile/subscription info from yesmail with user email
    # 2. if record exists
    # => 2.1 compare it with MailingListSubscription
    # => 2.2 if matches, return subscriptions and we're done
    # => 2.3 else, update MailingListSubscription and return them. Done.
    # 3. else, create record in yesmail
    # 4. update yesmail subscriptions with MailingListSubscription
    # 5. return them and we're done.

    # Note. If we not using yesmail anymore, just return:
    # => MailingList.where(:active => true)

    # 1. get profile info
    begin
      result = Mailer::YesMail::Api::Subscribers.get(current_user.email)
      if result.respond_to?(:id)
        # we have current user record in yesmail

        # update our DB with yesmail
        subs_yesmail = {}
        subs_ours = {}
        result.subscriptions.memberOf.each do |x|
          subs_yesmail[x] = 1
        end
        current_user.mailing_lists.each do |x|
          subs_ours[x.yesmail_subscription] = 1
        end

        # compare the two
        return if _compare_subscriptions(subs_yesmail, subs_ours)      # already synced. done.

        # update our db
        _update_subscription_ams(result.subscriptions.memberOf)

      else
        # we don't have current user record in yesmail
        Mailer::YesMail::Api::Subscribers.create(current_user.email, {:profile => {},
          :subscriptions =>result.subscriptions.memberOf,
          :target_lists =>[]})
      end
    rescue => e
      Rails.logger.error e.message + "\n " + Utils::clean_trace(e.backtrace).join("\n ")
    end
  end

  def _compare_subscriptions(a, b)
    return false if a.count != b.count
    a.each do |k,v|
      return false if a[k] != b[k]
    end
    return true
  end

  def _update_subscription_ams(subscriptions)
    MailingListSubscription.transaction do
      current_user.mailing_lists.destroy_all
      subscriptions.each do |x|
        ml = MailingList.where(:yesmail_subscription => x)
        next unless ml.count == 1
        MailingList.find(ml.first.id).subscribe(current_user.id)
        #m = MailingListSubscription.create(:user_id => current_user.id, :mailing_list_id => ml.first.id)
      end
    end
  end

  def disconnect_authorization
    authorization = current_user.authorizations.find_by_provider(params[:provider])

    if authorization.destroy
      flash[:notice] = tslt("your #{params[:provider]} account has been disconnected")
    else
      flash[:error] = tslt("there was an issue disconnecting your #{params[:provider]} account")
    end

    redirect_to profile_users_account_path
  end

  def update_screen_name
    unless @user.temp_screen_name?
      flash[:error] = tslt("you cannot modifyur publc identity at this time")
    else
      @user.screen_name = params[:user][:screen_name]
      @user.temp_screen_name = false
      if @user.save
        session[:user_name] = @user.screen_name
        flash[:notice] = tslt("your public identity has been saved")
      else
        flash[:error] = @user.errors.full_messages.to_sentence
      end
    end
    redirect_to users_account_path
  end

  def update_password
    if @user.authenticated?(params[:user][:old_password])
      @user.password = params[:user][:new_password]
      @user.password_confirmation = params[:user][:new_password_confirmation]
      if @user.password.blank?
        flash[:error] = tslt("password is invalid")
      elsif @user.save
        flash[:notice] = tslt("your password has been successfully updated")
        UserMailer.queue(:password_changed_notice, @user)
      else
        flash[:error] = @user.errors.full_messages.to_sentence
      end
    else
      flash[:error] = tslt("the value you entered for your current password is incorrect")
    end
    #redirect_to profile_users_account_path
    redirect_to users_account_path
  end

  def update_email
    if @user.authenticated?(params[:user][:old_password])
      email = params[:user][:new_email]
      errs = User.validate_field(:email, email)

      if @user.email == email
        @user.clear_new_email_request!
        flash[:warning] = tslt("your new email is the same as your current email")
      elsif errs.size > 0
        flash[:error] = "Email #{errs.to_sentence}"
      elsif @user.do_email_change(params[:user][:new_email], params[:user][:new_email_confirmation])
        flash[:notice] = "#{tslt("success please check")} '#{@user.email}' #{tslt("for instructions to complete the update process")}"
      else
        flash[:error] = @user.errors.full_messages.to_sentence
      end
    else
      flash[:error] = tslt("the value you entered for your current password is incorrect")
    end
    #redirect_to profile_users_account_path
    redirect_to users_account_path
  end

  def update_notifications
    notifs = params[:user][:receive_news]

    if @user.update_attribute(:receive_news, notifs)
      flash[:notice] = tslt("your notification preferences have been updated")
    else
      flash[:error] = @user.errors.full_messages.to_sentence
    end
    #redirect_to profile_users_account_path
    redirect_to users_account_path
  end

  def cancel_email_change
    if current_user.clear_new_email_request!
      flash[:notice] = tslt("your email change request has been removed")
    else
      flash[:error] = tslt("there was an error processing your request")
    end
    #redirect_back_or_default profile_users_account_path
    redirect_back_or_default users_account_path
  end

  def resend_email_change
    UserMailer.queue(:confirm_email_change, current_user)
    flash[:notice] = "#{tslt("a verification email has been sent to")} #{current_user.email}."
    #redirect_back_or_default profile_users_account_path
    redirect_back_or_default users_account_path
  end

  def ajax_check_field
    valid, msg = false, ""

    field_name = params["field_name"]
    field_val = params[field_name]

    # don't check all fields... only the ones we explicitly specify
    # add special check for beta key registration (as usage isn't stored in the user model)
    if ["old_password", "new_password"].include?(field_name)
      valid = current_user.password_change_field_valid?(field_name, field_val)
    elsif ["email"].include?(field_name)
      valid, msg = current_user.email_change_field_valid?(field_val)
    else
      valid = false
    end
    render :text => (valid ? 1 : msg)
  end

  def engarde_verification
    # make sure we go back to where we were trying to get to
    session[:return_to] ||= session.delete(:buffered_return_to)

    unless Rails.cache.read(@user.engarde_ticket_cache_key).present?
      ticket = @user.generate_engarde_ticket
      raise "Failed to generate authentication ticket" unless ticket.present?
      UserMailer.queue(:engarde_ticket, @user, ticket)
    end
    render :layout => "blank"
  rescue Exception => ex
    flash.now[:error] = ex.message
    render :layout => "blank"
  end

  def resend_engarde_ticket
    ticket = Rails.cache.read(@user.engarde_ticket_cache_key)
    ticket ||= @user.generate_engarde_ticket
    raise "Failed to generate authentication ticket" unless ticket.present?
    UserMailer.queue(:engarde_ticket, @user, ticket)
    flash[:notice] = tslt("your account armor authentication code has been sent")
  rescue Exception => ex
    flash[:error] = ex.message
  ensure
    redirect_to engarde_verification_users_account_path
  end

  def submit_engarde_verification
    if @user.consume_engarde_ticket!(params[:engarde_ticket], params[:remember_device])
      if current_game_id > 0
        redirect_to launcher_path(current_game_id)
      else
        flash[:notice] = tslt("you are now logged in")
        redirect_back_or_default users_account_path
      end
    else
      flash[:error] = tslt("the code you entered is invalid")
      redirect_to engarde_verification_users_account_path
    end
  end

  def update_engarde
    if @user.update_engarde_preferences!(params[:user][:engarde_enabled], params[:deauthorize_devices]=="true", session[:io_device_alias])
      flash[:notice] = tslt("your account armor preferences have been successfully updated")
    else
      flash[:error] = tslt("failed to update your account armor preferences")
    end
    #redirect_to profile_users_account_path
    redirect_to users_account_path
  end

  def update_game_account
    @game_account = current_user.game_accounts.find_by_account_name(params[:current_gacct_name])
    if @game_account.present?
      @game_account.account_name = params[:game_account][:account_name]
      if @game_account.save
        flash[:notice] = tslt("game account name has been updated")
      else
        flash[:error] = @game_account.errors.full_messages.to_sentence
      end
    else
      flash[:error] = tslt("invalid game account")
    end

    redirect_to users_account_path
  end

  def create_default_gacct
    redir_path = index_path(:slogin => true)

    raise if params[:de_exist].nil? || params[:de_exist] != 'false'

    redir_path = GameAccount.auto_account_creation(current_user, false, redir_path)

    redirect_to redir_path
  rescue => e
    flash[:error] = tslt('existing_user_promo_flash_error_msg')
    redirect_to redir_path
  end

  def get_emp_wallet_balance
    user_id = current_user.id
    begin
      emp_wallet_balance = User.get_emp_wallet_balance(user_id)
      render :json => {:user_id => user_id, :emp_wallet_balance => emp_wallet_balance, :error => nil}
    rescue => e
      render :json => {:user_id => user_id, :emp_wallet_balance => 0, :error => e}
    end
  end

  def update_iovation
    begin
      if params[:blackbox] # blackbox
        current_user.update_iovation!(request.remote_ip, params[:blackbox], params[:type])

        # authorize the device on initial authorization
        if params[:initial_authorization]
          device = current_user.user_devices.find_by_io_device_alias(@auth.user.io_device_alias)
          if device.present?
            device.authorization_required = false
            device.save!
            current_user.io_auth_required = false
            current_user.save!
          end
        end
      end

      render :json => { :io_result => current_user.io_result }
    rescue => ex
      render :json => { :error => ex.message }
    end
  end

  def remove_billing_info
    begin
      Payletter::Client.new.remove_billing_information(current_user.id)
      flash[:notice] = tslt("your billing information has been removed")
    rescue Exception => e
      flash[:error] = e
    end
    #redirect_to "/users/account/profile"
    redirect_to "/users/account"
  end

  # added
  def emp
    if session[:account_id]
      if !cookies[:emp]
        wallet = BillingAdapterInterface.get_wallet(session[:account_id])
        emp = if wallet && wallet.EMP && wallet.EMP[:amount]
          wallet.EMP[:amount]
        else
          'error'
        end
        Rails.logger.debug ["EMP:", emp]
        # expire in 5 minutes to check again.
        cookies[:emp] = { :value => emp.to_s, :expires => 5.minutes.from_now }
        render :text => emp.to_s
      else
        render :text => cookies[:emp].to_s
      end
    else
      reset_session
      # don't store cookie
      #cookies[:emp] = { :value => "error", :expires => 30.seconds.from_now }
      render :text => "error"
    end
  end
  # end added

  protected

  def set_current_app
    @current_app = "account"
  end

  def set_user_instance
    @user = User.find(current_user.id)
  end

  def ensure_engarde_applicable
    unless @user.io_auth_required?
      flash[:error] = tslt("you are already logged in")
      redirect_back_or_default users_account_path
    end
  end
end
