# == Schema Information
#
# Table name: global_alerts
#
#  id         :integer          not null, primary key
#  active     :boolean          default(FALSE), not null
#  game_id    :integer
#  level      :string(255)      not null
#  message    :text
#  regex      :text             not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class GlobalAlert < ActiveRecord::Base
  attr_accessible :active, :game_id, :message, :level, :regex

  belongs_to :game

  validates :active, :inclusion => { :in => [true, false] }
  validates :message, :presence => true
  validates :level, :presence => true
  validates :regex, :presence => true

  scope :active, :conditions => { :active => true }
  scope :for_game, lambda { |game_id| { :conditions => { :game_id => game_id} }}

  def self.global_alerts_cache_key
    "global_alerts"
  end

  def self.update_memcache
    all_records = GlobalAlert.active.all
    all_records = nil if all_records.empty?
    Rails.cache.write(self.global_alerts_cache_key, all_records)
    all_records
  rescue => ex
    nil
  end

  def self.all_from_cache
    global_alerts = Rails.cache.read self.global_alerts_cache_key
    if global_alerts.nil? || !global_alerts.is_a?(Array)
      self.update_memcache
    else
      global_alerts
    end
  end

  def self.for_path(path, game_id=nil)
    global_alerts = self.all_from_cache
    return [] unless global_alerts
    if game_id
      # select global alerts that match the game and path
      global_alerts.select { |global_alert| global_alert.game_id == game_id && Regexp.new(global_alert.regex).match(path) }
    else
      # select global alerts that match the path
      global_alerts.select { |global_alert| Regexp.new(global_alert.regex).match(path) }
    end
  end
end
