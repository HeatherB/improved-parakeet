# == Schema Information
#
# Table name: promotions
#
#  id                    :integer          not null, primary key
#  promotion_name        :string(255)
#  promotion_description :string(255)
#  starts_at             :datetime
#  ends_at               :datetime
#  codes_created_count   :integer          default(0)
#  codes_used_count      :integer          default(0)
#  created_at            :datetime
#  updated_at            :datetime
#  enabled               :boolean          default(FALSE)
#  redemption_limit      :integer          default(1)
#  rate_limit_amount     :integer          default(0), not null
#  rate_limit_duration   :integer          default(0), not null
#  alter_rate_limit      :boolean          default(FALSE), not null
#  gacct_limit           :boolean          default(FALSE), not null
#  rate_limit_resets_at  :time
#  giftable              :boolean          default(FALSE), not null
#  giftable_unique       :boolean          default(FALSE), not null
#  gift_promotion_id     :integer
#

class Promotion < ActiveRecord::Base
  has_many :promo_codes
  has_many :group_promo_codes
  has_many :promotion_skus, :include => :warehouse_sku, :conditions => ["warehouse_skus.active = ? AND warehouse_skus.deleted = ?", true, false]
  has_many :progressive_goals
  has_many :progressive_goal_counters
  has_many :gifts

  belongs_to :gift_promotion, :class_name => "Promotion"

  scope :active, :conditions => { :enabled => true }
  scope :giftable, :conditions => { :giftable => true }

  attr_accessible :promotion_name, :promotion_description, :starts_at, :ends_at, :codes_created_count, :codes_used_count, :enabled, :redemption_limit, :rate_limit_amount, :rate_limit_duration, :alter_rate_limit, :gacct_limit

  def increment_used_count!
    self.codes_used_count += 1
    self.save!
  end

  # the options hash currently only looks to see if there is a preferred game account (pref_acct)
  # we want to try to apply this fulfillment to. Just because an account is preferred, doesn't
  # necessarily mean it's going to be used
  def process_fulfillment!(user, code, options={})
    errors = false
    self.promotion_skus.each do |sku|
      success = AssetFulfillment.fulfill_warehouse_sku_assets(
        user,
        sku.warehouse_sku,
        code,
        options[:pref_acct],
        options[:rate_limited],
        options[:redemption_limited],
        options[:creation_path],
        options[:quantity]
      )
      errors = true unless success
      sku.warehouse_sku.increment!(:fulfillment_count) unless errors
    end
    unless errors
      # if this promotion is giftable, successful fulfillment is a purchase
      if self.giftable?
        # use the gift promotion if it exists
        if self.gift_promotion.present?
          progressive_goal_counter = self.gift_promotion.progressive_goal_counters.find_or_initialize_by_user_id(user.id)
        else
          progressive_goal_counter = self.progressive_goal_counters.find_or_initialize_by_user_id(user.id)
        end
        progressive_goal_counter.increment!(:purchased)
      end
      code.update_attribute(:fulfillment_complete, true)
    end
  end

  def process_progressive_goal_reward!(user, progressive_goal_reward, options={})
    errors = false
    self.promotion_skus.each do |sku|
      success = AssetFulfillment.fulfill_warehouse_sku_assets(
        user,
        sku.warehouse_sku,
        progressive_goal_reward,
        options[:pref_acct],
        options[:rate_limited],
        options[:redemption_limited],
        options[:creation_path],
        options[:quantity]
      )
      errors = true unless success
      sku.warehouse_sku.increment!(:fulfillment_count) unless errors
    end
    unless errors
      progressive_goal_reward.update_attribute(:fulfillment_complete, true)
    end
  end

  def rate_limit_exceeded?(user, options = {})
    return false if self.redemption_limit != -1
    return false if self.rate_limit_amount.to_i <= 0 || self.rate_limit_duration.to_i <= 0

    curr_time = Time.now.utc.to_i
    recent_fulfillable_date = case self.alter_rate_limit?
                              when true
                                if (self.rate_limit_resets_at)
                                  # the resets_at is in UTC; apparently the date defaults to 1/1/2000 when not provided
                                  # use the starts at date with the resets at time
                                  starts_at_utc = self.starts_at.utc
                                  reset_datetime = DateTime.new(starts_at_utc.year, starts_at_utc.month, starts_at_utc.day, self.rate_limit_resets_at.hour, self.rate_limit_resets_at.min, self.rate_limit_resets_at.sec, 0)

                                  Time.at(curr_time - (curr_time - reset_datetime.to_i) % self.rate_limit_duration.to_i.days.to_i)
                                else # legacy behavior, in which an altered rate limit would reset by the promotion's starts_at
                                  Time.at(curr_time - (curr_time - self.starts_at.to_i) % self.rate_limit_duration.to_i.days.to_i)
                                end
                              else
                                self.rate_limit_duration.to_i.days.ago
                              end

    gid = options[:pref_acct]
    cnt = case gid.present? && self.gacct_limit
          when true
            if self.alter_rate_limit? # user is good if it's been 24 hours since the last redemption
              PromoCode.nolock.total_redeemed_by_game_account(gid, self).count(:all, :conditions => ["used_at >= ?", recent_fulfillable_date])
            else
              last_used_promo_code = PromoCode.nolock.where(:game_account_id => gid, :promotion_id => self.id).order("promo_codes.used_at DESC").first
              if last_used_promo_code # do the full check for redemptions in the configured period
                PromoCode.nolock.total_redeemed_by_game_account(gid, self).count(:all, :conditions => ["used_at >= ?", recent_fulfillable_date])
              else # reset count, treat as 0
                0
              end
            end
          else
            if self.alter_rate_limit? # user is good if it's been 24 hours since the last redemption
              # Because of the lack of index, the following query is very slow. To Fix this problem, we use different query.
              # To speed up the following query, we need an index on promo_codes(used_at, used_by, promotion_id)
              # PromoCode.nolock.total_redeemed_by_user(user, self).count(:all, :conditions => ["fulfillment_complete = 1 and used_at >= ?", recent_fulfillable_date])
              PromoCode.nolock.total_redeemed_by_user(user, self).all.count {|x| x.fulfillment_complete == true && x.used_at >= recent_fulfillable_date}
            else
              last_used_promo_code = PromoCode.nolock.where(:used_by => user.id, :promotion_id => self.id).order("promo_codes.used_at DESC").first
              if last_used_promo_code # do the full check for redemptions in the configured period
                # Because of the lack of index, the following query is very slow. To Fix this problem, we use different query.
                # To speed up the following query, we need an index on promo_codes(used_at, used_by, promotion_id)
                # PromoCode.nolock.total_redeemed_by_user(user, self).count(:all, :conditions => ["fulfillment_complete = 1 and used_at >= ?", recent_fulfillable_date])
                PromoCode.nolock.total_redeemed_by_user(user, self).all.count {|x| x.fulfillment_complete == true && x.used_at >= recent_fulfillable_date}
              else # reset count, treat as 0
                0
              end
            end
          end

    cnt >= self.rate_limit_amount
  end

  def rate_limit_lifted_for(user)
    rla = self.rate_limit_amount.to_i
    rld = self.rate_limit_duration.to_i

    return nil if self.redemption_limit != -1
    return nil if rla <= 0 || rld <= 0

    all_redemptions = PromoCode.nolock.total_redeemed_by_user(user, self).find(:all,
      :conditions => ["fulfillment_complete = 1 and used_at >= ?", rld.days.ago],
      :order => "used_at"
    )

    return nil if all_redemptions.size < rla

    dt = all_redemptions[all_redemptions.size - rla].used_at + (60 * 60 * 24 * rld)
    dt.in_time_zone("Pacific Time (US & Canada)").strftime("%m/%d/%Y at %I:%M %p %Z")
  end

  def get_target_account_type
    skus = promotion_skus.each do |sku|
      warehouse_sku = sku.warehouse_sku
      warehouse_sku.warehouse_sku_assets.each do |asset|
        if asset.type == "WhAssetGameAccount"
          meta = JSON.parse(asset.meta_json)
          return meta["game_account_type_id"].to_i
        end
      end
    end
    return 0
  end

end
