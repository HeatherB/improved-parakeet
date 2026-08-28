# == Schema Information
#
# Table name: event_credit_logs
#
#  id              :integer          not null, primary key
#  event_credit_id :integer          not null
#  event_type      :string(20)       not null
#  message         :string(1024)     not null
#  additional_info :text
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class EventCreditLog < LogAR
  attr_accessible :event_type, :message, :additional_info, :event_credit_id

  belongs_to :event_credit
end
