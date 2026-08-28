# == Schema Information
#
# Table name: billing_transaction_items
#
#  id                     :integer          not null, primary key
#  billing_transaction_id :integer
#  meta_json              :text
#  status                 :integer          default(0)
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#

class BillingTransactionItem < ActiveRecord::Base
  belongs_to :billing_transaction
  
  attr_accessible :billing_transaction_id, :meta_json, :status
end
