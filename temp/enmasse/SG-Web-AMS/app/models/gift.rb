# == Schema Information
#
# Table name: gifts
#
#  id                   :integer          not null, primary key
#  source_type          :string(40)
#  source_id            :integer
#  user_id              :integer
#  recipient_id         :integer
#  gift_box_id          :integer          not null
#  recipient_name       :string(255)
#  sender_name          :string(255)
#  message              :text
#  given_at             :datetime
#  opened_at            :datetime
#  opened_by            :integer
#  active               :boolean          not null
#  log                  :text
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  promotion_id         :integer
#  item_code            :string(128)
#  emp                  :integer
#  lock_version         :integer          default(0)
#  fulfillment_complete :boolean          default(FALSE)
#

class Gift < ActiveRecord::Base
  include Extensions::GiftFulfillmentLogEx

  attr_accessible :source_type, :source_id, :user_id, :recipient_id, :gift_box_id, :given_at, :recipient_name, :sender_name, :message, :promotion_id, :active, :lock_version

  belongs_to :source, :polymorphic => true
  belongs_to :user
  belongs_to :recipient, :class_name => "User"
  belongs_to :opener, :class_name => "User", :foreign_key => "opened_by"
  belongs_to :promotion, :inverse_of => :gifts
  belongs_to :gift_box, :inverse_of => :gifts

  validates :gift_box_id, :presence => true

  before_create :initialize_log

  scope :active, :conditions => { :active => true }
  scope :opened, :conditions => "gifts.opened_by IS NOT NULL"
  scope :unopened, :conditions => "gifts.opened_by IS NULL"
  scope :sent, :conditions => "gifts.recipient_id IS NOT NULL"
  scope :unsent, :conditions => "gifts.recipient_id IS NULL"
  scope :created_by, lambda { |user| { :conditions => {:user_id => user.id} } }
  scope :received_by, lambda { |user| { :conditions => {:recipient_id => user.id} } }
  scope :in_promotion_range, lambda {|promos| {:conditions => {:promotion_id => promos} } }

  BOX_TIMEOUT = 5 # set box requests to timeout after 5 seconds

  class FulfillErrorWithRetry < StandardError; end
  class AlreadyQueued < StandardError
    def message
      "This gift has already been queued for fulfillment"
    end
  end

  def as_json(options={})
    super(options.reverse_merge(:only => [:active, :created_at, :emp, :fulfillment_complete, :gift_box_id, :given_at, :id, :item_code, :message, :opened_at, :opened_by, :promotion_id, :recipient_id, :recipient_name, :sender_name, :source_id, :source_type, :updated_at, :user_id]))
  end

  def reference_key
    "GIFT#{self.id}"
  end

  def add_to_log(message)
    parsed_log << trace_msg(message)
    update_log!
  end

  def initialize_log
    unless self.log
      if self.source
        if source.is_a? AssetFulfillment
          entry = trace_msg("Created from AssetFulfillment (id=#{source.id}): #{source.source_type} (reference key=#{source.source_reference_key})")
        else
          entry = trace_msg("Created from #{source.to_json}")
        end
      else
        entry = trace_msg("Created without a source")
      end
      self.log = [entry].to_json
    end
  end

  def opened?
    self.opened_by.present?
  end

  def sent?
    self.recipient_id.present?
  end

  def can_open?(opener)
    if self.recipient_id
      return opener.id == self.recipient_id
    else # this gift has not been given to someone else
      return opener.id == self.user_id
    end
  end

  def can_receive?(recipient)
    return false if self.user_id == recipient.id
    true
  end

  def send!(recipient, recipient_name, sender_name, message)
    raise StandardError.new("Gift has already been sent") if self.sent?

    self.recipient_id = recipient.id
    self.given_at = Time.now.utc
    self.recipient_name = recipient_name.blank? ? (recipient.temp_screen_name? ? recipient.email : recipient.screen_name) : recipient_name
    
    # use the configured name if it is not set
    if sender_name.blank?
      gifts_config = YAML.load_file("#{Rails.root}/config/gifts.yml")
      rewards_config = gifts_config["rewards"]
      config_namespace = rewards_config["config_namespace"]
      self.sender_name = rewards_config["config"][config_namespace]["sender_name"] || "A friend in the federation"
    else
      self.sender_name = sender_name
    end

    if message.blank?
      gifts_config = YAML.load_file("#{Rails.root}/config/gifts.yml")
      rewards_config = gifts_config["rewards"]
      config_namespace = rewards_config["config_namespace"]
      self.message = rewards_config["config"][config_namespace]["message"] || "I just sent you a Golden Gift box! Click the button below to open it!"
    else
      self.message = message
    end

    parsed_log << trace_msg("#{self.sender_name} (id=#{self.user_id}) is sending this gift to #{self.recipient_name} (id=#{self.recipient_id}) with the message:\n #{self.message}")

    self.save!
    UserMailer.queue(:gift_notification, self)

    # Check if the promotion only counts unique master accounts
    increment_counter = false
    if self.promotion.giftable_unique?
      # Only increment the counter if this user has not sent a gift from this promotion to this recipient
      unless Gift.where(:promotion_id => self.promotion_id, :user_id => self.user_id, :recipient_id => self.recipient_id).count > 1
        increment_counter = true
      end
    else
      increment_counter = true
    end

    if increment_counter
      # use the gift promotion if it exists
      if self.promotion.gift_promotion.present?
        progressive_goal_counter = self.promotion.gift_promotion.progressive_goal_counters.find_or_initialize_by_user_id(self.user_id)
      else
        progressive_goal_counter = self.promotion.progressive_goal_counters.find_or_initialize_by_user_id(self.user_id)
      end
      progressive_goal_counter.increment!(:sent)
      progressive_goal_counter.trigger_rewards!(:sent => true)
      parsed_log
    else # no rewards will be triggered as we didn't increment a counter
      []
    end
  rescue => ex
    parsed_log << trace_msg(ex.message)
    raise ex
  ensure
    update_log!
  end

  def open!(game_account, override_selected_gift: nil)
    raise StandardError.new("Gift has already been opened") if self.opened?
    raise StandardError.new("Gift already has an item code and/or emp assigned") if self.item_code.present? || self.emp.present?

    target = recipient || user
    parsed_log << trace_msg("User '#{target.screen_name}' (id=#{target.id}) is attempting to open gift...")

    possible_gift = self.gift_box.open(override_selected_gift: override_selected_gift)
    if game_item = possible_gift.game_item
      self.item_code = game_item.item_code
      contents = "#{game_item.display_name} (item_code=#{game_item.item_code}) and #{possible_gift.emp} EMP"
    else
      contents = "#{possible_gift.emp} EMP"
    end

    parsed_log << trace_msg("Opened possible gift (id=#{possible_gift.id}) which contains: \n#{contents}")

    self.emp = possible_gift.emp
    self.opened_by = target.id
    self.opened_at = Time.now.utc
    self.log = parsed_log.to_json
    self.save!

    # Create a gift fulfillment
    success = GiftFulfillment.fulfill_gift(
      target,
      self,
      game_account,
    )
    self.update_attribute(:fulfillment_complete, true) if success

    # use the gift promotion if it exists
    if self.promotion.gift_promotion.present?
      progressive_goal_counter = self.promotion.gift_promotion.progressive_goal_counters.find_or_initialize_by_user_id(self.opened_by)
    else
      progressive_goal_counter = self.promotion.progressive_goal_counters.find_or_initialize_by_user_id(self.opened_by)
    end

    progressive_goal_counter.increment!(:opened)
    progressive_goal_counter.trigger_rewards!(:opened => true)
    parsed_log
  rescue => ex
    parsed_log << trace_msg(ex.message)
    raise ex
  ensure
    update_log!
  end

  def fulfill!(gift_fulfillment)
    error_msg = nil
    user = gift_fulfillment.user
    gf_meta = JSON.parse(gift_fulfillment.meta_json) if gift_fulfillment.meta_json.present?
    gf_meta ||= {}
    game_account_id, game_account = gf_meta["game_account_id"].to_i, nil

    write_log(gift_fulfillment) do |log|
      self.class.transaction(:requires_new => true) do
        begin
          unless gf_meta["item_code_fulfilled"] && gf_meta["item_code_fulfilled"] == true
            if self.item_code
              log << trace_msg("Attempting to redeem item code #{self.item_code}...")
              log << trace_msg("Attempting to locate game account with id #{game_account_id}...")
              game_account = GameAccount.find(game_account_id)
              raise FulfillErrorWithRetry.new("Game account not found") unless game_account
              game = Game.nolock.find(game_account.game_id)
              game_item = GameItem.where(item_code: self.item_code).first
              txn_id = get_box_transaction_id(gift_fulfillment, game, gf_meta, log)
              create_box_from_template(gift_fulfillment, game, game_account, txn_id, game_item, log)

              # Notify player that their item was redeemed
              box_notification(game_account, log)

              # we're done... mark that this item was redeemed by the account
              gift_fulfillment.game_account_id = game_account.id
              gift_fulfillment.update_meta!("item_code_fulfilled", true)
            end
          end

          unless gf_meta["emp_fulfilled"] && gf_meta["emp_fulfilled"] == true
            if self.emp && self.emp > 0
              log << trace_msg("Attempting to credit '#{user.screen_name}' (user_id=#{user.id}) with #{self.emp} EMP...")

              # will raise a WalletException if not successful
              begin
                payletter_client = Payletter::Client.new
                result = payletter_client.add_cash(user.id, user.email, 'EMP_EVENT', self.emp, 'TERA', nil, 'gift', 'AMS', game_account_id, 'USA', 'EMP', self.reference_key)
                log << trace_msg("Success with transaction_id='#{result.transaction_id}'")
                gift_fulfillment.update_meta!("payletter_txn_id", result.transaction_id)
                gift_fulfillment.update_meta!("emp_fulfilled", true)
              rescue Payletter::Client::PayletterError => we
                raise FulfillErrorWithRetry.new(we.message)
              rescue Net::OpenTimeout => ot
                # retry if payletter times out as well
                raise FulfillErrorWithRetry.new(ot.message)
              end
            end
          end
        rescue FulfillErrorWithRetry => fewr
          log << trace_msg("Adding to retry queue")
          error_msg = fewr.message
        rescue ActiveRecord::StatementInvalid => e
          log << trace_msg("Rolling back transaction and adding to retry queue")
          error_msg = e.message
          raise ActiveRecord::Rollback
        end
      end

      raise FulfillErrorWithRetry.new(error_msg) if error_msg.present?

    end
  end

  private

  def update_log!
    if @parsed_log
      begin
        self.update_attribute(:log, @parsed_log.to_json)
      rescue ActiveRecord::StaleObjectError => soe
        self.reload
        retry
      end
    end
  end

  def parsed_log
    return @parsed_log if @parsed_log
    begin
      @parsed_log = JSON.parse(self.log)
    rescue JSON::ParserError => pe
      @parsed_log = []
    end
  end

  def trace_msg(msg)
    { :timestamp => Time.now.utc.to_i, :message => msg }
  end

  def box_timeout_options
    { :rest_options => { :open_timeout => BOX_TIMEOUT, :timeout => BOX_TIMEOUT } }
  end

  def get_box_transaction_id(gift_fulfillment, game, gf_meta, log)
    new_txn_id = false
    txn_id = gf_meta['box_txn_id'] # check for an existing box txn id (used when performing retry)

    if txn_id.present?
      log << trace_msg("Existing BOX Txn ID Found: #{txn_id}")
    else
      log << trace_msg('Fetching BOX transaction ID')
      begin
        txn_id = Box.get_box_transaction_id(log, game)

        gf_meta['box_txn_id'] = txn_id
        new_txn_id            = true
      rescue Box::BoxError => e
        raise FulfillErrorWithRetry.new(e)
      end
    end
    return txn_id
  ensure
    gift_fulfillment.update_attribute(:meta_json, gf_meta.to_json) if new_txn_id
  end

  def create_box_from_template(gift_fulfillment, game, acct, txn_id, game_item, log)
    log << trace_msg("Attempting to create BOX for Template ID: #{game_item.item_code} for Account ID: #{acct.id} - #{acct.account_name}")
    # Unfortunately it appears that the externalTransactionKey must be an unique
    # id, which has traditionally been an AssetFulfillment id.  In this case
    # we'll have to reuse the AssetFulfillment that created the gift
    raise StandardError.new("Fulfilling a game item requires that the gift be created from an AssetFulfillment") unless self.source_type == "AssetFulfillment"
    begin
      Box.create_box_template(log, acct.id, txn_id, game_item, self.source_id)
    rescue Box::BoxError => e
      raise FulfillErrorWithRetry.new(e)
    end
  end

  def box_notification(acct, log)
    Box.box_notify(log, acct.id)
  end

end
