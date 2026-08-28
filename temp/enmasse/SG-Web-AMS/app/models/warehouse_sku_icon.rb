# == Schema Information
#
# Table name: warehouse_sku_icons
#
#  id               :integer          not null, primary key
#  warehouse_sku_id :integer
#  content_type     :string(255)
#  size             :integer
#  width            :integer
#  height           :integer
#  parent_id        :integer
#  thumbnail        :string(255)
#  filename         :string(255)
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

class WarehouseSkuIcon < ActiveRecord::Base
  belongs_to :warehouse_sku
  
  has_attachment  :storage      => SECURE_CONFIG["assets"]["storage"],
                  :max_size     => 1.megabytes,
                  :content_type => :image,
                  :processor    => 'Rmagick'
  
  validates_as_attachment

  attr_accessible :warehouse_sku_id, :content_type, :size, :width, :height, :parent_id, :thumbnail, :filename
end
