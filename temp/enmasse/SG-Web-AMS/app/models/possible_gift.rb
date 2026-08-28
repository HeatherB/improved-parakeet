# == Schema Information
#
# Table name: possible_gifts
#
#  id           :integer          not null, primary key
#  gift_box_id  :integer          not null
#  game_item_id :integer
#  chance       :decimal(19, 16)  not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  emp          :integer          default(0), not null
#  opened       :integer          default(0), not null
#  image        :string(255)
#

class PossibleGift < ActiveRecord::Base
  attr_accessible :game_item_id, :gift_box_id, :chance, :emp, :image

  belongs_to :game_item, :inverse_of => :possible_gifts
  belongs_to :gift_box, :inverse_of => :possible_gifts

  validates :gift_box_id, :presence => true
  validates :chance, :numericality => {:greater_than => 0}
  validates :emp, :numericality => true
  validates :opened, :numericality => true

  def hash_with_game_item
    self.as_json(:only => [:emp, :game_item_id, :image], :include => :game_item)
  end

  def content
    reward = []
    reward << game_item.display_name if self.game_item.present?
    reward << "#{self.emp} EMP" if self.emp.present? && self.emp > 0
    reward.join(" and ")
  end
end
