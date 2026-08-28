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

class WarehouseSkuAsset < ActiveRecord::Base
  include Extensions::AssetFulfillmentLogEx

  belongs_to :warehouse_sku
  belongs_to :game

  scope :active, :conditions => { :deleted => false }

  ASSET_TYPES = [
    ["Game Account", "WhAssetGameAccount"],                            # create new game account
    ["Game Account Upgrade", "WhAssetGameAccountUpgrade"],             # upgrade existing game account
    ["Game Account Upgrade or New", "WhAssetGameAccountUpgradeOrNew"], # if no upgradeable accounts are found, create new
    ["Game Time (days)", "WhAssetGameTime"],
    ["Game (BOX) Item", "WhAssetGameItem"],
    ["Chrono Scroll (BOX) Item", "WhAssetChronoScroll"],
    ["Game Account Bits", "WhAssetGameAccountBit"],
    ["Email", "WhAssetEmail"],
    ["FFG Subscription Link", "WhAssetFfgSubscriptionLink"],
    ["FFG EMP", "WhAssetFfgEmp"],
    ["Charge", "WhAssetCharge"],
    ["Web Lootbox", "WhAssetWebLootBox"],
    ["Vip Exp", "WhAssetVipExp"],
    ["Vip Token", "WhAssetVipToken"],
    ["AVA Red Ticket", "WhAssetAVARedTicket"],
    ["AVA Euro", "WhAssetAVAEuro"],
    ["Beta Access", "WhAssetBetaAccess"]
  ]

  attr_accessible :warehouse_sku_id, :game_id, :type, :title, :meta_json, :deleted

  class GacctTypeAlreadyExists < StandardError; end
  class GameAccountAlreadyExists < StandardError; end
  class FulfillErrorWithRetry < StandardError
    def initialize (msg = "", _run_at = nil)
      @run_at = _run_at
      super(msg)
    end

    def get_run_at
      return @run_at
    end
  end
  class UserInputRequired < StandardError; end
  class AlreadyQueued < StandardError
    def message
      "This asset has already been queued for fulfillment"
    end
  end

  def asset_type_desc
    at = ASSET_TYPES.select { |t| t[1] == self["type"] }.first
    at.nil? ? "Unknown" : at[0]
  end

  def meta_variable_value(key)
    return nil unless self.meta_json.present?

    json = JSON.parse(self.meta_json)
    json[key.to_s]
  end

  def self.is_valid_type?(type_str)
    ASSET_TYPES.collect { |t| t[1] }.include?(type_str)
  end

  # this method is used when an asset is in state "input_required"
  # it determines the form fields to display for the respective
  # asset type. Implement for each applicable asset type
  def user_input_fields
  end

  def is_game_account_asset?
    self.is_a?(WhAssetGameAccount) || self.is_game_account_upgrade?
  end

  def is_game_account_upgrade?
    [WhAssetGameAccountUpgrade, WhAssetGameAccountUpgradeOrNew].include?(self.class)
  end

  def has_linked_game_account?
    self.is_game_account_asset? || self.is_a?(WhAssetFfgSubscriptionLink) || self.is_a?(WhAssetDrSubscriptionLink)
  end

  def is_master_account_asset?
    self.is_a?(WhAssetEmail)
  end

  # for assets which create or upgrade a game account, returns the account type given
  def account_type_given
    if is_game_account_asset?
      meta_variable_value("game_account_type_id").to_i
    else
      nil
    end
  end

  def account_types_allowed
    types = meta_variable_value("allowed_acct_types") || []
    types.collect(&:to_i)
  end

  def account_types_upgraded
    return [] unless self.is_game_account_upgrade?
    types = meta_variable_value("allowed_acct_types") || []
    types.collect(&:to_i)
  end

  protected

  ASSET_ERRORS = {
    :none_eligible       => "User does not have any accounts eligible for this SKU",
    :selection_required  => "Requires selection of game account",
    :selected_ineligible => "Selected game account (ID: %s) is not eligible for this SKU",
    :selected_invalid    => "Selected game account does not exist or does not belong to this user"
  }

  def get_asset_account(user, acct_id, log, options={})
    acct = nil

    # get list of current accounts applicable for upgrade
    log << trace_msg("Loading applicable accounts...")
    log << trace_msg("options = '#{options.to_json}'")
    applicable = self.warehouse_sku.applicable_game_accounts(user, acct_id, options)
    log << trace_msg("Applicable accounts found: #{applicable.size}")

    # if only one applicable account, use it
    if applicable.size == 1
      log << trace_msg("Only one applicable account found... auto-assigning")
      acct = applicable.first
    end

    if acct.nil?
      pref_acct = options[:pref_acct].to_i
      raise UserInputRequired.new(ASSET_ERRORS[:selection_required]) if acct_id == 0 && pref_acct == 0

      if acct_id > 0
        log << trace_msg("Account Selection: ID = #{acct_id}") if acct_id > 0

        unless applicable.collect(&:id).include?(acct_id)
          raise UserInputRequired.new(ASSET_ERRORS[:selected_ineligible] % acct_id)
        end

        acct = applicable.select { |g| g.id == acct_id }.first
      elsif pref_acct > 0
        log << trace_msg("Preferred account found: #{pref_acct}")
        acct = applicable.select { |g| g.id == pref_acct.to_i }.first

        if acct.nil?
          raise UserInputRequired.new(ASSET_ERRORS[:selected_ineligible] % pref_acct)
        else
          log << trace_msg("Preferred account is acceptable... applying.")
        end
      end

      raise UserInputRequired.new(ASSET_ERRORS[:selected_invalid]) if acct.nil?
    end

    if applicable.empty?
      if !!options[:nil_if_none_eligible]
        # Allows us to continue w/ fulfillment (e.g. GameAccountUpgradeOrNew)
        return nil
      else
        raise UserInputRequired.new(ASSET_ERRORS[:none_eligible])
      end
    end

    log << trace_msg("Selected account: #{acct.inspect}")

    acct
  end

  def create_ams_account(user, meta_hash, log)
    ga = user.game_accounts.new(
      :game_id => meta_hash["game_id"],
      :game_account_type_id => meta_hash["game_account_type_id"],
      :access_level => meta_hash["access_level"].to_i,
      :account_status => GameAccount.account_status_for(:ok),
      :creation_path => meta_hash["creation_path"]
    )

    if ga.save
      # Access Level 7 means it's a refer a friend account

      if meta_hash["access_level"].to_i == 7
        puts "REWARDING"
        referral = Referral.find(user.referral_id)
        referral.update_attribute(:target_game_account_id, ga.id)
        # We are not rewarding for the simple account creation anymore
        #
        # Referral.send_later(:apply_reward, referral.id, 'referral_account_created')
        Referral.send_later(:update_set_last_connected, referral.id)
      end

      return ga
    else
      return nil
    end

  rescue Exception => ex # db error
    # there is a potential race condition here that will attempt
    # to insert a duplicate game account name (based on on the autonaming works)
    # log it and return nil. This will send the job to be retried.
    log << trace_msg("Error: #{ex.message}")
    return nil
  end

  def create_game_account(acct, log)
    return true if self.game.settings(:service_url).nil?
    adapter, adapter_log = GameAdapter.new(acct.game.settings(:service_url)), []
    res = adapter.make_request(
      :create_account,
      { :user_id => acct.user_id },
      { :game_account_id => acct.id },
      adapter_log
    )
    adapter_log.each { |str| log << trace_msg(str) }
    res
  end

  def check_existance_and_throw_expetion(user_id, gacct_type_id)
    temp_gacct = GameAccount.active.first(:conditions => { :user_id => user_id, :game_account_type_id => gacct_type_id })
    raise GacctTypeAlreadyExists if temp_gacct.present?
  end
end
