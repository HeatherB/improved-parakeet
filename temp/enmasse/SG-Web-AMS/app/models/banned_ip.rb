# == Schema Information
#
# Table name: banned_ips
#
#  id           :integer          not null, primary key
#  ip           :string(255)
#  expires_at   :date
#  blocked_by   :integer
#  created_at   :datetime
#  updated_at   :datetime
#  notes        :text
#  is_permanent :boolean
#

class BannedIp < ActiveRecord::Base
  attr_accessible :ip, :expires_at, :blocked_by, :notes, :is_permanent
end