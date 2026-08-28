class AssetFulfillmentJob < ActiveRecord::Base
  attr_accessible :game_account_id, :game_id, :integer, :master_account_id, :quantity, :queued_at, :source_id, :source_ref_key, :source_type, :warehouse_sku_asset_id

  def self.queue_all!
    to_queue = AssetFulfillmentJob.where(queued_at: nil).all
    to_queue.each { |d| d.queue }
    return to_queue.size
  end

  def queue
    asset = WarehouseSkuAsset.find(warehouse_sku_asset_id)
    af = AssetFulfillment.new(user_id: master_account_id, warehouse_sku_asset_id: asset.id,
      source_id: source_id, source_reference_key: source_ref_key, source_type: source_type,
      meta_json: {pref_acct: game_account_id, quantity: quantity}.to_json)
    if af.save
      self.queued_at = Time.now
      self.save
      asset.fulfill!(af)
      # LOG IT ALSO!!!
    else
      # LOG IT!!!
    end
  end

end
