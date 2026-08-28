# == Schema Information
#
# Table name: game_images
#
#  id           :integer          not null, primary key
#  game_id      :integer
#  content_type :string(255)
#  size         :integer
#  width        :integer
#  height       :integer
#  parent_id    :integer
#  thumbnail    :string(255)
#  filename     :string(255)
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#

class GameImage < ActiveRecord::Base
  belongs_to :game
  
  has_attachment  :storage      => SECURE_CONFIG["assets"]["storage"],
                  :max_size     => 1.megabytes,
                  :content_type => :image,
                  :processor    => 'Rmagick'
  
  validates_as_attachment

  attr_accessible :game_id, :content_type, :size, :width, :height, :parent_id, :thumbnail, :filename
end
