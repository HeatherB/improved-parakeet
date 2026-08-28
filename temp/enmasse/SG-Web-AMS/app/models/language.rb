# == Schema Information
#
# Table name: languages
#
#  id          :integer          not null, primary key
#  description :string(255)      not null
#  subtag      :string(255)      not null
#  iso6391     :string(255)
#  iso6392     :string(255)
#  common      :boolean          default(FALSE)
#  active      :boolean          default(FALSE)
#  created_at  :datetime
#  updated_at  :datetime
#  native_desc :string(255)
#

class Language < ActiveRecord::Base
  scope :active, :conditions => { :active => true }, :order => "common desc, description" 

  attr_accessible :description, :subtag, :iso6391, :iso6392, :common, :active, :native_desc

  def to_i
    self.id
  end
end
