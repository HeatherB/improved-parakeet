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

class WhAssetFreeEmp < WarehouseSkuAsset

  def fulfill!(asset_fulfillment)
    error_msg = nil


    write_log(asset_fulfillment) do |log|
      self.class.transaction(:requires_new => true) do
        begin
          user = asset_fulfillment.user
          wh_sku_asset = asset_fulfillment.warehouse_sku_asset
          amount = wh_sku_asset.meta_variable_value("amount").to_i
          game_id = (wh_sku_asset.meta_variable_value("game_id") || Game.find_by_name("TERA").id).to_i
          game_name = Game.find(game_id).name rescue 'TERA'
          order_transaction_id = asset_fulfillment.id

          log << trace_msg("Adding Crediting '#{user.screen_name}' (user_id=#{user.id}) with #{amount} EMP, game_name='#{game_name}'")

          payletter_client = Payletter::Client.new
          result = payletter_client.add_cash(
            user.id,
            user.email,
            'EMP_BONUS',        #cashattrtype
            amount,
            game_name.upcase,
            nil,                #ip_addr
            'free emp',         #description
            'AMS',              #publisher
            nil,                #game_user_no
            'USA',              #country
            'EMP',              #cash_identifier
            order_transaction_id
            )
          transaction_id = result.transaction_id
          log << trace_msg("Success with transaction_id='#{transaction_id}'")
        rescue Payletter::Client::PayletterError => e
          raise FulfillErrorWithRetry.new e.message
        end

        PaidState.set!(:user_id => user.id, :game_id => game_id)

      end #self.class#
    end   #write#
  end     #def#
end       #class#
