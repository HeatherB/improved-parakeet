# == Schema Information
#
# Table name: mailing_lists
#
#  id                    :integer          not null, primary key
#  name                  :string(255)
#  display_name          :string(255)
#  description           :text
#  position              :integer
#  active                :boolean
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  auto_sign_up_for_game :string(255)
#  yesmail_subscription  :string(255)
#

class MailingList < ActiveRecord::Base
  attr_accessible :active, :display_name, :name, :position, :description

  has_many :mailing_list_subscriptions
  has_many :subscribers, :through => :mailing_list_subscriptions, :source => :user, :foreign_key => "user_id"

  def subscribe(user_id, update_yesmail = true)
    sub = MailingListSubscription.active.where(:user_id => user_id, :mailing_list_id => id).first
    if sub.nil?
      MailingListSubscription.create(:user_id => user_id, :mailing_list_id => id)

      if update_yesmail
        begin
          user = User.find(user_id)
          Mailer::YesMail::Api::Subscribers::Subscriptions.subscribe(user.email, yesmail_subscription)
        rescue => e
          Rails.logger.error e.message + "\n " + Utils::clean_trace(e.backtrace).join("\n ")
        end
      end

      return true
    end
    return false
  end

  def unsubscribe(user_id, update_yesmail = true)
    sub = MailingListSubscription.active.where(:user_id => user_id, :mailing_list_id => id).first
    if sub
      sub.unsubscribed_at = Time.now
      sub.save

      if update_yesmail
        begin
          Mailer::YesMail::Api::Subscribers::Subscriptions.unsubscribe(user_id, id.yesmail_subscription)
        rescue => e
          Rails.logger.error e.message + "\n " + Utils::clean_trace(e.backtrace).join("\n ")
        end
      end
    end
    nil
  end
end
