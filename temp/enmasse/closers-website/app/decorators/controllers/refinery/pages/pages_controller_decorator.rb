Refinery::PagesController.class_eval do

  include Refinery::Blog::ControllerHelper

  #before_filter :assign_featured_posts,
  #efore_filter :assign_home_posts
  #before_filter :assign_page, only: [:home]

  #def assign_page
  #  if cookies[:closers_first_time] != '1'
  #    cookies[:closers_first_time] = {
  #     :value => '1',
  #     :expires => 1.year.from_now,
  #     :domain => :all
  #   }
  #   cookies[:closers_first_time_redirect] = [:bodyclass => "firstabout"]
  #   redirect_to "/about"
  #  end
  #end

  def home
    page = params[:page] || 1

    @postshome = Refinery::Blog::Post.live.includes(
          :comments, :categories, :translations
        ).with_globalize.newest_first.paginate(page: params[:page], per_page: 4).all
    # allow blog posts on homepage
    #@posts = Rails.cache.fetch("home_page_blog_posts") do
    #  @posts = Refinery::Blog::Post.where(:draft => false).order("published_at DESC").limit(4).all
    #end    
  end

  def index
    page = params[:page] || 1
    #find_tags
    #@categories = all_blog_categories
  end

  def show
    page = params[:page] || 1
    #find_tags
    #@categories = all_blog_categories
  end

  #def assign_home_posts
  #  @postshome = Refinery::Blog::Post.where(:draft => false).order("published_at DESC").includes(:translations, {categories: [:translations]}).limit(10).all
  #end

  #def assign_featured_posts
  #  featured = Refinery::Blog::Category.where(title: "Featured").first
  #  @postft = featured.posts.where(:draft => false).order("published_at DESC").limit(3).all
  #end

end