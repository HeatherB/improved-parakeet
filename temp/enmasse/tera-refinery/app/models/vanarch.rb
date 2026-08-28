class Vanarch < ActiveRecord::Base
  if Rails.env == "test"
    establish_connection :tera_game_portal_test
  else
    establish_connection :tera_game_portal
  end
  self.table_name = "vanarchs"
  
  default_scope where(:server_id => Server::WHITELIST_IDS).where("guild_id IS NOT NULL")
  
  self.belongs_to :vanarch, :class_name => "Character", :foreign_key => :character_id
  self.belongs_to :guild
  self.belongs_to :server
  
  @cached_all = []
  
  def self.cached_all(round)
    return @cached_all[round] if @cached_all[round]
    @cached_all[round] = Vanarch.where(:vanarch_round => round).includes(:server, :guild, :vanarch).all
  end
  
end
