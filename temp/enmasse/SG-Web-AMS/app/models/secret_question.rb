# == Schema Information
#
# Table name: secret_questions
#
#  id         :integer          not null, primary key
#  question   :string(255)
#  active     :boolean          default(TRUE)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class SecretQuestion < ActiveRecord::Base

  scope :active, :conditions => { :active => true }

  attr_accessible :question, :active
end
