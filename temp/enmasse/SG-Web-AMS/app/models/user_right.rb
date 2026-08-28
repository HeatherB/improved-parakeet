# == Schema Information
#
# Table name: user_rights
#
#  id         :integer          not null, primary key
#  name       :string(255)
#  value      :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class UserRight < ActiveRecord::Base
  attr_accessible :name, :value
end
