class ErrorsController < ApplicationController
  skip_before_filter :check_site_maintenance
  skip_before_filter :check_game_maintenance
  skip_after_filter :store_location

  def not_found
    render :status => 404
  end

  def server_error
    render :status => 500
  end

end
