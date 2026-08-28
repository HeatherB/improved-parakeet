class Campaign < ActiveRecord::Base
  if Rails.env == "test"
    establish_connection :tera_game_portal_test
  else
    establish_connection :tera_game_portal
  end
  
  BATTLE_ZONES = ["Val Aureum", "Val Palrada", "Val Kaeli"].freeze
  default_scope where(:server_id => Server::WHITELIST_IDS).where("guild_id IS NOT NULL")
  
  belongs_to :candidate, :class_name => "Character", :foreign_key => :candidate_character_id
  belongs_to :guild
  belongs_to :server
  
  @cached_all = []
  
  def self.server_dropdown
    tmp = Server.all.collect{|c| c.name }.uniq.sort
    tmp.unshift("Select a Server...")
    tmp
  end
  
  def self.continent_dropdown
    ["all continents", "Arun", "Northern Shara", "Southern Shara"]
  end
  
  def is_battle_campaign?
    return BATTLE_ZONES.include?(self.region_name_1)
  end
  
  def continent_name
    self.continent
  end
  
  def platform
    tmp = self.candidate_platform.blank? ? "None entered" : self.candidate_platform
    Campaign.entitify(tmp)
  end
  
  def votes
    self[:votes].to_i
  end
  
  def vote_percentage
    return @cached_vote_percentage if @cached_vote_percentage
    competition = Campaign.cached_all(self.vanarch_round).dup
    Rails.logger.warn competition
    competition.select!{|a| a.continent == self.continent && a.server_id == self.server_id}
    Rails.logger.warn competition
    competition.select!{|v| v.is_battle_campaign? == self.is_battle_campaign?}
    Rails.logger.warn competition
    total = competition.collect{|c| c.votes }.inject(:+)
    Rails.logger.warn total
    @cached_vote_percentage = if total.to_i == 0
      "-"
    else
      Rails.logger.warn "(#{self.votes}/#{total.to_f})"
      Rails.logger.warn (self.votes/total.to_f)
      Rails.logger.warn "%3.2f\%" % ((self.votes/total.to_f)*100.0)
      "%3.2f\%" % ((self.votes/total.to_f)*100.0)
    end
    return @cached_vote_percentage
  end
  
  def battle_point_percentage
    return vote_percentage
  end
  
  def self.entitify(input)
    input.gsub!('&amp;' '&')
    input.gsub!('&lt;', '<')
    input.gsub!('&gt;', '>')
    input.gsub!('&quot;', '"')
    input
  end
  
  def self.cached_all(round)
    return @cached_all[round] if @cached_all[round]
    @cached_all[round] = Campaign.where(:vanarch_round => round).includes(:server, :guild, :candidate).all
  end
  
end
