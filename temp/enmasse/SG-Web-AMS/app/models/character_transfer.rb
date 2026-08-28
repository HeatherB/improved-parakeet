# == Schema Information
#
# Table name: character_transfers
#
#  id               :integer          not null, primary key
#  game_account_id  :integer
#  character_id     :integer
#  from_server_id   :integer
#  to_server_id     :integer
#  status           :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  character_name   :string(255)
#  from_server_name :string(255)
#  to_server_name   :string(255)
#  return_code      :string(255)
#

class CharacterTransfer < ActiveRecord::Base
  include ApplicationHelper

  DISABLED_SERVERS = []# ["Arun", "Tempest Reach", "Ascension Valley", "Celestial Hills - Roleplay"]

  belongs_to :game_account
  has_one :character_transfer_log

  attr_accessible :game_account_id, :character_id, :from_server_id, :to_server_id, :status, :character_name, :from_server_name, :to_server_name, :return_code

  # (robin) Allows a way for bidirection lookup of these statuses
  STATUS = %w( pending progress error complete )
  STATUS.each_with_index { |const, idx| self.const_set(const.upcase.to_sym, idx) }

  validates_presence_of :game_account_id, :character_id

  ERROR_CODES = {
    1 => "transfer_error_1",
    2 => "transfer_error_2",
    4 => "transfer_error_4",
    8 => "transfer_error_8",
    16 => "transfer_error_16",
    32 => "transfer_error_32",
    64 => "transfer_error_64",
    128 => "transfer_error_128",
    256 => "transfer_error_256",
    512 => "transfer_error_512",
    1024 => "transfer_error_1024",
    2048 => "transfer_error_2048",
    4096 => "transfer_error_4096",
    8192 => "transfer_error_8192",
    16384 => "transfer_error_16384",
    32768 => "transfer_error_32768",
    65536 => "transfer_error_65536",
    131072 => "transfer_error_131072"
  }

  ERROR_READABLE_MESSAGES = {
    1 => "Unhandled exception",
    2 => "requested character_srl doesn't exist",
    4 => "source arbiter server is not configured as 'characters can be transferred to other server'",
    8 => "requested character's level is lower than min_level",
    16 => "requested character's money is more than max_money",
    32 => "requested character is opening homunculus store.",
    64 => "requested character has unadjusted items in in-game auction house",
    128 => "requested character has untaken parcel items in the game",
    256 => "requested character has the items in inventory which is configured as untransferrable",
    512 => "failed to created character in the destination arbiter server",
    1024 => "the destination arbiter server is not configured as 'characters can be transferred into this server'",
    2048 => "the character slot of the game account in the destination server is already full",
    4096 => "requested character is being moderated/banned",
    8192 => "requested character is a member of guild. (user should leave guild before server-transfer)",
    16384 => "requested character has items seized from GM",
    32768 => "requested character is locked due to character name (duplicated name, banned name). locked character cannot be transferred. User should unlock character by changing name in the game first.",
    65536 => "requested character is deleting status by user's request",
    131072 => "Requested character has at least one item in inventory that is bound to another character. Please remove the item(s) before transferring servers.",
  }

  PURCHASE_INFOS_CACHE_TTL = 1.minutes
  PURCHASE_INFOS_CACHE_KEY = "payletter-paid-server-transfer-purchase-infos"

  # Author: Robin Liao <robin.liao@sleepygiant.com>
  #
  # Checks the validity of a character transfer
  # Does not require all the data because it does not require the model
  # to be persisted
  def check_eligibility
    errors = custom_errors
    return errors if errors.present?

    adapter = GameAdapter.new(Game.nolock.find(self.game_account.game_id).settings(:fcgi_url))

    result = adapter.make_request :check_character_transfer_conditions, { :source_arbiter => self.from_server_id, :character_srl => self.character_id }
    Rails.logger.info "CharacterTransfer Logging - Result from checking transfer eligibility character_srl: #{ self.character_id }, on source arbiter: #{ self.from_server_id }, resulted in: #{ result.inspect }"

    return [ 'transfer_error_not_reachable' ] unless result

    result = result.split(/\s/)
    status_code = result.last.to_i
    if status_code == 0
      return true
    else
      CharacterTransfer.error_code(status_code).values
    end
  end

  def custom_errors
    @error_log ||= []
    @error_log << 'transfer_error_not_enough_data' unless self.character_id && self.from_server_id && self.game_account_id
    @error_log << 'transfer_error_rate_limited' if character_locked?
    online = character_online?
    @error_log << online if online
  end

  def character_online?
    adapter = GameAdapter.new(Game.nolock.find(self.game_account.game_id).settings(:fcgi_url))

    online_result = adapter.make_request(:query, { :game_account_id => self.game_account.id })

    return 'transfer_error_not_reachable' unless online_result
    return 'transfer_error_player_logged_in' if online_result.split(' ').last.to_i != 0
    false
  end

  # Author: Robin Liao <robin.liao@sleepygiant.com>
  #
  # Returns true or false if character is locked or not
  def character_locked?
    lock = CharacterTransferLock.find_all_by_character_id_and_server_id(self.character_id, self.from_server_id)
    lock.present? && lock.first.active?(self.game_account.game)
  end

  # Author: Robin Liao <robin.liao@sleepygiant.com>
  #
  # Returns true or false based on if the transfer is completely restricted or not
  def transfer_possible?
    restricted = self.game_account.game.transfer_restricted

    return true unless restricted
    return false unless self.from_server_id && self.to_server_id

    server_list = GameServer.all_in_hash(self.game_account)

    return false if (server_list[self.from_server_id].category != server_list[self.to_server_id].category) && restricted
    true
  end

  # Author: Robin Liao <robin.liao@sleepygiant.com>
  #
  # Actually fulfills the character transfer after it's been recorded from the user
  # and we pick it up from delayed jobs
  def queue_fulfillment
    GameAccountMailer.queue :character_transfer_created, self.id
    self.send_later :fulfill_character_transfer
  end

  def fulfill_character_transfer
    backtrace = nil
    purchase_transaction_id = nil
    user = User.find(self.game_account.user_id)
    payletter_client = Payletter::Client.new
    adapter, adapter_log = GameAdapter.new(Game.nolock.find(self.game_account.game_id).settings(:fcgi_url)), []

    custom_errors

    # get purchase info for paid-server-transfer product
    #   purchase_info = {:price_id => ..., :event_id => ..., :original_price => ...,
    #                    :discount => ..., :price => ..., :elite_status => ...}
    purchase_info = CharacterTransfer.get_paid_server_transfer_purchase_info User.find(self.game_account.user_id), self.game_account_id

    if purchase_info.nil?
      adapter_log << "Failed to get purchase information, host='#{machine_hostname}', cache_key='#{PURCHASE_INFOS_CACHE_KEY}', purchase_infos='#{CharacterTransfer.get_paid_server_transfer_purchase_infos.inspect}'"
      @error_log << "transfer_error_fail_to_get_purchase_info"
    end

    unless transfer_possible?
      adapter_log << 'Attempted to transfer to a restricted server'
      @error_log << "transfer_error_server_type_restricted"
    end

    # purchase paid-server-transfer product
    # if any error occurs during this process, show error
    begin
      adapter_log << "Try to purchase paid-server-transfer product"
      user_subset = user.subscription_active?(self.game_account_id) ? 'elite' : 'normal'
      if purchase_info[:price] > 0
        result = payletter_client.purchase(user.id, user.email, self.game_account_id, 'TERA', user_subset, purchase_info[:price_id],
                                           purchase_info[:price], 1, 'tera-web', purchase_info[:event_id],
                                           skip_vip_rewards: true   # do not send vip rewards on purchase, it will be postponed until complete_purchase is called
        )
        purchase_transaction_id = result.transaction_id
        remain_amount = result.remain_amount
      else
        purchase_transaction_id = -1
        remain_amount = -1
      end
      adapter_log << "Successfully paid-server-transfer product purchased, purchase_transaction_id=#{purchase_transaction_id}, remain_amount=#{remain_amount}"
    rescue Payletter::Client::PurchaseException => e
      adapter_log << "Fail to purchase, e='#{e}'"
      @error_log << "transfer_error_fail_to_purchase"
    end

    if @error_log.present?
      adapter_log << 'Found errors before attempting transfer'
      adapter_log += @error_log

      self.error!
      self.update_attribute :return_code, @error_log.join("\n")

      if purchase_transaction_id.present?
        # cancel purchase
        begin
          adapter_log << "Try to cancel purchase, user_id=#{user.id}, purchase_transaction_id=#{purchase_transaction_id}"
          if purchase_transaction_id != -1
            payletter_client.cancel_purchase(user.id, purchase_transaction_id)
          end
          adapter_log << "Successfully transaction canceled"
        rescue Payletter::Client::PayletterError => payletter_error
          adapter_log << "Fail to cancel purchase , put the failed job into retry queue, e='#{payletter_error}'"
          job = CancelPurchase.new(user.id, purchase_transaction_id)
          Delayed::Job.enqueue job, 10
        end
        purchase_transaction_id = nil
      end

      return
    end

    adapter_log << "About to attempt the character transfer"
    adapter_log << "Submitting transfer request from host: #{machine_hostname}"

    begin
      result = adapter.make_request( :execute_character_transfer,
                                     { :source_arbiter => self.from_server_id,
                                       :character_srl => self.character_id,
                                       :dest_arbiter => self.to_server_id,
                                       :max_money => 50000,
                                       :min_level => 30 }, {}, adapter_log )

      if CharacterTransfer.parse_return_code(result) == true
        self.update_attribute :status, COMPLETE
        self.update_attribute :return_code, result
        GameAccountMailer.queue :character_transfer_completed, self.id

        lock_character_transfer!(result, to_server_id)

        adapter_log << "Character transfer request submitted with the return_codes of #{ result }"
      elsif CharacterTransfer.parse_return_code(result).is_a? Hash
        adapter_log << "Failed to transfer with the return_codes of #{ result }"
        CharacterTransfer.parse_return_code(result).keys.each do |error_code|
          adapter_log << "error_code=#{error_code}, message='#{ERROR_READABLE_MESSAGES[error_code] if ERROR_READABLE_MESSAGES.has_key? error_code}'"
        end
        self.error!
        self.update_attribute :return_code, result
        GameAccountMailer.queue :character_transfer_errored, self.id
        raise RuntimeError.new("Transfer Failed")
      else
        adapter_log << "Could not contact the character transfer FCGI endpoint, service down or unreachable"
        self.error!
        self.update_attribute :return_code, "Cannot connect to the server, service down or unreachable"
        GameAccountMailer.queue :character_transfer_errored, self.id
        raise RuntimeError.new("Service Unavailable")
      end
    rescue => e
      if purchase_transaction_id.present?
        # cancel purchase
        begin
          adapter_log << "Try to cancel purchase, user_id=#{user.id}, purchase_transaction_id=#{purchase_transaction_id}"
          if purchase_transaction_id != -1
            payletter_client.cancel_purchase(user.id, purchase_transaction_id)
          end
          adapter_log << "Successfully transaction canceled"
        rescue Payletter::Client::PayletterError => payletter_error
          adapter_log << "Fail to cancel purchase , put the failed job into retry queue, e='#{payletter_error}'"
          job = CancelPurchase.new(user.id, purchase_transaction_id)
          Delayed::Job.enqueue job, 10
        end
      end
      raise e
    else
      # complete the transaction to give vip rewards
      if purchase_transaction_id != -1
        adapter_log << "Try to complete purchase, user_id=#{user.id}, purchase_transaction_id=#{purchase_transaction_id}"
        payletter_client.complete_purchase(user.id, purchase_transaction_id)
        adapter_log << "Successfully transaction completed"
      end
    end
  rescue => e
    backtrace = e.message + "\n " + e.backtrace.join("\n ")
    self.error!
    adapter_log << "Error found with message: #{e.message} - Erroring out the transfer"
  ensure
    result ||= ''
    log_obj = self.build_character_transfer_log( :game_account_id => self.game_account.id,
                                                 :return_code => result,
                                                 :trace_msg => adapter_log.join("\n"),
                                                 :exception => backtrace )
    log_obj.save
  end

  class CancelPurchase
    # Used in delayed job to revert wallet
    def initialize(user_id, transaction_id)
      @user_id = user_id
      @transaction_id = transaction_id
    end

    def perform
      payletter_client = Payletter::Client.new
      begin
        if @transaction_id != -1
          payletter_client.cancel_purchase(@user_id, @transaction_id)
        end
      rescue Payletter::Client::PayletterError => e
        if e.err_code == 3915 # It is already canceled
          # the transaction is already canceled, ignore this error
        else
          raise e
        end
      end
    end
  end

  # Author: Robin Liao <robin.liao@sleepygiant.com>
  #
  # Creates a lock on the character so that they cannot transfer when they've already transferred
  # within a certain period of time
  def lock_character_transfer!(result, server_id)
    character_srl = result.split(/\s/).first

    CharacterTransferLock.create( :character_id => character_srl,
                                  :server_id => server_id )
  end

  # Author: Robin Liao <robin.liao@sleepygiant.com>
  #
  # Based on the error hash in this class, return an array of errors that match
  # in bitwise operator
  def self.error_code code
    errors = {}
    ERROR_CODES.each { |k, v| errors[k] = v if (k | code == code) }
    errors
  end

  # Author: Robin Liao <robin.liao@sleepygiant.com>
  #
  # Checks if the return is success or not
  def self.parse_return_code code
    return false unless code.is_a? String
    return code.split("\n") unless code =~ /\d+\s\d+/

    code = code.split(/\s/)
    status_code = code.last.to_i
    if status_code == 0
      true
    else
      CharacterTransfer.error_code status_code
    end
  end

  def error!
    self.update_attribute :status, ERROR
  end


  def self.update_paid_server_transfer_purchase_infos
    payletter_client = Payletter::Client.new

    begin
      item = payletter_client.get_game_item('TERA', 'paid_server_transfer')
    rescue Payletter::Client::PayletterError => e
      if e.err_code == 5000   # cannot find paid-server-transfer item because it is undefined.
        item = nil
      end
    end

    if item
      if item.prices.nil?() || item.prices.length() == 0
        raise RuntimeError.new("no price is set for paid-server-transfer")
      end
      price = item.prices[0]

      # find appropriate promotion and apply to normal purchase info and elite purchase info
      normal_purchase_info = {
        :price_id       => price.price_id,
        :event_id       => nil,
        :original_price => price.original_price,
        :discount       => 0,
        :price          => price.original_price,
        :elite_status   => false
      }
      elite_purchase_info = {
        :price_id       => price.price_id,
        :event_id       => nil,
        :original_price => price.original_price,
        :discount       => 0,
        :price          => price.original_price,
        :elite_status   => true
      }
      item.promotions.each do |promotion|
        if promotion.user_subset == 'elite'
          purchase_info = elite_purchase_info
        else
          purchase_info = normal_purchase_info
        end

        if promotion.event_dc_amount > purchase_info[:discount]
          purchase_info[:event_id] = promotion.event_id
          purchase_info[:discount] = promotion.event_dc_amount
          purchase_info[:price]    = price.original_price - promotion.event_dc_amount
        end
      end

      # if the discount rate of the normal purchase is more than that of the elite purchase, use the same discount rate
      if normal_purchase_info[:discount] > elite_purchase_info[:discount]
          elite_purchase_info[:event_id] = normal_purchase_info[:event_id]
          elite_purchase_info[:discount] = normal_purchase_info[:discount]
          elite_purchase_info[:price]    = normal_purchase_info[:price]
      end

      purchase_infos = [normal_purchase_info, elite_purchase_info]
    else
      purchase_infos = []
    end

    PersistentCache.write(PURCHASE_INFOS_CACHE_KEY, purchase_infos, :expires_in => PURCHASE_INFOS_CACHE_TTL)
    purchase_infos
  end

  def self.get_paid_server_transfer_purchase_infos
    purchase_infos = PersistentCache.read(PURCHASE_INFOS_CACHE_KEY)
    if purchase_infos.nil?() || !purchase_infos.is_a?(Array)
      # invoke delayed job to fill-up paid_server_transfer_purchase_info
      purchase_infos = update_paid_server_transfer_purchase_infos
    end
    purchase_infos
  end

  def self.get_paid_server_transfer_normal_purchase_info
    purchase_infos = self.get_paid_server_transfer_purchase_infos
    purchase_infos = purchase_infos.select { |p| p[:elite_status] == false }
    purchase_infos[0] rescue nil
  end

  def self.get_paid_server_transfer_elite_purchase_info
    purchase_infos = self.get_paid_server_transfer_purchase_infos
    purchase_infos = purchase_infos.select { |p| p[:elite_status] == true }
    purchase_infos[0] rescue nil
  end

  def self.get_paid_server_transfer_purchase_info(user, game_account_id=nil)
    purchase_infos = self.get_paid_server_transfer_purchase_infos
    if purchase_infos.present?
      if not user.subscription_active?(game_account_id)
        # exclude any purchase_info for elite
        purchase_infos = purchase_infos.select { |p| p[:elite_status] == false }
      end

      # select cheapest purchase_info
      min_price = nil
      min_purchase_info = nil
      for purchase_info in purchase_infos
        price = purchase_info[:price]
        if min_price.nil? or price < min_price
          min_price = price
          min_purchase_info  = purchase_info
        end
      end
      min_purchase_info
    else
      nil
    end
  end
end
