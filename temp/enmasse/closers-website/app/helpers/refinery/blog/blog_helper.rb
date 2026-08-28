module Refinery
  module Blog
    module BlogHelper
      
      def current_blog_post
        post = Refinery::Blog::Post.find(params[:id])
        if !post.try(:live?)
          if !(refinery_user? and current_refinery_user.authorized_plugins.include?("refinerycms_blog"))
            return nil
          end
        end
        return post
      end
  
      #def all_blog_posts
      #  Refinery::Blog::Post.live.includes(:comments).page(params[:page])
      #end
      
      def related_posts
        puts @posts.tags
        
      end

      def find_tags
        @tags = Rails.cache.fetch("blog_tags") do
          Refinery::Blog::Post.tag_counts_on(:tags).all
        end
      end

      def blog_post_teaser_enabled?
        Refinery::Blog::Post.teasers_enabled?
      end

      def blog_post_teaser(post)
        if post.respond_to?(:custom_teaser) && post.custom_teaser.present?
         post.custom_teaser.html_safe
        else
         truncate(post.body, {
           :length => Refinery::Blog.post_teaser_length,
           :preserve_html_tags => true
          }).html_safe
        end
      end

      def all_tags
        @tags ||= Refinery::Blog::Post.tag_counts_on(:tags)
      end
      
      def all_blog_categories
        Refinery::Blog::Category.all
      end
      
    end
  end
end