class GuildBattleDetail < ActiveRecord::Base
  if Rails.env == "test"
    establish_connection :tera_game_portal_test
  else
    establish_connection :tera_game_portal
  end
  self.primary_key = "guild_battle_detail_id"
  
  self.belongs_to :guild_battle
  self.belongs_to :winner, :class_name => "Character", :foreign_key => :winner_character_id
  self.belongs_to :loser, :class_name => "Character", :foreign_key => :loser_character_id
  self.belongs_to :server
  
end

__END__
GuildBattleDetail(guild_battle_detail_id: integer, guild_battle_id: integer, winner_character_id: integer,
                  loser_character_id: integer, battle_timestamp: datetime, points: integer,
                  server_id: integer, winner_guild_id: integer, loser_guild_id: integer)
