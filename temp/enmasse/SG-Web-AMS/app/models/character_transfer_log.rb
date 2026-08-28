# == Schema Information
#
# Table name: character_transfer_logs
#
#  id                    :integer          not null, primary key
#  game_account_id       :integer
#  return_code           :string(255)
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  character_transfer_id :integer
#  trace_msg             :text
#  exception             :text
#

class CharacterTransferLog < LogAR
  belongs_to :character_transfer

  attr_accessible :game_account_id, :return_code, :character_transfer_id, :trace_msg, :exception
end
