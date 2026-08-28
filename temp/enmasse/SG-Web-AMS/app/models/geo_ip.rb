# == Schema Information
#
# Table name: geo_ips
#
#  id           :integer          not null, primary key
#  begin_ip     :string(255)      not null
#  end_ip       :string(255)      not null
#  begin_ip_num :integer          default(0), not null
#  end_ip_num   :integer          default(0), not null
#  country_code :string(255)      not null
#  country_name :string(255)      not null
#  created_at   :datetime
#  updated_at   :datetime
#

class GeoIp < ActiveRecord::Base
  include Extensions::GeoIpEx

  attr_accessible :begin_ip, :end_ip, :begin_ip_num, :end_ip_num, :country_code, :country_name
end