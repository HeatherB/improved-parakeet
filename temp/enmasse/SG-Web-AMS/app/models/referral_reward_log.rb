# == Schema Information
#
# Table name: referral_reward_logs
#
#  id          :integer          not null, primary key
#  referral_id :integer
#  reward_rank :string(255)
#  trace_json  :text
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class ReferralRewardLog < LogAR
  belongs_to :referral

  attr_accessible :referral_id, :reward_rank, :trace_json
end
