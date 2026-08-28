class AddTranslationsToBlogPostTeaserImgField < ActiveRecord::Migration
  def up
    fields = { :teaser_img_field => :text }
    Refinery::Blog::Post.add_translation_fields!(fields, { :migrate_data => true })
  end

  def down
  end
end
