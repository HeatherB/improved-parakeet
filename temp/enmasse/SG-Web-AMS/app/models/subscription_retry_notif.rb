# == Schema Information
#
# Table name: subscription_retry_notifs
#
#  id                           :integer          not null, primary key
#  provider_txn_key             :string(255)
#  subscription_notification_id :integer
#  subs_info_json               :text
#  lock_version                 :integer          default(0)
#  processed                    :boolean          default(FALSE)
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#

class SubscriptionRetryNotif < LogAR
  
  belongs_to :subscription_notification
  
  after_save :retry_notification
  
  attr_accessor :billing_txn
  attr_accessible :billing_txn, :provider_txn_key, :subscription_notification_id, :subs_info_json, :lock_version, :processed

  def self.process_all_for(txn)
    notifs = find(:all, :include => [:subscription_notification],
      :conditions => {
        :provider_txn_key => txn.provider_txn_key,
        :processed => false
      }
    )
    
    notifs.each do |n|
      begin
        n.billing_txn = txn
        n.processed = true
        n.save!
          
      rescue ActiveRecord::StaleObjectError => soe
        n.reload
        retry unless n.processed?
      end
    end
  end
  
  protected
  
  def retry_notification
    return unless self.processed_changed? && self.processed?

    sub_notif = self.subscription_notification
    sub_notif.notes = "#{sub_notif.notes} Retry attempt made on #{Time.now.utc}"
    hash = JSON.parse(self.subs_info_json)
    
    gacct, code = SubscriptionNotification.redeemed_game_account(
      self.billing_txn, 
      hash.merge(:notif_id => sub_notif.id).symbolize_keys
    )
    
    sub_notif.billing_transaction_id = self.billing_txn.id
    sub_notif.promo_code             = code.promo_code

    pending = (sub_notif.state == "PendingActivation")
    subscribed = ["Subscribed", "FreeTrial"].include?(sub_notif.state)
    
    duration = pending ? 0 : sub_notif.duration
    attrs = {
      :ext_user_id             => sub_notif.ext_user_id,
      :ext_product_id          => sub_notif.ext_product_id,
      :ext_provider            => "digital_river",
      :ext_subscription_id     => sub_notif.ext_subscription_id,
      :transaction_source_type => sub_notif.class.name,
      :transaction_source_id   => sub_notif.id,
      :recurring               => sub_notif.recurring, 
      :payment_required        => false
    }
    
    if pending
      attrs.merge!(
        :ext_activation_required => true,
        :pending_activation_days => 30
      )
    elsif subscribed
      attrs.merge!(
        :ext_expiration_at => sub_notif.expiration_date,
        :ext_activation_at => Time.now.utc
      )
    end    
    
    job = SubscriptionUpsertJob.new(gacct.id, duration, attrs)
    Delayed::Job.enqueue job, 1
    
    sub_notif.pending = false
    sub_notif.has_errors = false

  rescue Exception => ex
    if sub_notif.present?
      sub_notif.has_errors = true
      sub_notif.error_json = { :message => ex.message, :backtrace => ex.backtrace }.to_json
    end
  ensure
    sub_notif.save if sub_notif.present? && sub_notif.changed?
  end
  
  class SubscriptionUpsertJob
    attr_accessor :gacct_id, :duration, :attr_hash

    def initialize(gacct_id, duration, attr_hash={})
      self.gacct_id    = gacct_id
      self.duration    = duration
      self.attr_hash   = attr_hash
    end

    def perform
      Subscription.delayed_upsert!(self.gacct_id, self.duration, self.attr_hash)
    end
  end
  
end
