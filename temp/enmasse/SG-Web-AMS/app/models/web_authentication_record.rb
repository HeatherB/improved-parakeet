# == Schema Information
#
# Table name: web_authentication_records
#
#  id           :integer          not null, primary key
#  user_id      :integer
#  ip_address   :string(40)
#  country_code :string(2)
#  success      :boolean
#  error_code   :integer
#  created_at   :datetime
#  updated_at   :datetime
#  in_launcher  :boolean
#  in_steam     :boolean
#  game_name    :string(128)
#

class WebAuthenticationRecord < LogAR
  belongs_to :user

  validates_presence_of :ip_address
  before_create :add_country_code
  after_create :update_user_table
  
  attr_accessible :user_id, :ip_address, :country_code, :success, :error_code, :in_launcher, :in_steam, :game_name
  
  protected
  
  def update_user_table
    # exit if this log entry can't be associated to a user
    return if self.user_id.to_i == 0 

    # don't update counters if the reason for failure is that the acct hasn't been activated 
    # (it's not really a failed login)
    return if self.error_code == User.auth_error_code_for(:not_activated) 
    
    u = User.find(self.user_id)

    if self.success?
      u.last_login_at = self.created_at
      u.failed_login_attempts = 0
      u.save(:validate => false)
    else
      u.failed_login_attempts += 1
      u.save(:validate => false)
    end
  end
  
  def add_country_code
    self.country_code ||= GeoIp.get_country_code(self.ip_address) 
  end
end
