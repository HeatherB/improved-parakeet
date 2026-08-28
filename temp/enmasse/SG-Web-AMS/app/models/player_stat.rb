# == Schema Information
#
# Table name: player_stats
#
#  id           :integer          not null, primary key
#  date         :date
#  year         :integer
#  month        :integer
#  day          :integer
#  count_total  :integer          default(0)
#  count_new    :integer          default(0)
#  count_active :integer          default(0)
#  count_on_web :integer          default(0)
#  max_on_web   :integer          default(0)
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#

class PlayerStat < ActiveRecord::Base
  before_save :update_max_columns
  
  attr_accessible :date, :year, :month, :day, :count_total, :count_new, :count_active, :count_on_web, :max_on_web
  
  protected
  
  def update_max_columns
    self.max_on_web = self.count_on_web if self.count_on_web > self.max_on_web
  end
end
