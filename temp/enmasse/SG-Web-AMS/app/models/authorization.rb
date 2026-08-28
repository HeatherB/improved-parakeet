# == Schema Information
#
# Table name: authorizations
#
#  id         :integer          not null, primary key
#  user_id    :integer          not null
#  provider   :string(255)      not null
#  uid        :string(255)      not null
#  token      :string(255)
#  expires_at :datetime
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Authorization < ActiveRecord::Base
  attr_accessible :user_id, :provider, :uid, :token, :expires_at

  belongs_to :user
  validates_presence_of :user_id, :uid, :provider, :token
  validates_uniqueness_of :uid, :scope => :provider

  after_destroy :cleanup

  def cleanup
    # Revoke login for the Facebook app if we still have a valid token
    if self.provider == "facebook"
      if Time.now < self.expires_at
        uri = URI.join("https://graph.facebook.com", "/v2.6/#{self.uid}/", "permissions")
        uri.query = URI.encode_www_form("access_token" => self.token)
        result = Faraday.delete(uri.to_s)
      end
    end
  end

  def self.find_from_hash(hash)
    find_by_provider_and_uid(hash['provider'], hash['uid'])
  end

  def self.create_from_hash(hash, cookies: nil, game: nil, user: nil, auto_subscribe_newsletters: true, newsletter_ids: nil, io_black_box: nil, original_referrer: nil, in_launcher: nil, in_steam: nil, signed_up_campaign: {})
    # check for an existing user
    user ||= User.find_by_email(hash['info']['email'])
    if user.nil?
      new_user = true

      if in_launcher.to_s == 'true'
        if in_steam.to_s == 'true'
          signed_up_page = "#{game.upcase} Steam Launcher"
        else
          signed_up_page = "#{game.upcase} Launcher"
        end
      else
        signed_up_page = game
      end

      user = User.create_user_phase1(
        :email              => hash['info']['email'],
        :date_of_birth      => (hash['extra']['raw_info'] && hash['extra']['raw_info']['birthday']) ? Date.strptime(hash['extra']['raw_info']['birthday'], '%m/%d/%Y') : nil,
        :terms              => '1',
        :signed_up_page     => signed_up_page,
        :signed_up_campaign => signed_up_campaign,
        :io_black_box       => io_black_box,
        :referrer           => original_referrer,
        :registration_ip    => hash['extra']['ip_address']
      )

      User.create_user_phase2(
        user,
        :cookies                       => cookies,
        :auto_subscribing_mailing_list => auto_subscribe_newsletters,
        :mailing_list_ids              => newsletter_ids,
        :referral_id                   => nil,
        :send_activation_email         => false
      )

      # User.create_user_phase3 will be called UserController.submit_additional_requirements (i.e. additional_requirements_users_path)
    else
      new_user = false
    end

    raise "Cannot create an authorization without an user" unless user
    raise "Cannot create an authorization without credentials" unless hash['credentials']

    # use extended token if available
    if hash['extension'] && hash['extension']['token']
      token = hash['extension']['token']
    else
      token = hash['credentials']['token']
    end

    expiry = hash['credentials']['expires_at']
    expires_at = Time.now + expiry.to_i if expiry

    authorization = Authorization.create!(:user_id => user.id, :uid => hash['uid'], :provider => hash['provider'], :token => token, :expires_at => expires_at)
    return authorization, new_user
  end

  def extend_token!(original_token=nil)
    original_token ||= self.token

    if self.provider == 'facebook'
      uri = URI.join("https://graph.facebook.com", "/v2.6/oauth/", "access_token")
      uri.query = URI.encode_www_form(
        "client_id" => SECURE_CONFIG['facebook']['id'],
        "client_secret" => SECURE_CONFIG['facebook']['secret'],
        "grant_type" => "fb_exchange_token",
        "fb_exchange_token" => original_token
        )
      response = Faraday.get(uri.to_s)

      if response.status == 200
        result = /access_token=(.+)&expires=(.+)/.match(response.body)
        if result.nil?
          # response is in JSON format
          result = JSON.load response.body
          self.token = result['access_token']
          expiry = result['expires_in']
        else
          self.token = result[1]
          expiry = result[2]
        end
        self.expires_at = Time.now + expiry.to_i if expiry
        self.save!
      end
    end
  end

  def encrypted_token
    return nil unless self.token
    aes = OpenSSL::Cipher::Cipher.new("aes-128-cbc").encrypt
    aes.key = SECURE_CONFIG["aes_encrypt"]["secret_key"]
    (aes.update(self.token) << aes.final).unpack("H*").join
  end

  def self.decrypted_token(encrypted_token)
    return nil unless encrypted_token
    aes = OpenSSL::Cipher::Cipher.new("aes-128-cbc").decrypt
    aes.key = SECURE_CONFIG["aes_encrypt"]["secret_key"]
    (aes.update(encrypted_token.to_a.pack("H*")) << aes.final).strip
  end

end
