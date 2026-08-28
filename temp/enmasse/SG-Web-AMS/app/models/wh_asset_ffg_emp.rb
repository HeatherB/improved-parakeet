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

class WhAssetFfgEmp < WarehouseSkuAsset

  def fulfill!(asset_fulfillment)
    error_msg = nil
    user = asset_fulfillment.user
    
    write_log(asset_fulfillment) do |log|
      self.class.transaction(:requires_new => true) do
        begin
          wh_sku_asset = asset_fulfillment.warehouse_sku_asset
          amount = wh_sku_asset.meta_variable_value("amount").to_i
          payment_type = wh_sku_asset.meta_variable_value("payment_type")
          if payment_type.nil?
            # Old format for WhAssetFfgEmp, just credit EMP amount to FFG
            log << trace_msg("Crediting '#{user.screen_name}' (user_id=#{user.id}) with #{amount} EMP")

            # will raise a WalletException if not successful
            begin
              ffg_client = FatFooGoo::Client.new
              transaction_id = ffg_client.credit_wallet(asset_fulfillment.source_reference_key, 'EMP', amount, user.id)
              log << trace_msg("Success with transaction_id='#{transaction_id}'")
            rescue FatFooGoo::Client::WalletException => e
              raise FulfillErrorWithRetry.new e.message
            end
            # create a paid state for this user if it does not already exist
            PaidState.set!(:user_id => user.id, :game_id => Game.find_by_name("TERA").id)
          elsif payment_type == "amazon" || payment_type == "steam" || payment_type == "levelup"
            # EMP was purchased from Amazon or Steam
            amount_gross = wh_sku_asset.meta_variable_value("amount_gross").to_i
            amount_net = wh_sku_asset.meta_variable_value("amount_net").to_i
            game_id = (wh_sku_asset.meta_variable_value("game_id") || Game.find_by_name("TERA").id).to_i
            game_name = Game.find(game_id).name rescue 'TERA'
            log << trace_msg("Crediting '#{user.screen_name}' (user_id=#{user.id}) with #{amount} EMP, amount_gross=#{amount_gross}, amount_net=#{amount_net}, payment_type='#{payment_type}', game_name='#{game_name}'")

            begin
              order_transaction_id = asset_fulfillment.id
              payletter_client = Payletter::Client.new
              result = payletter_client.create_cash(user.id, user.email, payment_type.upcase, 'USD', amount_net, 0.0, amount, order_transaction_id, game_name.upcase)
              transaction_id = result.transaction_id
              log << trace_msg("Success with transaction_id='#{transaction_id}'")
            rescue Payletter::Client::PayletterError => e
              raise FulfillErrorWithRetry.new e.message
            end
            # create a paid state for this user if it does not already exist
            PaidState.set!(:user_id => user.id, :game_id => game_id)
          else
            log << trace_msg("Unknown payment_type='#{payment_type}'")
          end
        end
      end
    end
  end
  
end
