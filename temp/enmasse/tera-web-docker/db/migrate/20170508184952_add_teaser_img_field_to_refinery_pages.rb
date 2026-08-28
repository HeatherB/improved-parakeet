class AddTeaserImgFieldToRefineryPages < ActiveRecord::Migration
  def change
    add_column :refinery_blog_posts, :teaser_img_field, :text
  end
end
