# == Schema Information
#
# Table name: free_promotion_logs
#
#  id                :integer          not null, primary key
#  user_id           :integer          not null
#  game_account_id   :integer          not null
#  free_promotion_id :integer          not null
#  trace_json        :text             not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#

class FreePromotionLog < LogAR
  belongs_to :user
  belongs_to :game_account
  belongs_to :free_promotion

  attr_accessible :user_id, :game_account_id, :free_promotion_id, :trace_json

  def log log_array
    self.trace_json = log_array.to_json
  end
end
