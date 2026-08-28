Refinery::Blog::Admin::PostsController.class_eval do

  before_filter :save_tags_and_date, :only => [:update, :create]
  after_filter :sweep_tags_and_archives, :only => [:update, :create]

  def save_tags_and_date
    p = if params[:post][:id]
      ::Refinery::Blog::Post.find(params[:post][:id])
    else
      ::Refinery::Blog::Post.new(params[:post])
    end
    @previous_tags = p.tags
    @previous_date = p.published_at
    @was_live = p.live?
  end

  def sweep_tags_and_archives
    return true if(!@was_live && !@post.live?)
    #changed_tags are union - intersection
    changed_tags = ((@previous_tags | @post.tags) - (@previous_tags & @post.tags) )

    changed_tags.each do |tag|
      Rails.cache.delete("tag_#{tag.id}")
      Rails.cache.delete("posts_tagged_with_#{tag.name.parameterize}")
      expire_fragment("tagged_#{tag.name.parameterize}")
    end

    if(@old_date != @post.published_at)
      [@old_date, @post.published_at].compact.each do |date|
        Rails.cache.delete("archived_posts_for_date_0_#{date.year}")
        Rails.cache.delete("archived_posts_for_date_#{date.month}_#{date.year}")
      end
    end
  end
end
