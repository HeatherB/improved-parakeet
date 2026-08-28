Refinery::PagesController.class_eval do
  require 'will_paginate/array'
  require 'set'
  include Refinery::Blog::ControllerHelper

  #before_filter :assign_featured_posts, :assign_home_posts
  #before_filter :assign_page, only: [:home]
  #before_filter :class_race_guides
  before_filter :gatherRaceSubLinks
  before_filter :gatherClassSubLinks
  before_filter :checkPlatformFilter
  before_filter :checkQueryFilter

  def assign_page
    if cookies[:tera_first_time] != '1'
      cookies[:tera_first_time] = {
       :value => '1',
       :expires => 1.year.from_now,
       :domain => :all
     }
     cookies[:tera_first_time_redirect] = [:bodyclass => "firstabout"]
     redirect_to "/about"
    end
  end

  def checkPlatformFilter
    @current_platform_filter = session[:current_platform_filter]
  end

  def checkQueryFilter
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

      if params[:ver] == "ps4"
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


  def home
    page = params[:page] || 1

    featured = Refinery::Blog::Category.where(title: "Featured").first

    posts_featured = featured.posts.live.includes(
          :comments, :categories, :translations
        ).with_globalize.newest_first.all
    #@posts_featured = featured.posts.live.includes(
    #      :comments, :categories, :translations
    #    ).with_globalize.newest_first.paginate(page: params[:page], per_page: 3).all

    @post_flagged_all = Refinery::Blog::Post.live.includes(
          :comments, :categories, :translations
        ).with_globalize.newest_first.paginate(page: params[:page], per_page: 3).all

    flagged_windows = Refinery::Blog::Category.where(title: "Windows").first
    post_flagged_windows = flagged_windows.posts.live.includes(
          :comments, :categories, :translations
        ).with_globalize.newest_first.all
    @post_flagged_windows = flagged_windows.posts.live.includes(
          :comments, :categories, :translations
        ).with_globalize.newest_first.paginate(page: params[:page], per_page: 3).all

    flagged_playstation = Refinery::Blog::Category.where(title: "Playstation").first
    post_flagged_playstation = flagged_playstation.posts.live.includes(
          :comments, :categories, :translations
        ).with_globalize.newest_first.all
    @post_flagged_playstation = flagged_playstation.posts.live.includes(
          :comments, :categories, :translations
        ).with_globalize.newest_first.paginate(page: params[:page], per_page: 3).all

    flagged_xbox = Refinery::Blog::Category.where(title: "Xbox").first
    post_flagged_xbox = flagged_xbox.posts.live.includes(
          :comments, :categories, :translations
        ).with_globalize.newest_first.all
    @post_flagged_xbox = flagged_xbox.posts.live.includes(
          :comments, :categories, :translations
        ).with_globalize.newest_first.paginate(page: params[:page], per_page: 3).all

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
      @home_posts = @post_flagged_xbox
      @posts_featured = posts_featured_xbox.paginate(page: params[:page], per_page: 3)
    elsif @current_platform_filter == "playstation"
      @home_posts = @post_flagged_playstation
      @posts_featured = posts_featured_playstation.paginate(page: params[:page], per_page: 3)
    elsif @current_platform_filter == "windows"
      @home_posts = @post_flagged_windows
      @posts_featured = posts_featured_windows.paginate(page: params[:page], per_page: 3)
    else
      @home_posts = @post_flagged_all
      @posts_featured = posts_featured.paginate(page: params[:page], per_page: 3)
    end
  
  end

  #def index
  #  page = params[:page] || 1
  #end

  #def show
  #  page = params[:page] || 1
  #end

  def gatherRaceSubLinks
    captureRacePage = Refinery::Page.where(:draft => false, :slug => "races").first
    racePageId = captureRacePage.id
    @racePageChildren = Refinery::Page.where(:draft => false, :parent_id => racePageId).all
  end

  def gatherClassSubLinks
    captureClassPage = Refinery::Page.where(:draft => false, :slug => "classes").first
    classPageId = captureClassPage.id
    @classPageChildren = Refinery::Page.where(:draft => false, :parent_id => classPageId).all
  end



end