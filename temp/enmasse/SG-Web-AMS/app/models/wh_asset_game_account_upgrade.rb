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

class WhAssetGameAccountUpgrade < WarehouseSkuAsset

  def fulfill!(asset_fulfillment)
    user = asset_fulfillment.user
    user_selections = JSON.parse(asset_fulfillment.meta_json) if asset_fulfillment.meta_json.present?
    user_selections ||= {}
    upgrade_id, upgrade_acct = user_selections["game_account_id"].to_i, nil
    meta_hash = JSON.parse(self.meta_json)

    write_log(asset_fulfillment) do |log|
      self.class.transaction(:requires_new => true) do
        begin
          log << trace_msg("Game Account Upgrading...")

          singleton = meta_hash['allow_only_one']
          check_existance_and_throw_expetion(user.id, meta_hash["game_account_type_id"]) if singleton.present? && singleton == 'true'

          upgrade_acct = get_asset_account(
            user,
            upgrade_id,
            log,
            { :pref_acct => user_selections["pref_acct"], :creation_path => user_selections["creation_path"] }
          )

          log << trace_msg("Upgrading AMS game account: ID - #{upgrade_acct.id}, Name - #{upgrade_acct.account_name}, Access Level = #{upgrade_acct.access_level_description}")
          prev_account_type = upgrade_acct.game_account_type.name

          upgrade_acct.game_account_type_id = meta_hash["game_account_type_id"]
          upgrade_acct.access_level = meta_hash["access_level"].to_i
          upgrade_acct.save!
          upgrade_acct.reload

          curr_account_type = upgrade_acct.game_account_type.name

          trace_str = "Account Upgraded: ID = #{upgrade_acct.id}, Name = #{upgrade_acct.account_name}, From Type = #{prev_account_type}, To Type = #{curr_account_type}, Access Level = #{upgrade_acct.access_level_description}"
          log << trace_msg(trace_str)

          asset_fulfillment.game_account_id = upgrade_acct.id
        rescue GacctTypeAlreadyExists => gtae
          log << trace_msg("A game account of target game account type already exists.")
        end
      end
    end
  end

  def fields_for_user_input
    [:game_account_id]
  end

end
