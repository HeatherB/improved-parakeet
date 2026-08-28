
class LootBoxDefinition < PGModel
  has_many :loot_boxes
  #has_many :chance_loot_box_items
  #has_many :default_loot_box_items
  belongs_to :game

end
