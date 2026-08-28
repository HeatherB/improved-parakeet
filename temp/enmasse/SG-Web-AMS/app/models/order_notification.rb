# == Schema Information
#
# Table name: order_notifications
#
#  id                :integer          not null, primary key
#  payment_method    :string(128)
#  user_id           :integer
#  provider_txn_key  :string(255)
#  sge_txn_key       :string(255)
#  request_ip        :string(255)
#  server_ip         :string(255)
#  notification_json :text
#  has_errors        :boolean          default(TRUE)
#  error_json        :text
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#

class OrderNotification < LogAR
  attr_accessible :payment_method, :user_id, :provider_txn_key, :sge_txn_key, :request_ip, :server_ip, :notification_json, :has_errors, :error_json
end
