# == Schema Information
#
# Table name: games
#
#  id                     :integer          not null, primary key
#  name                   :string(128)
#  service_url            :string(255)
#  deleted                :boolean          default(FALSE)
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  download_url           :string(255)
#  sls_url                :string(255)
#  exe_path               :string(255)
#  box_url                :string(255)
#  box_vendor_id          :string(255)
#  box_receiver_sn        :string(80)
#  fcgi_url               :string(255)
#  accounts_created       :integer          default(0)
#  require_auth_ip_check  :boolean          default(FALSE)
#  requires_payment_setup :boolean          default(FALSE)
#  transfer_cooldown      :integer          default(7)
#  transfer_restricted    :boolean          default(TRUE)
#  redemption_codes       :text
#  new_macct_cmpn_id      :integer          default(-1), not null
#  ext_macct_cmpn_id      :integer          default(-1), not null
#  redirect_url           :string(255)      default(""), not null
#  seo_id                 :string(255)
#  state                  :integer          default(0)
#  game_tools_url         :string(255)
#  thumbnail_url          :string(255)
#

class Game < ActiveRecord::Base
  has_one :game_image
  has_many :game_settings
  has_many :game_account_types
  has_many :beta_access_windows

  STATES = ["beta", "live", "sunset"].freeze
  def self.get_state(key)
    STATES.index(key)
  end

  scope :active, :conditions => { :state => Game.get_state('live') }
  scope :inlauncher, :conditions => ["state <> ?", Game.get_state('sunset')]

  attr_accessible :name, :service_url, :deleted, :download_url, :sls_url, :exe_path, :box_url, :box_vendor_id, :box_receiver_sn, :fcgi_url, :accounts_created, :require_auth_ip_check, :requires_payment_setup, :transfer_cooldown, :transfer_restricted, :redemption_codes, :new_macct_cmpn_id, :ext_macct_cmpn_id, :redirect_url, :game_tools_url
  before_validation :set_seo_id

  def set_seo_id
    self.seo_id = self.name.parameterize
  end

  def state_name
    STATES[self.state]
  end

  def is_single_account_per_game
    flag = setting('single_account_per_user')
    return false unless flag.present?
    return true if flag.to_s.downcase == 'true'
    return false
  end

  def can_create_new_game_account(user)
    flag = is_single_account_per_game
    return true unless flag
    count = user.game_accounts.where(:game_id => id).count
    return !(count > 0)
  end

  def setting(key)
    key = key.to_s
    set_data = game_settings.where(:key => key).first
    if set_data
      return set_data.value
    end
    val = nil
    case key
    when "box_url"
      val = box_url
    when "box_vendor_id"
      val = box_vendor_id
    when "box_receiver_sn"
      val = box_receiver_sn
    when "fcgi_url"
      val = fcgi_url
    when "service_url"
      val = service_url
    when "sls_url"
      val = sls_url
    when "transfer_cooldown"
      val = transfer_cooldown.to_s
    else
      Rails.logger.error "SETTING NOT FOUND: [#{key}] - Game ID: #{id}"
      return nil
    end
    # create settings there were looked for and found on game object
    Rails.logger.warn "CREATING GAME SETTING [#{key}] = #{val} - Game ID: #{id}"
    GameSetting.create(:game_id => id, :key => key, :value => val)
    return val
  end
  alias_method :settings, :setting

end
