# == Schema Information
#
# Table name: offenses
#
#  id          :integer          not null, primary key
#  name        :string(255)
#  description :text
#  created_at  :datetime
#  updated_at  :datetime
#

class Offense < ActiveRecord::Base
  has_many :suspensions

  attr_accessible :name, :description
end
