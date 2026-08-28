class MailingListSubscriptionsController < ApplicationController
  def update
    subs = params["subscribe"] || []
    unsubs = (params["mailing_list_ids"] || [] ) - subs
    subs.uniq!
    unsubs.uniq!
    subs.each { |ml_id| MailingList.find(ml_id).subscribe(current_user.id, false) }
    unsubs.each { |ml_id| MailingList.find(ml_id).unsubscribe(current_user.id, false) }

    # update yesmail
    begin
      subscriptions = subs.map { |ml_id| MailingList.find(ml_id).yesmail_subscription}
      Mailer::YesMail::Api::Subscribers::Subscriptions.update(current_user.email, subscriptions)
    rescue => e
      Rails.logger.error e.message + "\n " + Utils::clean_trace(e.backtrace).join("\n ")
    end

    redirect_to "/users/account"
  end
end
