# == Schema Information
#
# Table name: subscription_notifications
#
#  id                     :integer          not null, primary key
#  payment_method         :string(128)
#  user_id                :integer
#  request_type           :string(255)
#  provider_txn_key       :string(255)
#  billing_transaction_id :integer
#  subscription_id        :integer
#  ext_product_id         :string(255)
#  ext_subscription_id    :string(255)
#  request_ip             :string(255)
#  server_ip              :string(255)
#  duration               :integer
#  recurring              :boolean
#  expiration_date        :datetime
#  renewal_date           :datetime
#  state                  :string(80)
#  promo_code             :string(80)
#  notification_json      :text
#  has_errors             :boolean          default(TRUE)
#  error_json             :text
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  ext_user_id            :string(80)
#  notes                  :string(1028)
#  pending                :boolean          default(FALSE)
#  activation_date        :datetime
#  cancel_date            :datetime
#  game_account_id        :integer
#

class ChronoScrollNotification < LogAR
  self.table_name = "subscription_notifications"

  attr_accessible :payment_method, :user_id, :request_type, :provider_txn_key, :billing_transaction_id, :subscription_id, :ext_product_id, :request_ip, :server_ip, :duration, :recurring, :expiration_date, :renewal_date, :state, :promo_code, :notification_json, :has_errors, :error_json, :ext_user_id, :notes, :pending, :ext_subscription_id, :activation_date, :cancel_date, :game_account_id, :is_trial
end
