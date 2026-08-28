# encoding: utf-8

# encoding comment above is required to allow Unicode characters (name method) to work, do not remove it. -cr-

class Dungeon < ActiveRecord::Base
  if Rails.env == "test"
    establish_connection :tera_game_portal_test
  else
    establish_connection :tera_game_portal
  end
  self.primary_key = "dungeon_id"
  
  #has_many :instances
  self.has_many :instance_runs
  
  def name
    self.dungeon_name.gsub("’", "'")
  end
  
  def clean_name
    #self.name.downcase.gsub(/\s/, "-").gsub(/\'|\(|\)/, '')
    name.downcase.gsub(/\s/, "-").split("").select{|letter| (letter >= 'a' && letter <= 'z') || letter == '-' }.join("")
  end
  
end

__END__

Dungeon(dungeon_id: integer, dungeon_name: string)
