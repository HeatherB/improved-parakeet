# == Schema Information
#
# Table name: gift_boxes
#
#  id         :integer          not null, primary key
#  name       :string(255)      not null
#  game_id    :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  image      :string(255)
#

class GiftBox < ActiveRecord::Base
  attr_accessible :name, :game_id, :image, :possible_gifts_attributes

  belongs_to :game
  has_many :possible_gifts, :inverse_of => :gift_box
  has_many :gifts, :inverse_of => :gift_box

  accepts_nested_attributes_for :possible_gifts, :allow_destroy => true

  validates :name, :presence => true, :uniqueness => true
  validates :game_id, :presence => true
  validate :sane_items

  def sane_items
    game_item_ids = self.possible_gifts.map(&:game_item_id)
    counts = Hash.new(0)
    game_item_ids.each { | game_item_id | counts[game_item_id] +=1 }
    errors.add(:possible_gifts, "cannot contain duplicate items") unless counts.select { |game_item_id, count| count > 1 }.size == 0
  end

  # Returns a possible gift
  def open(update_stats: true, override_selected_gift: nil)
    # create whole number frequences from the chances
    if override_selected_gift
      selected_gift = override_selected_gift
    else
      ordered_possible_gifts = self.possible_gifts.order(:id)
      frequencies = ordered_possible_gifts.map { |possible_gift| possible_gift.chance * 10000000000000000 }
      selected_gift = sample(ordered_possible_gifts, frequencies)
    end
    selected_gift.increment!(:opened) if update_stats
    selected_gift
  end

  private

  def sample(arr, frequencies)
    thresholds = frequencies.clone
    0.upto(frequencies.count - 1).each { |i| thresholds[i] += thresholds[i - 1] }
    max = frequencies.reduce :+
    roll = rand(max)
    index = thresholds.find_index { |x| roll <= x }
    arr[index]
  end
end
