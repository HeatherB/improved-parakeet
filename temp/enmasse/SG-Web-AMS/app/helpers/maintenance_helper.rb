module MaintenanceHelper

  def self.included(base)
    if base.respond_to?(:before_filter)
      base.class_eval do
        before_filter :check_site_maintenance
      end
    end
  end

  def check_site_maintenance(perform_redirect=true)
    @maintenance = SiteMaintenance.active

    if @maintenance != :false && !whitelisted_ip?(@maintenance["whitelisted_ips"].to_s)
      session[:site_maintenance] = @maintenance
      redirect_to maintenance_index_path if perform_redirect
    else
      session.delete(:site_maintenance)
    end
  end

  # game maintenance is now handled a bit differently as this info is stored
  # in each specific game database... so we make a service call to fetch it
  def check_game_maintenance(perform_redirect=true)
    @game ||= Game.find(params[:launcher_id]) if params[:launcher_id].present?
    return unless @game.present?
    return nil if @game.settings(:service_url).nil?

    adapter = GameAdapter.new(@game.setting(:service_url))
    res = adapter.make_request(:game_auth_info)

    if res
      hash = JSON.parse(res)

      @game_auth_settings = hash["game_auth_settings"]
      @maintenance = hash["maintenance"]

      if @maintenance.present? && !whitelisted_ip?(@maintenance["whitelisted_ips"].to_s)
        session[:game_maintenance] = @maintenance
        redirect_to game_maintenance_index_path(:launcher_id => @game.id) if perform_redirect
      else
        session.delete(:game_maintenance)
      end
    else
      session[:game_maintenance] = {
        "title" => "Service Error",
        "body" => "Unable to connect to #{@game.name} service"
      }
      redirect_to game_maintenance_index_path(:launcher_id => @game.id) if perform_redirect
    end
  end

  def whitelisted_ip?(ips)
    ips.split(",").collect(&:strip).include?(request.remote_ip)
  end

end
