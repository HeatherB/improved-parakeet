# == Schema Information
#
# Table name: incomm_redemption_logs
#
#  id                   :integer          not null, primary key
#  incomm_redemption_id :integer
#  trace_json           :text
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#

class IncommRedemptionLog < LogAR
  belongs_to :incomm_redemption

  attr_accessible :incomm_redemption_id, :trace_json
end
