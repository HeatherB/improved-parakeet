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

class WhAssetGameTime < WarehouseSkuAsset

  def fulfill!(asset_fulfillment)
    error_msg = nil
    user = asset_fulfillment.user
    af_meta = JSON.parse(asset_fulfillment.meta_json) if asset_fulfillment.meta_json.present?
    af_meta ||= {}
    acct_id, acct = af_meta["game_account_id"].to_i, nil
    meta_hash = JSON.parse(self.meta_json)

    write_log(asset_fulfillment) do |log|
      self.class.transaction(:requires_new => true) do
        begin
          acct = get_asset_account(user, acct_id, log, { :pref_acct => af_meta["pref_acct"], :creation_path => af_meta["creation_path"] })
          begin
            add_game_time_to_account(acct, meta_hash, asset_fulfillment)
          rescue SubscriptionServiceError => e
            raise FulfillErrorWithRetry.new("Failed to add game time: error='#{e.message}'")
          end

          # we're done... mark that this item was redeemed by the account
          asset_fulfillment.game_account_id = acct.id

        rescue FulfillErrorWithRetry => fewr

          # without this workaround, the ENTIRE transaction (including promocode redemption status and logs) gets rolled back
          log << trace_msg("Rolling back transaction and adding to retry queue")
          error_msg = fewr.message
          raise ActiveRecord::Rollback

        rescue ActiveRecord::StatementInvalid => e

          log << trace_msg("Rolling back transaction and adding to retry queue")
          error_msg = e.message
          raise ActiveRecord::Rollback

        end
      end

      raise FulfillErrorWithRetry.new(error_msg) if error_msg.present?

    end
  end

  def fields_for_user_input
    [:game_account_id]
  end

  private

  def add_game_time_to_account(acct, meta_hash, asset_fulfillment)
    Subscription.add_days_with_subscription_creation(acct.user_id, acct.id, acct.game_id,
                                                     meta_hash["game_time"].to_i, 'WhAssetGameTime',
                                                     {
                                                       source_type: asset_fulfillment.class.name,
                                                       source_id:   asset_fulfillment.id,
                                                       meta_hash:   meta_hash,
                                                     }.to_json)
  end

end
