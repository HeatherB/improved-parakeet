module Tera
  class Server
    API_URI = Tera::UriHelper.server_list_uri
    CCU_API_URI = Tera::UriHelper.ccu_uri

    OPEN_MESSAGES = {
      :recommended => "This server is unlikely to experience queues.",
      :medium => "This server has a moderate number of characters and may experience occasional queues.",
      :high => "This server has many characters and may experience regular queues.",
      :full => "Character creation is disabled on this server."
    }.freeze
    
    CROWDNESS_MESSAGES = {
      :none => "This server is under 90% capacity.",
      :almost => "This server is over 90% capacity.",
      :likely => "This server is over 90% capacity.",
      :yes => "There is currently a wait time to enter this server."
    }.freeze

    def self.all
      servers = []
      servers = from_server.map {|hash| new(hash) }
      if servers.select{|s| s.crowdness == "Yes"}.length > 0
        fetch_ccu_info(servers)
      end
      servers
    rescue => e
      Rails.logger.debug { ["#{e.message} (#{e.class})", e.backtrace].join("\n") }
      Airbrake.notify(e)
      servers
    end

    def self.from_server
      response = Net::HTTP.get_response(API_URI)
      if response.is_a? Net::HTTPSuccess
        parse_xml(response.body)
      else
        Rails.logger.debug [
          "Tera::Server.from_server got a #{response.code} from #{API_URI}",
          response.body
        ].join("\n")
        []
      end
    end
    
    def self.fetch_ccu_info(servers)
      return if CCU_API_URI.nil?
      response = Net::HTTP.get_response(CCU_API_URI)
      
      ccu_info = if response.is_a? Net::HTTPSuccess
        JSON.parse(response.body)
      else
        Rails.logger.debug [
          "Tera::Server#fetch_ccu_info got a #{response.code} from #{CCU_API_URI}",
          response.body
        ].join("\n")
        {}
      end

      if ccu_info && ccu_info["servers"] && !ccu_info["servers"].empty?
        servers.each do |server|
          ccu_hash = ccu_info["servers"][server.id.to_s]
          if ccu_hash && ccu_hash["connected_users"]
            server.ccu = ccu_hash["connected_users"].to_i
          end
        end
      end
    end

    def self.parse_xml(xml)
      val = NokoHash.from_xml(xml)
      return val[:serverlist][:server] if val && val[:serverlist] && val[:serverlist][:server]
      return raise RuntimeError, "Incorrect XML from server"
    end

    attr_reader :id, :ip, :port, :category, :name, :crowdness, :open,
      :permission_mask, :server_stat, :popup, :language,
      :open_sort, :category_sort, :crowdness_sort

    attr_accessor :ccu
    
    class << self
      attr_accessor :cache_ttl, :background_job_fires, :max_ccu
    end

    def initialize(params={})
      @id = params[:id]
      @ip = params[:ip]
      @port = params[:port]
      if params[:category]
        @category = params[:category][:value]
        @category_sort = params[:category][:attributes][:sort] if params[:category][:attributes]
      end
      @name = params[:name][:value] if params[:name]
      if params[:category]
        @crowdness = params[:crowdness][:value]
        @crowdness_sort = params[:crowdness][:attributes][:sort] if params[:crowdness][:attributes]
      end
      if params[:open]
        @open = params[:open][:value]
        @open_sort = params[:open][:attributes][:sort] if params[:open][:attributes]
      end
      @permission_mask = params[:permission_mask]
      @server_stat = params[:server_stat]
      @popup = params[:popup]
      @language = params[:language]
    end
    
    # {:id=>3016, :ip=>"10.63.2.62", :port=>10003, :category=>{:attributes=>{:sort=>1}, :value=>"PVE"},
    #  :name=>{:attributes=>{:raw_name=>"BHS TEST SERVER"}, :value=>"BHS TEST SERVER"},
    #  :crowdness=>{:attributes=>{:sort=>1}, :value=>"Low"}, :open=>{:attributes=>{:sort=>1},
    #  :value=>"Unknown"}, :permission_mask=>"0x80000000", :server_stat=>"0x00000000",
    #  :popup=>"This server is not currently available.", :language=>"en"}
    
    # 0x80000000 = down
    # 0x000000## = up, where ## is anything.  There are more nuances to this but not sure if they will be relevant.
    # 0x00000100 = maintenance
    def maintenance?
      permission_mask.to_i(16) == 0x100
    end
    
    def up?
      permission_mask.to_i(16) < 0x100
    end
    
    def down?
      permission_mask.to_i(16) > 0x100
    end
    
    def status_sort
      return 0 if up?
      return 4 if maintenance?
      return 8
    end
    
    def open_message
      return OPEN_MESSAGES[self.open.downcase.to_sym]
    end
    
    def crowdness_message
      if self.queue && self.queue > 1
        return "#{self.queue} people are in the queue to play on this server."
      elsif self.queue && self.queue == 1
        return "1 person is in the queue to play on this server."
      elsif self.queue && self.queue == 0
        return "There is currently a very short wait time to enter this server."
      end
      return CROWDNESS_MESSAGES[self.crowdness.downcase.to_sym]
    end
    
    def max_ccu
      self.class.max_ccu
    end
    
    def queue
      return nil if ccu.nil? || ccu < max_ccu
      return ccu - max_ccu
    end
  end
end
