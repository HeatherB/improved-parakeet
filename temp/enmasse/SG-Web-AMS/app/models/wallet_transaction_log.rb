# == Schema Information
#
# Table name: wallet_transaction_logs
#
#  id                              :integer          not null, primary key
#  user_id                         :integer
#  game_code                       :string(255)
#  transaction_id                  :string(255)
#  transaction_type                :string(32)
#  transaction_date                :datetime
#  transaction_amount              :float(53)
#  after_transaction_wallet_amount :float(53)
#  currency_identifier             :string(255)
#  request_json                    :text
#  response_json                   :text
#  created_at                      :datetime
#  additional_info                 :text
#

class WalletTransactionLog < LogAR

end
