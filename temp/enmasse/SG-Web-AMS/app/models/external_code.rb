# == Schema Information
#
# Table name: external_codes
#
#  id          :integer          not null, primary key
#  code        :string(255)      not null
#  referral_id :integer
#  used_at     :datetime
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class ExternalCode < ActiveRecord::Base
  attr_accessible :code, :referral_id, :used_at
  
  def self.first_unused
    ExternalCode.find_by_referral_id(nil)
  end

  def use_code! referral
    update_attribute(:used_at, Time.now)
    update_attribute(:referral_id, referral.id)
    self
  end
end
