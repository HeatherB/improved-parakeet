# == Schema Information
#
# Table name: game_items
#
#  id           :integer          not null, primary key
#  game_id      :integer
#  item_code    :string(128)
#  display_name :string(255)
#  active       :boolean          default(TRUE)
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  meta_json    :string(2048)
#

class GameItem < ActiveRecord::Base
  has_many :possible_gifts, :inverse_of => :game_item

  def description
    m = (JSON.load(self.meta_json) || {}) rescue {}
    m['description']
  end

  def item_sn
    m = (JSON.load(self.meta_json) || {}) rescue {}
    m['item_sn']
  end

  def icon
    m = (JSON.load(self.meta_json) || {}) rescue {}
    m['icon']
  end

end
