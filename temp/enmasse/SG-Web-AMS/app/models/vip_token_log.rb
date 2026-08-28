# == Schema Information
#
# Table name: vip_token_logs
#
#  id              :integer          not null, primary key
#  game_account_id :integer          not null
#  event_type      :string(20)       not null
#  message         :string(1024)
#  additional_info :text
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class VipTokenLog < LogAR
  attr_accessible :game_account_id, :event_type, :message, :additional_info

  belongs_to :game_account
end
