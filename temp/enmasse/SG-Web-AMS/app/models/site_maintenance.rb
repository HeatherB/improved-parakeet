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

class SiteMaintenance < MaintenanceInfo
end
