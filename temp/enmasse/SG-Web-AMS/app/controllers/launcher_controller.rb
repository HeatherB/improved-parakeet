class LauncherController < ApplicationController
  layout "blank"

  newrelic_ignore_enduser   # disable end user monitoring because it crashes the launcher when it is closed

  skip_after_filter :store_location
  skip_before_filter :check_site_maintenance

  before_filter :preload_models
  before_filter :set_game
  before_filter :set_launcher
  before_filter :check_game_maintenance
  before_filter :set_current_app

  def preload_models
    # When some object is stored in the memcache, its class should be preloaded by the before filter.
    # Otherwise loading object stored in the memcache would be failed.
    # http://www.philsergi.com/2007/06/rails-memcached-undefinded-classmodule.html
    Game
  end

  def show
    unless logged_in?
      redirect_to launcher_signin_path(@game)
      return
    end

    @free_settings = FreePlaySetting.all_from_cache
    @acct_bits = GameAccount.all_account_bits(@game, current_user.id)

    selected_gacct = finish_selection?
    return set_gacct_and_go_next(selected_gacct) if selected_gacct.present?

    game_accounts = current_user.game_accounts.active.for_game(@game.id).all(:include => [:user, :game_account_type])

    case game_accounts.size
    when 0
      @wait_for_account = true
      @message = ""
      if GameAccount.where(user_id: current_user.id, game_id: @game.id, deleted: 1).size == 0
        if !GameAccount.get_active_auto_account_creation_promotion(@game)
          @message = tslt("message_not_creating_game_account_launcher")
          @wait_for_account = false
        else
          @message = tslt("message_creating_game_account_launcher")
          if cookies[:steam_app_id].present?
            creation_path = 'auto_creation_steam'
          else
            creation_path = nil
          end
          GameAccount.auto_account_creation(current_user, false, launcher_url(@game.id), @game, creation_path)
        end
      else
        @message = tslt("message_reenabling_account")
        game_account = GameAccount.where(user_id: current_user.id, game_id: @game.id, deleted: 1).first
        game_account.deleted = false
        game_account.save!
      end

      render :partial => "launcher/#{@game.name.downcase}/no_accounts", :layout => "blank"
    when 1
      gacct = game_accounts.first
      res_code, free_setting = gacct.can_play_ex?(@free_settings, @game_auth_settings, @acct_bits)

      if res_code == 200
        set_gacct_and_go_next(gacct)
      else
        @game_accounts = [make_gacct_args(gacct, res_code, free_setting)]
        render :partial => "launcher/#{@game.name.downcase}/banned_game_account", :layout => "blank"
      end
    else
      subscriptions = Subscription.find_all_active_for_master_account_id(current_user.id)
      subscriptions = subscriptions.select { |subscription| game_accounts.collect(&:id).include? subscription.game_account_id }
      @game_accounts = game_accounts.collect do |gacct|
        res_code, free_setting = gacct.can_play_ex?(@free_settings, @game_auth_settings, @acct_bits, @game, subscriptions)
        make_gacct_args(gacct, res_code, free_setting)
      end
      render :partial => "select_game_account", :layout => "blank"
    end
  rescue Exception => ex
    logger.error ex
    logger.error ex.backtrace.join("\n")
    redirect_to signout_path(:msg => "0")
  end

  # user is trying to access one of the launcher pages without actually
  # being in the launcher so logout and bounce to standard homepage
  def forbidden
    session[:launcher_embed] = nil
    if logged_in?
      redirect_to signout_path(:msg => 0)
    else
      redirect_to index_path
    end
  end

  def validate_additional_requirements
    if logged_in? && current_user.secret_question_id.nil? && !current_user.allow_blank_secret
      set_game
      redirect_to additional_requirements_users_path(:in_launcher => true, :game_id => @game.id)
    end
  end



  protected

  def set_current_app
    @current_app = "launcher"
  end

  def set_game
    def fetch_game_info
      # try to retrieve game information from the memcache.
      game_id = params[:launcher_id] || params[:id]
      game_info_cache_key = "game-info-#{game_id}-cached" if game_id.present?

      if game_info_cache_key.present?
        Rails.cache.fetch(game_info_cache_key, :expires_in => 1.minute) do
          begin
            Game.nolock.find(game_id) if game_id.present?
          rescue ActiveRecord::RecordNotFound => rnf
            render :text => "Invalid game", :layout => "blank"
          end
        end
      end
    end

    @game = fetch_game_info
  end

  def set_launcher
    session[:launcher_embed] = @game.id if @game.present?
  end

  def current_game_account
    GameAccount.find(session[:current_game_account_id])
  end

  def set_current_game_account(gacct)
    session[:current_game_account_id] = gacct.id
    gacct
  end

  def make_gacct_args(gacct, res_code, free_setting)
    gacct_rescode = { :gacct => gacct, :res_code => res_code, :type_name => (gacct.active_subscription? ? 'Elite' : gacct.game_account_type.name) }
    free_play_options = get_free_options(free_setting)
    gacct_rescode.merge! free_play_options
  end

  def get_free_options(free_setting)
    { :unlimited => free_setting.present? ? free_setting.unlimited? : false }
  end

  def finish_selection?
    return nil unless params[:gid].present?

    gacct = current_user.game_accounts.active.find(params[:gid], :include => { :game_account_type => :free_play_setting })
    return nil unless gacct.present?

    res_code, free_setting = gacct.can_play_ex?(@free_settings, @game_auth_settings, @acct_bits)
    case res_code
    when 200
      gacct
    else
      nil
    end
  end

  def set_gacct_and_go_next gacct
    @game_account = set_current_game_account gacct

    @game_settings = GameSetting.all_from_cache.select { |row| row.game_id == @game.id }

    render :partial => @game.name.parameterize.to_s, :layout => "blank"
    nil
  end

end
