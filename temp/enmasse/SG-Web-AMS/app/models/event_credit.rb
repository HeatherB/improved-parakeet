# == Schema Information
#
# Table name: event_credits
#
#  id         :integer          not null, primary key
#  user_id    :integer          not null
#  credit     :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class EventCredit < ActiveRecord::Base
  attr_accessible :user_id, :credit

  has_many :event_credit_logs
  belongs_to :user
end
