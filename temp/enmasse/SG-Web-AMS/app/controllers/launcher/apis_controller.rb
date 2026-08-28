# This controller is basically the request router for the calls made from
# the launcher's javascript API. ALL requests assume the existence of a logged
# in user (session) and that an active game account is selected
class Launcher::ApisController < LauncherController
  before_filter :ensure_user_and_account_exists, except: [ :has_game_account ]

  # generates an auth ticket for the currently logged in user's selected game account
  def auth_ticket
    ticket, error = get_auth_ticket
    return if error

    permission = current_game_account.game_account_type.permission_mask
    out = { "result-message" => "OK", "result-code" => 200, "ticket" => ticket, "user_permission" => permission}
    render :text => out.to_json, :status => 200
  end

  # Calls game specific web service to retrieve last connected server and
  # count of characters per server. We cache the response for 1 minute
  # because there are multiple requests that do more or less the same thing (per BHS spec)
  # if they are called immediately after one another, we don't want to have the
  # extraneous requests.
  def account_server_info
    res, error = current_game_account.server_info(@game)
    if error || res.blank?
      out = { "result-message" => res, "result-code" => 500 }
      render :text => out.to_json, :status => 500
    else
      out = JSON.parse(res)
      if params[:attach_auth_ticket] == "1"
        ticket, error = get_auth_ticket
        out.merge!("ticket" => ticket)
        return if error
      end

      permission = current_game_account.game_account_type.permission_mask
      out.merge!({
        "result-message"      => "OK",
        "result-code"         => 200,
        "user_permission"     => permission,
        "game_account_name"   => current_game_account.account_name,
        "access_level"        => current_game_account.access_level,
        "master_account_name" => current_user.screen_name
      })
      render :text => out.to_json, :status => 200
    end
  end

  # if an account is marked as only being able to play during limited
  # play times, this method is called when the "Play" button in the launcher
  # is clicked and confirms whether or not the user is in one of the allowed time slots
  def account_can_play
    res = false
    curr_time = Time.now.utc.strftime("%H%M").to_i

    # @limited_play_times is set in the game maintenance check b/c it requires
    # a call to the game service and we wan't to avoid multiple calls
    # to that service so just use what was set previously
    lpt = @limited_play_times || []
    lpt.each do |pt|
      if curr_time >= pt[0] && curr_time <= pt[1]
        res = true
        break
      end
    end
    render :text => (res ? "1" : "0"), :status => 200
  end

  def login_events
    @track_args = []
    label_value = [] + FreePromotion.auto_fulfillment(current_user, current_game_account)
    unless label_value.empty?
      @track_args = label_value.collect do |lv|
        { :category => 'FreePromo' }.merge lv
      end
    end

    render :json => { :track_args => @track_args }
  end

  # generates an sso ticket for the currently logged in user's selected game account
  # this function is for getWebLinkUrl which is used for in-game web pages
  def sso_auth_ticket
    out = { "ticket" => LauncherSSO.get_sso_auth_ticket(current_user.id, current_game_account.id, params) }
    render :json => out
  end

  # for launcher_v2
  def sso_auth_ticket_v2
    Rails.logger.debug("current user: #{current_user.id}")
    Rails.logger.debug("game: #{params[:launcher_id]}")
    game_account_id = current_user.game_accounts.where(:game_id => params[:launcher_id].to_i).first.id
    out = { "ticket" => LauncherSSO.get_sso_auth_ticket(current_user.id, game_account_id, params) }
    render :json => out
  end

  def has_game_account
    game_accounts = current_user.game_accounts.active.for_game(@game.id).all(:include => [:user, :game_account_type])
    render :json => { :has_game_account => game_accounts.size > 0 }
  end

  def get_commandline_options
    # check if the user is banned or suspended
    if current_user.suspended_from_game?
      render :json => {:error => tslt("this account is currently banned or suspended")}
    else
      case current_game_account.game.name
        when 'ZMR'
          release_name = params[:release_name]
          launcher_version = params[:launcher_version]
          release_name_splitted = release_name.split('.')
          major_version = release_name_splitted[0].to_i rescue 0
          minor_version = release_name_splitted[1].to_i rescue 0
          patch_version = release_name_splitted[2].to_i rescue 0
          version = "0x#{patch_version.to_s(16).rjust(2, '0')}#{minor_version.to_s(16).rjust(2, '0')}#{major_version.to_s(16).rjust(2, '0')}"
          if launcher_version.present?
            launcher_version_splitted = launcher_version.split('-')
            environment_name = launcher_version_splitted[1] rescue nil
          else
            environment_name = nil
          end
          site = 0
          options = {}
          case current_game_account.game_account_type.name
            when 'ZMR QA'
              options['UT'] = '798'
            when 'ZMR Admin'
              options['UT'] = '797'
          end
          lstoken = ZMR::SecureToken.generate(current_game_account.id, options)
          if major_version == 0 && minor_version == 0 && patch_version < 31
            command_options = "version=#{version} site=#{site} safemode=0 audiotype=1 lstoken=#{lstoken}"
          else
            game = Game.find_by_name('ZMR')
            login_server = game.settings("login_server_#{environment_name}")
            login_server = game.settings('login_server') unless login_server
            command_options = "version=#{version} site=#{site} safemode=0 audiotype=1 lstoken=#{lstoken}&LS=#{login_server}"
          end
        when 'Battleplans'
          token_data = EME::Auth.make_ticket(current_game_account.id)
          environment_name = Rails.env
          command_options = "token=#{token_data['ticket']} environment=#{environment_name} game_account_id=#{current_game_account.id}"
        when 'AVA'
          response = EME::Auth.generate_authentication_token(current_game_account.id)
          if response[:error] == true
            error_code = response[:response]['error_code']
            error_message = response[:response]['message']
            return render :json => {:error => "generate_authentication_token error: ERROR_CODE=#{error_code}, ERROR_MESSAGE='#{error_message}'"}
          end
          auth_token = response['token']
          server_addrs = '23.96.252.194:28004'
          ping_server_addrs = '23.96.246.173:16384'
          command_options = "-serveraddr\"#{server_addrs}\" -pingserveraddr\"#{ping_server_addrs}\" -key\"#{auth_token}\""
        else
          command_options = ''
      end
      render :json => {:options => command_options}
    end
  end

  def check_steam_dlc_activated
    # Check if the given steam DLCs are activated
    #
    # Request:
    #   curl -X POST -d "dlc_list[0][dlc_id]=1&dlc_list[0][name]=test1&dlc_list[1][dlc_id]=2&dlc_list[1][name]=test2" http://localhost:3000/launcher/1/check_steam_dlc_activated
    #     OR
    #   $.post('/launcher/1/check_steam_dlc_activated', {dlc_list: [{dlc_id:1, name:"test1"}, {dlc_id:2, name:"test2"}]}, function(data) { console.log(data) })
    #
    # Params:
    #   params => {"dlc_list"=>{"0"=>{"dlc_id"=>"1", "name"=>"test1"}, "1"=>{"dlc_id"=>"2", "name"=>"test2"}}, "launcher_id"=>"1"}

    steam_authorization = self.current_user.authorizations.where(:provider => 'steam').first
    if steam_authorization
      steam_user_id = steam_authorization.uid
      dlc_list = []

      if params['dlc_list'].nil?
        render :json => {'result-message' => 'dlc_list is missing'}
        return
      end

      params['dlc_list'].each_value do |dlc|
        dlc_id = dlc['dlc_id']
        dlc_name = dlc['name']

        if dlc_id.nil?
          render :json => {'result-message' => 'dlc_id is missing in the dlc_list element'}
          return
        end

        if dlc_name.nil?
          render :json => {'result-message' => 'name is missing in the dlc_list element'}
          return
        end

        # find dlc activation record
        dlc_activation = SteamDlcActivation.where(:steam_user_id => steam_user_id, :steam_dlc_id => dlc_id).first
        if dlc_activation
          if dlc_activation.activated_at.present?
            dlc_list.push({:dlc_id => dlc_id, :name => dlc_name, :activated => true})
          else
            dlc_activation_job = SteamDlcActivationJob.find_by_steam_dlc_activation_id(dlc_activation.id)
            if dlc_activation_job
              dlc_activation_job.refresh_expired_at
              dlc_list.push({:dlc_id => dlc_id, :name => dlc_name, :activated => false, :will_be_activated => true})
            else
              dlc_list.push({:dlc_id => dlc_id, :name => dlc_name, :activated => false, :will_be_activated => false})
            end
          end
        else
          dlc_list.push({:dlc_id => dlc_id, :name => dlc_name, :activated => false, :will_be_activated => false})
        end
      end
      render :json => {'result-message' => 'ok', 'dlc_list' => dlc_list}
    else
      render :json => {'result-message' => 'no authorization record for steam'}
    end
  end

  def activate_steam_dlc
    # Active the given steam DLCs
    #
    # Request:
    #   curl -X POST -d "dlc_id_list[]=1&dlc_id_list[]=2&dlc_id_list[]=3" http://localhost:3000/launcher/1/activate_steam_dlc
    #     OR
    #   $.post('/launcher/1/activate_steam_dlc', {dlc_id_list: [1, 2, 3]}, function(data) { console.log(data) })
    #
    # Params:
    #   params => {"dlc_id_list"=>["1","2","3"], "launcher_id"=>"1"}

    # check parameters
    dlc_id_list = params['dlc_id_list']
    if dlc_id_list.nil?
      render :json => {'result-message' => 'dlc_id_list is missing'}
      return
    end

    # check the current user is associated with steam
    steam_authorization = self.current_user.authorizations.where(:provider => 'steam').first
    if steam_authorization.nil?
      render :json => {'result-message' => 'no authorization record for steam'}
      return
    end

    steam_user_id = steam_authorization.uid

    SteamDlcActivation.transaction do
      dlc_id_list.each do |dlc_id|
        dlc_activation = SteamDlcActivation.where(:steam_user_id => steam_user_id, :steam_dlc_id => dlc_id).first
        if dlc_activation.nil?
          dlc_activation = SteamDlcActivation.create({:user_id         => self.current_user.id,
                                                      :game_account_id => self.current_game_account.id,
                                                      :steam_user_id   => steam_user_id,
                                                      :steam_dlc_id    => dlc_id})
        end

        # check dlc is already activated or in progress of activating
        if dlc_activation.activated_at.nil?
          # not activated
          if dlc_activation.steam_dlc_activation_job.nil?
            # not in progress of activating
            # activating dlc now
            SteamDlcActivationJob.create_job(dlc_activation.id)
          end
        end
      end
    end

    render :json => {'result-message' => 'ok'}
  end

  protected

  def ensure_user_and_account_exists
    unless logged_in? && current_game_account.present?
      out = { "result-message" => "Game account not found", "result-code" => 404 }
      render :text => out.to_json, :status => 404
    end
  end

  def get_auth_ticket
    ticket, error = current_game_account.create_auth_ticket(request.remote_ip)
    if error
      out = { "result-message" => error.message, "result-code" => 500 }
      render :text => out.to_json, :status => 500
    end
    return ticket, error
  end

  # the api needs to handle game maintenance a bit differently so overload
  # the existing check_game_maintenance method provided by maintenance helper
  def check_game_maintenance
    return unless @game.present?

    if @game.setting(:service_url).present?
      adapter = GameAdapter.new(@game.setting(:service_url))
      res = adapter.make_request(:game_auth_info)

      if res
        hash = JSON.parse(res)

        @game_auth_settings = hash["game_auth_settings"] || []
        @maintenance = hash["maintenance"]
        @limited_play_times = hash["limited_play_times"]

        if @maintenance.present? && !whitelisted_ip?(@maintenance["whitelisted_ips"].to_s)
          session[:game_maintenance] = @maintenance
          out = { "result-message" => "Game is currently in maintenance", "result-code" => 412 }
          render :text => out.to_json, :status => 412
        else
          session.delete(:game_maintenance)
        end
      else
        out = { "result-message" => "Unable to connect to authentication service", "result-code" => 500 }
        render :text => out.to_json, :status => 500
      end
    end
  end

end
