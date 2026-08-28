# == Schema Information
#
# Table name: warehouse_sku_assets
#
#  id               :integer          not null, primary key
#  warehouse_sku_id :integer
#  game_id          :integer
#  type             :string(255)
#  title            :string(255)
#  meta_json        :text
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  deleted          :boolean          default(FALSE)
#

class WhAssetEventCredit < WhAssetChronoScroll
  # Use the same logic of WhAssetChronoScroll because WhAssetChronoScroll and WhAssetEventCredit and the same
  # in terms of implementation.
  # They differs in terms of interpretation.
end
