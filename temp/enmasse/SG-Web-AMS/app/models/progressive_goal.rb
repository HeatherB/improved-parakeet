# == Schema Information
#
# Table name: progressive_goals
#
#  id                  :integer          not null, primary key
#  promotion_id        :integer          not null
#  reward_id           :integer          not null
#  reward_quantity     :integer          not null
#  repeatable          :boolean          default(FALSE), not null
#  purchase_gift_count :integer          default(0), not null
#  open_gift_count     :integer          default(0), not null
#  send_gift_count     :integer          default(0), not null
#  message             :string(255)      not null
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#

class ProgressiveGoal < ActiveRecord::Base
  attr_accessible :promotion_id, :reward_id, :reward_quantity, :repeatable, :purchase_gift_count, :open_gift_count, :send_gift_count, :message

  belongs_to :promotion
  belongs_to :reward, :class_name => "Promotion"

  validates :promotion_id, :presence => true
  validates :reward_id, :presence => true
  validates :reward_quantity, :numericality => { :greater_than => 0 }
  validates :repeatable, :inclusion => { :in => [true, false] }
  validates :send_gift_count, :numericality => { :greater_than => 0 }
  validates :message, :presence => true
end
