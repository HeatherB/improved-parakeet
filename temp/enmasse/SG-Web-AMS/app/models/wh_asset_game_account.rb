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

class WhAssetGameAccount < WarehouseSkuAsset

  def fulfill!(asset_fulfillment)
    meta_hash = JSON.parse(self.meta_json)
    error_msg = nil

    # get options from fulfillment
    meta_hash_from_fulfillment = {}
    meta_hash_from_fulfillment = JSON.parse(asset_fulfillment.meta_json) if asset_fulfillment.meta_json.present?

    write_log(asset_fulfillment) do |log|

      self.class.transaction(:requires_new => true) do
        begin
          log << trace_msg("Creating AMS game account...")

          singleton = meta_hash['allow_only_one']
          check_existance_and_throw_expetion(asset_fulfillment.user.id, meta_hash["game_account_type_id"]) if singleton.present? && singleton == 'true'

          can_create_new = game.can_create_new_game_account(asset_fulfillment.user)
          raise GameAccountAlreadyExists.new('Game account already exists.') unless can_create_new 

          # merge 'creation_path' options from asset_fulfillment
          if !meta_hash['creation_path'].present? && meta_hash_from_fulfillment['creation_path'].present?
            meta_hash['creation_path'] = meta_hash_from_fulfillment['creation_path']
          end

          acct = create_ams_account(asset_fulfillment.user, meta_hash, log)
          raise FulfillErrorWithRetry.new("Failed to create AMS account") unless acct

          log << trace_msg("Account Created: ID = #{acct.id}, Name = #{acct.account_name}, Access Level = #{acct.access_level_description}")

          af_meta = JSON.parse(asset_fulfillment.meta_json) if asset_fulfillment.meta_json.present?
          af_meta ||= {}

          # this has to be the last statement processed as it makes an external request which
          # is not covered by a transaction rollback. If it's a success, we're done... otherwise
          # we have to rollback the account creation in the AMS db.
          log << trace_msg("Creating #{game.name} account")
          res = create_game_account(acct, log)
          raise FulfillErrorWithRetry.new("Failed to create #{acct.game.name} account") unless res

          asset_fulfillment.game_account_id = acct.id

          #welcome email will be done at a different time now. -cr-
          # email name change to welcome_to_game
          #UserMailer.queue(:account_created_notice, asset_fulfillment.user)
        rescue FulfillErrorWithRetry => fewr

          # without this workaround, the ENTIRE transaction (including promocode redemption status and logs) gets rolled back
          log << trace_msg("Rolling back transaction and adding to retry queue")
          error_msg = fewr.message
          raise ActiveRecord::Rollback

        rescue ActiveRecord::StatementInvalid => e

          log << trace_msg("Rolling back transaction and adding to retry queue")
          error_msg = e.message
          raise ActiveRecord::Rollback

        rescue GacctTypeAlreadyExists => gtae
          log << trace_msg("A game account of target game account type already exists.")

        rescue GameAccountAlreadyExists => gaae
          log << trace_msg("A game account already exists.")
        end

      end

      raise FulfillErrorWithRetry.new(error_msg) if error_msg.present?

    end
  end

end
