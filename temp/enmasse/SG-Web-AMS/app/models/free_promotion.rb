# == Schema Information
#
# Table name: free_promotions
#
#  id                   :integer          not null, primary key
#  name                 :string(255)      not null
#  game_id              :integer          not null
#  game_account_type_id :integer          not null
#  promotion_id         :integer          not null
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  elite_only           :boolean          default(FALSE)
#

class FreePromotion < ActiveRecord::Base
  belongs_to :game
  belongs_to :game_account_type
  belongs_to :promotion

  validates_presence_of   :game_id, :game_account_type_id, :promotion_id
  validates_uniqueness_of :name

  attr_accessible :name, :game_id, :game_account_type_id, :promotion_id, :elite_only

  def self.auto_fulfillment user, gacct
    label_value = []
    if gacct.active_subscription?
      # load all the promotions
      promotion_ids = FreePromotion.where(:game_account_type_id => gacct.game_account_type_id).pluck(:promotion_id)
    else
      # exclude elite_only promotions
      promotion_ids = FreePromotion.where(:game_account_type_id => gacct.game_account_type_id).where("elite_only is NULL or elite_only = 0").pluck(:promotion_id)
    end

    return label_value if promotion_ids.empty?

    promos = Promotion.active.all(:conditions => { :id => promotion_ids })
    curr_time = Time.now.utc
    promos_in_progress = promos.select { |promo| promo.starts_at <= curr_time && (promo.ends_at.nil? || curr_time < promo.ends_at) }
    return label_value if promos_in_progress.empty?

    promos_in_progress.each do |promo|
      pid = promo.id
      gaid = gacct.id
      next unless self.check_promotion pid, gacct.game.id

      options = { :pref_acct => gaid }
      next if promo.rate_limit_exceeded?(user, options)

      label_value << { :action => promo.promotion_name, :label => user.screen_name, :value => gaid }
    end

    job = FreePromotionAutoFulfillmentJob.new user.id, gacct.id, promos_in_progress.map { |promo| promo.id }
    Delayed::Job.enqueue job, 11

    label_value
  end

  class FreePromotionAutoFulfillmentJob
    def initialize(user_id, game_account_id, promo_ids_in_progress)
      @user_id = user_id
      @promo_ids_in_progress = promo_ids_in_progress
      @game_account_id = game_account_id
    end

    def perform
      user = User.find(@user_id)
      promos_in_progress = @promo_ids_in_progress.map { |promo_id| Promotion.find(promo_id) }
      gacct = GameAccount.find(@game_account_id)

      promos_in_progress.each do |promo|
        pid = promo.id
        gaid = gacct.id
        next unless FreePromotion.check_promotion pid, gacct.game.id

        options = { :pref_acct => gaid }
        next if promo.rate_limit_exceeded?(user, options)

        begin
          logs = []

          gpcs = promo.group_promo_codes.all(:conditions => { :active => true })
          raise ActiveRecord::RecordNotFound if gpcs.empty?

          gpc = gpcs.find { |group_promo_code| group_promo_code.use_limit > group_promo_code.use_count }

          code = GroupPromoCode.use_code(user, gpc, options, true, false, true)
          unless code.fulfillment_complete?
            logs << { :Message => 'Fulfillment job is queued in delayed job.',
                      :Code => code.promo_code }
          end
        rescue ActiveRecord::RecordNotFound => e
          logs << { :Message => "Group batches don't exist or there are not active group batches.",
                    :Exception => e.message }
        rescue PromoCode::CodeNotFound => e
          logs << { :Message => "Every codes in group batches are used.",
                    :Exception => e.message }
        rescue PromoCode::InternalCodeError => e
          logs << { :Message => "Group batch is not set to internal",
                    :Exception => e.message }
        rescue PromoCode::AssignmentError => e
          logs << { :Message => "Game account cannot redeem a code.",
                    :Exception => e.message }
        rescue => e
          logs << { :Message => "Unknown Exception.",
                    :Exception => e.message }
        ensure
          unless logs.empty?
            log_entry = FreePromotionLog.new(:user_id => user.id,
                                             :game_account_id => gaid,
                                             :free_promotion_id => pid)
            log_entry.log(logs)
            log_entry.save
          end
        end
      end
    end
  end

  def self.check_promotion pid, gid
    sku_ids = PromotionSku.all(:select => 'warehouse_sku_id',
                               :conditions => { :promotion_id => pid }).collect { |row| row.warehouse_sku_id }
    assets = WarehouseSkuAsset.all(:conditions => { :warehouse_sku_id => sku_ids })

    raise unless assets.all? { |asset| asset.game_id == gid }
    raise unless assets.all? { |asset| asset.type == 'WhAssetGameItem' || asset.type == 'WhAssetGameTime' || asset.type == 'WhAssetAVARedTicket' || asset.type == 'WhAssetAVAEuro' || asset.type == 'WhAssetFreeEmp'}

    true
  rescue
    false
  end

end
