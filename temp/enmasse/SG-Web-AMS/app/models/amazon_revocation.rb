# == Schema Information
#
# Table name: amazon_revocations
#
#  id           :integer          not null, primary key
#  purchase_id  :string(255)
#  sku          :string(255)
#  amazon_token :string(255)
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#

class AmazonRevocation < ActiveRecord::Base
  validates_uniqueness_of :purchase_id

  attr_accessible :purchase_id, :sku, :amazon_token

  def respond_with_json
    response = { "Type" => "ConfirmRevokePurchase",
                 "PurchaseId" => self.purchase_id,
                 "Status" => 'FAILURE_UNKNOWN' }

    @sns = Amazon::Notification.new
    @sns.topic.publish(response.to_json)
  end

  def self.create_and_respond_with_json(message_json)
    revocation = create( :purchase_id => message_json['PurchaseId'],
                         :sku => message_json['Sku'],
                         :amazon_token => message_json['Address'] )
    
    revocation.respond_with_json
  end
end
