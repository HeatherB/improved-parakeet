# == Schema Information
#
# Table name: launcher_errors
#
#  id              :integer          not null, primary key
#  user_id         :integer
#  game_account_id :integer
#  error_code      :string(255)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class LauncherError < LogAR
  belongs_to :user
  belongs_to :game_account

  attr_accessible :user_id, :game_account_id, :error_code
end
