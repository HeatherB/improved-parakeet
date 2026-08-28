# == Schema Information
#
# Table name: subscription_error_logs
#
#  id                    :integer          not null, primary key
#  subscription_id       :integer
#  severity              :string(255)
#  subscription_obj_json :text
#  error_details         :text
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#

class SubscriptionErrorLog < LogAR
  
  attr_accessible :subscription_id, :severity, :subscription_obj_json, :error_details
  
  def self.create_log!(sub, severity, details)
    create(
      :subscription_id => (sub.present? ? sub.id : 0),
      :severity => severity,
      :subscription_obj_json => sub.to_json,
      :error_details => details
    )
  end

end
