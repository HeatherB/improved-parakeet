Refinery::Blog::BlogController.class_eval do
  require 'will_paginate/array'
  
  before_filter :find_all_blog_categories
  before_filter :assign_feature
  before_filter :assign_not_featured


  def find_all_blog_categories
    @categories = Refinery::Blog::Category.translated
  end

  def assign_feature
    featured = Refinery::Blog::Category.where(title: "Featured").first
    #@postft = featured.posts.live.order("published_at DESC").limit(3).all

    @postft = featured.posts.live.includes(
          :comments, :categories, :translations
        ).with_globalize.newest_first.limit(3).all
  end


  def assign_not_featured
    featured = Refinery::Blog::Category.where(title: "Featured").first
    postft = featured.posts.live.newest_first.limit(3).all

    #@posts = post_finder_scope.live.includes(
    #      :categories, :translations
    #     ).with_globalize.all

    posts = Refinery::Blog::Post.live.includes(
          :comments, :categories, :translations
        ).with_globalize.newest_first.all

    #@posts_notfeatured = @posts.where.not(title: "Featured").newest_first.paginate(page: params[:page]).all

    posts_nf = posts - postft
    @posts_notfeatured = posts_nf.paginate(page: params[:page], per_page: 10)
  end

 
end
