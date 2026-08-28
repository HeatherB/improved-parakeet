# == Schema Information
#
# Table name: group_promo_codes
#
#  id            :integer          not null, primary key
#  promotion_id  :integer
#  promo_code    :string(255)      default("")
#  use_limit     :integer          not null
#  use_count     :integer          default(0)
#  description   :string(255)
#  active        :boolean          default(TRUE)
#  created_at    :datetime
#  updated_at    :datetime
#  batch_id      :integer
#  internal_only :boolean          default(FALSE)
#

require 'digest/sha1'

class GroupPromoCode < ActiveRecord::Base
  belongs_to :promotion
  belongs_to :promo_code_batch, :foreign_key => "batch_id"
  validates_uniqueness_of :promo_code
  scope :active, (lambda do 
    {:include => [:promotion, :promo_code_batch],
              :conditions => ["group_promo_codes.active = ? and promo_code_batches.active = ? and promotions.enabled = ? and
                              (promotions.starts_at is null OR promotions.starts_at <= ?) and 
                              (promotions.ends_at is null OR promotions.ends_at >= ?)", true, true, true, Time.now.utc, Time.now.utc]}
  end)

  attr_accessible :promotion_id, :promo_code, :use_limit, :use_count, :description, :active, :batch_id, :internal_only

  def self.use_code(user, promo_code, options = {}, internal = false, check_limit = true, pass_present_check = false)
    group_code = pass_present_check ? promo_code : get_available(promo_code)
    raise PromoCode::CodeNotFound unless group_code.present?
    raise PromoCode::InternalCodeError if group_code.internal_only && !internal
    raise PromoCode::RedemptionLimitOverflowError if not PromoCode.can_be_redeemed_by?(user, Promotion.nolock.find(group_code.promotion_id), options)

    code = PromoCode.insert_unique_code(group_code.promotion_id, true, group_code.batch_id, { :code_length => 32, :return_obj => true })
    return nil unless code.present?

    group_code.increment_use_count!

    code.assign_to_user!(user, options, check_limit) if code.present?
    code
  end
    
  # Check if a particular code is available (active and not used)...
  def self.get_available(promo_code)
    self.nolock.active.find_by_promo_code(promo_code, :conditions => ["group_promo_codes.use_limit > use_count"])
  end
  
  def increment_use_count!
    self.use_count += 1
    self.save!
  end

end
