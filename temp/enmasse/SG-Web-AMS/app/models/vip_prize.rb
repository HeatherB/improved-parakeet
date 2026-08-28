# == Schema Information
#
# Table name: vip_prizes
#
#  id               :integer          not null, primary key
#  vip_exp          :integer
#  prize_group_code :string(255)
#  activated        :boolean          default(FALSE)
#  started_at       :datetime
#  ended_at         :datetime
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  name             :string(255)
#

class VipPrize < ActiveRecord::Base
  attr_accessible :name, :vip_exp, :prize_group_code, :activated, :started_at, :ended_at

  has_many :vip_prize_fulfillments
end
