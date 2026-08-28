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

class SubscriptionMigrateNotification < SubscriptionNotification

  attr_accessible :payment_method, :user_id, :request_type, :provider_txn_key, :billing_transaction_id, :subscription_id, :ext_product_id, :request_ip, :server_ip, :duration, :recurring, :expiration_date, :renewal_date, :state, :promo_code, :notification_json, :has_errors, :error_json, :ext_user_id, :notes, :pending, :ext_subscription_id, :activation_date, :cancel_date, :game_account_id, :is_trial

  def self.create_initial!(hash)
    create!(
      :payment_method      => "digital_river",
      :user_id             => hash["ENMASSE_USERID"],
      :request_type        => "migrate",
      :provider_txn_key    => hash["ORDER_ID"],
      :ext_product_id      => hash["SUB_PRODUCT_ID"],
      :ext_subscription_id => hash["SUBSCRIPTION_ID"],
      :duration            => hash["RENEWAL_TERM_MONTHS"].to_i * 30,
      :recurring           => (hash["AUTOMATIC"].to_i == 1),
      :request_ip          => "127.0.0.1",
      :server_ip           => "127.0.0.1",
      :state               => hash["SUBSCRIPTION_STATE"],
      :promo_code          => hash["ACTIVATION_CODE"],
      :notification_json   => hash.to_json,
      :ext_user_id         => hash["DR_USERID"],
      :has_errors          => true
    )
  end

  # given a promocode and user, return the game account fulfilled by 
  # the provided code. Ensure this game account is owned by given user
  def self.redeemed_game_account(code, user)
    pcode = PromoCode.first({
      :conditions => { :promo_code => code },
      :include => { :asset_fulfillments => :warehouse_sku_asset }
    })
    raise "Code not found" unless pcode.present?
    
    # now we need to find the game account asset redeemed for the requested lineitem
    fulfillments = pcode.asset_fulfillments.flatten
    acct_assets = fulfillments.select { |af| af.warehouse_sku_asset.is_game_account_asset? }

    raise "Game account fulfillment has not completed: found 0 accounts" if acct_assets.size == 0
    raise "Unable to determine game account: found #{acct_assets.size} accounts" if acct_assets.size > 1
  
    acct_asset = acct_assets.first
  
    raise "Game account fulfillment has not completed" unless acct_asset.complete?
  
    acct = GameAccount.active.find_by_id(acct_asset.game_account_id.to_i)
  
    raise "Game account does not exist: ID #{acct_asset.game_account_id.to_i}" if acct.nil?
    raise "Game account with ID #{acct.id} does not belong to #{user.email} (#{user.screen_name})" unless acct.user_id == user.id
    raise "Game account is permanently banned" if acct.perma_banned?
    
    acct
  end

  private

  # this gets called by parent after save filter... we want a noop for the migration
  def update_line_item_promo_codes; end  
  
end
