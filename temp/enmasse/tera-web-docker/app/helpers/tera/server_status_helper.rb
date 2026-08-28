module Tera
  module ServerStatusHelper
    def server_status_table
      #cache_options = Rails.application.config.server_status_cache_options

      #Rails.cache.fetch("server_status_table", cache_options) do
        #servers = WebserviceCacher.latest_server_statuses.select{|s| s.category.downcase != 'event'}
        #render "server_statuses/table", :servers => servers
      #end
    end
  end
end
