# == Schema Information
#
# Table name: steam_dlc_activation_logs
#
#  id                      :integer          not null, primary key
#  steam_dlc_activation_id :integer
#  user_id                 :integer
#  steam_user_id           :integer
#  trace_json              :text
#  exception               :string(4000)
#  execution_time          :decimal(20, 10)
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  count                   :integer          default(0)
#

class SteamDlcActivationLog < LogAR
  belongs_to :steam_dlc_activation
  belongs_to :user

  attr_accessible :steam_dlc_activation_id, :user_id, :steam_user_id, :trace_json, :exception, :execution_time, :count

  def self.write_log(steam_dlc_activation_job_id, raise_exception)
    trace_log = TraceLogger.new
    start_time = Time.now
    backtrace = nil
    steam_dlc_activation = SteamDlcActivationJob.find(steam_dlc_activation_job_id).steam_dlc_activation

    res = yield trace_log if block_given?

    return res
  rescue => e
    trace_log << "error_type='#{e.class}', error_message='#{e.message}'"
    backtrace = Utils::clean_trace($@).join("\n")
    raise e if raise_exception
  ensure
    if steam_dlc_activation
      last = SteamDlcActivationLog.where(:steam_dlc_activation_id => steam_dlc_activation.id).last
      if last.present? && backtrace.present? && last.exception == backtrace
        last.count += 1
        last.trace_json == trace_log.json_logs
        last.execution_time = (Time.now - start_time).to_d
        last.save
      else
        SteamDlcActivationLog.create(
          :steam_dlc_activation_id => steam_dlc_activation.id,
          :user_id                 => steam_dlc_activation.user_id,
          :steam_user_id           => steam_dlc_activation.steam_user_id,
          :trace_json              => trace_log.json_logs,
          :exception               => backtrace,
          :execution_time          => (Time.now - start_time).to_d,
          :count                   => 1
        )
      end
    else
      Rails.logger.error "Invalid steam_dlc_activation_job_id, cannot find associated SteamDlcActivation record"
    end
  end

end
