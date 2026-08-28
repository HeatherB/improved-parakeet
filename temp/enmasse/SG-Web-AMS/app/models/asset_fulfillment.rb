# == Schema Information
#
# Table name: asset_fulfillments
#
#  id                     :integer          not null, primary key
#  user_id                :integer
#  source_type            :string(40)
#  source_id              :integer
#  source_reference_key   :string(80)
#  warehouse_sku_asset_id :integer
#  meta_json              :string(2048)
#  status                 :integer          default(0)
#  attempts               :integer          default(0)
#  last_attempt_at        :datetime
#  last_error_message     :text
#  lock_version           :integer          default(0)
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  game_account_id        :integer
#

class AssetFulfillment < ActiveRecord::Base
  include Extensions::AssetFulfillmentEx

  attr_accessible :user_id, :source_type, :source_id, :source_reference_key, :warehouse_sku_asset_id, :meta_json, :status, :attempts, :last_attempt_at, :last_error_message, :lock_version, :game_account_id
end
