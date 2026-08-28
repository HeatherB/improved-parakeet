# == Schema Information
#
# Table name: line_item_promo_codes
#
#  id                     :integer          not null, primary key
#  billing_transaction_id :integer
#  line_item_id           :string(255)
#  promo_code             :string(255)
#  subscription_created   :boolean          default(FALSE)
#  lock_version           :integer          default(0)
#  locked_by              :string(255)
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#

class LineItemPromoCode < ActiveRecord::Base
  belongs_to :billing_transaction

  attr_accessible :billing_transaction_id, :line_item_id, :promo_code, :subscription_created, :lock_version, :locked_by
end
