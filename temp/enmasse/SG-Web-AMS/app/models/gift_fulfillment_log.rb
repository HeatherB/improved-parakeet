# == Schema Information
#
# Table name: gift_fulfillment_logs
#
#  id                  :integer          not null, primary key
#  user_id             :integer
#  gift_fulfillment_id :integer
#  trace_json          :text
#  exception           :text
#  execution_time      :decimal(20, 10)
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#

class GiftFulfillmentLog < LogAR
  include Extensions::GiftFulfillmentLogEx
  # FYI : AR associations (to WebAR) won't work here since it's held in another db

  attr_accessible :user_id, :gift_fulfillment_id, :trace_json, :exception, :execution_time
end
