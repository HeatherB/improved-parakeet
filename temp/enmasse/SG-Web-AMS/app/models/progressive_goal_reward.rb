# == Schema Information
#
# Table name: progressive_goal_rewards
#
#  id                          :integer          not null, primary key
#  user_id                     :integer          not null
#  progressive_goal_id         :integer          not null
#  progressive_goal_counter_id :integer          not null
#  promotion_id                :integer          not null
#  purchased                   :integer          default(0), not null
#  opened                      :integer          default(0), not null
#  sent                        :integer          default(0), not null
#  given_at                    :datetime         not null
#  fulfillment_complete        :boolean          default(FALSE), not null
#  created_at                  :datetime         not null
#  updated_at                  :datetime         not null
#  reward_promotion_id         :integer
#

class ProgressiveGoalReward < ActiveRecord::Base
  attr_accessible :user_id, :progressive_goal_id, :progressive_goal_counter_id, :promotion_id, :reward_promotion_id, :purchased, :opened, :sent, :given_at

  belongs_to :user
  belongs_to :progressive_goal
  belongs_to :progressive_goal_counter
  belongs_to :promotion
  belongs_to :reward_promotion, :class_name => "Promotion"

  has_many :asset_fulfillments, :as => :source

  validates :user_id, :presence => true
  validates :progressive_goal_id, :presence => true
  validates :progressive_goal_counter_id, :presence => true
  validates :promotion_id, :presence => true
  validates :reward_promotion_id, :presence => true
  validates :given_at, :presence => true

  after_commit :fulfill_reward, :on => :create

  def fulfill_reward
    unless self.fulfillment_complete
      options = {}
      options[:pref_acct] = nil
      options[:rate_limited] = false
      options[:redemption_limited] = false

      self.reward_promotion.process_progressive_goal_reward!(user, self, options)
    end
  end

  def reference_key
    self.id
  end
end
