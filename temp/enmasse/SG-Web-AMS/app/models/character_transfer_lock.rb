# == Schema Information
#
# Table name: character_transfer_locks
#
#  id           :integer          not null, primary key
#  character_id :integer
#  server_id    :integer
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#

class CharacterTransferLock < ActiveRecord::Base
  validates_uniqueness_of :character_id, :scope => :server_id
  
  attr_accessible :character_id, :server_id
  
  def active?(game)
    transfer_lock = game.settings(:transfer_cooldown).to_i.days
    active_status = ((Time.now - self.created_at) < transfer_lock)
    self.destroy unless active_status
    active_status
  end
end
