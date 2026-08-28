# == Schema Information
#
# Table name: warehouse_skus
#
#  id                :integer          not null, primary key
#  title             :string(255)
#  description       :string(255)
#  active            :boolean          default(TRUE)
#  asset_count       :integer          default(0)
#  fulfillment_count :integer          default(0)
#  deleted           :boolean          default(FALSE)
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#

class WarehouseSku < ActiveRecord::Base
  require 'set'

  has_one :warehouse_sku_icon, :dependent => :destroy

  # this ordering ensures we process game accounts and account upgrades before anything else
  has_many :warehouse_sku_assets,
    :conditions => { :deleted => false },
    :order => "CASE type WHEN 'WhAssetGameAccountUpgradeOrNew' THEN '0' WHEN 'WhAssetGameAccount' THEN '1' WHEN 'WhAssetGameAccountUpgrade' THEN '2' ELSE type END"

  has_many :promotion_skus, :dependent => :destroy

  scope :not_deleted, :conditions => { :deleted => false }

  attr_accessible :title, :description, :active, :asset_count, :fulfillment_count, :deleted

  def account_type_given(assets)
    types = assets.collect { |a| a.account_type_given.to_i }.uniq
    types.delete(0)

    raise "SKU cannot contain more than one Game Account asset." if types.size > 1
    types.first
  end

  def game_ids(assets)
    return [] if assets.to_a.empty?

    game_ids = assets.collect { |a| a.game_id }.flatten.uniq
    if game_ids.include?(nil)
      # nil means that there is an item which can be applied all game accounts.
      # so to disable filtering with game_ids, return empty array
      []
    else
      game_ids
    end
  end

  def account_types_upgraded(assets)
    return [] if assets.to_a.empty?

    types = assets.collect { |a| a.account_types_upgraded }.flatten.uniq
    types.delete(0)
    types
  end

  def account_types_required(assets)
    return [] if assets.to_a.empty?

    non_acct_assets = assets.select { |asset| !asset.is_game_account_asset? && !asset.is_master_account_asset? }
    return [] if non_acct_assets.empty?

    # fetch the intersection of account types across all non-acct assets
    set = Set.new(non_acct_assets.first.account_types_allowed)
    non_acct_assets[1..-1].each { |a| set &= a.account_types_allowed }

    # if at this point, the set is empty, it means the assets conflict with each other
    # (e.g. requires 1,2 AND requires 3,4 - there's no intersection)
    # we throw in an invalid type (-1) so we can distinguish it as such
    # set.empty? ? [-1] : set.to_a
    set.to_a
  end

  def applicable_game_ids()
    assets = self.warehouse_sku_assets.all
    return game_ids(assets)
  end

  # determines which game accounts this sku can be applied to
  # if this SKU has been partially fulfilled (e.g. game account given)
  # pass 'sku_acct_id' to ensure it's the only applicable acct returned
  def applicable_game_accounts(user, sku_acct_id=nil, options=nil)
    assets = self.warehouse_sku_assets.all
    asset_game_ids = game_ids(assets)

    # skip deleted and banned/suspended accounts
    accts_lookup = user.game_accounts.where(:deleted => false, :account_status => GameAccount.upgradeable_account_types)
    accts_lookup = accts_lookup.where(:game_id => asset_game_ids) if asset_game_ids.present?
    accts = accts_lookup.all

    if sku_acct_id.to_i > 0
      return accts.select { |a| a.id == sku_acct_id }
    else
      gives = account_type_given(assets)
      required = account_types_required(assets)
      upgrades_from = account_types_upgraded(assets)

      candidates = []
      accts.each do |acct|
        gtype = acct.game_account_type_id

        # commenting this out because we want the assets to stack
        # this is ok since we can prevent stacking simply by not including
        # "gives" as an allowed account type when setting up the asset
        # next if gives == gtype

        # if this asset is part of an upgrade, then ensure only accounts applicable
        # for the upgrade are chosen
        if upgrades_from.include?(gtype)
          candidates << acct if required.empty? || required.include?(gives)
        else
          candidates << acct if required.include?(gtype) if upgrades_from.empty?
        end
      end

      # IF NO candidates we can try to create the game account here, if there is a game_id
      if candidates.length == 0 && asset_game_ids.length > 0
        asset_game_ids.uniq!
        asset_game_ids.each do |game_id|
          game = Game.find(game_id)
          if game
            promo = GameAccount.get_active_auto_account_creation_promotion(game)
            raise NoPromotionError, "No campaigns to create account." if promo.nil?

            account_type_id = promo.get_target_account_type
            if (account_type_id != 0 && upgrades_from.include?(account_type_id))

              promo_ids_in_progress = [promo.id]

              # creation_path
              creation_path = options[:creation_path] if options.present?

              # Don't delay the normally delayed job, for we need the account right away.
              job = GameAccount::AutoAccountCreationJob.new user.id, promo_ids_in_progress, game.id, creation_path
              rtn = job.perform
              if rtn == false
                candidates = []       # account is already exist and we already know that can't be candidate
              else
                candidates << user.game_accounts.where(:game_id => game.id, :deleted => false, :account_status => GameAccount.upgradeable_account_types).first
              end
            end
          else
            raise RuntimeError, "Must specify game to auto-create account."
          end
        end
      end

      candidates
    end

  end

end
