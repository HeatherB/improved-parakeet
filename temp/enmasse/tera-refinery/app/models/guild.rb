class Guild < ActiveRecord::Base
  if Rails.env == "test"
    establish_connection :tera_game_portal_test
  else
    establish_connection :tera_game_portal
  end
  self.primary_key = "guild_id"

  self.belongs_to :server
  self.has_many :members, :class_name => "Character", :conditions => {:is_deleted => false}
  
  default_scope where(:server_id => Server::WHITELIST_IDS)
  
  def self.most_wins(server_name = 'all', count = 100)
    self.most('battle_wins', server_name, count)
  end
  
  def self.most_battles(server_name = 'all', count = 100)
    query = Guild.select("*, (battle_wins + battle_losses + battle_draws) AS battle_count").includes(:server).where(:server_id => Server::WHITELIST_IDS).order("battle_count DESC, guild_name ASC")
    if server_name != 'all'
      server = Server.where(:server_name => server_name).first
      query.where(:server_id => server.id)
    end
    return query.limit(count)
  end
  
  VALID_BOARDS = ["battle_wins", "battle_points"].freeze
  
  def self.most(board, server_name = 'all', count = 100)
    return [] unless VALID_BOARDS.include?( board )
    query = Guild.where(:server_id => Server::WHITELIST_IDS).order("#{board} DESC, guild_name ASC").includes(:server)
    if server_name != 'all'
      server = Server.where(:server_name => server_name).first
      query.where(:server_id => server.id)
    end
    return query.limit(count)
  end
  
  def set_server_name(val = nil)
    @server_name = val || self.server.name
  end
  
  def set_rank(board = "wins", val = nil)
    @rank = val
    lookup = nil
    if @rank.nil?
      lookup = if board == "wins"
        if self.battle_wins.nil? || self.battle_wins < 1
          @rank = "&#8212;"
        else
          lookup = "battle_wins > #{self.battle_wins}"
        end
      elsif board == "battles"
        if self.total_battles.nil?  || self.total_battles < 1
          @rank = "&#8212;"
        else
          lookup = "(battle_wins + battle_draws + battle_losses) > #{self.total_battles}"
        end
      elsif board == "points"
        if self.battle_points.nil? || self.battle_points < 1
          @rank = "&#8212;"
        else
          lookup = "battle_points > #{self.battle_points}"
        end
      end
      if @rank.nil? && lookup
        @rank = Guild.where(lookup).count + 1
      end
    end
    return @rank
  end
  
  def total_battles
    (self.battle_wins || 0) + (self.battle_draws || 0) + (self.battle_losses || 0)
  end
  
  def self.as_percentage(num, dem)
    dem == 0 ? "-" : ("%3.2f\%" % ((num/dem.to_f)*100.0))
  end
  
  
  def win_percentage
    Guild.as_percentage(self.battle_wins, self.total_battles)
  end
  
  def loss_percentage
    Guild.as_percentage(self.battle_losses, self.total_battles)
  end
  
  def draw_percentage
    Guild.as_percentage(self.battle_draws, self.total_battles)
  end
  
  def name
    self.guild_name
  end
  
  def member_count
    self.members.length
  end
  
  def logo
    self.guild_logo
  end
  
  def as_json(options={})
    result = super(options)
    result["battle_wins"] = self.battle_wins || 0
    result["win_percentage"] = self.win_percentage
    result["battle_losses"] = self.battle_losses || 0
    result["loss_percentage"] = self.loss_percentage
    result["battle_draws"] = self.battle_draws || 0
    result["draw_percentage"] = self.draw_percentage
    result["battle_points"] = self.battle_points || 0
    result["server_name"] = @server_name if @server_name
    result["rank"] = @rank if @rank
    result.delete("guild_logo")
    result
  end
end

# guild_id, source_guild_id, server_id, guild_name, guild_leader, creation_date,
# guild_logo, guild_title, guild_praise,
# guild_recruitment_statement, accepting_applications, guild_level
# NOT USED
# guild_competition_points_total

# guild_leader -> guild_leader_id
