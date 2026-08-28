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

      def all_tags
        @tags ||= Refinery::Blog::Post.tag_counts_on(:tags)
      end
      
      def all_blog_categories
        Refinery::Blog::Category.all
      end
      
    end
  end
end
