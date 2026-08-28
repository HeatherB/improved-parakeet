# == Schema Information
#
# Table name: game_account_types
#
#  id               :integer          not null, primary key
#  game_id          :integer
#  name             :string(255)
#  name_il8n_key    :string(255)
#  description      :string(255)
#  desc_il8n_key    :string(255)
#  permission_mask  :integer
#  accounts_created :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

class GameAccountType < ActiveRecord::Base
  has_many :game_accounts
  has_one :free_play_setting

  belongs_to :game

  attr_accessible :game_id, :name, :name_il8n_key, :description, :desc_il8n_key, :permission_mask, :accounts_created
end
