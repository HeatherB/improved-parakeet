class AddNewsHeroToRefineryPages < ActiveRecord::Migration
  def change
    add_column :refinery_blog_posts, :news_hero_id, :integer
  end
end