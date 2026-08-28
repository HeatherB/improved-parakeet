# == Schema Information
#
# Table name: subscription_change_logs
#
#  id                      :integer          not null, primary key
#  user_id                 :integer
#  game_account_id         :integer
#  subscription_id         :integer
#  ext_subscription_id     :string(255)
#  prev_state              :string(80)
#  curr_state              :string(80)
#  changes_json            :text
#  transaction_source_type :string(255)
#  transaction_source_id   :integer
#  created_at              :datetime
#  updated_at              :datetime
#  trace_json              :text
#

class SubscriptionChangeLog < LogAR

  attr_accessible :user_id, :game_account_id, :subscription_id, :ext_subscription_id, :prev_state, :curr_state, :changes_json, :transaction_source_type, :transaction_source_id, :trace_json

  def self.log_changes!(sub, transition)
    create(
      :user_id                 => sub.user_id,
      :game_account_id         => sub.game_account_id,
      :subscription_id         => sub.id,
      :ext_subscription_id     => sub.ext_subscription_id,
      :prev_state              => transition.from,
      :curr_state              => transition.to,
      :changes_json            => sub.changes.to_json,
      :transaction_source_type => sub.transaction_source_type,
      :transaction_source_id   => sub.transaction_source_id
    )
  end

end
