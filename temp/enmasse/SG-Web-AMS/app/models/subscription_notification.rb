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

class SubscriptionNotification < LogAR
  after_save :update_line_item_promo_codes
 
  attr_accessible :payment_method, :user_id, :request_type, :provider_txn_key, :billing_transaction_id, :subscription_id, :ext_product_id, :request_ip, :server_ip, :duration, :recurring, :expiration_date, :renewal_date, :state, :promo_code, :notification_json, :has_errors, :error_json, :ext_user_id, :notes, :pending, :ext_subscription_id, :activation_date, :cancel_date, :game_account_id, :is_trial
 
  def self.redeemed_game_account(txn, hash)
    code, lipc = applicable_promo_code(txn, hash)
    
    begin
      raise "Serial code is invalid" if code.nil?

      # now we need to find the game account asset redeemed for the requested lineitem
      fulfillments = code.asset_fulfillments.flatten
      acct_assets = fulfillments.select { |af| af.warehouse_sku_asset.has_linked_game_account? }

      raise "No game accounts were fulfilled for this order" if acct_assets.size == 0
      raise "Multiple game accounts redeemed for this order: found #{acct_assets.size} accounts" if acct_assets.size > 1
    
      acct_asset = acct_assets.first
      acct = GameAccount.active.find_by_id(acct_asset.game_account_id.to_i)
    
      raise "Game account does not exist: ID #{acct_asset.game_account_id.to_i}" if acct.nil?
      raise "Game account is permanently banned" if acct.perma_banned?
    rescue Exception => ex
      # make sure we unlock the line item promocode on error
      lipc.update_attribute(:locked_by, nil) if lipc.present?
      raise ex
    end
    
    return acct, code
  end

  def self.applicable_promo_code(txn, params)

      lipcs = txn.line_item_promo_codes.find(:all, 
        :conditions => { 
          :line_item_id => params[:line_item_id], 
          :subscription_created => false,
          :locked_by => nil 
        }
      )

      # ensure we don't allow duplicate requests on the same code
      # we flag the code once the sub is created, but as this happens asynchronously,
      # we need additional locking in place.
      if lipcs.empty?
        raise FatalException.new("Serial code not found for this order, or it has already been processed")
      else
        ix = 0
        begin
          lipc = lipcs[ix]
          if lipc.present?
            lipc.locked_by = params[:notif_id]
            lipc.save!
          else
            lipc = nil
            raise FatalException.new("Serial code is already being processed")
          end
        rescue ActiveRecord::StaleObjectError => soe
          ix += 1
          retry
        end
      end

      # check if the promo code is a a group promo code
      group_code = GroupPromoCode.find(:first, :conditions => { :promo_code => lipc.promo_code })

      if group_code
        code = PromoCode.first({
          :conditions => { :promotion_id => group_code.promotion_id, :fulfillable_type => txn.class.name, :fulfillable_id => txn.id },
          :include => { :asset_fulfillments => :warehouse_sku_asset }
        })
      else
        code = PromoCode.first({
          :conditions => { :promo_code => lipc.promo_code },
          :include => { :asset_fulfillments => :warehouse_sku_asset }
        })
      end

      return code, lipc
  end 
  
  private
  
  def update_line_item_promo_codes
    if self.errors.empty? && self.subscription_id.to_i > 0 && self.promo_code.present?
      lipc = LineItemPromoCode.find(:first, :conditions => {
        :billing_transaction_id => self.billing_transaction_id,
        :promo_code => self.promo_code
      })

      if lipc.present?
        begin
          lipc.subscription_created = true
          lipc.locked_by = nil
          lipc.save!
        rescue ActiveRecord::StaleObjectError => sop
          lipc.reload
          retry
        end
      end
    end
  end
end
