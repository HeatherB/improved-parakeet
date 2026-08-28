# == Schema Information
#
# Table name: users
#
#  id                        :integer          not null, primary key
#  screen_name               :string(33)
#  email                     :string(64)
#  crypted_password          :string(60)
#  salt                      :string(40)
#  remember_token            :string(40)
#  remember_token_expires_at :datetime
#  activation_code           :string(40)
#  activated_at              :datetime
#  failed_login_attempts     :integer          default(0)
#  account_status            :integer          default(0)
#  admin_account_type        :integer          default(0)
#  tos_accepted_at           :datetime
#  eula_accepted_at          :datetime
#  receive_news              :boolean
#  receive_offers            :boolean
#  date_of_birth             :date
#  secret_question_id        :integer
#  secret_answer             :string(1000)
#  registration_ip           :string(80)
#  reg_ip_as_int             :integer
#  country_code              :string(2)
#  referrer                  :string(255)
#  referrer_domain           :string(255)
#  last_seen_at              :datetime
#  last_login_at             :datetime
#  last_logout_at            :datetime
#  logged_in_from_cookie     :boolean          default(FALSE)
#  created_at                :datetime
#  updated_at                :datetime
#  timezone                  :string(80)
#  latitude                  :string(40)
#  longitude                 :string(40)
#  city                      :string(50)
#  region                    :string(255)
#  isp                       :string(255)
#  affiliate_code            :string(255)
#  can_change_screen_name    :boolean          default(FALSE)
#  new_email                 :string(255)
#  new_email_key             :string(40)
#  forgot_password_key       :string(40)
#  buffered_password         :string(255)
#  buffered_salt             :string(255)
#  deleted                   :boolean          default(FALSE)
#  io_device_alias           :string(80)
#  io_tracking_number        :integer
#  io_result                 :string(1)
#  io_reason                 :string(255)
#  engarde_enabled           :boolean          default(TRUE)
#  temp_screen_name          :boolean          default(FALSE)
#  language                  :string(2)        default("en")
#  io_auth_required          :boolean          default(FALSE)
#  forgot_password_key_at    :datetime
#  amazon_token              :string(255)
#  amazon_request_token      :string(255)
#  amazon_request_kind       :string(255)
#  referral_id               :integer
#  activation_code_at        :datetime
#  authorize_next_device     :boolean          default(FALSE)
#  authorization_code        :string(6)
#  authorization_code_at     :datetime
#  signed_up_page            :string(255)
#  signed_up_campaign        :string(255)
#

include CustomValidationsHelper

