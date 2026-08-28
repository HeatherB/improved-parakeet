class SubscriptionServiceError < StandardError
end

class SubscriptionBase
  include DateFunctionsHelper
  extend DateFunctionsHelper

  def self.datetime_type_fields
    []
  end

  def initialize(hash)
    @table = {}
    if hash
      for k,v in hash
        if self.class.datetime_type_fields.include? k.to_s
          v = Time.zone.parse v if v
        end
        @table[k.to_sym] = v
        new_member(k)
      end
    end
  end

  def [](key)
    @table[key.to_sym]
  end

  protected

  def modifiable
    if self.frozen?
      raise TypeError, "can't modify frozen #{self.class}", caller(2)
    end
    @table
  end

  def new_member(name)
    name = name.to_sym
    class << self; self; end.class_eval do
      define_method(name) { @table[name] }
      define_method("#{name}=") { |x| modifiable[name] = x }
    end
    name
  end

end

class Subscription < SubscriptionBase
  def self.datetime_type_fields
    %w(created_at updated_at started_at ended_at next_delivery_at next_payment_at next_update_at)
  end

  def self.find(id)
    response = EME::Subscription.fetch(id, EME::Subscription.connection, {}, true)
    if response[:error]
      raise SubscriptionServiceError.new(response[:response]['error']) if response[:response]
      raise ActiveRecord::RecordNotFound
    end

    attributes = response['subscription']
    if attributes
      self.new attributes
    else
      raise ActiveRecord::RecordNotFound
    end
  end

  def self.find_all_active_for_master_account_id(master_account_id)
    response = EME::Subscription.fetch_active(master_account_id, EME::Subscription.connection, {}, true)
    if response[:error]
      raise SubscriptionServiceError.new(response[:response]['error']) if response[:response]
      return []
    end

    subscriptions = response["subscriptions"].map do |attributes|
      Subscription.new attributes
    end
    subscriptions
  end

  def self.find_all_for_master_account_id(master_account_id)
    response = EME::Subscription.fetch_all(master_account_id, EME::Subscription.connection, {}, true)
    if response[:error]
      raise SubscriptionServiceError.new(response[:response]['error']) if response[:response]
      return []
    end

    subscriptions = response["subscriptions"].map do |attributes|
      Subscription.new attributes
    end
    subscriptions
  end

  def self.find_by_game_account_id(game_account_id)
    response = EME::Subscription.fetch_active_for_game_account(game_account_id, EME::Subscription.connection, {}, true)
    if response[:error]
      raise SubscriptionServiceError.new(response[:response]['error']) if response[:response]
      return nil
    end

    subscriptions = response["subscriptions"]
    if subscriptions.length > 0
      self.new subscriptions[0]
    else
      response = EME::Subscription.fetch_all_for_game_account(game_account_id, EME::Subscription.connection, {}, true)
      if response[:error]
        raise SubscriptionServiceError.new(response[:response]['error']) if response[:response]
        return nil
      end

      subscriptions = response["subscriptions"]
      if subscriptions.length > 0
        subscriptions.sort! { |x, y| x['id'] <=> y['id']}
        self.new subscriptions[-1]  # select the last one
      else
        nil
      end
    end
  end

  def active?
    self.state == 'active'
  end

  def expired?
    self.state == 'expired'
  end

  def cancelled?
    self.state == 'active' && self.recurring == false
  end

  def recurring?
    self.recurring == true
  end

  def state? state_name
    self.state.downcase == state_name.to_s.downcase
  end

  def has_game_time_remaining?
    self.ended_at.present? && self.ended_at > Time.now
  end

  def self.add_days_with_subscription_creation(user_id, game_account_id, game_id, days, notes, additional_info)
    response = EME::Subscription.add_days_with_subscription_creation(user_id, game_account_id, game_id, days,
                                                                     :notes           => notes,
                                                                     :additional_info => additional_info)
    if response[:error]
      raise SubscriptionServiceError.new(response[:response]['error']) if response[:response]
      return nil
    end
    attributes = response['subscription']
    Subscription.new attributes
  end
end

