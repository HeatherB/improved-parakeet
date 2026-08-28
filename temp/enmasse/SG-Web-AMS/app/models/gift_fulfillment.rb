# == Schema Information
#
# Table name: gift_fulfillments
#
#  id                 :integer          not null, primary key
#  user_id            :integer
#  gift_id            :integer
#  game_account_id    :integer
#  meta_json          :string(2048)
#  status             :integer          default(0)
#  attempts           :integer          default(0)
#  last_attempt_at    :datetime
#  last_error_message :text
#  lock_version       :integer          default(0)
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#

class GiftFulfillment < ActiveRecord::Base
  include Extensions::GiftFulfillmentEx

  attr_accessible :user_id, :gift_id, :meta_json, :status, :attempts, :last_attempt_at, :last_error_message, :lock_version, :game_account_id
end
