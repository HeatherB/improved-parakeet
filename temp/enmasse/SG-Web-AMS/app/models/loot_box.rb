class LootBox < PGModel
  belongs_to :loot_box_definition

  attr_accessible :game_account_id, :master_account_id, :loot_box_definition_id


end
