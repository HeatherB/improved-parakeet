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

# A charge references a gift box that is redeemed for the user to either use or
# gift to another player
class WhAssetWebLootBox < WarehouseSkuAsset

  def fulfill!(asset_fulfillment)
    error_msg = nil
    user = asset_fulfillment.user

    write_log(asset_fulfillment) do |log|
      self.class.transaction(:requires_new => true) do
        begin
          log << trace_msg("Fulfilling Web Lootbox Asset...")
          log << trace_msg(asset_fulfillment.inspect)

          wh_sku_asset = asset_fulfillment.warehouse_sku_asset
          lootbox_defintion_id = wh_sku_asset.meta_variable_value("lootbox_definition_id").to_i
          game_account_id = asset_fulfillment.game_account_id || JSON.parse(asset_fulfillment.meta_json)["pref_acct"]
          lb_def = LootBoxDefinition.where(active: true, id: lootbox_defintion_id).first


          if lb_def
            log << trace_msg("Found web lootbox definition with id #{lootbox_defintion_id}")
            log << trace_msg("Creating lootbox...")
            
            lb = LootBox.create!(:game_account_id => game_account_id,
                                :master_account_id => user.id,
                                :loot_box_definition_id => lb_def.id)

            log << trace_msg("Created lootbox with id #{lb.id}")
          else
            error_msg = "Unable to find lootbox definition with id #{lootbox_defintion_id}"
          end
        rescue => ex
          log << trace_msg("Rolling back transaction and adding to retry queue")
          error_msg = ex.message
          raise ActiveRecord::Rollback
        end
      end

      raise FulfillErrorWithRetry.new(error_msg) if error_msg.present?
    end
  end

end
