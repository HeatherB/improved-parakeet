# == Schema Information
#
# Table name: script_logs
#
#  id                 :integer          not null, primary key
#  script_name        :string(255)
#  count_success      :integer          default(0)
#  count_lock_exit    :integer          default(0)
#  count_exception    :integer          default(0)
#  exception_messages :string(2000)     default("")
#  ts_date            :date
#  last_success_at    :datetime
#  created_at         :datetime
#  updated_at         :datetime
#

class ScriptLog < ActiveRecord::Base

  attr_accessible :script_name, :count_success, :count_lock_exit, :count_exception, :exception_messages, :ts_date, :last_success_at

  def self.update_script_stats(script_name, success, exited, exception, exception_msg)
    curr_date = Time.now.utc.to_date
    log = find_or_initialize_by_script_name_and_ts_date(script_name, curr_date)
    log.count_success += success
    log.count_lock_exit += exited
    log.count_exception += exception
    log.exception_messages = "#{log.exception_messages}#{exception_msg}" if exception_msg
    log.last_success_at = Time.now.utc if success == 1
    log.save
  end
end
