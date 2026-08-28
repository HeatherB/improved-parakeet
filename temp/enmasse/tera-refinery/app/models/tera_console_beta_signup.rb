class TeraConsoleBetaSignup < ActiveRecord::Base
  validates_uniqueness_of :email, :message => "This email has already been used."
  validates_presence_of :email

  attr_accessible :email, :ps4, :xbox
end
