Refinery::Blog::BlogController.class_eval do
  require 'will_paginate/array'  
  before_filter :find_all_blog_categories
  before_filter :assign_feature
  before_filter :checkPlatformFilter
  before_filter :checkQueryFilter, only: [:show]


  def find_all_blog_categories
    @categories = Refinery::Blog::Category.translated
  end

  def checkPlatformFilter
    @current_platform_filter = session[:current_platform_filter]
  end

  def checkQueryFilter
    #query params on individual news posts
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

  def assign_feature
    #@posts = Refinery::Blog::Post.where(:draft => false).order("published_at DESC").all
    @post_flagged_all = Refinery::Blog::Post.live.includes(
          :comments, :categories, :translations
        ).with_globalize.newest_first.paginate(page: params[:page], per_page: 10).all
    #@post_flagged_all = Refinery::Blog::Post.where(:draft => false).order("published_at DESC").paginate(page: params[:page], per_page: 10).all
    #@newsposts = Refinery::Blog::Post.where(:draft => false).order("published_at DESC").paginate(page: params[:page], per_page: 10).all

    featured = Refinery::Blog::Category.where(title: "Featured").first
    #@posts_featured = featured.posts.where(:draft => false).with_globalize.order("published_at DESC").limit(3).all
    @posts_featured = featured.posts.live.includes(
          :comments, :categories, :translations
        ).with_globalize.newest_first.paginate(page: params[:page], per_page: 3).all


    flagged_xbox = Refinery::Blog::Category.where(title: "Xbox").first
    #@post_flagged_xbox = flagged_xbox.posts.where(:draft => false).order("published_at DESC").paginate(page: params[:page], per_page: 10).all
    @post_flagged_xbox = flagged_xbox.posts.live.includes(
          :comments, :categories, :translations
        ).with_globalize.newest_first.paginate(page: params[:page], per_page: 10).all

    flagged_playstation = Refinery::Blog::Category.where(title: "Playstation").first
    #@post_flagged_playstation = flagged_playstation.posts.where(:draft => false).order("published_at DESC").paginate(page: params[:page], per_page: 10).all
    @post_flagged_playstation = flagged_playstation.posts.live.includes(
          :comments, :categories, :translations
        ).with_globalize.newest_first.paginate(page: params[:page], per_page: 10).all

    flagged_windows = Refinery::Blog::Category.where(title: "Windows").first
    #@post_flagged_windows = flagged_windows.posts.where(:draft => false).order("published_at DESC").paginate(page: params[:page], per_page: 10).all
    @post_flagged_windows = flagged_windows.posts.live.includes(
          :comments, :categories, :translations
        ).with_globalize.newest_first.paginate(page: params[:page], per_page: 10).all

  end


end
