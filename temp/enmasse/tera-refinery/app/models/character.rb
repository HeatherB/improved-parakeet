class Character < ActiveRecord::Base
  if Rails.env == "test"
    establish_connection :tera_game_portal_test
  else
    establish_connection :tera_game_portal
  end
  self.primary_key = "character_id"
  
  self.belongs_to :guild
  self.belongs_to :server
  self.belongs_to :game_account, :foreign_key => :source_account_id
  
  default_scope where(:server_id => Server::WHITELIST_IDS)
  
  def name
    self.character_name
  end
  
  def gender
    self.character_gender
  end
  
  def race
    self.character_race
  end
  
  def job
    self.character_class
  end
  
  def active?
    !self.is_deleted?
  end
  
  def runs=(val)
    @cached_runs = val
  end
  
  def runs
    @cached_runs
  end
  
  def self.all_for_master_account(master_account_id)
    game_accounts = GameAccount.where(:master_account_id => master_account_id).all
    return [] if game_accounts.empty?
    ids = game_accounts.collect{|ga| ga.game_account_id }
    return self.where(:source_account_id => ids).order('character_level DESC').all
  end
  
  def get_instance_rank(dungeon_id, kind="completions")
    irt = InstanceRunTotal.where(:character_id => self.character_id, :dungeon_id => dungeon_id).first
    
    higher = if kind == "completions"
      total = irt.nil? ? 0 : irt.completions
      InstanceRunTotal.where(:dungeon_id => dungeon_id).where("completions > ?", total).count
    end
    return higher + 1
  end
  
end

__END__

Character(character_id: integer, source_character_id: integer, create_date: datetime,
          server_name: string, server_id: integer, source_account_id: integer,
          character_name: string, character_gender: string, character_class: string,
          character_race: string, is_deleted: integer, guild_id: integer)
