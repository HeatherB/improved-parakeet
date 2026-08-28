# == Schema Information
#
# Table name: blacklisted_emails
#
#  id               :integer          not null, primary key
#  email            :string(255)      not null
#  active           :boolean          default(TRUE)
#  added_by_user_id :integer
#  created_at       :datetime
#  updated_at       :datetime
#

class BlacklistedEmail < ActiveRecord::Base
  belongs_to :user, :foreign_key => "added_by_user_id"
  validates_presence_of :email
  validates_format_of :email, :with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i
  validates_uniqueness_of :email, :message => "is already blacklisted"
  
  scope :active, :conditions => {:active => true}, :order => "created_at"
  
  attr_accessible :email, :active, :added_by_user_id
  
  def self.active_emails
    self.active.find(:all).collect {|blacklist| blacklist.email}
  end
end
