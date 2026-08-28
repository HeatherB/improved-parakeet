# == Schema Information
#
# Table name: api_access_logs
#
#  id             :integer          not null, primary key
#  api_key        :string(64)
#  remote_ip      :string(50)
#  method         :string(10)
#  path           :string(255)
#  query          :string(255)
#  body           :text
#  status         :integer
#  response       :text
#  execution_time :decimal(20, 10)
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

class ApiAccessLog < LogAR
  attr_accessible :api_key, :remote_ip, :method, :path, :query, :body, :status, :response, :execution_time, :exception
end
