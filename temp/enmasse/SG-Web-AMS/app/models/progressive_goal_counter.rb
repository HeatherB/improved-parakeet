# == Schema Information
#
# Table name: progressive_goal_counters
#
#  id           :integer          not null, primary key
#  user_id      :integer          not null
#  promotion_id :integer          not null
#  purchased    :integer          default(0), not null
#  opened       :integer          default(0), not null
#  sent         :integer          default(0), not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#

class ProgressiveGoalCounter < ActiveRecord::Base
  attr_accessible :user_id, :promotion_id, :purchased, :opened, :sent

  belongs_to :user
  belongs_to :promotion
  has_many :progressive_goal_rewards

  validates :user_id, :presence => true
  validates :promotion_id, :presence => true

  after_commit :trigger_rewards_on_purchase

  def trigger_rewards_on_purchase
    # automatically trigger rewards after a purchase
    if self.previous_changes.keys.include?("purchased")
      incremented = {}
      incremented[:purchased] = self.changes["purchased"] && self.changes["purchased"][0] < self.changes["purchased"][1]
      incremented[:opened] = self.changes["opened"] && self.changes["opened"][0] < self.changes["opened"][1]
      incremented[:sent] = self.changes["sent"] && self.changes["sent"][0] < self.changes["sent"][1]
      self.trigger_rewards!(incremented) if incremented[:purchased]
    end
  end

  def trigger_rewards!(incremented)
    messages = []

    self.promotion.progressive_goals.each do |progressive_goal|
      # skip this goal if it is not repeatable and we've already redeemed it
      next if !progressive_goal.repeatable? && self.progressive_goal_rewards.nolock.exists?(:progressive_goal_id => progressive_goal.id)

      # only check set conditions
      conditions = {}
      conditions[:purchased] = progressive_goal.purchase_gift_count if progressive_goal.purchase_gift_count > 0
      conditions[:opened] = progressive_goal.open_gift_count if progressive_goal.open_gift_count > 0
      conditions[:sent] = progressive_goal.send_gift_count if progressive_goal.send_gift_count > 0

      # check if all conditions are met as long as there are conditions
      conditions_met = conditions.size > 0 && (conditions.select { |condition, count| self.send(condition) >= count }.size == conditions.size)

      next unless conditions_met

      if progressive_goal.repeatable?
        # check the most recent reward
        recent_reward = self.progressive_goal_rewards.nolock.find(:first, :conditions => {:progressive_goal_id => progressive_goal.id}, :order => "progressive_goal_rewards.given_at DESC, progressive_goal_rewards.id DESC")
        if recent_reward
          # make sure at least one of the conditions that has changed is exactly equal to the condition and greater than the previous reward
          changed_and_met_condition = conditions.select { |condition, count| count != 0 && self.send(condition) != 0 && incremented[condition] && (self.send(condition) > recent_reward.send(condition)) && (self.send(condition) % count == 0)}.size > 0
        else
          # make sure at least one of the conditions that has changed is exactly equal to the condition
          changed_and_met_condition = conditions.select { |condition, count| count != 0 && self.send(condition) != 0 && incremented[condition] && self.send(condition) == count }.size > 0
        end
      else
        # make sure at least one of the conditions that has changed is exactly equal to the condition
        changed_and_met_condition = conditions.select { |condition, count| count != 0 && self.send(condition) != 0 && incremented[condition] && self.send(condition) == count }.size > 0
      end

      if changed_and_met_condition
        # redeem the promotion for the quantity listed, add the message to the return array
        progressive_goal.reward_quantity.times.each do |i|
          self.progressive_goal_rewards.create!(:user_id => self.user_id, :progressive_goal_id => progressive_goal.id, :promotion_id => self.promotion_id, :reward_promotion_id => progressive_goal.reward_id, :purchased => self.purchased, :opened => self.opened, :sent => self.sent, :given_at => Time.now.utc)
        end
        messages << progressive_goal.message
      end
    end
    return messages
  end
end
