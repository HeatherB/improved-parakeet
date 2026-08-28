# == Schema Information
#
# Table name: site_referrers
#
#  id            :integer          not null, primary key
#  user_id       :integer
#  source        :string(255)
#  campaign_name :string(255)
#  medium        :string(255)
#  search_terms  :string(255)
#  referral      :string(255)
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  click_id      :string(255)
#

class SiteReferrer < ActiveRecord::Base
  belongs_to :user

  attr_accessible :user_id, :source, :campaign_name, :medium, :search_terms, :referral, :click_id
end
