# == Schema Information
#
# Table name: amazon_fulfillment_logs
#
#  id                    :integer          not null, primary key
#  amazon_fulfillment_id :integer
#  trace_json            :text
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#

class AmazonFulfillmentLog < LogAR
  belongs_to :amazon_fulfillment

  attr_accessible :amazon_fulfillment_id, :trace_json

  def log log_array
    self.trace_json = log_array.to_json
  end
end
