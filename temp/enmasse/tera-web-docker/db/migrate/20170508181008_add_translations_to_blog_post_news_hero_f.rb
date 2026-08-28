class AddTranslationsToBlogPostNewsHeroF < ActiveRecord::Migration
  def up
    fields = { :news_hero_field => :text }
    Refinery::Blog::Post.add_translation_fields!(fields, { :migrate_data => true })
  end

  def down
  end
end