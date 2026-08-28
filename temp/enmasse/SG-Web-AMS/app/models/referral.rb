# == Schema Information
#
# Table name: referrals
#
#  id                     :integer          not null, primary key
#  user_id                :integer
#  game_account_id        :integer
#  server                 :string(255)
#  character_name         :string(255)
#  message                :text
#  email                  :string(255)
#  sender                 :string(255)
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  target_user_id         :integer
#  server_id              :integer
#  char_srl               :integer
#  status                 :string(255)
#  invited_at             :datetime
#  pending_at             :datetime
#  active_at              :datetime
#  settled_at             :datetime
#  target_game_account_id :integer
#  active                 :boolean          default(TRUE), not null
#  resent_at              :datetime
#

class Referral < ActiveRecord::Base
  belongs_to :user
  belongs_to :game_account

  has_many :referral_reward_logs

  validates_presence_of :email
  validates_length_of :email, :in => 3..255
  validates_format_of :email, :with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i, :on => :create
  validates_presence_of :server
  validates_presence_of :character_name
  validates_presence_of :user_id
  validates_presence_of :game_account_id
  validates_presence_of :server_id
  validates_presence_of :char_srl
  validates_presence_of :sender

  after_create :queue_email
  after_create :invited!

  scope :past_month_for_user, lambda { |user_id| { :conditions =>  [ "user_id = ? AND created_at >= ? AND active = ?", user_id, 30.days.ago, 1 ] }}


  attr_accessible :user_id, :game_account_id, :server, :character_name, :message, :email, :sender, :target_user_id, :server_id, :char_srl, :status, :invited_at, :pending_at, :active_at, :settled_at, :target_game_account_id, :active, :resent_at

  STATUSES = %w( invited pending active settled )


  def self.user_can_invite? user
    !(past_month_for_user(user.id).count >= 5)
  end

  # Stolen id obfuscation from users so we can hide the rate at which
  # the referral system is used

  def obfuscated_id
    return 'null' if new_record?
    self.class.obfuscated_id(self.id)
  end

  def unobfuscated_id
    self.class.unobfuscated_id(self.id)
  end

  def self.obfuscated_id(i)
    seeded_id = i + 1234567
    Base64.encode64(seeded_id.to_s).strip.gsub("=", "_")
  end

  def self.unobfuscated_id(param)
    val = Base64.decode64(param.to_s.gsub("_", "=")).to_i - 1234567
    [0, val].max
  rescue
    0
  end

  def queue_email
    GameAccountMailer.queue :referral, self.id
  end

  def invited!
    self.update_attribute(:status, 'invited')
    self.update_attribute(:invited_at, Time.now)
  end

  def pending!
    self.update_attribute(:status, 'pending')
    self.update_attribute(:pending_at, Time.now)
  end

  def active!
    self.update_attribute(:status, 'active')
    self.update_attribute(:active_at, Time.now)

    Referral.send_later(:create_referral_game_account, self.id)
  end

  def settled!
    self.update_attribute(:status, 'settled')
    self.update_attribute(:settled_at, Time.now)
  end

  def self.create_referral_game_account(id)
    referral = Referral.find_by_id(id)
    referral.create_referral_game_account
  end

  def create_referral_game_account
    logs = TraceLogger.new

    raise ReferralNotAccepted if self.target_user_id.blank?
    target_user = User.find(self.target_user_id)

    # Only allow users with no accounts other than trials to even create referral accounts
    raise ReferralNotApplicable if target_user.game_accounts.map{ |g| g.game_account_type.name }.any?{ |g| g.downcase! != 'trial' }

    codes = self.game_account.game.redemption_codes
    raise ReferralRedemptionCodesNotFound if codes.blank?
    gacct_code = JSON.parse(codes)['referral_account']

    promo_code = PromoCode.use_code(target_user, gacct_code, {}, true)
  rescue ReferralException => e
    logs << e.message
    puts logs.json_logs
  end

  def self.update_set_last_connected(id)
    referral = Referral.find(id)
    target_game_account = GameAccount.find(referral.target_game_account_id)

    adapter = GameAdapter.new(Game.find(target_game_account.game_id).settings(:service_url))
    JSON.parse adapter.make_request(:set_last_connected, { :user_id => target_game_account.user_id, :game_account_id => target_game_account.id, :server_id => referral.server_id })
  end

  def self.apply_reward(id, reward)
    referral = Referral.find(id)
    referral.apply_reward(reward)
  end

  def apply_reward(reward)
    logs = TraceLogger.new

    logs << "Got request to apply [#{reward}] reward"
    logs << "The reward is from referral ID #{self.id}"

    log_obj = ReferralRewardLog.new(:referral_id => self.id, :reward_rank => reward)
    codes = self.game_account.game.redemption_codes
    raise ReferralRedemptionCodesNotFound if codes.blank?
    code = JSON.parse(codes)[reward]

    logs << "About to apply group code: #{code}"

    referral = User.find(self.target_user_id)

    referrer_promo_code = PromoCode.use_code(self.user, code, { :pref_account => self.game_account_id }, true)
    logs << "Code applied to the referrer, with unique code: #{referrer_promo_code.promo_code}"

    referral_promo_code = PromoCode.use_code(referral, code, { :pref_account => self.target_game_account_id }, true)
    logs << "Code applied to the referral, with unique code: #{referral_promo_code.promo_code}"

    return log_obj
  rescue ReferralException => e
    logs << e.message
  ensure
    log_obj.trace_json = logs.json_logs
    log_obj.save
  end

  def subscription_rewarded?
    rewards = ReferralRewardLog.find_all_by_referral_id(self.id)
    rewards.map!{ |r| r.reward_rank }.any?{ |r| r == 'referral_subscribed' }
  end

  def can_resend?
    # If the resent_at time isn't even there, you can resend
    return true unless self.resent_at

    resent_day = self.resent_at.to_date
    Time.now.to_date > resent_day
  end

  def resend!
    self.update_attribute(:resent_at, Time.now)
    self.queue_email
  end

  # Exception Classes

  class ReferralException < StandardError; end

  class ReferralNotAccepted < ReferralException
    def message
      "referral not yet accepted"
    end
  end

  class ReferralNotApplicable < ReferralException
    def message
      "target user already has game accounts other than trials"
    end
  end

  class ReferralRedemptionCodesNotFound < ReferralException
    def message
      "there are no redemption codes for this game setup"
    end
  end

  class NoCharactersForAccount < ReferralException
    def message
      "referral game account has no characters"
    end
  end
end
