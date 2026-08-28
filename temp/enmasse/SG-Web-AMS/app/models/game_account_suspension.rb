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

class GameAccountSuspension < Suspension
  self.table_name = "suspensions"
  belongs_to :game_account
  
  default_scope :conditions => "game_account_id IS NOT NULL"

  attr_accessible :moderator_id, :user_id, :offense_id, :suspension_term, :note, :message, :url, :suspension_type, :expires_at, :lifted, :admin_id, :lifted_at, :lifted_by, :suspension_unit, :game_account_id, :starts_at

  GAME_SUSPENSION_MSG = "This account is currently suspended and may not be used to log into the game at this time. This suspension will be lifted on %s."
  PERMANENT_SUSPENSION_MSG = "This account has been banned or deactivated."
  CHAT_BAN_SUSPENSION_MSG = "This account is currently restricted from chatting in game. Chatting privileges will be reinstated %s."
  WARN_SUSPENSION_MSG = "This account has not yet been suspended, but a record of this offense has been saved and repeated occurrances will result in a suspension or permanent ban."

  SUSPENSION_TYPE = { 
    :PERMANENT  => ["Permanent Ban", GameAccount.account_status_for(:permanent_ban), PERMANENT_SUSPENSION_MSG],
    :GAME       => ["Suspend From Game", GameAccount.account_status_for(:suspended_game), GAME_SUSPENSION_MSG],
    :CHAT_BAN   => ["Chat Ban", GameAccount.account_status_for(:chat_ban), CHAT_BAN_SUSPENSION_MSG],
    :WARN       => ["Warn", GameAccount.account_status_for(:ok), WARN_SUSPENSION_MSG],
    :KICK       => ["Kick", GameAccount.account_status_for(:ok), WARN_SUSPENSION_MSG]
  }

  def mailer_message
    stype = self.suspension_type.to_s.upcase.to_sym
    case stype
    when :PERMANENT then SUSPENSION_TYPE[stype][2] % SUPPORT_EMAIL_ADDRESS
    when :WARN then SUSPENSION_TYPE[stype][2]
    when :CHAT_BAN
      if self.starts_at.nil?
        str = "#{pluralize(self.suspension_term, self.suspension_unit || "day")} after you next login to the game"
      else
        str = "on #{self.suspension_term_str}"
      end
      SUSPENSION_TYPE[stype][2] % str
    when :GAME
      SUSPENSION_TYPE[stype][2] % self.suspension_term_str
    end
  end
      
end
