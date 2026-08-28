# == Schema Information
#
# Table name: suspensions
#
#  id              :integer          not null, primary key
#  moderator_id    :integer
#  user_id         :integer
#  offense_id      :integer
#  suspension_term :integer          default(0)
#  note            :text
#  message         :text
#  url             :string(255)
#  suspension_type :string(255)
#  expires_at      :datetime
#  lifted          :boolean          default(FALSE)
#  admin_id        :integer
#  lifted_at       :datetime
#  lifted_by       :string(255)
#  suspension_unit :string(255)
#  created_at      :datetime
#  updated_at      :datetime
#  game_account_id :integer
#  starts_at       :datetime
#

class Suspension < ActiveRecord::Base
  include ActionView::Helpers::DateHelper
  include ActionView::Helpers::TextHelper
  
  belongs_to :user
  belongs_to :moderator, :class_name => "User", :foreign_key => "moderator_id"
  belongs_to :offense

  scope :active, :conditions => "lifted = 0", :limit => 1
  scope :lifted, :conditions => "lifted = 1", :order => "created_at DESC"
  scope :expired, :conditions => "lifted = 0 AND expires_at IS NOT NULL AND expires_at <= UTC_TIMESTAMP()"

  FORUM_SUSPENSION_MSG = "This account is currently suspended from forum activity. During this period, you will not be able to post in the forums. This account will reactivate on %s."
  GAME_SUSPENSION_MSG = "This account is currently suspended and may not be used to log into the games at this time. This suspension will be lifted on %s."
  SITE_SUSPENSION_MSG = "This account is currently suspended and may not be used to log into the website or games at this time. This suspension will be lifted on %s."
  PERMANENT_SUSPENSION_MSG = "This account has been banned or deactivated."
  WARN_SUSPENSION_MSG = "This account has not yet been suspended, but a record of this offense has been saved and repeated occurrances will result in a suspension or permanent ban."
  
  SUSPENSION_TYPE = { 
    :PERMANENT  => ["Permanent Ban", User.account_status_for(:permanent_ban),PERMANENT_SUSPENSION_MSG],
    :GAME       => ["Suspend From Games", User.account_status_for(:suspended_game),GAME_SUSPENSION_MSG],
    :SITE       => ["Full Suspension (Web & Games)", User.account_status_for(:suspended_site),SITE_SUSPENSION_MSG],
    :FORUM      => ["Suspend From Forums", User.account_status_for(:suspended_forums),FORUM_SUSPENSION_MSG],
    :WARN       => ["Warn", User.account_status_for(:ok),WARN_SUSPENSION_MSG]
  }

  attr_accessible :moderator_id, :user_id, :offense_id, :suspension_term, :note, :message, :url, :suspension_type, :expires_at, :lifted, :admin_id, :lifted_at, :lifted_by, :suspension_unit, :game_account_id, :starts_at

  def expiration
    self.expires_at ? self.expires_at.strftime("%a, %d %b %Y %H:%M:%S %Z") : "n/a"
  end

  def time_to_expiration
    (self.expires_at.nil? || Time.now.utc > self.expires_at) ? 0 : distance_of_time_in_words(Time.now.utc, self.expires_at, true)
  end

  def suspension_term_str
    if self.suspension_term.nil?
      "permanent" 
    else 
      "#{self.expiration} (#{pluralize(self.suspension_term, self.suspension_unit || "day")})"
    end
  end
  
  def mailer_message
    stype = self.suspension_type.to_s.upcase.to_sym
    case stype
    when :PERMANENT then SUSPENSION_TYPE[stype][2] % SUPPORT_EMAIL_ADDRESS
    when :WARN then SUSPENSION_TYPE[stype][2]
    when :GAME, :SITE, :FORUM
      SUSPENSION_TYPE[stype][2] % self.suspension_term_str
    end
  end

end