class User < ActiveRecord::Base
  require 'digest/sha1'
  require 'openssl'
  include DateFunctionsHelper
  include Extensions::UserEx
  include ActionView::Helpers

  has_one  :secret_question
  has_many :user_devices
  has_one  :site_referrer
  has_many :game_accounts, :conditions => { :deleted => false }
  has_many :promo_codes, :foreign_key => "used_by"
  has_many :asset_fulfillments
  has_many :referrals
  has_many :authorizations
  has_many :gifts
  has_many :progressive_goal_counters
  has_many :progressive_goal_rewards
  has_many :mailing_list_subscriptions, :conditions => { :unsubscribed_at => nil }
  has_many :mailing_lists, :through => :mailing_list_subscriptions
  has_one  :event_credit

  scope :activated, :conditions => "activated_at is not null", :order => "activated_at DESC"
  scope :not_activated, :conditions => "activated_at is null"

  # validates_promo_code      :promo_code, :if => :promo_code_required?

  validates_presence_of       :password, :if => :password_required? # , :secret_question, :secret_answer, :if => :password_required?
  validates_password          :password, :if => :password_required?
  validates_presence_of       :password_confirmation, :if => :password_required?
  validates_confirmation_of   :password, :if => :password_required?

  validates_presence_of       :screen_name, :if => :screen_name_changed?
  validates_length_of         :screen_name, :within => 3..20, :if => :screen_name_changed?
  validates_uniqueness_of     :screen_name, :allow_nil => true, :if => :screen_name_changed?
  validates_format_of         :screen_name, :with => /\A[a-zA-Z0-9]+[_]?[a-zA-Z0-9]+\z/, :message => "is invalid", :if => :screen_name_changed?
  validates_swear_free        :screen_name, :message => "contains an inappropriate word", :if => :screen_name_changed?

  validates_presence_of       :email
  validates                   :email, :email_format => { :if => :email_changed? }, :email_veracity => { :if => :email_changed? }
  validates_uniqueness_of     :email, :if => :email_changed?
  validates_presence_of       :email_confirmation, :on => :create # :if => :email_required?
  validates_confirmation_of   :email, :on => :create # :if => :email_required?

  validates_uniqueness_of     :new_email, :if => :new_email_request?
  validates                   :new_email, :email_format => { :if => :new_email_request? }, :email_veracity => { :if => :new_email_request? }
  validates_presence_of       :new_email_confirmation, :if => :new_email_request?
  validates_confirmation_of   :new_email, :if => :new_email_request?

  #validates_format_of         :date_of_birth_str, :with => /(0?[1-9]|1[012])[\/](0?[1-9]|[12][0-9]|3[01])[\/](19|20)\d\d$/, :on => :create
  #validates_age_of            :age, :atleast => 13, :message => " must be 13 or older to register", :if => :reject_under_13?
  #validates_age_of            :age, :atleast => 1, :message => "is invalid", :unless => :reject_under_13?
  validates_acceptance_of     :terms, :on => :create
  validates_presence_of       :secret_question_id, :if => :secret_question_required?
  validates_presence_of       :secret_answer, :if => :secret_answer_changed?
  validates_length_of         :secret_answer, :in => 1..255, :if => :secret_answer_changed?

  validates_uniqueness_of     :amazon_token, :allow_nil => true

  # custom validations that need multiple attributes
  validates_with UserValidator, :if => :new_email_request?

  before_validation :set_dob_str
  before_save  :encrypt_password, :encrypt_secret_answer, :set_country_code
  before_create :make_activation_code, :set_referrer_domain, :set_tos_accepted_at, :generate_temp_screen_name
  after_save :update_newsletter_subscription_status
  after_save :update_payletter_account_info
  after_update :update_iovation_devices
  after_update :update_support_user

  attr_accessor :password, :promo_code, :referral_tracking_code, :client_time, :rid,
                :old_password, :new_password, :new_password_confirmation, :date_of_birth_str,
                :skip_activation, :new_email_confirmation, :io_black_box, :allow_blank_secret, :allow_no_password

  # all the following can be mass assigned
  attr_accessible :email, :password, :receive_news, :receive_offers, :date_of_birth, :language,
                  :email_confirmation, :password_confirmation, :terms, :timezone, :client_time,
                  :secret_question_id, :secret_answer, :io_black_box, :date_of_birth_str, :screen_name,
                  :signed_up_page, :signed_up_campaign

  def connected_to_facebook?
    self.authorizations.where(:provider => 'facebook').count > 0
  end

  def update_support_user
    if SECURE_CONFIG["support_svc"]
      # we only care about some attributes for the support user
      if (self.changed & ["screen_name", "email", "account_status", "language", "deleted"]).size > 0
        update_params = {}
        update_params[:screen_name] = self.screen_name if self.screen_name_changed?
        update_params[:email] = self.email if self.email_changed?
        update_params[:account_status] = self.account_status if self.account_status_changed?
        update_params[:language] = self.language if self.language_changed?
        update_params[:deleted] = self.deleted if self.deleted_changed?

        support_user_email = self.email_changed? ? self.email_was : self.email
        Services::Support::Users.update(:email => support_user_email, :user => update_params)
      end
    end
  end

  def email_service_provider_hash
    username, domain = (/(.+?)@(.+)/).match(email)[1..2]

    hash = {}
    EMAIL_SERVICE_PROVIDERS.each do |esp, url|
      if /#{esp.downcase}/.match(domain.downcase)
        hash[:email_address] = link_to(email, url)
        hash[:email_inbox]  = link_to("> Go to #{esp}", url)
        return hash
      end
    end

    hash[:email_address] = email
    return hash
  end

  def was_referred?
    !!self.referral_id
  end

  def can_apply_referral?
    !(self.game_accounts.map{ |x| x.game_account_type.name }.any?{ |x| x =~ /Refer/ })
  end

  def web_online?
    if self.last_seen_at.nil? || (self.last_logout_at && self.last_logout_at > self.last_seen_at) || date_diff(self.last_seen_at, Time.now, 'minute') >= 30
      return false
    else
      return true
    end
  end

  def request_password_reset(email_handler: nil)
    key = self.generate_password_reset_key!
    if key
      if email_handler
        email_handler.call(:password_reset_request, self)
      else
        UserMailer.queue(:password_reset_request, self)
      end
      true
    end
  end

  def self.request_password_reset(uid, email_handler:nil)
    User.find(uid).request_password_reset(email_handler: email_handler)
  end

  def can_reset_password?(key)
    self.forgot_password_key.present? && key.present? &&
    self.forgot_password_key.strip.downcase == key.downcase &&
    self.forgot_password_key_at.present? && (Time.now.to_i - self.forgot_password_key_at.to_i <= SECURE_CONFIG["time_to_live"]["forgot_password_key"])
  end

  def reset_password(key)
    return false unless can_reset_password?(key)

    new_password="#{String.generate_random_code(5)}-#{String.generate_random_code(4, ('a'..'z').to_a)}"
    self.password = new_password
    self.password_confirmation = new_password
    self.forgot_password_key = nil

    if self.save
      UserMailer.queue(:password_reset, self, new_password)
      true
    else
      # Probably not needed but added security due to the fact that user sometimes gets saved without validations for performance
      self.password = nil
      self.password_confirmation = nil
      self.forgot_password_key = nil
      false
    end
  end

  def update_last_seen_at
    curr_date = Date.today
    prev_last_seen = self.last_seen_at
    # only update once per minute
    if self.last_seen_at.nil? || date_diff(self.last_seen_at, Time.now, 'second') > 60
      self.update_attribute(:last_seen_at, Time.now)
    end
  end

  def age
    if self.date_of_birth
      day_diff = Date.today.day - self.date_of_birth.day
      month_diff = Date.today.month - self.date_of_birth.month - (day_diff < 0 ? 1 : 0)
      Date.today.year - self.date_of_birth.year - (month_diff < 0 ? 1 : 0)
    else
      0
    end
  end

  def reject_under_13?
    REJECT_PLAYERS_UNDER_13
  end

  def decrypted_secret_answer
    aes = OpenSSL::Cipher::Cipher.new("aes-128-cbc").decrypt
    aes.key = SECURE_CONFIG["aes_encrypt"]["secret_key"]
    (aes.update(self.secret_answer.to_a.pack("H*")) << aes.final).strip
  end

  def secret_answer_matched?(secret_answer)
    if (secret_answer.to_s.downcase == self.decrypted_secret_answer.to_s.downcase) || (User.encrypt_secret_answer(secret_answer.to_s) == self.secret_answer)
      return true
    else
      return false
    end
  end

  def self.update_iovation!(id, ip, blackbox, io_type)
    user = User.find(id)
    user.update_iovation!(ip, blackbox, io_type) if user
  end

  def update_iovation!(ip, blackbox, io_type)
    begin
      io_check = Iovation::CheckTransaction.new(self.id, self.email, ip, blackbox, { :io_type => io_type })
      io_response = io_check.io_response
      self.io_result          = io_response[:io_result]
      self.io_device_alias    = io_response[:io_device_alias]
      self.io_tracking_number = io_response[:io_tracking_number]
      self.io_auth_required   = UserDevice.requires_authorization?(self)

      return false unless self.io_device_alias # we don't want to save a device without an alias

      if io_response[:io_reason].is_a? Array and io_response[:io_reason].length >= 1
        # if io_reason is array, then
        #   1. select any reason that contains "(@denyAction)"
        #   2. if there is'nt, select first reason
        #   3. store it into user.io_reasion
        io_reasons_with_deny_action = io_response[:io_reason].select { |r| r.include?("(@denyAction)") }
        if io_reasons_with_deny_action.any?
          self.io_reason = io_reasons_with_deny_action[0]
        else
          self.io_reason = io_response[:io_reason][0]
        end
      else
        self.io_reason = ""
      end

      self.save(:validate => false)
    rescue SOAP::FaultError => fe
      # Skip the iovation check if there's a SOAP error
    end
  end

  def iovation_denied?
    self.io_result == "D"
  end

  def iovation_review?
    self.io_result.blank? || self.io_result == "R"
  end

  def iovation_denied_by_deny_action?
    # if a user is really bad guy, then reject him
    # User.io_reason can be Array or String. Handle both cases.
    # in general, user.io_reason is String but just in case, we also handle the case of Array.
    if (self.io_reason.kind_of?(Array) && self.io_reason.select { |r| r.include?("(@denyAction)") }.any?) ||
       (self.io_reason.kind_of?(String) && self.io_reason.include?("(@denyAction)"))
      return true
    else
      return false
    end
  end

  def self.alternate_names(name)
    avail_chars = 20 - name.length
    return [] if avail_chars <= 0

    number_cap = [avail_chars, 3].min
    number_cap = (10 ** number_cap) - 1

    numbers = (0...9).collect { |n| rand(number_cap)}.uniq
    names = numbers.collect { |n| "#{name}#{n}" }
    existing = User.find(:all, :select => "screen_name", :conditions => { :screen_name => names })
    existing.collect! { |n| n.downcase }
    names.delete_if { |n| existing.include?(n.downcase) }
    names[0,3]
  rescue
    []
  end

  def password_change_field_valid?(field_name, field_val)
    case field_name
    when "old_password"
      self.authenticated?(field_val)
    when "new_password"

    else
      false
    end
  end

  def email_change_field_valid?(field_val)
    valid, msg = true, ""

    errs = User.validate_field("email", field_val)
    valid = (errs.size == 0)
    msg = "Email #{errs.to_sentence}."
    if valid && field_val != self.new_email
      self.new_email = field_val
      self.valid?
      errs = self.errors[:new_email]
      valid = (errs.size == 0)
      msg = "New Email #{errs.to_sentence}."
    end
    return valid, msg
  end

  def self.generate_engarde_ticket(user_id, io_device_alias)
    ticket = String.generate_random_code(5)
    if Rails.cache.write(self.engarde_ticket_cache_key(user_id, io_device_alias), ticket, :expires_in => 60.minutes)
      ticket
    else
      nil
    end
  end

  def generate_engarde_ticket
    self.class.generate_engarde_ticket(self.id, self.io_device_alias)
  end

  def self.read_engarde_ticket(user_id, io_device_alias)
    Rails.cache.read(self.engarde_ticket_cache_key(user_id, io_device_alias))
  end

  def read_engarde_ticket
    Rails.cache.read(self.engarde_ticket_cache_key)
  end

  def self.consume_engarde_ticket!(user_id, io_device_alias, ticket, remember)
    engarde_ticket_cache_key = self.engarde_ticket_cache_key(user_id, io_device_alias)
    stored_ticket = Rails.cache.read(engarde_ticket_cache_key)
    user = User.find(user_id)
    if stored_ticket.present?
      if stored_ticket.downcase == ticket.to_s.downcase
        Rails.cache.delete(engarde_ticket_cache_key)
        user.update_attribute(:io_auth_required, false)
        device = user.user_devices.find_by_io_device_alias(io_device_alias)
        if device.present? && remember.to_s == "true"
          device.update_attribute(:authorization_required, false)
        end
        true
      else
        false
      end
    else
      false
    end
  end

  def consume_engarde_ticket!(ticket, remember)
    self.class.consume_engarde_ticket!(self.id, self.io_device_alias, ticket, remember)
  end

  def self.engarde_ticket_cache_key(user_id, io_device_alias)
    "engarde_ticket_#{user_id}-#{io_device_alias}"
  end

  def engarde_ticket_cache_key
    self.class.engarde_ticket_cache_key(self.id, self.io_device_alias)
  end

  def update_engarde_preferences!(enabled, deauthorize=false, curr_device_alias=nil)
    self.engarde_enabled = enabled
    self.save!
    if self.engarde_enabled && deauthorize
      if curr_device_alias.nil?
        curr_device_alias = self.io_device_alias
      end
      UserDevice.deauthorize_for_user!(self.id, curr_device_alias)
    end
    true
  rescue Exception => ex
   false
  end

  # Returns an email address exposing only the first letter in each segment for the sake
  # of Amazon email display.
  #
  # robin.liao@sleepygiant.com -> r****.l***@s********.c**
  def obfuscated_email
    self.email.gsub(/(\w(\w+))/){ |s| "#{ $1[0,1] }#{ "*" * $2.length }" }
  end

  def email_activation(email_handler: nil)
    if !self.skip_activation && self.activation_code #tera
      if email_handler
        email_handler.call(:signup_notification, self)
      else
        UserMailer.queue(:signup_notification, self)
      end
    end
  end

  def self.email_activation(user_id, email_handler: nil)
    u = User.find_by_id(user_id)
    u.email_activation(email_handler: email_handler) if u
  end

  def self.email_authorization_code(user_id)
    u = User.find_by_id(user_id)
    if u && u.authorization_code
      UserMailer.queue(:email_authorization_code, u)
    end
  end

  def call_iovation_create_acct
    return if self.skip_activation == true # don't do this when we migrate accounts
    io_check = Iovation::AccountCreateJob.new(self.id, self.io_black_box)

    begin
      io_check.perform
    rescue => e
      Rails.logger.error e.message + "\n " + Utils::clean_trace(e.backtrace).join("\n ")
      # send to delayed job with high priority
      Delayed::Job.enqueue io_check, 9
    end
  end

  # Amazon related stuff
  def link_to_amazon! request_token, kind
    unless self.amazon_token.present?
      update_attribute(:amazon_token, generate_amazon_token)
    end

    update_attribute(:amazon_request_token, request_token)
    update_attribute(:amazon_request_kind, kind)
    publish_link_account
  end

  #
  # Game connect v2
  #
  def set_amazon_token
    unless self.amazon_token.present?
      self.amazon_token = generate_amazon_token_v2
    end

    self.amazon_request_token = ""
    self.amazon_request_kind = "AMAZON_INSTANT_ACCESS"
    self.save!
  end

  def generate_amazon_token_v2
    Digest::SHA1.hexdigest(self.id.to_s + self.email)
  end
  #
  # Game connect v2 (end)
  #

  def generate_amazon_token
    Digest::SHA1.hexdigest(self.id.to_s + self.email + self.amazon_request_token.to_s)
  end

  def amazon_delivery_address
    return false unless self.amazon_token.present?

    { "Address" => Amazon.delivery_url(self.amazon_token),
      "AddressDescription" => self.obfuscated_email }
  end

  def amazon_link_account_json
    { "Type" => "LinkAccount",
      "Kind" => self.amazon_request_kind,
      "RequestToken" => self.amazon_request_token,
      "AccountToken" => self.amazon_token,
      "Addresses" => [ amazon_delivery_address ] }.to_json
  end

  def publish_link_account
    @sns = Amazon::Notification.new
    @sns.topic.publish self.amazon_link_account_json
  end

  def able_to_refer?
    self.game_accounts.present? &&
      self.game_accounts.map{ |gacct| gacct.game_account_type.name }.any?{ |gacct_type| !(gacct_type =~ /trial|refer/i) } &&
      self.game_accounts.any?{ |gacct| gacct.subscription.present? && gacct.subscription.has_game_time_remaining? } &&
      self.activated_at.present?
  end

  def can_refer?
    Referral.past_month_for_user(self.id).count < 5
  end

  def all_characters
    self.game_accounts.map{ |game_account| game_account.characters }.flatten
  end

  def subscriptions
    Subscription.find_all_for_master_account_id(self.id)
  end

  def subscription_active?(game_account_id=nil)
    if game_account_id.nil?
      subscriptions.each do |subscription|
        return true if subscription.active?
      end
      false
    else
      subscription = Subscription.find_by_game_account_id(game_account_id)
      return true if subscription.present? and subscription.active?
      false
    end
  end

  def game_account_founder?
    game_accounts.each do |game_account|
      return true if game_account.founder?
    end
    false
  end

  def get_emp_wallet_balance
    self.class.get_emp_wallet_balance(self.id)
  end

  def self.get_emp_wallet_balance(user_id)
    # get new wallet balance and keep it in the cache
    client = Payletter::Client.new
    begin
      wallet = client.get_wallet user_id
      if wallet.present?
        wallet_balance = wallet.amount
      else
        wallet_balance = 0
      end
    rescue Payletter::Client::PayletterError => e
      wallet_balance = 0
    end
    wallet_balance
  end


  def signed_up_game_name
    # signed_up_page can have following strings
    #   1. ""
    #   2. "<game name>"
    #   3. "<game name> launcher"
    #   4. "<game name> steam launcher"
    if self.signed_up_page.present?
      return self.signed_up_page.to_s.split[0].to_s.downcase
    else
      return ''
    end
  end

  protected

    def update_payletter_account_info
      if (self.activation_code_changed?() && self.activated?()) || (self.activated?() && self.email_changed?())
        client = Payletter::Client.new
        begin
          client.create_account(self.id, self.email)
        rescue Payletter::Client::PayletterError => e
          # write error message and skip
          logger.error e.to_s + "\n " + e.backtrace.join("\n ")
        end
      end
    end

    def update_newsletter_subscription_status
      if self.new_record? or self.receive_news_changed?
        Mailer::Subscription.update(self.id, self.email, self.receive_news)
      end
    end

    def encrypt_password
      return if password.blank?
      self.salt = Digest::SHA1.hexdigest("--#{Time.now.to_s}--#{email}--") if new_record?
      self.crypted_password = encrypt(password)
      self.forgot_password_key = nil
      self.forgot_password_key_at = nil
    end

    def password_required?
      # we do not require a password if the user has authorizations or the temporary allow_no_password attribute is set
      unless self.allow_no_password || self.authorizations.count > 0
        crypted_password.blank? || !password.blank?
      end
    end

    def email_required?
      created_at.nil? # email.blank?
    end

    def new_email_request?
      self.new_email_changed? && !self.new_email.nil?
    end

    def set_country_code
      if self.registration_ip.present? && self.registration_ip_changed?
        self.country_code	= GeoIp.get_country_code(self.registration_ip)
        self.reg_ip_as_int = GeoIp.get_ip_num(self.registration_ip)
        self.timezone = DEFAULT_GEO_TIMEZONE # we're not asking for this, so we set to default
      end
    end

    # used to track where the user came to the site from
    def set_referrer_domain
      if self.referrer.present?
        self.referrer_domain = URI.parse(self.referrer).host rescue nil
      end
    end

    def self.human_attribute_name(attribute_key_name, options={})
      case attribute_key_name
      when :"" then ""
      when "io_black_box" then "Device Signature"
      when "screen_name" then "Nickname"
      when "date_of_birth_str" then "Date of Birth"
      else
        super
      end
    end

    def update_iovation_devices
      if self.io_device_alias_changed?
        params = {
          :io_device_alias => self.io_device_alias,
          :io_tracking_number => self.io_tracking_number,
          :io_result => self.io_result,
          :io_reason => self.io_reason
        }

        # no current device, create new and set it to master device
        if self.io_device_alias_was.nil?
          begin
            self.user_devices.create!(params.merge(:master_device => true, :authorization_required => false))
          rescue ActiveRecord::RecordInvalid => e
            #
            # Sometimes, io_device_alias could be nil although the user already had a master device.
            #
            # In the previous login attempt, if Iovation responded an nil io_device_alias for some reason and the nil io_device_alias was recorded,
            # "ActiveRecord::RecordInvalid (Validation failed: Io device alias has already been taken)" could be raised in the next login.
            #
            device = self.user_devices.find_or_initialize_by_user_id_and_io_device_alias(self.id, self.io_device_alias)
            device.attributes = params
            device.save!
          end
        else
          device = self.user_devices.find_or_initialize_by_user_id_and_io_device_alias(self.id, self.io_device_alias)
          device.attributes = params
          device.save!
        end
      end
    end

    def set_tos_accepted_at
      self.tos_accepted_at = Time.now.utc
    end

    def encrypt_secret_answer
      if self.secret_answer_changed? && self.secret_answer.present?
        self.secret_answer = self.class.encrypt_secret_answer(self.secret_answer)
      end
    end

    def self.encrypt_secret_answer(answer)
      aes = OpenSSL::Cipher::Cipher.new("aes-128-cbc").encrypt
      aes.key = SECURE_CONFIG["aes_encrypt"]["secret_key"]
      (aes.update(answer) << aes.final).unpack("H*").join
    end

    def generate_temp_screen_name
      return if self.screen_name.present?
      temp = String.generate_random_code(10)
      raise if User.exists?(:screen_name => temp)
      self.screen_name = temp
      self.temp_screen_name = true
    rescue
      retry
    end

    def secret_question_required?
      return false if self.allow_blank_secret == true
      true if new_record? || self.secret_question_id_changed? || self.legacy_account?
    end

    def set_dob_str
      str = self.date_of_birth.strftime("%m/%d/%Y")
    rescue
      str = ""
      self.date_of_birth = nil
    ensure
      self.date_of_birth_str = str
    end

end
