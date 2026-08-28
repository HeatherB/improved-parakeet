# == Schema Information
#
# Table name: amazon_fulfillments
#
#  id            :integer          not null, primary key
#  purchase_id   :string(255)      not null
#  sku           :string(255)      not null
#  amazon_token  :string(255)      not null
#  user_id       :integer
#  promo_code_id :integer
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#

class AmazonFulfillment < ActiveRecord::Base
  belongs_to :user
  belongs_to :promo_code
  has_one :amazon_fulfillment_log

  validates_uniqueness_of :purchase_id

  attr_accessible :purchase_id, :sku, :amazon_token, :user_id, :promo_code_id

  def self.fulfill sqs_message_body
    logs = []

    begin
      message_json = JSON.parse(JSON.parse(sqs_message_body)['Message'])
    rescue => e
      # When we fail to decode sqs_message_body, simply ignore it since it is malformed message.
      Delayed::Worker.logger.error e.message + "\n " + e.backtrace.join("\n ")
      return
    end

    # TODO: Implement logic split here to revoke
    # Or elsewhere, either way, revoke is handled here
    unless message_json['Type'] == 'FulfillPurchase'
      self.record_revoke(message_json) if message_json['Type'] == 'RevokePurchase'
      AmazonRevocation.create_and_respond_with_json(message_json)
      return
    end

    sku, amazon_token = message_json['Sku'], message_json['Address']

    fulfillment = new( :purchase_id => message_json['PurchaseId'],
                       :sku => sku,
                       :amazon_token => amazon_token )
    logs << "Got fulfillment request for Amazon purchase ID #{message_json['PurchaseId']}"

    user = User.find_by_amazon_token(amazon_token)
    raise ActiveRecord::RecordNotFound unless user.present?
    logs << "User according to this fulfillment is #{user.email}"

    p = PromoCode.use_code(user, sku, {}, true)
    logs << "Used group code #{sku} and got unique code #{p.promo_code}"

    fulfillment.promo_code = p
    fulfillment.user = user

    fulfillment.save!
    logs << "Code successfully redeemed"
    fulfillment.respond_with_json('SUCCESS')
  rescue ActiveRecord::RecordNotFound => e
    logs << "Could not fulfill, user with the amazon token #{message_json['Address']} could not be found"
    fulfillment.respond_with_json InvalidAddress.new.message
  rescue PromoCode::CodeNotFound => e
    logs << "Could not fulfill, sku #{message_json['Sku']} could not be found"
    fulfillment.respond_with_json InvalidSku.new.message
  rescue FulfillmentException => e
    logs << "Could not fulfill from amazon: #{e.message}"
    fulfillment.respond_with_json e.message
  rescue => e
    logs << "Could not fulfill from amazon: UNKNOWN ERROR"
    fulfillment.respond_with_json 'FAILURE_UNKNOWN'
    Delayed::Worker.logger.error e.message + "\n " + e.backtrace.join("\n ")
  ensure
    if fulfillment and fulfillment.valid?
      fulfillment.save
      log_entry = AmazonFulfillmentLog.new(:amazon_fulfillment_id => fulfillment.id)
      log_entry.log(logs)
      log_entry.save!
    end
  end

  def self.record_revoke message
    AmazonRevocation.create( :purchase_id => message['PurchaseId'],
                             :sku => message['Sku'],
                             :amazon_token => message['Address'] )
  end

  def respond_with_json message = nil
    response = { "Type" => "ConfirmFulfillPurchase",
                 "PurchaseId" => self.purchase_id,
                 "Status" => message }

    @sns = Amazon::Notification.new
    @sns.topic.publish(response.to_json)
  end

  class FulfillmentException < StandardError; end

  class InvalidAddress < FulfillmentException
    def message
      "FAILURE_ADDRESS_INVALID"
    end
  end

  class AddressNotEligible < FulfillmentException
    def message
      "FAILURE_ADDRESS_NOT_ELIGIBLE"
    end
  end

  class InvalidSku < FulfillmentException
    def message
      "FAILURE_SKU_INVALID"
    end
  end

  class UnsupportedMessage < FulfillmentException
    def message
      "FAILURE_UNKNOWN"
    end
  end
end
