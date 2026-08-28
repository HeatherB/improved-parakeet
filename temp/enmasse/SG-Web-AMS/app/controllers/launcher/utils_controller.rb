class Launcher::UtilsController < LauncherController

  skip_filter :set_game
  skip_filter :set_launcher

  def error_report
    result = LauncherError.create :user_id => params[:user_id], :game_account_id => params[:game_account_id], :error_code => params[:error]

    render :text => { :success => !!result }.to_json
  end

  def report_spec_log
    pk = { :user_id => params[:user_id], :game_account_id => params[:game_account_id], :game_id => params[:game_id] }

    spec = Base64.decode64 params[:spec]
    utf8string = spec.encode("UTF-8", "UTF-16LE", :invalid => :replace, :undef => :replace, :replace => "?")
    spec = ActiveSupport::JSON.decode(utf8string.gsub(/\\/, '/'))

    spec_log = SpecLog.first(:conditions => pk)
    result = spec_log.present? ? spec_log.update_attributes(spec) : SpecLog.create(spec.merge pk)

    render :text => { :success => !!result }.to_json
  rescue
    render :text => { :success => false }.to_json
  end

  def auth_forward_url
    next_url = params[:next]
    ticket = params[:ticket]

    if setup_sso_auth_ticket(ticket)
      redirect_to next_url
    else
      redirect_to index_url
    end
  end

  def iovation_auth_forward_url
    @next_url = params[:next]
    @ticket = params[:ticket]

    if @next_url && check_sso_auth_ticket(@ticket)
      render :layout => false
    else
      redirect_to index_url
    end
  end

  def submit_iovation_auth_forward
    ticket   = params[:ticket]
    blackbox = params[:blackbox]
    next_url = params[:next_url]

    user = setup_sso_auth_ticket(ticket)
    if blackbox && user
      user.update_iovation!(request.remote_ip, blackbox, 'login')
      redirect_to next_url
    else
      redirect_to index_url
    end
  end

  def goto_previous_url
    previous_url = cookies['current_url']
    if previous_url
      redirect_to previous_url
    else
      render :text => ''
    end
  end

  def show_ingame_store_window
    if Rails.env == "production"
      redirect_to index_path
    else
      store_type = params[:type] || "sample"
      @steam_user_id = params[:steam_user_id] || "76561198040913661"
      @steam_user_persona_name = params[:steam_user_persona_name] || "minjae.lee"

      case store_type
        when "sample"
          game = Game.find_by_name("zmr")
          @game_id = game.id
          @store_url = sample_ingame_login_window_path
        when "zmr"
          game = Game.find_by_name("zmr")
          @game_id = game.id
          @store_url = game.settings(:steam_buy_emp_url)
        when "tera"
          game = Game.find_by_name("tera")
          @game_id = game.id
          @store_url = game.settings(:steam_url_13) || game.settings(:url_13)
      end
      begin
        current_game_account
      rescue
        begin
          set_current_game_account User.find(current_user.id).game_accounts.where(:game_id => @game_id).first
        rescue
        end
      end
      render :layout => "blank"
    end
  end

  def show_ingame_web_window
    if Rails.env == "production"
      redirect_to index_path
    else
      @id = params[:id] || -1
      @game_settings = GameSetting.all_from_cache.select { |row| row.game_id == 1 }
      begin
        current_game_account
      rescue
        begin
          set_current_game_account User.find(current_user.id).game_accounts.first
        rescue
        end
      end
      render :layout => "blank"
    end
  end

  def sample_ingame_login_window
    if Rails.env == "production"
      redirect_to index_path
    else
      @insecure_sso_ticket = cookies['_ssot']
      @secure_sso_ticket = cookies['serialized']
      if @secure_sso_ticket
        sso_ticket = @secure_sso_ticket
        sso_ticket_type = 'sso'
      else
        sso_ticket = @insecure_sso_ticket
        sso_ticket_type = 'sso_insecure'
      end

      if sso_ticket
        adapter = GameAdapter.new(SECURE_CONFIG["sso"]["service_base_url"])
        res = adapter.make_request(:sso_ticket_verify, { :ticket => sso_ticket }, { :tt => sso_ticket_type }, [], {:timeout => 5, :open_timeout => 5})
        parsed_res = JSON.parse(res)

        # Strecture of parsed_res
        # {
        #  :id => ...,
        #  :email => ...,
        #  :screen_name => ...,
        #  :account_status => ...,
        #  :game_accounts => [
        #    {
        #      :id => ...,
        #      :name => ...,
        #      :founder => ...,
        #      :subscription_active => ...,
        #    },
        #    ...
        #  ]
        #  :temp_screen_name => ...,
        #  :languate => ...,
        #  :optional => {
        #    :user_id =>
        #    :game_account_id => ...,
        #    :server_id => ...,
        #    :character_id => ...,
        #    :steam_user_id => ...,
        #    :steam_user_persona_name => ...
        #  }
        # }

        @user_id          = parsed_res["id"]
        @user_email       = parsed_res["email"]
        @screen_name      = parsed_res["screen_name"]
        if parsed_res["optional"]
          @game_account_id         = parsed_res["optional"]["game_account_id"]
          @server_id               = parsed_res["optional"]["server_id"]
          @character_id            = parsed_res["optional"]["character_id"]
          @steam_user_id           = parsed_res["optional"]["steam_user_id"]
          @steam_user_persona_name = parsed_res["optional"]["steam_user_persona_name"]
          game_account_info = parsed_res["game_accounts"].select { |gacct| gacct["id"] == @game_account_id }
          if game_account_info.length > 0
            @elite_status     = game_account_info[0]["subscription_active"]
          end
        end
        render :layout => false
        return
      end

      render :layout => false
    end
  end

  private

  def check_sso_auth_ticket(ticket)
    value = LauncherSSO.read_sso_auth_ticket(ticket)
    if value.is_a? Hash
      true
    else
      false
    end
  end

  def setup_sso_auth_ticket(ticket)
    value = LauncherSSO.read_sso_auth_ticket(ticket)

    if value.is_a? Hash
      t_timeout = (Time.now.utc + SESSION_TIMEOUT)
      insecure_sso_ticket = value.delete('_ssot')
      secure_sso_ticket = value.delete('serialized')
      cookies['serialized'] = {
        :value => secure_sso_ticket,
        :domain => SECURE_CONFIG["sso"]["domain"],
        :secure => DEFAULT_PROTOCOL == "https",
        :httponly => true,
        :expires => t_timeout
      }
      cookies['_ssot'] = {
        :value => insecure_sso_ticket,
        :domain => SECURE_CONFIG["sso"]["domain"],
        :httponly => true,
        :expires => t_timeout
      }

      # Write optional value for sso_tickets
      LauncherSSO.write_optional_value_for_sso_auth_ticket(insecure_sso_ticket, 'sso_insecure', value)
      LauncherSSO.write_optional_value_for_sso_auth_ticket(secure_sso_ticket, 'sso', value)

      # retrieve user object
      ticket    = secure_sso_ticket
      auth_type = 'sso'
      adapter = GameAdapter.new(SECURE_CONFIG["sso"]["service_base_url"])
      res = adapter.make_request(:sso_ticket_verify, { :ticket => ticket }, { :tt => auth_type }, [], {:timeout => 5, :open_timeout => 5})

      if res != false
        parsed_res = JSON.parse(res)
        user = User.find(parsed_res["id"].to_i)
        user
      else
        nil
      end
    else
      nil
    end
  end

end