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

class WhAssetGameAccountUpgradeOrNew < WarehouseSkuAsset

  def fulfill!(asset_fulfillment)
    user = asset_fulfillment.user
    user_selections = JSON.parse(asset_fulfillment.meta_json) if asset_fulfillment.meta_json.present?
    user_selections ||= {}
    upgrade_id, upgrade_acct = user_selections["game_account_id"].to_i, nil
    meta_hash = JSON.parse(self.meta_json)
    error_msg = nil

    write_log(asset_fulfillment) do |log|

      self.class.transaction(:requires_new => true) do
        begin
          log << trace_msg("Game Account Upgrading or creating...")

          singleton = meta_hash['allow_only_one']
          check_existance_and_throw_expetion(user.id, meta_hash["game_account_type_id"]) if singleton.present? && singleton == 'true'

          upgrade_acct = get_asset_account(
            user,
            upgrade_id,
            log,
            { :nil_if_none_eligible => true, :pref_acct => user_selections["pref_acct"], :creation_path => user_selections["creation_path"] }
          )

          if upgrade_acct.nil?

            log << trace_msg("No applicable game accounts found, creating new...")
            log << trace_msg("Creating AMS game account...")

            can_create_new = game.can_create_new_game_account(asset_fulfillment.user)
            raise GameAccountAlreadyExists.new('Game account already exists.') unless can_create_new 

            upgrade_acct = create_ams_account(user, meta_hash, log)
            raise FulfillErrorWithRetry.new("Failed to create AMS account") unless upgrade_acct

            log << trace_msg("Account Created: ID = #{upgrade_acct.id}, Name = #{upgrade_acct.account_name}, Access Level = #{upgrade_acct.access_level_description}")

            # this has to be the last statement processed as it makes an external request which
            # is not covered by a transaction rollback. If it's a success, we're done... otherwise
            # we have to rollback the account creation in the AMS db.
            log << trace_msg("Creating #{game.name} account")
            res = create_game_account(upgrade_acct, log)
            raise FulfillErrorWithRetry.new("Failed to create #{game.name} account") unless res

          else

            log << trace_msg("Upgrading AMS game account: ID - #{upgrade_acct.id}, Name - #{upgrade_acct.account_name}")
            prev_account_type = upgrade_acct.game_account_type.name

            # Keep a copy of the previous account so we can reward if the previous account was a
            # refer a friend account
            prev_account = upgrade_acct.dup

            upgrade_acct.game_account_type_id = meta_hash["game_account_type_id"]
            upgrade_acct.access_level = meta_hash["access_level"].to_i
            upgrade_acct.save!
            upgrade_acct.reload

            curr_account_type = upgrade_acct.game_account_type.name

            trace_str = "Account Upgraded: ID = #{upgrade_acct.id}, Name = #{upgrade_acct.account_name}, From Type = #{prev_account_type}, To Type = #{curr_account_type}, Access Level = #{upgrade_acct.access_level_description}"
            log << trace_msg(trace_str)

            log << trace_msg("Previous account type is #{prev_account_type}")
            log << trace_msg("Previous account is #{prev_account.inspect}")

            if prev_account_type.downcase! == 'refer a friend'
              log << trace_msg("Account upgraded was a refer a friend account")
              referral = Referral.find_by_target_game_account_id(prev_account.id)

              log << trace_msg("referral found was #{referral.inspect}")

              if referral
                log << trace_msg("Found referral ID: #{referral.id} matching this game account")
                log << trace_msg("Rewarding the referring user ID: #{referral.user_id} in the background")

                referral_log_obj = Referral.send_later(:apply_reward, referral.id, 'referral_game_purchase')

                log << trace_msg("Game purchase for refer a friend happened, settling referral")
                referral.settled!
              end
            end

          end

          asset_fulfillment.game_account_id = upgrade_acct.id

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

  def fields_for_user_input
    [:game_account_id]
  end
end
