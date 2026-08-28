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
class WhAssetCharge < WarehouseSkuAsset

  def fulfill!(asset_fulfillment)
    error_msg = nil
    user = asset_fulfillment.user

    write_log(asset_fulfillment) do |log|
      self.class.transaction(:requires_new => true) do
        begin
          log << trace_msg("Fulfilling Charge Asset...")

          wh_sku_asset = asset_fulfillment.warehouse_sku_asset
          gift_box_id = wh_sku_asset.meta_variable_value("gift_box_id").to_i
          gift_box = GiftBox.find(gift_box_id)

          if gift_box
            log << trace_msg("Found gift box with id #{gift_box_id}")
            log << trace_msg("Creating gift...")

            # Track the promotion this gift came from if the asset fulfillment
            # source was a promotion code or progressive goal reward
            if ["PromoCode", "ProgressiveGoalReward"].include? asset_fulfillment.source_type
              promotion_id = asset_fulfillment.source.promotion_id
            else
              promotion_id = nil
            end

            # If this is a progressive goal reward, treat the gift as if it were
            # created by EME and sent to the player
            if asset_fulfillment.source_type == "ProgressiveGoalReward"
              gifts_config = YAML.load_file("config/gifts.yml")
              rewards_config = gifts_config["rewards"]
              config_namespace = rewards_config["config_namespace"]
              sender_name = rewards_config["config"][config_namespace]["sender_name"]
              recipient_name = user.temp_screen_name? ? user.email : user.screen_name
              message = rewards_config["config"][config_namespace]["messages"]
              gift = Gift.create!(:source_type => asset_fulfillment.class.name,
                                    :source_id => asset_fulfillment.id,
                                    :user_id => nil,
                                    :recipient_id => user.id,
                                    :given_at => Time.now.utc,
                                    :sender_name => sender_name,
                                    :recipient_name => recipient_name,
                                    :message => message,
                                    :gift_box_id => gift_box.id,
                                    :promotion_id => promotion_id,
                                    :active => true)
              gift.add_to_log("#{gift.sender_name} is sending this gift with the message: \n#{gift.message}")
              UserMailer.queue(:eme_gift_notification, gift)
            else
              gift = Gift.create!(:source_type => asset_fulfillment.class.name,
                                  :source_id => asset_fulfillment.id,
                                  :user_id => user.id,
                                  :gift_box_id => gift_box.id,
                                  :promotion_id => promotion_id,
                                  :active => true)
            end

            log << trace_msg("Created gift with id #{gift.id}")
          else
            error_msg = "Unable to find gift box with id #{gift_box_id}"
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
