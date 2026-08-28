# == Schema Information
#
# Table name: mailing_list_subscriptions
#
#  id              :integer          not null, primary key
#  user_id         :integer
#  mailing_list_id :integer
#  subscribed_at   :datetime
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  unsubscribed_at :datetime
#

class MailingListSubscription < ActiveRecord::Base
  attr_accessible :mailing_list_id, :subscribed_at, :user_id

  before_create do |mls|
    mls.subscribed_at = Time.now if mls.subscribed_at.blank?
  end

  belongs_to :user
  belongs_to :mailing_list

  scope :active, -> { where(:unsubscribed_at => nil) }
  scope :inactive, -> { where('unsubscribed_at IS NOT NULL') }

end
