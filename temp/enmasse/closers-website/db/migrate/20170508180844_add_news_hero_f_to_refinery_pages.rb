class AddNewsHeroFToRefineryPages < ActiveRecord::Migration
  def change
    add_column :refinery_blog_posts, :news_hero_field, :text
  end
end
