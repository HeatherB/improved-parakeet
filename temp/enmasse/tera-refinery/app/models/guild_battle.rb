class GuildBattle < ActiveRecord::Base
  if Rails.env == "test"
    establish_connection :tera_game_portal_test
  else
    establish_connection :tera_game_portal
  end
  self.primary_key = "guild_battle_id"
  
  default_scope where(:server_id => Server::WHITELIST_IDS)
  
end

__END__

GuildBattle(guild_battle_id: integer, source_guild_battle_id: integer, server_id: integer,
            gb_start: datetime, gb_end: datetime, guild_id_1: integer, guild_id_2: integer,
            guild_1_points: integer, guild_2_points: integer, guild_winner_id: integer)
