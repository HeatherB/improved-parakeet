module Refinery
  module Blog
    class CategoriesController < BlogController

      before_action :find_category,  only: :show

      private

      def find_category
        @category = Refinery::Blog::Category.friendly.find(params[:id])
      end

      def find_all_blog_posts
        assign_featured_posts
         @posts = post_finder_scope.live.includes(
          :categories, :translations
         ).with_globalize.newest_first.paginate(page: params[:page]).all
       end

      def post_finder_scope
        @category.posts
      end

      def assign_featured_posts
        featured = Refinery::Blog::Category.where(title: "Featured").first
        @postft = featured.posts.where(:draft => false).order("published_at DESC").limit(3).all
      end

    end
  end
end