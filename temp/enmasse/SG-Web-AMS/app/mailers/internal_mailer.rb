class InternalMailer < ActionMailer::Base
  default to: REPLY_TO_EMAIL_ADDRESS,
          from: REPLY_TO_EMAIL_ADDRESS

  def trial_promotion_redemption(start_time, elapsed_time, created_cnt, errors_cnt, csv_string)
    @start_time = start_time
    @elapsed_time = elapsed_time
    @created_cnt = created_cnt
    @errors_cnt = errors_cnt

    attachments["redeem_trial_promotion-#{start_time.to_i}.csv"] = {:mime_type => "text/csv", :content => csv_string }

    mail(:to => SECURE_CONFIG["enmasse"]["internal_email"], :subject => "#{GAME_NAME} – Trial Promotion Redemption Results")
  end

end