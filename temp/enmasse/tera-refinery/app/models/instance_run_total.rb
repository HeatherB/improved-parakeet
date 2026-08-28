class InstanceRunTotal < ActiveRecord::Base
  if Rails.env == "test"
    establish_connection :tera_game_portal_test
  else
    establish_connection :tera_game_portal
  end
  self.primary_key = "instance_run_total_id"

  self.belongs_to :character
  self.belongs_to :dungeon
  
  VALID_FIELDS = ["completions", "legendary_items_looted", "bam_kills", "monster_kills"]
  
  def self.most(dungeon_id, field="completions", count=100)
    raise RuntimeError, "Use a valid field for #most function: ALLOWED: #{VALID_FIELDS.inspect} you used: '#{field}'" unless VALID_FIELDS.include?(field)
    the_most = self.where(:dungeon_id => dungeon_id).order("#{field} DESC").includes(:character => :server).limit(count)
    the_most.select!{|run| !run.character.nil?}
    return the_most.sort_by{|r| [-r.send(field.to_sym), r.character.name]}
  end
  
  def self.most_for_characters(characters_array, dungeon_id, field)
    raise RuntimeError, "Use a valid field for #most function: ALLOWED: #{VALID_FIELDS.inspect} you used: '#{field}'" unless VALID_FIELDS.include?(field)
    the_most = self.where(:character_id => characters_array.collect{|x| x.character_id }, :dungeon_id => dungeon_id).order("#{field} DESC").includes(:character => :server).limit(count)
    return the_most.sort_by{|r| [-r.send(field.to_sym), r.character.name]}
  end
  
  def set_rank(dungeon_id, field = :completions, val = nil)
    field = field.to_sym
    @rank = val
    @rank = "&#8212;" if self.send(field).nil?
    if @rank.nil?
      lookup = "completions > #{self.completions}"
      @rank = InstanceRunTotal.where(:dungeon_id => dungeon_id).where(lookup).count + 1
    end
    return @rank
  end
  
  def rank
    @rank
  end
  
end

__END__
InstanceRunTotal
  dungeon_id: 9087, character_id: 246584, completions: 1, legendary_items_looted: 0,
  monster_kills: 15, bam_kills: 1, instance_run_total_id: 98100
