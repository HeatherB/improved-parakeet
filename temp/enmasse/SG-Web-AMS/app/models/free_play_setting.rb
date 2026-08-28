# == Schema Information
#
# Table name: free_play_settings
#
#  id                   :integer          not null, primary key
#  game_account_type_id :integer          not null
#  unlimited            :boolean          default(FALSE), not null
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#

class FreePlaySetting < ActiveRecord::Base
  belongs_to :game_account_type

  validates_presence_of :game_account_type_id
  validates_uniqueness_of :game_account_type_id

  attr_accessible :game_account_type_id, :unlimited

  def self.free_play_setting_cache_key
    "free_play_setting"
  end

  def self.update_memcache
    all_records = FreePlaySetting.all
    all_records = nil if all_records.empty?
    Rails.cache.write(self.free_play_setting_cache_key, all_records)
    all_records
  rescue
    nil
  end

  def self.all_from_cache
    free_settings = Rails.cache.read self.free_play_setting_cache_key
    if free_settings.nil? || !free_settings.is_a?(Array)
      self.update_memcache
    else
      free_settings
    end
  end

end
