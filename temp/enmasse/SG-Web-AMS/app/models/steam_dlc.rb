# == Schema Information
#
# Table name: steam_dlcs
#
#  id         :integer          not null, primary key
#  dlc_id     :integer
#  game_id    :integer
#  promo_code :string(32)
#  name       :string(255)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class SteamDlc < ActiveRecord::Base
  attr_accessible :dlc_id, :game_id, :promo_code, :name

end
