# == Schema Information
#
# Table name: maintenance_info
#
#  id              :integer          not null, primary key
#  title           :string(255)
#  body            :text
#  mode            :boolean
#  start_at        :datetime
#  end_at          :datetime
#  whitelisted_ips :text
#  type            :string(255)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class MaintenanceInfo < ActiveRecord::Base
  include Extensions::MaintenanceInfoEx

  attr_accessible :title, :body, :mode, :start_at, :end_at, :whitelisted_ips, :type
end
