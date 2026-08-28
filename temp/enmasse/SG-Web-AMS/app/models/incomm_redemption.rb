# == Schema Information
#
# Table name: incomm_redemptions
#
#  id              :integer          not null, primary key
#  user_id         :integer
#  game_account_id :integer
#  pin             :string(255)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  promo_code_id   :integer
#  status          :string(255)      default("failed")
#

class IncommRedemption < ActiveRecord::Base
  belongs_to :game_account
  belongs_to :user
  belongs_to :promo_code
  has_one :incomm_redemption_log

  attr_accessible :user_id, :game_account_id, :pin, :promo_code_id, :status

  def self.use_pin
  end

  class IncommRedemptionException < StandardError
    def message
      "generic incomm redemption failure message"
    end
  end

  class RateLimited < IncommRedemptionException
    def message; "incomm redemption rate limited"; end
  end

  class InvalidCard < IncommRedemptionException
    def message
      "card is invalid according to incomm"
    end
  end

  class CardRedemptionFailure < IncommRedemptionException
    def message
      "card failed during attempt to redeem"
    end
  end

  class UnknownGameAccount < IncommRedemptionException
    def message
      "game account not found"
    end
  end
end
