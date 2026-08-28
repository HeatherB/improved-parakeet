# == Schema Information
#
# Table name: game_settings
#
#  id         :integer          not null, primary key
#  game_id    :integer          not null
#  key        :string(255)      not null
#  value      :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class GameSetting < ActiveRecord::Base
  belongs_to :game

  validates_presence_of :game_id, :key, :value

  before_create :check_duplicate
  before_save :check_duplicate

  attr_accessible :game_id, :key, :value

  def check_duplicate
    setting = GameSetting.first(:conditions => { :game_id => self.game_id, :key => self.key })
    if setting.present? && setting != self
      errors.add('key', 'Must not be duplicated.')
      false
    end
  end

  def self.game_setting_cache_key
    'game_setting'
  end

  def self.update_memcache
    all_records = GameSetting.all
    Rails.cache.write(self.game_setting_cache_key, all_records)
    all_records
  rescue
    nil
  end

  def self.all_from_cache
    game_settings = Rails.cache.read self.game_setting_cache_key
    if game_settings.nil? || !game_settings.is_a?(Array)
      self.update_memcache
    else
      game_settings
    end
  end

end
