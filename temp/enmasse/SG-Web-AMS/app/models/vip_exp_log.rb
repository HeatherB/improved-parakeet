# == Schema Information
#
# Table name: vip_exp_logs
#
#  id              :integer          not null, primary key
#  vip_exp_id      :integer          not null
#  event_type      :string(20)       not null
#  message         :string(1024)
#  additional_info :text
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class VipExpLog < LogAR
  attr_accessible :event_type, :message, :additional_info

  belongs_to :vip_exp
end
