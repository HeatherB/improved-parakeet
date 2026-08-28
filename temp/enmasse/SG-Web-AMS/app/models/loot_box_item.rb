class LootBoxItem < PGModel
  belongs_to :loot_box_definition
  belongs_to :boxable, polymorphic: true
  has_many :loot_boxes

  BOXABLE_TYPES = ["WarehouseSku", "Currency"]

  def as_json(opts = {})
    {
      name: self.name,
      image_url: self.image_url,
      quantity: self.quantity,
      prize: self.prize
    }
  end

  def prize
    if self.boxable_type == "WarehouseSku"
      self.boxable.title
    elsif self.boxable_type == "Currency"
      self.boxable.name
    else
      "???"
    end
  end
end