# # == Schema Information
# #
# # Table name: subscriptions
# #
# #  id                      :integer          not null, primary key
# #  user_id                 :integer
# #  game_account_id         :integer
# #  started_at              :datetime
# #  ended_at                :datetime
# #  billing_attempt         :integer          default(0)
# #  recurring               :boolean          default(FALSE)
# #  transaction_source_type :string(255)
# #  transaction_source_id   :integer
# #  ext_subscription_id     :string(255)
# #  recurring_stopped_at    :datetime
# #  created_at              :datetime
# #  updated_at              :datetime
# #  state                   :string(80)
# #  ext_provider            :string(255)
# #  ext_product_id          :string(255)
# #  ext_activation_at       :datetime
# #  ext_user_id             :string(80)
# #  payment_required        :boolean          default(TRUE)
# #  ext_expiration_at       :datetime
# #  extensions              :integer          default(0)
# #  renewal_duration        :integer
# #  admin_state             :string(80)
# #  is_trial                :boolean
# #  lock_version            :integer          default(0)
# #
#
# class Subscription < ActiveRecord::Base
#   include DateFunctionsHelper
#   extend DateFunctionsHelper
#
#   GRACE_PERIOD = 15.minutes # give a 15 minute grace period for sub expiration
#
#   belongs_to :user
#   belongs_to :game_account
#   belongs_to :transaction_source, :polymorphic => true
#
#   validates_presence_of :user_id, :game_account_id
#
#   attr_accessible :transaction_source, :transaction_source_type, :transaction_source_id, :ext_user_id, :pending_activation_days,
#                   :recurring, :ext_provider, :ext_subscription_id, :ext_product_id, :started_at, :ended_at, :ext_activation_at,
#                   :ext_activation_required, :ext_expiration_at, :trace_txn_source_type, :trace_txn_source_id,
#                   :payment_required, :is_migration, :invalid_sub_id, :is_free_trial, :renewal_duration, :extensions, :is_trial
#
#   attr_accessor :days_to_add, :ext_activation_required, :ext_modification_required, :pending_activation_days,
#                 :trace_txn_source_type, :trace_txn_source_id, :is_migration, :invalid_sub_id, :is_free_trial
#
#   before_save :adjust_expiration_dates, :update_activation, :update_renewal, :update_recurring_info
#
#   after_save :send_ext_activation, :send_ext_modify_renewal
#
#   state_machine :initial => :pending do
#
#     before_transition [:expired, :cancelled] => :active, :do => :reset_started_at
#     before_transition any => [:expired, :cancelled], :do => :reset_recurring
#     before_transition any => [:pending, :active], :do => :apply_game_time
#     before_transition any => [:cancelled], :do => :reset_trial
#
#     after_transition do |sub, transition|
#       sub.log_subscription_change(transition)
#     end
#
#     event :start do
#       transition :pending => :active, :if => :activatable?
#       transition :pending => :pending, :unless => :activatable?
#     end
#
#     event :cancel do
#       transition [:pending, :active] => :cancelled
#     end
#
#     event :extend_expiration do
#       transition :active => same
#     end
#
#     event :change_expiration do
#       transition :active => same
#     end
#
#     event :cancel_recurring do
#       transition :active => same
#     end
#
#     event :expire do
#       transition :active => :expired, :unless => :has_game_time_remaining?
#       transition :active => :cancelled, :if => :has_game_time_remaining?
#     end
#
#     event :renew do
#       transition [:expired, :cancelled] => :active, :unless => :pending_renewal?
#       transition [:expired, :cancelled] => :pending, :if => :pending_renewal?
#       transition :pending => :pending, :unless => :activatable?
#       transition :pending => :active, :if => :activatable?
#       transition :active => same
#     end
#
#     event :abort_transaction do
#       transition any => same
#     end
#
#   end
#
#   # overriding change_expiration and cancel_recurring event method
#   # 'change_expiration' event always sent only if automatic renewal is active. thus, we can assume that recurring is true.
#   def change_expiration(*)
#     self.recurring = true
#     super   # call original "change_expiration" event method
#   end
#
#   # 'cancel_recurring' always sent on if automatic renewal is not active. thus, we can assume that recurring is false.
#   def cancel_recurring(*)
#     self.recurring = false
#     super   # call original "cancel_recurring" event method
#   end
#
#   # handles what should be done if ended_at date is reached
#   def handle_expiration
#     if self.state == 'active' && self.ended_at.present? && self.ended_at.to_i < Time.now.to_i
#       if self.ext_provider.present? && self.ext_provider == 'fat_foo_goo'
#         # The desired behavior of FatFooGoo subscriptions is that they never
#         # expire without an explicit onsubscriptionend notification.
#         # Even if we've received an onsubscriptioncancel notification to
#         # cancel recurring, we will not cancel the actual subscription until
#         # we receive the onsubscriptionend notification.
#         # Tony states that we should extend the expiration date by one day,
#         # but keep track of times we've extended the expiration date.
#         logged_extend(1)
#       else
#         self.extensions = 0
#         logged_expire
#       end
#     end
#   end
#
#   def logged_extend(duration)
#     log = []
#
#     Subscription.append_subscription_info(self, log)
#
#     if self.ext_provider.present? && self.ext_provider == 'fat_foo_goo'
#       if self.ended_at != self.ext_expiration_at
#         log << trace_msg("Internal expiration date (#{self.ended_at}) is out of sync with external expiration date (#{self.ext_expiration_at}).  Setting internal expiration date to external expiration date.")
#         self.ended_at = self.ext_expiration_at
#         self.save!
#         Subscription.append_subscription_info(self, log)
#         return if self.ended_at.to_i > Time.now.to_i
#       end
#     end
#
#     log << trace_msg("Expiration date reached; extending by #{duration} #{duration == 1 ? ' grace day' : ' grace days'}")
#
#     self.days_to_add = duration
#     self.extensions += duration
#
#     if self.extend_expiration
#       log << trace_msg("Subscription has been extended")
#       Subscription.append_subscription_info(self, log)
#     else
#       msg = "Error: #{self.errors.full_messages.to_sentence}"
#       log << trace_msg(msg)
#     end
#   rescue ActiveRecord::StaleObjectError => sop
#     self.reload
#     retry
#   rescue Exception => ex
#     SubscriptionErrorLog.create_log!(self, "warning", "#{ex.message} --- #{ex.backtrace}")
#   ensure
#     self.append_trace_json(log)
#   end
#
#   def logged_expire
#     log = []
#
#     log << trace_msg("Setting status of subscription to expired")
#
#     if self.expire
#       log << trace_msg("Subscription has expired")
#       Subscription.append_subscription_info(self, log)
#     else
#       msg = "Error: #{self.errors.full_messages.to_sentence}"
#       log << trace_msg(msg)
#     end
#   rescue ActiveRecord::StaleObjectError => sop
#     self.reload
#     retry
#   rescue Exception => ex
#     SubscriptionErrorLog.create_log!(self, "warning", "#{ex.message} --- #{ex.backtrace}")
#   ensure
#     self.append_trace_json(log)
#   end
#
#   def self.trace_msg(msg)
#     { :timestamp => Time.now.utc.to_i, :message => msg }
#   end
#
#   def trace_msg(msg)
#     { :timestamp => Time.now.utc.to_i, :message => msg }
#   end
#
#   def active?
#     current_state = self.admin_state.blank? ? self.state : self.admin_state
#     current_state == "active"
#   end
#
#   def cancelled?
#     current_state = self.admin_state.blank? ? self.state : self.admin_state
#     current_state == "cancelled"
#   end
#
#   def log_subscription_change(transition)
#     SubscriptionChangeLog.log_changes!(self, transition)
#   end
#
#   def reset_started_at
#     self.started_at = Time.now.utc unless !!self.is_migration
#   end
#
#   def reset_trial
#     self.is_trial = false if self.is_trial.present? && self.is_trial
#     true # returning false will cause the transition to fail
#   end
#
#   def reset_recurring
#     self.recurring = false
#     true # returning false will cause the transition to fail
#   end
#
#   def no_days_to_add?
#     self.days_to_add.to_i == 0
#   end
#
#   def pending_renewal?
#     no_days_to_add? && self.ended_at.present? && self.ended_at.to_i <= Time.now.to_i
#   end
#
#   def activatable?
#     return false unless self.started_at && self.ended_at
#     self.started_at.to_i <= Time.now.to_i && self.ended_at.to_i > Time.now.to_i
#   end
#
#   def missing_ext_activation_at?
#     !!self.ext_activation_required && self.ext_provider.present? && self.ext_activation_at.nil?
#   end
#
#   def pending_can_become_active?
#     !self.missing_ext_activation_at? && !self.provider_info_changed?
#   end
#
#   def provider_info_changed?
#     (self.ext_provider.present? && self.ext_provider_changed? && self.ext_provider_was.present?) ||
#     (self.ext_subscription_id.present? && self.ext_subscription_id_changed? && self.ext_subscription_id_was.present?) ||
#     # (self.ext_product_id.present? && self.ext_product_id_changed? && self.ext_product_id_was.present?) ||
#     (self.ext_user_id.present? && self.ext_user_id_changed? && self.ext_user_id_was.present?)
#   end
#
#   def update_recurring_info
#     if self.recurring_changed?
#       curr_time = Time.now.utc
#
#       if self.recurring?
#         self.recurring_stopped_at = nil
#       else
#         self.recurring_stopped_at = curr_time
#       end
#     end
#   end
#
#   def update_activation
#     if !!self.ext_activation_required &&
#       (self.ext_activation_at.nil? || self.ext_subscription_id_changed?) &&
#       !self.is_migration
#
#       pad = self.pending_activation_days.to_i
#       if pad == 0
#         # there is no pending game time, so activate at end of
#         # current sub... renewal date will wind up being the same
#         # day as the activation
#
#         # EDIT: instead of defaulting to Time.now.utc, we have to make adjustments
#         # b/c DR doesn't store timestamps AND they store their dates in Central time
#         # self.ext_activation_at = (self.ended_at_was || Time.now.utc)
#         self.ext_activation_at = self.ended_at_was || Subscription.convert_to_central(Time.now.utc, "00:00:00")
#       else
#         # set the external activation date to be n days prior to the
#         # end of the subscription. If the resulting activation date
#         # is less than the subscription start, set it to the subscription start
#         tmp_exp = self.ended_at - (60 * 60 * 24 * pad)
#         self.ext_activation_at = [self.started_at, tmp_exp].max
#       end
#     end
#   end
#
#   def send_ext_activation
#     curr_time = Time.now.utc
#
#     if !!self.ext_activation_required && self.ext_activation_at.present? &&
#       (!!self.is_migration || self.ext_activation_at_changed?)
#
#       provider = self.ext_provider
#
#       if provider.present?
#         klass = "#{provider.classify}::SubscriptionService".constantize rescue nil
#
#         # we only want to send the activation if an external service exists
#         if klass.present? && klass.is_a?(Class)
#           klass.activate(self)
#         end
#       end
#     end
#   end
#
#   def update_renewal
#     return unless self.ended_at.present?
#     return unless self.ext_provider.present?
#
#     curr_time = Time.now.utc
#
#     if self.ext_expiration_at.nil?
#
#       self.ext_expiration_at = self.ended_at
#
#       unless self.ext_expiration_at.to_date <= Subscription.convert_to_central(curr_time, "23:59:59").to_date
#         self.ext_modification_required = true
#       end
#
#     elsif self.ended_at.to_date > self.ext_expiration_at.to_date
#
#       self.ext_expiration_at = self.ended_at
#
#       unless self.ext_expiration_at.to_date <= Subscription.convert_to_central(curr_time, "23:59:59").to_date
#         self.ext_modification_required = true
#       end
#
#     elsif self.ended_at.to_date < self.ext_expiration_at.to_date
#
#       # err on the side of caution... if the external expiration is greater
#       # than what we have internally, update our records to be the same as
#       # the external provider
#       self.ended_at = self.ext_expiration_at
#
#       # but log the warning
#       msg = "External subscription and internal subscription expiration date mismatch. Increasing internal dates to match external."
#       SubscriptionErrorLog.create_log!(self, "warning", msg)
#
#     end
#   end
#
#   def send_ext_modify_renewal
#     return unless self.state?(:active) || self.state?(:pending)
#     return unless !!self.ext_modification_required
#
#     provider = self.ext_provider
#
#     if provider.present?
#       klass = "#{provider.classify}::SubscriptionService".constantize rescue nil
#
#       # we only want to send the modify request if an external service exists
#       if klass.present? && klass.is_a?(Class)
#         klass.renewal_modification(self)
#       end
#     end
#   end
#
#   def has_game_time_remaining?
#     if self.ext_provider.present? && self.ext_provider == 'fat_foo_goo'
#       # give a 15 minute grace period for fat foo goo subs (per tony)
#       (self.ended_at + GRACE_PERIOD).to_i > Time.now.to_i
#     else
#       self.ended_at.present? && self.ended_at.to_i > Time.now.to_i
#     end
#   end
#
#   def apply_game_time
#     curr_time = Time.now.utc
#
#     if self.days_to_add.present?
#       self.started_at = curr_time if self.started_at.nil?
#
#       # workaround to how DR handles free trial accounts. They
#       # do not request payment information for "PendingActivation" subs
#       # which is what the freetrial technically is. To get around this, we
#       # handle them just like we do for "Subscribed" accounts but don't add game time
#       if self.is_free_trial
#         self.ended_at ||= self.started_at # ensure ended_at is not null
#       else
#         add_time = (60 * 60 * 24 * self.days_to_add.to_i)
#
#         if self.ext_provider == "fat_foo_goo"
#           # fat foo goo subscriptions will have an accurate ended_at date
#           # add duration to the last ended_at without caring about Time.now
#           self.ended_at += add_time
#           # sync external expiration as desired by Tony
#           self.ext_expiration_at = self.ended_at
#         elsif !!self.is_migration
#           self.ended_at = self.started_at + add_time
#         elsif self.ended_at.nil? || self.ended_at.to_i < curr_time.to_i
#           self.ended_at = Time.now.utc + add_time
#         else
#           self.ended_at += add_time
#         end
#       end
#     end
#   end
#
#   def append_trace_json(log)
#     begin
#       txn_type = self.trace_txn_source_type || self.transaction_source_type
#       txn_id = self.trace_txn_source_id || self.transaction_source_id
#       if log.size > 0 && txn_type.present? && txn_id.to_i > 0
#         scl = SubscriptionChangeLog.find(
#           :last,
#           :conditions => {
#             :transaction_source_type => txn_type,
#             :transaction_source_id => txn_id
#           }
#         )
#         if scl.present?
#           json = scl.trace_json || "[]"
#           arr = JSON.parse(json) || []
#           log.each { |l| arr << l }
#           scl.trace_json = arr.to_json
#           scl.save!
#         end
#       end
#     rescue Exception => ex
#       # we have to log this to file b/c by now it's too late to rollback
#       # this transaction is against the log db. An error here means the
#       # subscription was created and external requests made. What failed
#       # is the logging of those changes to the change log
#       SubscriptionErrorLog.create_log!(self, "warning", "#{ex.message} --- #{ex.backtrace}")
#     end
#   end
#
#   # we don't want to show our actual subscription id as that would reveal
#   # the number of subscribers. Let's seed it and then base64 encode it
#   def to_param
#     seeded_id = self.id + 1234567
#     Base64.encode64(seeded_id.to_s).strip
#   end
#
#   def payment_required=(val)
#     self['payment_required'] = val if self.payment_required?
#   end
#
#   def payment_setup_required_for?(acct)
#     game = acct.game
#     game.requires_payment_setup? && self.payment_required?
#   end
#
#   # def cancel_erroneous(attr_hash, log)
#   #   invalid_sub_id = attr_hash[:ext_subscription_id]
#
#   #   log << self.class.trace_msg("Abort: Cannot overwrite an active external subscription")
#   #   log << self.class.trace_msg("Sending Cancel Notification for duplicate subscription #{invalid_sub_id}")
#
#   #   self.transaction_source_type = attr_hash[:transaction_source_type]
#   #   self.transaction_source_id = attr_hash[:transaction_source_id]
#   #   self.abort_transaction
#
#   #   self.class.send_later(
#   #     :send_ext_cancel,
#   #     self.id,
#   #     self.transaction_source_type,
#   #     self.transaction_source_id,
#   #     attr_hash[:ext_subscription_id]
#   #   )
#   # end
#
#   # we need to get the actual id back from the obfuscated id
#   def self.id_from_param(param)
#     val = Base64.decode64(param).to_i - 1234567
#     [0, val].max
#   end
#
#   # since DR doesn't store timestamps, we have to hard code our
#   # expiration date to have time 23:59:59
#   # AND TO TOP IT OFF!!! Their times are all central time, so we have
#   # to do some conversions
#   def adjust_expiration_dates
#     if self.ext_provider == "digital_river"
#       # don't do anything if the start and end dates are the same (e.g. no time added / pending)
#       if self.started_at != self.ended_at
#         # adjust the end date
#         if self.ended_at.present? && self.ended_at_changed?
#           self.ended_at = Subscription.convert_to_central(self.ended_at, "23:59:59")
#
#           # make sure we adjust the start date as well
#           if self.started_at.present?
#             self.started_at = Subscription.convert_to_central(self.started_at, "00:00:00")
#           end
#         end
#       end
#     end
#   end
#
#   class << self
#
#     def upsert(gacct, duration, attr_hash={}, log=[])
#       attr_hash.symbolize_keys!
#
#       success = false
#       curr_time = Time.now.utc
#
#       sub = gacct.subscription
#
#       if sub.nil?
#         log << trace_msg("No subscription found, creating...")
#         sub = Subscription.new(:recurring => false)
#         sub.game_account_id = gacct.id
#         sub.user_id         = gacct.user_id
#       end
#
#       append_subscription_info(sub, log)
#
#       unless attr_hash.empty?
#         log << trace_msg("Applying attributes: #{attr_hash.to_json}")
#         sub.attributes = attr_hash
#       end
#
#       if !!attr_hash[:is_free_trial]
#         log << trace_msg("Granting 0 days of game time (free trial)")
#       else
#         if sub.started_at.nil?
#           # started_at is when the subscription became active internally
#           sub.started_at = Time.now.utc
#         end
#
#         if sub.ext_provider.present? && sub.ext_provider == "fat_foo_goo"
#           if sub.ended_at != sub.ext_expiration_at
#             # ext_expiration_at is kept updated with the internal ended_at, but it
#             # is always overridden by FFG notifications; thus we should synchronize
#             # internal with external before adding any game time
#             log << trace_msg("Setting internal expiration date to external date: #{sub.ext_expiration_at}")
#             sub.ended_at = sub.ext_expiration_at
#           end
#         end
#
#         duration = duration.to_i if duration.is_a?(String)
#         if duration > 0
#           # adjust duration by the number of 1-day extensions given
#           if sub.extensions > 0
#             log << trace_msg("Adjusting the duration of #{duration} days for #{sub.extensions} #{(sub.extensions == 1 ? 'day' : 'days')} of extensions")
#             if sub.extensions >= duration
#               sub.extensions -= duration
#               duration = 0
#             else
#               duration -= sub.extensions
#               sub.extensions = 0
#             end
#           end
#           log << trace_msg("Granting #{duration} #{duration == 1 ? 'day' : 'days'} of game time")
#         end
#       end
#
#       sub.days_to_add = duration
#
#       # we can't overwrite an existing subscription, unless this is a migration
#       success = sub.new_record? ? sub.start : sub.renew
#
#       if success
#         log << trace_msg("Update complete")
#         append_subscription_info(sub, log)
#
#         # Rewarding referrals
#         if gacct.user.was_referred? && sub.ext_provider && sub.ext_provider == 'digital_river'
#           log << trace_msg("The user for this account was referred, checking if we should apply first subscription rewards")
#
#           referral = Referral.find(gacct.user.referral_id)
#           unless referral.subscription_rewarded?
#             log << trace_msg("The referral has not been rewarded the subscription reward before, rewarding in the background")
#             Referral.send_later(:apply_reward, referral.id, 'referral_subscribed')
#           else
#             log << trace_msg("The referral has already been rewarded the subscription reward, ignoring")
#           end
#         end
#       else
#         msg = "Error: #{sub.errors.full_messages.to_sentence} --- Attempted Changes: #{sub.changes.to_json}"
#         log << trace_msg(msg)
#         SubscriptionErrorLog.create_log!(sub, "error", msg)
#       end
#
#       sub.append_trace_json(log)
#       sub
#     rescue ActiveRecord::StaleObjectError => sop
#       sub.reload if sub
#       retry
#     end
#
#     def append_subscription_info(sub, log)
#       log << trace_msg("Sub State: #{sub.state}")
#       log << trace_msg("Sub Start: #{time_utc_with_format('%m/%d/%Y %I:%M%p %Z', sub.started_at, 'null')}")
#       log << trace_msg("Sub End: #{time_utc_with_format('%m/%d/%Y %I:%M%p %Z', sub.ended_at, 'null')}")
#     end
#
#     def expire_all
#       # the query itself has to account for grace period to avoid retrieving the same record
#       Subscription.find_each(:conditions => [ "state = ? AND ended_at <= ? AND ext_provider = 'fat_foo_goo'", "active", Time.now.utc - GRACE_PERIOD], :batch_size => 1) do |sub|
#         sub.handle_expiration unless sub.has_game_time_remaining?
#       end
#
#       # handle non-ffg subscriptions without grace period
#       Subscription.find_each(:conditions => [ "state = ? AND ended_at <= ? AND ext_provider != 'fat_foo_goo'", "active", Time.now.utc ], :batch_size => 1) do |sub|
#         sub.handle_expiration unless sub.has_game_time_remaining?
#       end
#     end
#
#     def send_ext_cancel(sub_id, txn_type=nil, txn_id=nil, invalid_sub_id=nil)
#       sub = Subscription.find(sub_id)
#
#       provider = sub.ext_provider
#
#       if provider.present?
#         klass = "#{provider.classify}::SubscriptionService".constantize rescue nil
#
#         # we only want to send the cancellation if an external service exists
#         if klass.present? && klass.is_a?(Class)
#           klass.delayed_cancel(sub, txn_type, txn_id, invalid_sub_id)
#         end
#       end
#     rescue ActiveRecord::RecordNotFound => rnf
#       # this shouldn't happen, and if it does, we don't want it sitting in the retry queue
#       # log it to the error log
#       msg = "A request was made to Subscription.send_ext_cancel with an invalid subscription ID (#{sub_id})"
#       SubscriptionErrorLog.create_log!(nil, "error", msg)
#     end
#
#     def delayed_upsert!(gacct_id, duration, attr_hash={})
#       sub, log = nil, []
#       gacct    = GameAccount.find(gacct_id)
#
#       src_type = attr_hash[:transaction_source_type]
#       src_id   = attr_hash[:transaction_source_id]
#
#       src = src_type.constantize.find(src_id) if src_type.present? && src_id.present?
#
#       sub = upsert(gacct, duration, attr_hash)
#
#       if sub.errors.size != 0
#         msg = "Error: #{sub.errors.full_messages.to_sentence}"
#         log << trace_msg(msg)
#         raise msg
#       end
#
#       return sub
#     ensure
#       # finalize_delayed_worker(sub, src, log)
#     end
#
#     # this is called from the admin console and behaves slightly differently
#     # than send_ext_cancel
#     def delayed_cancel!(sub_id, attr_hash={})
#       sub, log = nil, []
#       src_type = attr_hash[:transaction_source_type]
#       src_id   = attr_hash[:transaction_source_id]
#
#       src = src_type.constantize.find(src_id) if src_type.present? && src_id.present?
#       sub = Subscription.find(sub_id)
#
#       unless attr_hash.empty?
#         log << trace_msg("Applying additional attributes: #{attr_hash.to_json}")
#         sub.attributes = attr_hash
#       end
#
#       success = sub.cancel
#
#       if success
#         log << trace_msg("Subscription has been cancelled")
#         append_subscription_info(sub, log)
#       else
#         msg = "Error: #{sub.errors.full_messages.to_sentence}"
#         log << trace_msg(msg)
#
#         # if it's no longer active, we don't care
#         # otherwise we do, so keep it in the queue
#         if sub.state == 'active'
#           log << trace_msg("Job will remain in the queue to be retried")
#           raise msg
#         else
#           log << trace_msg("Subscription is not currently active. Removing job from queue")
#         end
#       end
#     rescue ActiveRecord::RecordNotFound
#       # this should never happen as we check validity multipe times before it gets here
#       # so don't keep it in the worker queue. Just log it.
#       sub = nil
#       log << trace_msg("Subscription not found")
#     ensure
#       finalize_delayed_worker(sub, src, log)
#     end
#
#     def delayed_change!(sub_id, attr_hash={})
#       sub, log = nil, []
#       src_type = attr_hash[:transaction_source_type]
#       src_id   = attr_hash[:transaction_source_id]
#       ext_expiration_at = attr_hash[:ext_expiration_at]
#
#       src = src_type.constantize.find(src_id) if src_type.present? && src_id.present?
#       sub = Subscription.find(sub_id)
#
#       unless attr_hash.empty?
#         log << trace_msg("Applying additional attributes: #{attr_hash.to_json}")
#         sub.attributes = attr_hash
#       end
#
#       # update subscription end date as ext_expiration_at which is given from fat_foo_goo.
#       sub.ext_expiration_at = ext_expiration_at
#       sub.ended_at = ext_expiration_at
#       success = sub.change_expiration
#
#       if success
#         log << trace_msg("Subscription has been changed")
#         append_subscription_info(sub, log)
#       else
#         msg = "Error: #{sub.errors.full_messages.to_sentence}"
#         log << trace_msg(msg)
#
#         # if it's no longer active, we don't care
#         # otherwise we do, so keep it in the queue
#         if sub.state == 'active'
#           log << trace_msg("Job will remain in the queue to be retried")
#           raise msg
#         else
#           log << trace_msg("Subscription is not currently active. Removing job from queue")
#         end
#       end
#     rescue ActiveRecord::RecordNotFound
#       # this should never happen as we check validity multipe times before it gets here
#       # so don't keep it in the worker queue. Just log it.
#       sub = nil
#       log << trace_msg("Subscription not found")
#     ensure
#       finalize_delayed_worker(sub, src, log)
#     end
#
#     def finalize_delayed_worker(sub, src, log)
#       if src.present?
#         src.subscription_id = sub.id if src.respond_to?(:subscription_id) && sub.present?
#         src.save
#         sub.append_trace_json(log) if sub.present?
#       end
#     rescue Exception => ex
#       # BobT: so, the code in this block actually writes to the log db.
#       # As such, we cannot do a rollback of the subscription in the event
#       # of an error (in this block specifically) because of the different db connections.
#       # The issue would be that it would remain in the delayed job queue and we would therefore
#       # continually increase the number of days added on each retry attempt.
#       # The good news is that errors here should never happen. If they do,
#       # there is a critical bug in the system that would need to be remedied.
#       # As such, we'll log it to a file we can monitor.
#       # This should be ok (for now), since this block is more for housekeeping anyway. Ironically,
#       # the primary purpose for this block is to prevent DR from sending duplicate subscription requests.
#       # TODO : implement an email notification system that won't spam hundreds of emails at a time
#       # and that can be used system wide.
#       SubscriptionErrorLog.create_log!(sub, "error", "#{ex.message} --- #{ex.backtrace}")
#     end
#
#     def delayed_cancel_recurring!(sub_id, attr_hash={})
#       sub, log = nil, []
#       src_type = attr_hash[:transaction_source_type]
#       src_id   = attr_hash[:transaction_source_id]
#
#       src = src_type.constantize.find(src_id) if src_type.present? && src_id.present?
#       sub = Subscription.find(sub_id)
#
#       unless attr_hash.empty?
#         log << trace_msg("Applying additional attributes: #{attr_hash.to_json}")
#         sub.attributes = attr_hash
#       end
#
#       success = sub.cancel_recurring
#
#       if success
#         log << trace_msg("Subscription recurring has been cancelled")
#         append_subscription_info(sub, log)
#       else
#         msg = "Error: #{sub.errors.full_messages.to_sentence}"
#         log << trace_msg(msg)
#
#         # if it's no longer active, we don't care
#         # otherwise we do, so keep it in the queue
#         if sub.recurring == true
#           log << trace_msg("Job will remain in the queue to be retried")
#           raise msg
#         else
#           log << trace_msg("Subscription recurring is not currently active. Removing job from queue")
#         end
#       end
#     rescue ActiveRecord::StaleObjectError => sop
#       sub.reload if sub
#       retry
#     rescue ActiveRecord::RecordNotFound
#       # this should never happen as we check validity multipe times before it gets here
#       # so don't keep it in the worker queue. Just log it.
#       sub = nil
#       log << trace_msg("Subscription not found")
#     ensure
#       finalize_delayed_worker(sub, src, log)
#     end
#
#     # DR doesn't store their times as timestamps, rather they just use dates
#     # we have to convert our times to either 00:00:00 or 23:59:59 AND convert
#     # to/from Central time as they don't store their dates as UTC either
#     def convert_to_central(t, time_string)
#       t_in_central = t.in_time_zone("Central Time (US & Canada)")
#       Time.parse(t_in_central.strftime("%Y-%m-%d #{time_string} %Z")).utc
#     end
#
#   end
#
# end
