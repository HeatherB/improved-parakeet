class AddTeaserImageToBlogPosts < ActiveRecord::Migration
  def change
    add_column :refinery_blog_posts, :teaser_image_id, :integer
  end
end
