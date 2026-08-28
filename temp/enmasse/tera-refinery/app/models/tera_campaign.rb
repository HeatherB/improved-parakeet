class TeraCampaign < ActiveRecord::Base
  if Rails.env == "test"
    establish_connection :tera_game_portal_test
  else
    establish_connection :tera_game_portal
  end
  self.table_name = "TERA_Elections"
  
  
  
  BATTLE_ZONES = ["Val Aureum", "Val Palrada", "Val Kaeli"].freeze
  #default_scope where(:server_id => Server::WHITELIST_IDS)
  
  def self.pluck_server_names(campaigns = cached_all)
    tmp = campaigns.collect{|c| c.server_name }.uniq.sort
    tmp.unshift("Select a Server...")
    tmp
  end
  
  def self.pluck_continent_names(campaigns = cached_all)
    tmp = campaigns.collect{|c| c.continent_name }.uniq.sort
    tmp.unshift("all continents")
    tmp
  end
  
  def self.election_id
    campaign = self.first
    return campaign.election_id if campaign
    return nil
  end
  
  def election_id
    return self.Election_ID
  end
  
  def election_state
    return self.Election_State
  end
  
  def is_battle_campaign?
    return BATTLE_ZONES.include?(self.Region_1)
  end
  
  def election_start_date
    self.Election_Start_Date
  end
  
  def candidate_name
    self.Character_Name
  end
  
  def candidate_class
    self.Character_Class
  end
  
  def candidate_level
    self.Character_Level
  end
  
  def guild_name
    self.Guild_Name
  end
  
  def guild_population
    self.Guild_Size
  end
  
  def server_name
    self.Server_Name
  end
  
  def continent_name
    self.Continent
  end
  
  def guild_praise
    self.Guild_Praise
  end
  
  def platform
    tmp = self.Candidate_Platform.blank? ? "None entered" : self.Candidate_Platform
    self.class.entitify(tmp)
  end
  
  def votes
    self.Votes.to_i
  end
  
  def self.cached_all
    @cached_all || @cached_all = self.all
  end
  
  def vote_percentage
    return @cached_vote_percentage if @cached_vote_percentage
    competition = self.class.cached_all.select{|a| a.continent_name == self.continent_name && a.server_name == self.server_name}
    competition.select!{|v| v.is_battle_campaign? == self.is_battle_campaign?}
    total = competition.collect{|c| c.votes }.inject(:+)
    if total == 0
      @cached_vote_percentage = "-"
    else
      @cached_vote_percentage = ("%3.2f\%" % ((self.votes/total.to_f)*100.0))
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
  
  def last_updated_at
    return self.Fact_Date
  end
  
  # election_date?
end
