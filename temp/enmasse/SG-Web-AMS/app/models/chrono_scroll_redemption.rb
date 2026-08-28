# == Schema Information
#
# Table name: chrono_scroll_redemptions
#
#  id              :integer          not null, primary key
#  game_id         :integer
#  user_id         :integer
#  game_account_id :integer
#  used_by         :integer
#  planet_id       :integer
#  box_item_id     :integer
#  used_at         :datetime
#  lock_version    :integer          default(0)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class ChronoScrollRedemption < ActiveRecord::Base
  attr_accessible :game_id, :user_id, :game_account_id, :used_by, :planet_id, :box_item_id, :used_at, :lock_version
end
