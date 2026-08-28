# == Schema Information
#
# Table name: promo_codes
#
#  id                   :integer          not null, primary key
#  promotion_id         :integer
#  promo_code           :string(32)       default(""), not null
#  used_by              :integer
#  used_at              :datetime
#  assigned_to_user     :integer
#  assigned_to_email    :string(255)
#  active               :boolean          default(TRUE)
#  created_at           :datetime
#  updated_at           :datetime
#  batch_id             :integer
#  game_account_id      :integer
#  fulfillment_complete :boolean          default(FALSE)
#  fulfillable_type     :string(80)
#  fulfillable_id       :integer
#

class PromoCode < ActiveRecord::Base

  belongs_to :promotion
  belongs_to :promo_code_batch, :foreign_key => "batch_id"
  has_many :asset_fulfillments, :as => :source
  belongs_to :fulfillable, :polymorphic => true

  validates_uniqueness_of   :promo_code
  validates_length_of       :promo_code, :within => 16..32

  scope :active, (lambda do
    {:include => [:promotion, :promo_code_batch],
    :conditions => ["promo_codes.active = ? and promo_code_batches.active = ? and promotions.enabled = ? and used_by is null and
                    (promotions.starts_at is null OR promotions.starts_at <= ?) and
                    (promotions.ends_at is null OR promotions.ends_at >= ?)", true, true, true, Time.now.utc, Time.now.utc]}
  end)

  scope :total_redeemed_by_user, lambda { |user, promotion| {
              :conditions => ["used_by = ? and promotion_id = ?", user.id, promotion.id]} }

  scope :total_redeemed_by_game_account, lambda { |gid, promotion| {
              :conditions => ["game_account_id = ? and promotion_id = ?", gid, promotion.id]} }

  after_save :update_fulfillable

  attr_accessible :promotion_id, :promo_code, :used_by, :used_at, :assigned_to_user, :assigned_to_email, :active, :batch_id, :game_account_id, :fulfillment_complete, :fulfillable

  def self.insert_unique_code(promotion_id, active, batch_id, options={})
    new_code = self.new
    new_code.promotion_id = promotion_id
    new_code.active = active
    new_code.assigned_to_user = options[:assigned_to_user] if options[:assigned_to_user].present?
    new_code.assigned_to_email = options[:assigned_to_email] if options[:assigned_to_email].present?
    new_code.promo_code = self.generate_code(options[:code_length] || 16)
    new_code.batch_id = batch_id if batch_id

    return new_code.save ? (options[:return_obj] ? new_code : new_code.promo_code) : nil
  end

  def self.is_group_code? promo_code
    code = GroupPromoCode.find_by_promo_code(promo_code)
    !!code
  rescue ActiveRecord::RecordNotFound
    return false
  end

  def self.check_code_precondition(user, promo_code, options={}, internal=false)
    error_messages = []
    begin
      if is_group_code? promo_code
        group_code = GroupPromoCode.get_available(promo_code) rescue nil
        raise PromoCode::CodeNotFound unless group_code.present?
        raise PromoCode::InternalCodeError if group_code.internal_only && !internal
        promotion = group_code.promotion
      else
        promo_code = self.active.find_by_promo_code(promo_code.to_alphanum, :include => [:promotion]) rescue nil
        raise PromoCode::CodeNotFound unless promo_code.present?
        promotion = promo_code.promotion
      end
      raise PromoCode::RedemptionLimitOverflowError if not PromoCode.can_be_redeemed_by?(user, Promotion.nolock.find(promotion.id), options)
    rescue => e
      error_messages << e.message
    end

    if error_messages.empty?
      # find all warehouse_sku_assets and check their preconditions
      promotion.promotion_skus.each do |promotion_sku|
        promotion_sku.warehouse_sku.warehouse_sku_assets.each do |asset|
          if asset.respond_to? :check_precondition
            error_message = asset.check_precondition(user, options)
            error_messages << error_message if error_message && !error_messages.include?(error_message)
          end
        end
      end
    end
    error_messages
  end

  #def schedule_use_code_job(user_id, promo_code, opts, internal=false)
  #  user = User.find(user_id)
  #end

  def force_redeem!(user)
    promotion ||= self.promotion
    skus = promotion.promotion_skus.collect(&:warehouse_sku)
    fulfillments = user.asset_fulfillments.find(:all,
      :include => :warehouse_sku_asset,
      :conditions => { :source_type => "PromoCode", :source_id => self.id })
    unredeemed_assets = {}
    p_rate_limit_exceeded = promotion.rate_limit_exceeded?(user)

    fulfillments.select { |f| !f.complete? }.each do |ur|
      if p_rate_limit_exceeded
        if ur.status != AssetFulfillment.fulfillment_status_for(:rate_limited)
          ur.status = AssetFulfillment.fulfillment_status_for(:rate_limited)
          ur.attempts += 1
          ur.last_attempt_at = Time.now
          ur.save
          Rails.logger.info "Campaign rate limit exceeded"
        end
      else
        # we need to attempt to fulfill rate_limited assets when applicable
        if ur.status == AssetFulfillment.fulfillment_status_for(:rate_limited)
          AssetFulfillment.retry_fulfillment(ur.id, { :queue_on_fail_retry => true })
          ur.reload
          next if ur.status == AssetFulfillment.fulfillment_status_for(:complete)
        end
      end

      asset = ur.warehouse_sku_asset
      wh_sku_id = asset.warehouse_sku_id
      unredeemed_assets[wh_sku_id] ||= []
      unredeemed_assets[wh_sku_id] << ur
    end
    # temp workaround to potential race condition where fulfillment_complete
    # not getting properly updated
    self.update_attribute(:fulfillment_complete, true) if unredeemed_assets.empty?
    return promotion, skus
  end

  def self.use_code(user, promo_code, options={}, internal=false)
    return GroupPromoCode.use_code(user, promo_code, options, internal) if is_group_code? promo_code

    code = self.nolock.active.find_by_promo_code(promo_code.to_alphanum, :include => [:promotion])

    raise CodeNotFound unless code.present?
    code.assign_to_user!(user, options)

    code
  end

  def assign_to_user!(user, options={}, check_limit = true)
    promo = self.promotion

    options[:redemption_limited] = !self.class.can_be_redeemed_by?(user, promo, options)
    options[:rate_limited] = true if check_limit && promo.rate_limit_exceeded?(user, options)

    self.update_attributes!({
      :active => false,
      :fulfillment_complete => false,
      :used_by => user.id,
      :used_at => Time.now.utc,
      :game_account_id => options[:pref_acct]? options[:pref_acct] : nil,
      :fulfillable => options[:fulfillable]
    })

    self.promo_code_batch.increment_used_count!
    promo.increment_used_count!

    promo.process_fulfillment!(user, self, options)
  end

  def self.can_be_redeemed_by?(user, promo, options)
    return true if promo.redemption_limit == -1

    gid = options[:pref_acct]
    used_codes = case gid.present? && promo.gacct_limit
                 when true
                   self.nolock.total_redeemed_by_game_account(gid, promo)
                 else
                   self.nolock.total_redeemed_by_user(user, promo)
                 end

    promo.redemption_limit > used_codes.size
  end

  # Check if a particular code is available (active and not used)...
  def self.available?(promo_code)
    self.active.find_by_promo_code(promo_code.to_alphanum) ? true : false
  end

  def self.human_attribute_name(attribute_key_name, options={})
    case attribute_key_name
    when "promo_code" then "Game Code"
    else
      super
    end
  end

  # this is used by the logging mechanism
  def reference_key
    self.promo_code
  end

  # since we're using the serial code system to do asset fulfillment
  # on varying types of transactions (digital river, incomm, etc...)
  # we need to check if this code is part of one of those transactions
  # and update the additional records as needed
  def update_fulfillable
    if self.fulfillment_complete_changed? && self.fulfillment_complete? && (f = self.fulfillable).present?
      # check if we've fulfilled all codes for the particular order
      if f.promo_codes.count(:conditions => { :fulfillment_complete => false }) == 0
        f.fulfillment_complete = true
        f.save!
      end
    end
  end

  # this is delegated to delayed job. As such, if an exception is raised
  # it will remain in the queue (and be retried) unless we handle the exception
  # errors here shouldn't happen. causes would be if provider was given
  # an incorrect batch of codes or if user records are not in sync.
  # let's leave them in the queue so once the issue is resolved, we can
  # re-process the orders
  def self.redeem_fulfillable!(code, uid, f_type, f_id, internal=false, pref_acct=nil)
    u = User.find_by_id(uid)
    raise AssignmentError unless u.present?

    f = f_type.constantize.find_by_id(f_id)
    raise AssignmentError.new("invalid fulfillable instance") unless f.present?

    options = { :fulfillable => f }
    options[:pref_acct] = pref_acct.to_i if pref_acct.present?

    use_code(u, code, options, internal)
  end

  def self.redeem_fulfillable_ex!(code, uid, f_type, f_id, quantity=1, internal=false, pref_acct=nil)
    u = User.find_by_id(uid)
    raise AssignmentError unless u.present?

    f = f_type.constantize.find_by_id(f_id)
    raise AssignmentError.new("invalid fulfillable instance") unless f.present?

    options = { :fulfillable => f }
    options[:pref_acct] = pref_acct.to_i if pref_acct.present?
    options[:quantity] = quantity.to_i rescue 1

    use_code(u, code, options, internal)
  end

  # this is also delegated to delayed job. It is instantiated from the
  # admin console when a CSR adds a code on behalf of a user
  def self.redeem_on_behalf_of_user!(code, uid)
    user = User.find_by_id(uid)
    raise AssignmentError unless user.present?

    use_code(user, code)
  end

  class CodeException < StandardError; end

  class CodeNotFound < CodeException
    def message
      "invalid code"
    end
  end

  class AssignmentError < CodeException
    def message
      "not eligible to redeem this code"
    end
  end

  class InternalCodeError < CodeException
    def message
      "not eligible to redeem internal code"
    end
  end

  class RedemptionLimitOverflowError < CodeException
    def message
      "redemption limit overflow"
    end
  end

  class RedeemJob
    def initialize(user_id, code, opts)
      @user_id = user_id
      @code = code
      @opts = opts
    end

    def perform
      user = User.find(@user_id)
      PromoCode.use_code(user, @code, @opts)
    end
  end

  private
    def self.generate_code(code_length)
      String.generate_random_code(code_length)
    end
end
