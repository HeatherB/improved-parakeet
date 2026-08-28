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

class WhAssetAVARedTicket < WarehouseSkuAsset

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
          acct = get_asset_account(user, acct_id, log, { :pref_acct => af_meta["pref_acct"] })
          wh_sku_asset = asset_fulfillment.warehouse_sku_asset
          amount = wh_sku_asset.meta_variable_value("amount").to_i

          log << "Attempting to call send_red_tickets(#{acct.id}, #{amount})"
          res = GameTools::AVA::API.new.send_red_tickets(acct.id, amount)
          log << "Response: #{res}"
          case res['error_code']
          when 'not_found'
            log << "Failed, error_message: Not Found!"
            raise RuntimeError.new("send_red_tickets failed, error_emssage: #{res.inspect}")
          when 'operation_error'
            log << "Failed, error_message: #{res.inspect}"
            raise RuntimeError.new("send_red_tickets failed, error_message: #{res.inspect}")
          when nil
            log << 'Success'
          end
        rescue Exception => e
          raise FulfillErrorWithRetry.new e.message
        end

      end #self.class#
    end   #write#
  end     #def#
end       #class#
