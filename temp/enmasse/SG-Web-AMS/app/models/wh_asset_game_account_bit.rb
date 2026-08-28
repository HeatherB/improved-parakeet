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

class WhAssetGameAccountBit < WarehouseSkuAsset

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
          res = apply_bits_to_account(acct, meta_hash["applied_bits"], meta_hash["applied_benefits"], log)
          raise FulfillErrorWithRetry.new("Failed to update account bits") unless res

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

  def apply_bits_to_account(acct, bits, benefits, log)
    return nil if self.game.settings(:service_url).nil?

    if bits.is_a? String
      if bits.start_with?('0x')
        bits = bits.to_i(16)
      else
        bits = bits.to_i
      end
    end

    log << trace_msg("Applying bits: #{bits & 0xffffffffffffffff}")
    adapter, adapter_log = GameAdapter.new(acct.game.settings(:service_url)), []
    res = adapter.make_request(
      :update_bits,
      { :user_id => acct.user_id, :game_account_id => acct.id },
      { :add_bits => bits & 0xffffffffffffffff },
      adapter_log
    )
    adapter_log.each { |str| log << trace_msg(str) }
    return res if res.nil?

    if benefits && !benefits.empty?
      log << trace_msg("Applying benefits: #{benefits.join(',')}")
      adapter_log = []
      res = adapter.make_request(
         :update_benefits,
         { :user_id => acct.user_id, :game_account_id => acct.id },
         { :add_benefits => benefits.join(',') },
         adapter_log
      )
      adapter_log.each { |str| log << trace_msg(str) }
    end

    res
  end

end
