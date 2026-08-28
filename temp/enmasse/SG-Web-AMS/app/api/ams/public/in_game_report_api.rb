module AMS
  module Public
    class InGameReportAPI < AMS::Public::BaseAPI

      #
      # unhandled exceptions come here
      rescue_from :all do |e|
        Rails.logger.debug e.message
        Rails.logger.debug e.backtrace.join("\n")
        # check if we have good error code
        # or we use execption class name
        if e.class.instance_methods(true).include?(:error_code)
          error_code = e.error_code
        else
          error_code = e.class.to_s.upcase
        end
        error!({error_code: error_code, error_message: e.message})
      end

      #
      #
      resource :in_game_report do
        desc 'Send in-game report'
        params do
          requires :violation_reason, type: Integer, values: [1,2,3,4,5]
          requires :reporter_in_game_account_id, type: String
          requires :reporter_eme_game_account_id, type: Integer
          requires :reporter_in_game_character_name, type: String
          optional :reporter_additional_info, type: String
          optional :chat_line, type: String
          requires :target_in_game_account_id, type: String
          requires :target_eme_game_account_id, type: Integer
          requires :target_in_game_character_name, type: String
          optional :target_additional_info, type: String
          optional :reserved, type: String
          requires :timestamp, type: Integer
          requires :checksum, type: String
        end
        post 'send_report' do
          # timestamp check
          now = Time.now.to_i
          timestamp = params["timestamp"].to_i
          error!({error_code: "timeout", error_message: "request time is out-of-date"}) if (now - timestamp > 5.minutes.second.to_i)

          # checksum
          salt = SECURE_CONFIG["in_game_report"]["salt"]
          reporter_eme_game_account_id = params["reporter_eme_game_account_id"]
          target_eme_game_account_id = params["target_eme_game_account_id"]
          source = Digest::SHA1.hexdigest "#{salt}|#{timestamp}|#{reporter_eme_game_account_id}|#{target_eme_game_account_id}"
          error!({error_code: "checksum_mismatch", error_message: "checksum doesn't match"}) if source != params["checksum"]

          # doit
          report = InGameReport.new
          report.attributes = params.reject{|k,v| !report.attributes.keys.member?(k.to_s)}
          report.save!
          success!({success: true})
        end

        get 'test' do
          success!({success: true})
        end
      end
    end
  end
end