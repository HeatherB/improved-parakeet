# == Schema Information
#
# Table name: vip_prize_fulfillments
#
#  id              :integer          not null, primary key
#  game_account_id :integer          not null
#  vip_prize_id    :integer          not null
#  promo_code      :string(32)
#  last_error      :text
#  attempts        :integer          default(0)
#  fulfilled_at    :datetime
#  vip_exp_at      :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class VipPrizeFulfillment < ActiveRecord::Base
  attr_accessible :game_account_id, :vip_prize_id
  belongs_to :game_account
  has_one :vip_prize
end
