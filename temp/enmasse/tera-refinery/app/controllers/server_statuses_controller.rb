class ServerStatusesController < ApplicationController
  caches_action :show, :expires_in => Tera::Server.cache_ttl
  
  skip_before_filter :find_page, :find_pages_for_menu, :refinery_user_required?
  
  def show
    @page = Rails.cache.fetch('server-status-page') do
      Refinery::Page.find("server-status-page")
    end
  end
end
