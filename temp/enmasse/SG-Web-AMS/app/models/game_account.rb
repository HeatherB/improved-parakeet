# == Schema Information
#
# Table name: game_accounts
#
#  id                            :integer          not null, primary key
#  user_id                       :integer
#  game_id                       :integer
#  game_account_type_id          :integer
#  account_name                  :string(32)
#  deleted                       :boolean          default(FALSE)
#  created_at                    :datetime         not null
#  updated_at                    :datetime         not null
#  subscription_ends_at          :datetime
#  access_level                  :integer          default(1)
#  account_status                :integer          default(0)
#  previous_game_account_type_id :integer
#  creation_path                 :string(255)
#

class GameAccount < ActiveRecord::Base
  include Extensions::GameAccountEx

  belongs_to :user
  belongs_to :game
  belongs_to :game_account_type

  has_many :character_transfers
  has_many :chrono_scroll_redemptions
  has_one :vip_exp
  has_many :vip_prize_fulfillments
  has_many :vip_token_logs
  has_one :kritika_game_account_ex
  has_many :kritika_game_account_ex_logs

  before_create :set_default_name

  before_save :save_previous_game_account_type_id
  after_save :set_paid_state, :if => :game_account_type_id_changed?
  after_save :update_payletter_account_info

  validates_presence_of :account_name, :if => :account_name_changed?
  validates_length_of :account_name, :maximum => 24, :if => :account_name_changed?
  validates_uniqueness_of :account_name, :scope => :user_id, :if => :account_name_changed?

  scope :active, :conditions => {:deleted => false}
  scope :for_game, lambda {|game_id| {:conditions => {:game_id => game_id}}}

  attr_accessible :user_id, :game_id, :game_account_type_id, :account_name, :deleted, :subscription_ends_at, :access_level, :account_status, :previous_game_account_type_id, :creation_path

  CHARACTER_FILTERED_FIELDS = %w( created_at updated_at int_created_at game_account_id )

  def founder?
    game_account_type = GameAccountType.nolock.find(game_account_type_id)
    game_account_type.name.downcase.match(/founder/).present?
  end

  def characters
    case self.game.name.upcase
      when 'TERA'
        characters = (admin_info['characters'] rescue []) || []
        characters.map! do |character|
          CHARACTER_FILTERED_FIELDS.each {|field| character.delete(field)}
          character
        end
      when 'ZMR'
        game_account_id = self.id
        client          = ZMR::GameToolsClient.new
        res             = client.game_account_search(game_account_id)
        if res != nil && res.code == 200
          if res['characters']
            characters = res['characters'].select {|char| char['deleted'].to_i == 0}
          else
            characters = []
          end
          return characters.map do |char|
            res = client.char_id_search(char['character_id'])
            if res != nil && res.code == 200
              res['character']
            else
              {}
            end
          end
        else
          return []
        end
      else
        return []
    end
  end

  def admin_info
    return nil if self.game.settings(:service_url).nil?
    adapter = GameAdapter.new(Game.find(self.game_id).settings(:service_url))
    result  = adapter.make_request(:account_admin_info, {:user_id => self.user_id, :game_account_id => self.id})
    if result
      return JSON.parse(result)
    else
      return {}
    end
  end

  def game_name
    self.game.name
  end

  def sub
    return "elite" if active_subscription?
  end

  def email
    return self.user.email
  end

  def active_servers
    characters.map {|c| c['server_id']}.uniq
  end

  # takes an optional array of subscriptions so we can
  # avoid n+1 selects when calling this for many accounts
  def subscription(subscriptions=[])
    if subscriptions.empty?
      sub = Subscription.find_by_game_account_id(self.id)
    else
      sub = subscriptions.select {|s| s.game_account_id == self.id}.first
    end
    sub
  end

  def active_subscription?
    sub = subscription
    if sub.present? && sub.active?
      return true
    else
      return false
    end
  end

  # we don't want to show our actual subscription id as that would reveal
  # the number of subscribers. Let's seed it and then base64 encode it
  def obfuscated_id
    self.class.obfuscated_id(self.id)
  end

  def self.obfuscated_id(i)
    seeded_id = i + 1234567
    Base64.encode64(seeded_id.to_s).strip.gsub("=", "_")
  end

  # we need to get the actual id back from the obfuscated id
  def self.unobfuscated_id(param)
    val = Base64.decode64(param.to_s.gsub("_", "=")).to_i - 1234567
    [0, val].max
  rescue
    0
  end

  def is_trial?
    # the better way to do this is by creating a new bit on the
    # game account types we consider "trial". Due to the urgency
    # of the fix as well as the potential risks involved w/ changing
    # our bit mask, we'll go w/ the safer route.
    ["trial", "refer a friend", "discovery edition"].include? self.game_account_type.name.to_s.downcase
  end

  def is_raf?
    self.game_account_type.name.to_s.downcase == "refer a friend"
  end

  def num_failed_incomm_redemptions(time = nil)
    if time.present?
      IncommRedemption.count(:all, :conditions => ['game_account_id = ? AND promo_code_id IS NULL AND created_at >= ?', self.id, time.ago])
    else
      IncommRedemption.count(:all, :conditions => ['game_account_id = ? AND promo_code_id IS NULL', self.id])
    end
  end

  def self.num_failed_incomm_redemptions(ids)
    IncommRedemption.count(:all, :conditions => ['game_account_id IN (?) AND promo_code_id IS NULL', ids])
  end

  def self.auto_account_creation(user, new_macct, default_redir_path, game=nil, creation_path=nil, direct_creation=false, raise_exception: false)
    redir_path = default_redir_path
    if game.present?
      redir_path = game.redirect_url if new_macct && !game.redirect_url.blank?
    else
      raise RuntimeError, "Must specify game to auto-create account."
    end

    promo = get_active_auto_account_creation_promotion(game)
    raise NoPromotionError, "No campaigns to create account." if promo.nil?

    promo_ids_in_progress = [promo.id]

    if direct_creation
      # create immediately and then initiate delayed job for the rest

      # search for meta json for account creation
      account_creation_script = nil
      promo.promotion_skus.each do |ps|
        wsku = WarehouseSku.find(ps.warehouse_sku_id)
        next if !wsku.present?
        wsku.warehouse_sku_assets.each do |wsa|
          if wsa.type == 'WhAssetGameAccount'
            account_creation_script = wsa.meta_json
            break
          end
        end
        break if account_creation_script != nil
      end

      # check we have valid creation script
      raise RuntimeError, 'no valid warehouse_sku_assets for action creation' if account_creation_script == nil

      # now we create game account
      direct_create_account(user, account_creation_script)
    end

    # make a delayed job for account creation to cope with unexpected error.
    # it will retry if any error occurs.
    job = AutoAccountCreationJob.new user.id, promo_ids_in_progress, game.id, creation_path, direct_creation
    Delayed::Job.enqueue job, 10

    redir_path
  rescue NoPromotionError => e
    # write an error and ignore it
    logger.info e.message
    raise e if raise_exception
    redir_path
  rescue Exception => e
    # write an error and ignore it
    logger.error e.message + "\n " + e.backtrace.join("\n ")
    raise e if raise_exception
    redir_path
  end

  def self.get_active_auto_account_creation_promotion(game)
    promo_id = game.new_macct_cmpn_id
    return nil if promo_id.nil? || promo_id < 1
    promos    = Promotion.active.all(:conditions => {:id => promo_id})
    curr_time = Time.now.utc
    return promos.select {|promo| promo.starts_at <= curr_time && (promo.ends_at.nil? || curr_time < promo.ends_at)}[0]
  end

  def self.direct_create_account(user, hash)
    meta_hash = JSON.parse(hash)
    singleton = meta_hash['allow_only_one']

    if (singleton.present? && singleton == 'true')
      account = GameAccount.active.first(:conditions => {:user_id => user.id, :game_account_type_id => meta_hash["game_account_type_id"]})
      raise AlreadyExistError, 'account already exist' if account.present?
    end

    # merge 'creation_path' options from asset_fulfillment
    acct = create_ams_account(user, meta_hash)
    raise RuntimeError, "Failed to create AMS account" unless acct

    # this has to be the last statement processed as it makes an external request which
    # is not covered by a transaction rollback. If it's a success, we're done... otherwise
    # we have to rollback the account creation in the AMS db.
    #log << trace_msg("Creating #{game.name} account")
    #res = create_game_account(acct, log)
    #raise FulfillErrorWithRetry.new("Failed to create #{acct.game.name} account") unless res

    #asset_fulfillment.game_account_id = acct.id
  end

  def self.create_ams_account(user, meta_hash)
    ga = user.game_accounts.new(
      :game_id              => meta_hash["game_id"],
      :game_account_type_id => meta_hash["game_account_type_id"],
      :access_level         => meta_hash["access_level"].to_i,
      :account_status       => GameAccount.account_status_for(:ok),
      :creation_path        => meta_hash["creation_path"]
    )

    if ga.save
      # Access Level 7 means it's a refer a friend account

      if meta_hash["access_level"].to_i == 7
        puts "REWARDING"
        referral = Referral.find(user.referral_id)
        referral.update_attribute(:target_game_account_id, ga.id)
        # We are not rewarding for the simple account creation anymore
        #
        # Referral.send_later(:apply_reward, referral.id, 'referral_account_created')
        Referral.send_later(:update_set_last_connected, referral.id)
      end

      return ga
    else
      return nil
    end
  end

  class Error < StandardError
  end

  class VipTokenItemNotFoundError < Error
    def initialize()
      super('vip token item is not registered in the box system')
    end
  end

  class VipTokenItemNotConfiguredError < Error
    def initialize()
      super('vip token item is not properly configured')
    end
  end

  BOX_TIMEOUT = 5 # set box requests to timeout after 5 seconds

  def add_vip_token(num_vip_tokens_to_add, external_transaction_id: 0, message: nil, additional_info: nil)
    vip_token_item = GameItem.where(game_id: game.id).where("display_name like 'Reward Credit%'").first
    raise VipTokenItemNotFoundError if vip_token_item.nil?
    raise VipTokenItemNotConfiguredError if vip_token_item.item_sn.nil? || vip_token_item.item_code.nil?

    game_account_id    = self.id
    game               = self.game
    log                = []
    box_transaction_id = Box.get_box_transaction_id(log, game)
    box_serial_number  = Box.create_box_simple(log, game_account_id, box_transaction_id, vip_token_item, num_vip_tokens_to_add, external_transaction_id)
    Box.box_notify(log, game_account_id)

    additional_info = {} if additional_info.nil?
    additional_info.merge!({num_vip_tokens_added: num_vip_tokens_to_add})
    additional_info = additional_info.to_json
    self.vip_token_logs.create!({event_type: 'add', message: message, additional_info: additional_info})

    {box_transaction_id: box_transaction_id, box_serial_number: box_serial_number, log: log}
  end

  def get_vip_game_token
    adapter     = GameAdapter.new(Game.find_by_name('TERA').settings(:fcgi_url))
    adapter_log = []
    res         = adapter.make_request(:get_vip_game_token, {game_account_id: self.id}, {}, adapter_log)
    unless res
      # error
      raise GameAccount::Error.new(adapter_log.last)
    else
      String.new(res).to_i # RestClient::Response.to_i will return http status code, to avoid this problem, cast it to String
    end
  end

  class AddVipTokenJob
    def initialize(game_account_id, num_vip_tokens_to_add, external_transaction_id, message)
      @game_account_id         = game_account_id
      @num_vip_tokens_to_add   = num_vip_tokens_to_add
      @external_transaction_id = external_transaction_id
      @message                 = message
    end

    def perform
      game_account = GameAccount.find(@game_account_id)
      game_account.add_vip_token(@num_vip_tokens_to_add, external_transaction_id: @external_transaction_id, message: @message)
    end
  end

  class AutoAccountCreationJob
    def initialize(user_id, promo_ids_in_progress, game_id=nil, creation_path=nil, allow_account_precreation=false)
      @user_id                   = user_id
      @promo_ids_in_progress     = promo_ids_in_progress
      @game_id                   = game_id
      @creation_path             = creation_path
      @allow_account_precreation = allow_account_precreation
    end

    def perform
      user = User.find(@user_id)

      if @game_id
        if user.game_accounts.where(:game_id => @game_id).count > 0 && !@allow_account_precreation
          log_entry = AutoAccountCreationLog.new(:user_id => user.id)
          log_entry.log([{:Message => "User already has a game account for game id #{@game_id}"}])
          log_entry.save
          # exit without retrying
          return false
        end
      end

      @promo_ids_in_progress.each do |promo_id|
        promo                   = Promotion.find(promo_id)
        options                 = {}
        options[:creation_path] = @creation_path
        next if promo.rate_limit_exceeded?(user, options)

        begin
          logs = []

          # Observing log db, following query fails frequently
          gpcs = promo.group_promo_codes.all(:conditions => {:active => true})
          raise ActiveRecord::RecordNotFound if gpcs.empty?

          gpc = gpcs.find {|group_promo_code| group_promo_code.use_limit > group_promo_code.use_count}

          code = GroupPromoCode.use_code(user, gpc, options, true, false, true)
          unless code.fulfillment_complete?
            logs << {:Message => 'Fulfillment job is queued in delayed job.',
                     :Code    => code.promo_code}
          end
        rescue ActiveRecord::RecordNotFound => e
          logs << {:Message   => "Group batches don't exist or there are not active group batches.",
                   :Exception => e.message}
        rescue PromoCode::CodeNotFound => e
          logs << {:Message   => "Every codes in group batches are used.",
                   :Exception => e.message}
        rescue PromoCode::InternalCodeError => e
          logs << {:Message   => "Group batch is not set to internal",
                   :Exception => e.message}
        rescue PromoCode::AssignmentError => e
          logs << {:Message   => "User cannot redeem a code.",
                   :Exception => e.message}
        rescue ActiveRecord::StatementInvalid => e
          # This error should be propagated up to DelayedJob handler so that the handler makes this function restart.
          raise e
        rescue => e
          logs << {:Message   => "Unknown Exception.",
                   :Exception => e.message}
        ensure
          unless logs.empty?
            log_entry = AutoAccountCreationLog.new(:user_id => user.id)
            log_entry.log(logs)
            log_entry.save
          end
        end
      end
    end
  end

  class NoPromotionError < StandardError
  end

  class AlreadyExistError < StandardError
  end

  class ForbiddenInBetaStageError < StandardError
  end

  def get_commandline_options(game)
    # check if the user is banned or suspended
    command_options = ''
    if self.user.suspended_from_game?
      return {:error => true, :response => {:error_code => 0, :message => 'suspended from game'}}
    else
      case game.name.upcase
        when 'AVA'
          response = EME::Auth.generate_authentication_token(self.id)
          if response[:error] == true
            error_code    = response[:response]['error_code']
            error_message = response[:response]['message']
            return {:error => true, :response => {:error_code => error_code, :message => error_message}}
          end
          auth_token = response['token']
          #server_addrs = '23.96.252.194:28004'
          #ping_server_addrs = '23.96.246.173:16384'

          begin
            server_addrs      = GameSetting.where(:game_id => game.id, :key => 'game_server_addr_list').first
            ping_server_addrs = GameSetting.where(:game_id => game.id, :key => 'ping_server_addr_list').first
            if server_addrs.present? && ping_server_addrs.present?
              command_options = "-serveraddr\"#{server_addrs.value}\" -pingserveraddr\"#{ping_server_addrs.value}\" -key\"#{auth_token}\""
            else
              raise 'game configuration error'
            end
          rescue => e
            error_message = e.message
            Rails.logger.error e.message + e.backtrace.join("\n")
            return {:error => true, :response => {:error_code => 0, :message => e.message}}
          end
        when 'ZMR'
          release_name          = game.settings('release_name')
          environment_name      = (Rails.env == 'production') ? nil : Rails.env
          release_name_splitted = release_name.split('.')
          major_version = release_name_splitted[0].to_i rescue 0
          minor_version = release_name_splitted[1].to_i rescue 0
          patch_version = release_name_splitted[2].to_i rescue 0
          version = "0x#{patch_version.to_s(16).rjust(2, '0')}#{minor_version.to_s(16).rjust(2, '0')}#{major_version.to_s(16).rjust(2, '0')}"
          site    = 0
          options = {}
          case self.game_account_type.name
            when 'ZMR QA'
              options['UT'] = '798'
            when 'ZMR Admin'
              options['UT'] = '797'
          end
          lstoken = ZMR::SecureToken.generate(self.id, options)
          if major_version == 0 && minor_version == 0 && patch_version < 31
            command_options = "version=#{version} site=#{site} safemode=0 audiotype=1 lstoken=#{lstoken}"
          else
            login_server    = game.settings("login_server_#{environment_name}")
            login_server    = game.settings('login_server') unless login_server
            command_options = "version=#{version} site=#{site} safemode=0 audiotype=1 lstoken=#{lstoken}&LS=#{login_server}"
          end
        when 'KRITIKA'
          response = EME::Auth.generate_authentication_token(self.id)
          if response[:error] == true
            error_code    = response[:response]['error_code']
            error_message = response[:response]['message']
            return {:error => true, :response => {:error_code => error_code, :message => error_message}}
          end
          auth_token      = response['token']
          command_options = "--token #{auth_token}"
        else
          command_options = ''
      end
      return {:error => false, :commandline_option => command_options}
    end
  end

  protected

  def update_payletter_account_info
    if self.created_at_changed? # note: new_record? does not work in after_save callback
      client = Payletter::Client.new
      begin
        client.create_account(self.user.id, self.user.email, self.game.name.upcase, self.id, 'normal')
      rescue Payletter::Client::PayletterError => e
        # write error message and skip
        logger.error e.to_s + "\n " + e.backtrace.join("\n ")
      end
    end
  end

  def set_default_name
    game  = self.game
    accts = self.class.find(:all,
                            :select     => "account_name",
                            :conditions => ["game_id = ? AND user_id = ? AND account_name LIKE ?", self.game_id, self.user_id, "#{game.name}%"]
    )
    if accts.empty?
      self.account_name = game.name
    else
      max               = accts.collect {|a| a.account_name.split(" ")[1].to_i}.max
      max               = 1 if max == 0
      self.account_name = "#{game.name} #{max+1}"
    end
  end

  def save_previous_game_account_type_id
    if self.game_account_type_id_changed?
      self.previous_game_account_type_id = self.game_account_type_id_was
    end
  end

  def set_paid_state
    PaidState.set!({:user_id => self.user_id, :game_id => self.game_id}) if self.founder?
  end
end
