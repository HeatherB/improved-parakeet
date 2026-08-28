class ServerStatusesController < ApplicationController
  # caches_action :show, :expires_in => Tera::Server.cache_ttl
  before_filter :assign_page
  
  # skip_before_filter :find_page, :find_pages_for_menu, :refinery_user_required?
  
  # def show
  #   @page = Rails.cache.fetch('server-status-page') do
  #     Refinery::Page.find("server-status-page")
  #   end
  # end
  def show
  	@servers = TeraServer.getServerStatusAggregated
    render "/server_statuses/show"
  end

    
  def assign_page
    page = Rails.cache.fetch('server-status') do
      #Refinery::Page.find_by_slug("server-status-page")
      Refinery::Page.find_by_path("/support/server-status") ||
      Refinery::Page.find_by_path("/support/server-status-page")
    end

    header_part = page.parts.select{|a| a.title == "Article Header"}.first if page && page.parts
    @custom_header = header_part ? header_part.body : ""

    body_part = page.parts.select{|a| a.title == "Body"}.first if page && page.parts
    @custom_body = body_part ? body_part.body : ""
    
    wide_part = page.parts.select{|a| a.title == "Wide Body"}.first if page && page.parts
    @custom_wide = wide_part ? wide_part.body : ""

    side_part = page.parts.select{|a| a.title == "Side Body"}.first if page && page.parts
    @custom_side = side_part ? side_part.body : ""

    footer_part = page.parts.select{|a| a.title == "Article Footer"}.first if page && page.parts
    @custom_footer = footer_part ? footer_part.body : ""
  end
  
end
