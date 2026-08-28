# == Schema Information
#
# Table name: iovation_logs
#
#  id                     :integer          not null, primary key
#  user_id                :integer
#  device_alias           :string(40)
#  tracking_number        :integer
#  result                 :string(1)
#  reason                 :string(255)
#  browser_charset        :string(50)
#  browser_configuredlang :string(50)
#  browser_type           :string(50)
#  browser_version        :string(20)
#  cookies_enabled        :boolean
#  firstseen              :datetime
#  flash_enabled          :boolean
#  flash_version          :string(20)
#  js_enabled             :boolean
#  new_device             :boolean
#  os                     :string(50)
#  screen                 :string(20)
#  device_type            :string(50)
#  tz                     :string(10)
#  ipaddress              :string(20)
#  realipaddress          :string(20)
#  realipaddress_source   :string(20)
#  rulesmatched           :integer
#  score                  :integer
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  ip_org                 :string(128)
#  ip_isp                 :string(255)
#  ip_proxy               :string(20)
#  ip_loc_lat             :decimal(10, 5)
#  ip_loc_lng             :decimal(10, 5)
#  ip_loc_city            :string(128)
#  ip_loc_countrycode     :string(5)
#  ip_loc_country         :string(128)
#  ip_loc_region          :string(128)
#  realip_org             :string(128)
#  realip_isp             :string(255)
#  realip_proxy           :string(20)
#  realip_loc_lat         :decimal(10, 5)
#  realip_loc_lng         :decimal(10, 5)
#  realip_loc_city        :string(128)
#  realip_loc_countrycode :string(5)
#  realip_loc_country     :string(128)
#  realip_loc_region      :string(128)
#

class IovationLog < LogAR

  attr_accessible :user_id, :device_alias, :tracking_number, :result, :reason, :browser_charset, :browser_configuredlang, :browser_type, :browser_version, :cookies_enabled, :firstseen, :flash_enabled, :flash_version, :js_enabled, :new_device, :os, :screen, :device_type, :tz, :ipaddress, :realipaddress, :realipaddress_source, :rulesmatched, :score, :ip_org, :ip_isp, :ip_proxy, :ip_loc_lat, :ip_loc_lng, :ip_loc_city, :ip_loc_countrycode, :ip_loc_country, :ip_loc_region, :realip_org, :realip_isp, :realip_proxy, :realip_loc_lat, :realip_loc_lng, :realip_loc_city, :realip_loc_countrycode, :realip_loc_country, :realip_loc_region

  def self.create_from_response(user_id, res_hash, details_hash)
    if res_hash[:io_reason].is_a? Array
      # Ensure length of 'reason' must be below the size of field
      length = res_hash[:io_reason].length
      reason = res_hash[:io_reason].to_json
      while length > 1 && reason.length > self.columns_hash["reason"].limit
        length -= 1
        reason = res_hash[:io_reason].slice(0, length).to_json
      end
    else
      reason = res_hash[:io_reason]
    end

    create!(
      {
        :user_id                => user_id, 
        :device_alias           => res_hash[:io_device_alias],
        :tracking_number        => res_hash[:io_tracking_number],
        :result                 => res_hash[:io_result],
        :reason                 => reason
      }.merge(details_hash)
    )
  end
  
end
