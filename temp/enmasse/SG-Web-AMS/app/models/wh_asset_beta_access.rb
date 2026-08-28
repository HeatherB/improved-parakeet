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

class WhAssetBetaAccess < WarehouseSkuAsset

  def fulfill!(asset_fulfillment)
    error_msg = nil

    user = asset_fulfillment.user

    write_log(asset_fulfillment) do |log|
      self.class.transaction(:requires_new => true) do
        begin
          beta_app = BetaApplication.where(user_id: user.id, game_id: game.id).first
          beta_app ||= BetaApplication.new(user_id: user.id, game_id: game.id, applied_at: Time.now)
          log << "Attempting to add beta(userID: #{user.id}, gameID:#{game.id})"
          if beta_app.can_activate?
            beta_app.accepted_at = Time.now
            if beta_app.save
              EME::Email.send_email({to: user.email, master_account_id: user.id, template_name: "API_beta_accepted_#{game.seo_id}"})
              log << "Success beta(userID: #{user.id}, gameID:#{game.id})"
            else
              log << "Error saving beta data. beta(userID: #{user.id}, gameID:#{game.id})"
              raise Exception, "Failed to save! beta(userID: #{user.id}, gameID:#{game.id})"
            end
          end
        rescue Exception => e
          raise FulfillErrorWithRetry.new e.message
        end

      end #self.class#
    end   #write#
  end     #def#
end       #class#
