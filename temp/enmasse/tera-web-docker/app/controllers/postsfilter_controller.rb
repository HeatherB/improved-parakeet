class PostsfilterController < ApplicationController
  require 'will_paginate/array'
  #before_filter :assign_posts

  respond_to :html, :xml, :json, :rss
  layout false


  # this is only used on the homepage and to set the news url for sesssion views
  def routeByPlatformFilter
    @current_platform_filter = session[:current_platform_filter]

    if @current_platform_filter == 'playstation'
      redirect_to('/news/categories/playstation')
    elsif @current_platform_filter == 'xbox'
      redirect_to('/news/categories/xbox')
    elsif @current_platform_filter == 'windows'
      redirect_to('/news/categories/windows')
    else
      redirect_to('/news/categories/all')
    end
  end

  # the special language versions
  def routeByPlatformFilterGerman
    @current_platform_filter = session[:current_platform_filter]

    if @current_platform_filter == 'playstation'
      redirect_to('/de/news/categories/playstation')
    elsif @current_platform_filter == 'xbox'
      redirect_to('/de/news/categories/xbox')
    elsif @current_platform_filter == 'windows'
      redirect_to('/de/news/categories/windows')
    else
      redirect_to('/de/news/categories/all')
    end
  end

  def routeByPlatformFilterFrench
    @current_platform_filter = session[:current_platform_filter]

    if @current_platform_filter == 'playstation'
      redirect_to('/fr/news/categories/playstation')
    elsif @current_platform_filter == 'xbox'
      redirect_to('/fr/news/categories/xbox')
    elsif @current_platform_filter == 'windows'
      redirect_to('/fr/news/categories/windows')
    else
      redirect_to('/fr/news/categories/all')
    end
  end


  def rssfeed
    # restrict to just pc posts 
    flagged_windows = Refinery::Blog::Category.where(title: "Windows").first
    if request.format.rss?
      @posts = if params["max_results"].present?
        # limit rss feed for services (like feedburner) who have max size
        #Refinery::Blog::Post.recent(params["max_results"])
        # restrict to pc posts
        flagged_windows.posts.newest_first.live.recent(params["max_results"])
      else
        #Refinery::Blog::Post.newest_first.live.includes(:comments, :categories)
        # restrict to pc posts
        flagged_windows.posts.newest_first.live.includes(:comments, :categories)
      end
    end
    respond_with (@posts) do |format|
      format.rss { render layout: false }
    end
  end

  def posts_filter_all
      @post_flagged_all = Refinery::Blog::Post.live.includes(
          :comments, :categories, :translations
        ).with_globalize.newest_first.paginate(page: params[:page], per_page: 3).all
      
      @home_posts = @post_flagged_all

      featured = Refinery::Blog::Category.where(title: "Featured").first
      posts_featured = featured.posts.live.includes(
          :comments, :categories, :translations
        ).with_globalize.newest_first.all
      @posts_featured = posts_featured.paginate(page: params[:page], per_page: 3)

      session[:current_platform_filter] = "all"

      respond_with(@post_flagged_all)
  end

  def posts_filter_windows
      flagged_windows = Refinery::Blog::Category.where(title: "Windows").first
      post_flagged_windows = flagged_windows.posts.live.includes(
          :comments, :categories, :translations
        ).with_globalize.newest_first.all
      @post_flagged_windows = flagged_windows.posts.live.includes(
          :comments, :categories, :translations
        ).with_globalize.newest_first.paginate(page: params[:page], per_page: 3).all
      @home_posts = @post_flagged_windows

      featured = Refinery::Blog::Category.where(title: "Featured").first
      posts_featured = featured.posts.live.includes(
          :comments, :categories, :translations
        ).with_globalize.newest_first.all
      posts_featured_windows = posts_featured & post_flagged_windows
      @posts_featured = posts_featured_windows.paginate(page: params[:page], per_page: 3)

      session[:current_platform_filter] = "windows"

      respond_with(@post_flagged_windows)
  end

  def posts_filter_playstation
      flagged_playstation = Refinery::Blog::Category.where(title: "Playstation").first
      post_flagged_playstation = flagged_playstation.posts.live.includes(
          :comments, :categories, :translations
        ).with_globalize.newest_first.all
      @post_flagged_playstation = flagged_playstation.posts.live.includes(
          :comments, :categories, :translations
        ).with_globalize.newest_first.paginate(page: params[:page], per_page: 3).all
      @home_posts = @post_flagged_playstation

      featured = Refinery::Blog::Category.where(title: "Featured").first
      posts_featured = featured.posts.live.includes(
          :comments, :categories, :translations
        ).with_globalize.newest_first.all
      posts_featured_playstation = posts_featured & post_flagged_playstation
      @posts_featured = posts_featured_playstation.paginate(page: params[:page], per_page: 3)

      session[:current_platform_filter] = "playstation"

      respond_with(@post_flagged_playstation)
  end

  def posts_filter_xbox
     flagged_xbox = Refinery::Blog::Category.where(title: "Xbox").first
     post_flagged_xbox = flagged_xbox.posts.live.includes(
          :comments, :categories, :translations
        ).with_globalize.newest_first.all
     @post_flagged_xbox = flagged_xbox.posts.live.includes(
          :comments, :categories, :translations
        ).with_globalize.newest_first.paginate(page: params[:page], per_page: 3).all
     @home_posts = @post_flagged_xbox

     featured = Refinery::Blog::Category.where(title: "Featured").first
     posts_featured = featured.posts.live.includes(
          :comments, :categories, :translations
        ).with_globalize.newest_first.all
     posts_featured_xbox = posts_featured & post_flagged_xbox
     @posts_featured = posts_featured_xbox.paginate(page: params[:page], per_page: 3)

     session[:current_platform_filter] = "xbox"

     respond_with(@post_flagged_xbox)
  end

  def rerollFeatured
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

    respond_with(@posts_featured)
  end


end