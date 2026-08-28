# == Schema Information
#
# Table name: asset_fulfillment_logs
#
#  id                   :integer          not null, primary key
#  user_id              :integer
#  asset_fulfillment_id :integer
#  trace_json           :text
#  exception            :text
#  execution_time       :decimal(20, 10)
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#

class AssetFulfillmentLog < LogAR
  include Extensions::AssetFulfillmentLogEx
  # FYI : AR associations (to WebAR) won't work here since it's held in another db

  attr_accessible :user_id, :asset_fulfillment_id, :trace_json, :exception, :execution_time
end
