Refinery::Blog::Admin::PostsController.prepend(
  Module.new do
    def permitted_post_params
      super << [:news_hero_field, :teaser_img_field]
    end
  end
)