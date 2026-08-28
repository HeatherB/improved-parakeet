# == Schema Information
#
# Table name: user_devices
#
#  id                     :integer          not null, primary key
#  user_id                :integer
#  master_device          :boolean          default(FALSE)
#  io_device_alias        :string(80)
#  io_tracking_number     :integer
#  io_result              :string(1)
#  io_reason              :string(255)
#  authorization_required :boolean          default(TRUE)
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#

class UserDevice < ActiveRecord::Base
  belongs_to :user
  validates_uniqueness_of :io_device_alias, :scope => :user_id

  attr_accessible :user_id, :io_device_alias, :io_tracking_number, :io_result, :io_reason, :master_device, :authorization_required
  
  def self.requires_authorization?(user)
    return false unless user.engarde_enabled?
    
    device = find_by_user_id_and_io_device_alias(user.id, user.io_device_alias)
    return device.nil? ? true : device.authorization_required?
  end
  
  def self.deauthorize_for_user!(uid, master_device_alias)
    update_all({ :master_device => false, :authorization_required => true }, { :user_id => uid })
    update_all({ :master_device => true, :authorization_required => false }, { :user_id => uid, :io_device_alias => master_device_alias })
  end
end
