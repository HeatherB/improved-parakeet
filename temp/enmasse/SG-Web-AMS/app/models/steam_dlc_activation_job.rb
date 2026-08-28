# == Schema Information
#
# Table name: steam_dlc_activation_jobs
#
#  id                      :integer          not null, primary key
#  steam_dlc_activation_id :integer
#  attempts                :integer
#  retry_interval          :integer
#  last_error              :text
#  run_at                  :datetime
#  locked_at               :datetime
#  expired_at              :datetime
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#

class SteamDlcActivationJob < ActiveRecord::Base
  belongs_to :steam_dlc_activation
  has_one :steam_dlc_activation_log

  attr_accessible :steam_dlc_activation_id, :attempts, :retry_interval, :handler, :last_error, :run_at, :locked_at, :expired_at

  JOB_RETRY_INTERVAL = 1.minute
  JOB_EXPIRATION_TIME = 2.hours

  def self.create_job(steam_dlc_activation_id)
    # create activation job
    job = self.create({:steam_dlc_activation_id => steam_dlc_activation_id, :attempts => 0,
                       :retry_interval          => JOB_RETRY_INTERVAL, :run_at => Time.now.utc,
                       :expired_at              => Time.now.utc + JOB_EXPIRATION_TIME})

    # check job process is running
    # if not, create new one
    self.check_batch_process_delayed_job

    return job
  end

  def refresh_expired_at
    self.expired_at = Time.now.utc + JOB_EXPIRATION_TIME
    self.save
  end

  class SteamDlcActivationError < RuntimeError
  end

  def perform(log)
    dlc = SteamDlc.find_by_dlc_id(steam_dlc_activation.steam_dlc_id)

    raise SteamDlcActivationError.new("SteamDlc (dlc_id='#{steam_dlc_activation.steam_dlc_id}') is not defined") if dlc.nil?

    # before activating DLC check ownership of the DLC
    steam_client = Steam::Client.new
    begin
      if steam_client.check_app_ownership(steam_dlc_activation.steam_user_id, steam_dlc_activation.steam_dlc_id) == false
        # The given steam user does not have an ownership of the given DLC
        # Until he has the ownership, do not allow activating it and retry checking
        error_message = "The steam user(#{steam_dlc_activation.steam_user_id}) does not have an ownership of the DLC(#{steam_dlc_activation.steam_dlc_id})"
        log << error_message
        raise SteamDlcActivationError.new(error_message)
      end
    rescue Steam::Client::SteamError => e
      log << "SteamClient.check_app_ownership Error: #{e.message}"
      raise e
    end

    user = User.find(steam_dlc_activation.user_id)
    code = dlc.promo_code
    options = {pref_acct: steam_dlc_activation.game_account_id}
    error_messages = PromoCode.check_code_precondition(user, code, options, true)
    if error_messages.include? (PromoCode::RedemptionLimitOverflowError.new.message)
      # the given promo code is already used for the given user.
      log << "The promo code (#{code}) is already used by the user (user_id=#{user.id}, game_account_id=#{steam_dlc_activation.game_account_id})"
    elsif error_messages.empty?
      begin
        PromoCode.use_code(user, code, options, true)
        self.steam_dlc_activation.activated_at = Time.now.utc
        self.steam_dlc_activation.save
        log << "Success, the promo code (#{code}) is used by the user (user_id=#{user.id}, game_account_id=#{steam_dlc_activation.game_account_id})"
      rescue => e
        log << "PromoCode.use_code Error: #{e.message}"
        raise e
      end
    else
      log << "PromoCode.check_code_precondition Error: #{error_messages.join(',')}"
      raise SteamDlcActivationError.new(error_messages.join(','))
    end
  end

  class BatchProcessDelayedJob

    def perform

      begin
        job_ids = SteamDlcActivationJob.nolock.select(:id).where("run_at <= ? and locked_at is NULL", Time.now.utc).map { |job| job.id }

        job_ids.each do |job_id|

          SteamDlcActivationLog.write_log(job_id, false) do |log|

            exception_throw = nil

            SteamDlcActivationJob.transaction do

              begin
                job = SteamDlcActivationJob.find(job_id, :lock => 'WITH(UPDLOCK,ROWLOCK,NOWAIT)')
              rescue ActiveRecord::RecordNotFound, ActiveRecord::StatementInvalid
                job = nil
              end

              if job && job.locked_at.nil?
                if job.attempts == 0
                  log << 'Start'
                else
                  log << "Start, # of attempts=#{job.attempts}"
                end

                # lock job
                job.locked_at = Time.now.utc
                job.save

                begin
                  job.perform(log)

                  log << 'Successfully processed, delete the processed job'
                  job.delete
                  log << 'Stop'
                rescue Exception => e
                  if job.expired_at < Time.now.utc
                    log << 'Error occurred, job was expired, delete the expired job'
                    job.delete
                  else
                    log << 'Error occurred, job will be retried '
                    job.last_error = "error_type='#{e.class}', error_message='#{e.message}'\n" +  Utils::clean_trace(e.backtrace).join("\n")
                    job.locked_at = nil   # unlock job
                    job.attempts += 1
                    job.run_at = Time.now.utc + job.retry_interval
                    job.save
                  end
                  log << 'Stop'
                  exception_throw = e # do not throw exception here because it will cause transaction rollback
                end
              else
                log << 'Skip job processing because the given job is already in processing'
              end
            end

            # throw exception if there is any, this causes writing error log
            raise exception_throw if exception_throw
          end
        end
      ensure
        # ensure there is only one BatchProcessDelayedJob
        if Delayed::Job.where("handler like '%BatchProcessDelayedJob%' and locked_by is NULL").empty?
          Delayed::Job.enqueue(BatchProcessDelayedJob.new, :priority => 10, :run_at => 30.seconds.from_now)
        end
      end
    end
  end

  def self.check_batch_process_delayed_job
    if Delayed::Job.where("handler like '%BatchProcessDelayedJob%'").empty?
      Delayed::Job.enqueue(BatchProcessDelayedJob.new, :priority =>10)
    end
  end

end
