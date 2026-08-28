# == Schema Information
#
# Table name: promotion_skus
#
#  id               :integer          not null, primary key
#  promotion_id     :integer
#  warehouse_sku_id :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

class PromotionSku < ActiveRecord::Base
  belongs_to :promotion
  belongs_to :warehouse_sku

  attr_accessible :promotion_id, :warehouse_sku_id
end
