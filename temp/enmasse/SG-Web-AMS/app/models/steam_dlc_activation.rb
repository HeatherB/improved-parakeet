# == Schema Information
#
# Table name: steam_dlc_activations
#
#  id              :integer          not null, primary key
#  steam_user_id   :integer
#  user_id         :integer
#  steam_dlc_id    :integer
#  activated_at    :datetime
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  game_account_id :integer
#

class SteamDlcActivation < ActiveRecord::Base
  belongs_to :steam_dlc
  has_one :steam_dlc_activation_job

  attr_accessible :user_id, :game_account_id, :steam_user_id, :steam_dlc_id, :activated_at
end
