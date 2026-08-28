# == Schema Information
#
# Table name: billing_transactions
#
#  id                   :integer          not null, primary key
#  user_id              :integer
#  payment_type         :string(255)
#  payment_account      :string(255)
#  original_amount      :decimal(6, 2)
#  amount_paid          :decimal(6, 2)
#  currency             :string(255)
#  sge_txn_key          :string(255)
#  provider_txn_key     :string(255)
#  country_code         :string(2)
#  request_ip           :string(255)
#  server_ip            :string(255)
#  status               :integer
#  meta_json            :text
#  automatic_charge     :boolean          default(FALSE)
#  was_reversed         :boolean          default(FALSE)
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  tax                  :decimal(6, 2)
#  fulfillment_complete :boolean          default(FALSE)
#

class BillingTransaction < ActiveRecord::Base
  include Extensions::BillingTransactionEx
  
  has_many :billing_transaction_items
  has_many :promo_codes, :as => :fulfillable
  has_many :line_item_promo_codes
    
  after_save :process_pending_sub_notifs
  
  attr_accessible :user_id, :payment_type, :payment_account, :original_amount, :amount_paid, :currency, :sge_txn_key, :provider_txn_key, :country_code, :request_ip, :server_ip, :status, :meta_json, :automatic_charge, :was_reversed, :tax, :fulfillment_complete
  
  protected
  
  def process_pending_sub_notifs
    if self.fulfillment_complete_changed? && self.fulfillment_complete?
      SubscriptionRetryNotif.process_all_for(self)
    end
  end
  
end
