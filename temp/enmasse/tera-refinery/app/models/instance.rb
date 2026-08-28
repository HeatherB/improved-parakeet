class Instance < ActiveRecord::Base
  if Rails.env == "test"
    establish_connection :tera_game_portal_test
  else
    establish_connection :tera_game_portal
  end
  self.primary_key = "instance_id"

  self.has_many :instance_runs, :conditions => proc {"dungeon_id = #{self.dungeon_id}"}, :include => :character
  self.belongs_to :dungeon
  
  default_scope where(:is_completed => 1, :server_id => Server::WHITELIST_IDS)
  
  def self.fastest(dungeon_id, count=100)
    self.where(:dungeon_id => dungeon_id).order(:completion_seconds).limit(count).all
  end
  
  def participants
    self.instance_runs.collect{ |i| i.character }
  end
  
  def completion_participants
    completed = self.instance_runs.where(:is_completed => 1)
    Rails.logger.warn "AHHWHHHFSFHFH"
    Rails.logger.warn completed.inspect
    return completed.collect{ |i| i.character }.sort{|a,b| a.name <=> b.name }
  end
end

__END__
Instance(instance_id: integer, dungeon_id: integer, min_start_time: datetime,
         max_end_time: datetime, completion_seconds: integer,
         is_completed: integer, total_party_members: integer)
