class MaintenanceController < ApplicationController
  before_filter :set_current_app
  skip_before_filter :check_site_maintenance
  skip_before_filter :check_game_maintenance
  skip_after_filter :store_location
  
  def index
    check_site_maintenance(false)
    @maintenance = session[:site_maintenance]
    redirect_to index_path unless @maintenance.present?
  end

  def game
    check_game_maintenance(false)
    @maintenance = session[:game_maintenance]
    @maintenance ||= {}

    if @maintenance.empty?
      redirect_to launcher_path(current_game_id)
    else
      render :layout => "blank"
    end
  end

  protected
  
  def set_current_app
    @current_app = "maintenance"
  end
  
end
