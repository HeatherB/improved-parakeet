class Server < ActiveRecord::Base
  if Rails.env == "test"
    establish_connection :tera_game_portal_test
  else
    establish_connection :tera_game_portal
  end
  
  attr_accessor :cache_ttl, :background_job_fires, :max_ccu
  
  @cache_ttl = 5
  @background_job_fires = 4
  @max_ccu = 5500
  
  WHITELIST_IDS = if ["production", "test", "development"].include?(Rails.env)
    [4001, 4002, 4003, 4004, 4005, 4006, 4007, 4009, 4010, 4013, 4014, 4015, 4016]
  else
    #[4008, 4013]
    [4008, 4001, 4002, 4003, 4004, 4005, 4006, 4007, 4009, 4010, 4013, 4014, 4015, 4016]
  end
  
  default_scope where(:server_id => Server::WHITELIST_IDS)
  
  self.primary_key = "server_id"

  self.has_many :guilds
  self.has_many :characters
  
  def name
    self.friendly_name
  end
  
end

__END__
