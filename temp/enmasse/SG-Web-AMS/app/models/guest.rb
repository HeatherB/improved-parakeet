# == Schema Information
#
# Table name: guests
#
#  id         :integer          not null, primary key
#  ip_address :string(255)
#  created_at :datetime
#  updated_at :datetime
#

class Guest < ActiveRecord::Base
  
  validates_presence_of :ip_address
  validates_uniqueness_of :ip_address

  attr_accessible :ip_address
end
