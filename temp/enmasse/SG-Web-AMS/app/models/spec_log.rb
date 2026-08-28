# == Schema Information
#
# Table name: spec_logs
#
#  id              :integer          not null, primary key
#  user_id         :integer          not null
#  game_account_id :integer          not null
#  game_id         :integer          not null
#  path            :string(255)
#  os              :integer
#  cpu             :string(255)
#  ram             :integer
#  hdd             :integer
#  dx              :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class SpecLog < LogAR
  belongs_to :user
  belongs_to :game_account
  belongs_to :game

  attr_accessible :user_id, :game_account_id, :game_id, :path, :os, :cpu, :ram, :hdd, :dx
end
