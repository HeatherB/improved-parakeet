module Refinery
  module Blog
    class CategoriesController < BlogController

      before_action :find_category, :find_all_blog_posts, only: :show
      before_action :checkPlatformFilter
      before_action :checkFeatured
      #before_filter :checkQueryFilter

      private

      def find_category
        @category = Refinery::Blog::Category.friendly.find(params[:id])
      end

      def post_finder_scope
        #@category.posts

        if @category.title.downcase == 'all'
          @post_flagged_all = Refinery::Blog::Post.where(:draft => false).order("published_at DESC").paginate(page: params[:page], per_page: 10).all

          @category.posts = @post_flagged_all
        else 
          @category.posts
        end
      end

      def checkPlatformFilter
        session[:current_platform_filter] = @category.title.downcase 
        @current_platform_filter = session[:current_platform_filter]
      end

      def checkFeatured
        featured = Refinery::Blog::Category.where(title: "Featured").first

        posts_featured = featured.posts.live.includes(
              :comments, :categories, :translations
            ).with_globalize.newest_first.all

        flagged_windows = Refinery::Blog::Category.where(title: "Windows").first
        post_flagged_windows = flagged_windows.posts.live.includes(
              :comments, :categories, :translations
            ).with_globalize.newest_first.all
        

        flagged_playstation = Refinery::Blog::Category.where(title: "Playstation").first
        post_flagged_playstation = flagged_playstation.posts.live.includes(
              :comments, :categories, :translations
            ).with_globalize.newest_first.all
        

        flagged_xbox = Refinery::Blog::Category.where(title: "Xbox").first
        post_flagged_xbox = flagged_xbox.posts.live.includes(
              :comments, :categories, :translations
            ).with_globalize.newest_first.all
        

        #setup featured and platform
        # all featured, [15, 50, 55, 57, 59]
        posts_featured_windows = posts_featured & post_flagged_windows
        # windows, no matches
        posts_featured_playstation = posts_featured & post_flagged_playstation
        #playstation, [55, 57, 59]
        posts_featured_xbox = posts_featured & post_flagged_xbox
        # xbox, [55, 57, 59]

        @current_platform_filter = session[:current_platform_filter]

        if @current_platform_filter == "xbox"
          @posts_featured = posts_featured_xbox.paginate(page: params[:page], per_page: 3)
        elsif @current_platform_filter == "playstation"
          @posts_featured = posts_featured_playstation.paginate(page: params[:page], per_page: 3)
        elsif @current_platform_filter == "windows"
          @posts_featured = posts_featured_windows.paginate(page: params[:page], per_page: 3)
        else
          @posts_featured = posts_featured.paginate(page: params[:page], per_page: 3)
        end
      end

      def checkQueryFilter
        #query params on news homepage
        if params[:ver]

          if params[:ver] == "xbox"
            @queryFilter = "xbox"
            @current_platform_filter = "xbox"
            session[:current_platform_filter] = "xbox"
          end

          if params[:ver] == "xboxone"
            @queryFilter = "xbox"
            @current_platform_filter = "xbox"
            session[:current_platform_filter] = "xbox"
          end

          if params[:ver] == "playstation"
            @queryFilter = "playstation"
            @current_platform_filter = "playstation"
            session[:current_platform_filter] = "playstation"
          end

          if params[:ver] == "ps"
            @queryFilter = "playstation"
            @current_platform_filter = "playstation"
            session[:current_platform_filter] = "playstation"
          end

          if params[:ver] == "windows"
            @queryFilter = "windows"
            @current_platform_filter = "windows"
            session[:current_platform_filter] = "windows"
          end

          if params[:ver] == "pc"
            @queryFilter = "windows"
            @current_platform_filter = "windows"
            session[:current_platform_filter] = "windows"
          end

          if params[:ver] == "all"
            @queryFilter = "all"
            @current_platform_filter = "all"
            session[:current_platform_filter] = "all"
          end
        end
      end

    end
  end
end