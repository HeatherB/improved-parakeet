module Refinery
  module Blog
    class BlogController < ::ApplicationController

      helper :'refinery/blog/posts'
      before_action :find_page, :find_all_blog_categories
      before_action :find_all_blog_posts_exclude_current,  only: :show

      protected

      def find_all_blog_categories
        @categories = Refinery::Blog::Category.translated
      end

      def find_blog_post
        unless (@post = post_finder_scope.with_globalize.friendly.find(params[:id])).try(:live?)
          if current_refinery_user && current_refinery_user.has_plugin?("refinerycms_blog")
            @post = post_finder_scope.friendly.find(params[:id])
          else
            error_404
          end
        end
      end

       def find_all_blog_posts
         @posts = post_finder_scope.live.includes(
          :categories, :translations
         ).with_globalize.newest_first.all
       end

       def find_all_blog_posts_exclude_current
         @posts = post_finder_scope.live.includes(
          :categories, :translations
         ).with_globalize.newest_first.paginate(page: params[:page]).all

         current_post = post_finder_scope.friendly.find(params[:id])
         @posts_trunc = @posts.where.not(id: current_post.id).limit(6)
       end

      def find_page
        @page = Refinery::Page.find_by(:link_url => Refinery::Blog.page_url)
      end

      def find_tags
        @tags = post_finder_scope.live.tag_counts_on(:tags)
      end

      def post_finder_scope
        Refinery::Blog::Post
      end
    end
  end
end