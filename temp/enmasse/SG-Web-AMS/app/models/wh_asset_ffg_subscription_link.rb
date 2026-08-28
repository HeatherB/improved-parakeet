# == Schema Information
#
# Table name: warehouse_sku_assets
#
#  id               :integer          not null, primary key
#  warehouse_sku_id :integer
#  game_id          :integer
#  type             :string(255)
#  title            :string(255)
#  meta_json        :text
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  deleted          :boolean          default(FALSE)
#

class WhAssetFfgSubscriptionLink < WarehouseSkuAsset

  def fulfill!(asset_fulfillment)
    # error_msg = nil
    # user = asset_fulfillment.user
    # af_meta = JSON.parse(asset_fulfillment.meta_json) if asset_fulfillment.meta_json.present?
    # af_meta ||= {}
    # acct_id, acct = af_meta["game_account_id"].to_i, nil
    #
    # write_log(asset_fulfillment) do |log|
    #   self.class.transaction(:requires_new => true) do
    #     begin
    #       acct = get_asset_account(user, acct_id, log, { :pref_acct => af_meta["pref_acct"] })
    #
    #       log << trace_msg("Linking account #{acct.id} - #{acct.account_name} to the order notification")
    #
    #       sub = acct.subscription
    #
    #       if sub.present?
    #         # in FFG, there is no subscription renew call
    #         # instead, we receive an order notification with the same promocode
    #         # thus, this asset is redeemed again; we can infer that this is a
    #         # renewal by the presence of an active subscription
    #         if sub.state == 'active'
    #           if sub.ext_provider == 'fat_foo_goo'
    #             # an active subscription exists, we need to queue a renewal notification
    #             log << trace_msg("Queueing renewal for subscription #{sub.id}")
    #
    #             # use the subscription duration if it exists
    #             if sub.renewal_duration.present?
    #               duration = sub.renewal_duration
    #             else
    #               duration = 30 # otherwise use default duration of 30 days
    #             end
    #
    #             sub_attrs = { :recurring => true,
    #                           :transaction_source_type => asset_fulfillment.class.name,
    #                           :transaction_source_id => asset_fulfillment.id
    #                         }
    #             sub_attrs[:is_trial] = false if sub.is_trial.present? && sub.is_trial # reset trial status
    #
    #             update_line_item_promo_code(asset_fulfillment, false)
    #
    #             Subscription.upsert(acct, duration, sub_attrs)
    #           else
    #             raise FulfillErrorWithRetry.new("There is an active non-FFG subscription; failed.")
    #           end
    #         elsif ['pending', 'expired', 'cancelled'].include?(sub.state)
    #           log << trace_msg("Moving subscription to pending state")
    #
    #           sub_attrs = { :payment_required => false,
    #                         :transaction_source_type => asset_fulfillment.class.name,
    #                         :transaction_source_id => asset_fulfillment.id
    #                       }
    #           sub_attrs[:is_trial] = false if sub.is_trial.present? && sub.is_trial # reset trial status
    #
    #           update_line_item_promo_code(asset_fulfillment, true)
    #
    #           Subscription.upsert(acct, 0, sub_attrs)
    #         end
    #       else
    #         log << trace_msg("Creating pending subscription")
    #         # create a pending sub
    #         sub_attrs = { :payment_required => false,
    #                       :transaction_source_type => asset_fulfillment.class.name,
    #                       :transaction_source_id => asset_fulfillment.id
    #                     }
    #
    #         update_line_item_promo_code(asset_fulfillment, true)
    #
    #         Subscription.upsert(acct, 0, sub_attrs)
    #       end
    #
    #       # create a paid state for this user if it does not already exist
    #       PaidState.set!(:user_id => acct.user_id, :game_id => acct.game_id)
    #
    #       # we're done... mark that this item was redeemed by the account
    #       asset_fulfillment.game_account_id = acct.id
    #     end
    #   end
    # end
  end

  def fields_for_user_input
    [:game_account_id]
  end

  private

  # def update_line_item_promo_code(asset_fulfillment, subscription_created)
  #   if asset_fulfillment.source.is_a?(PromoCode) && asset_fulfillment.source.fulfillable.is_a?(BillingTransaction)
  #     # first attempt to find by unique promo code
  #     lipc = LineItemPromoCode.find(:first, :conditions => {
  #       :billing_transaction_id => asset_fulfillment.source.fulfillable_id,
  #       :promo_code => asset_fulfillment.source.promo_code
  #     })
  #
  #     unless lipc.present?
  #       # attempt to find by group code
  #       lipc = LineItemPromoCode.find(:first, :conditions => {
  #         :billing_transaction_id => asset_fulfillment.source.fulfillable_id,
  #         :promo_code => asset_fulfillment.source.promo_code_batch.group_code
  #       })
  #     end
  #
  #     if lipc.present?
  #       begin
  #         lipc.subscription_created = subscription_created
  #         lipc.locked_by = nil
  #         lipc.save!
  #       rescue ActiveRecord::StaleObjectError => sop
  #         lipc.reload
  #         retry
  #       end
  #     end
  #   end
  # end
  
end
