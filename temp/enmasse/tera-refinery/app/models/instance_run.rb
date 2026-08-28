class InstanceRun < ActiveRecord::Base
  if Rails.env == "test"
    establish_connection :tera_game_portal_test
  else
    establish_connection :tera_game_portal
  end
  self.primary_key = "instance_id"

  self.belongs_to :instance
  self.belongs_to :character
  self.belongs_to :dungeon
  
  default_scope where(:server_id => Server::WHITELIST_IDS, :is_completed => 1)
  
  #InstanceRun.most(@current_dungeon.id, 100)
  def self.most(dungeon_id, count = 100)
    tmp = self.where(:dungeon_id => dungeon_id).select("character_id, dungeon_id, COUNT(*) AS comp_count").group(:character_id).order("comp_count DESC").limit(count)
    tmp.each{|i| i.completion_count = i.comp_count}
    return tmp
  end
  
  def self.most_for_characters(characters, dungeon_id)
    character_ids = characters.collect{|c| c.id}
    tmp = self.where(:character_id => character_ids, :dungeon_id => dungeon_id).select("character_id, dungeon_id, COUNT(*) AS comp_count").group(:character_id).order("comp_count DESC").all
    tmp.each{|i| i.completion_count = i.comp_count}
    return tmp
  end
  
  def completion_count=(val)
    @cached_completion_count = val
  end
  
  def completion_count
    @cached_completion_count
  end
  
end

__END__
columns:
instance_run_id, dungeon_id, instance_id, character_id, start_time, end_time, monster_kills, deaths, large_monster_kills, completion_seconds, is_completed, legendary_items_looted, party_members, party_matched
sample data:
1, 9089, 262326019, 78047, 2012-05-08 21:29:24, 2012-05-08 22:14:06, 13, 13, 13, 13, 1, 0, 5, 0
