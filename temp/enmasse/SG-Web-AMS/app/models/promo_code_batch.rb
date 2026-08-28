# == Schema Information
#
# Table name: promo_code_batches
#
#  id            :integer          not null, primary key
#  admin_id      :integer
#  promotion_id  :integer
#  batch_type    :integer          default(0)
#  title         :string(255)
#  codes_created :integer          default(0)
#  codes_used    :integer          default(0)
#  active        :boolean          default(TRUE)
#  created_at    :datetime
#  updated_at    :datetime
#  num_codes     :integer
#  code_length   :integer
#  use_limit     :integer
#  group_code    :string(255)
#

class PromoCodeBatch < ActiveRecord::Base
  belongs_to :promotion
  has_many   :promo_codes, :foreign_key => "batch_id"
  has_many   :group_promo_codes, :foreign_key => "batch_id"

  attr_accessible :admin_id, :promotion_id, :batch_type, :title, :codes_created, :codes_used, :active, :num_codes, :code_length, :use_limit, :group_code
  
  def increment_used_count!
    self.codes_used += 1
    self.save!
  end  
end
