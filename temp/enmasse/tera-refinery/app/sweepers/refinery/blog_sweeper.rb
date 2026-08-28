module Refinery
  class BlogSweeper < ActionController::Caching::Sweeper
    observe Blog::Post, Blog::Comment

    def after_create(record)
      expire_cache_for(record)
    end

    def after_update(record)
      expire_cache_for(record)
    end

    def after_destroy(record)
      expire_cache_for(record)
    end

    private

    def expire_cache_for(record)
      expire_fragment("tag_cloud")
      expire_fragment("archive_list")

      # main show views
      expire_fragment("blog_post_#{record.id}")
      expire_fragment("blog_post_#{record.friendly_id}")
      expire_fragment("head/posts/show/#{record.id}")

      # main previews
      expire_fragment("blog_post_preview_#{record.id}")

      # index pages
      per_page = ::Refinery::Setting.get(:blog_posts_per_page) || 10
      page_count = (Refinery::Blog::Post.live.count/per_page) + 1
      (1..page_count).each do |i|
        expire_fragment Refinery::Blog::Post.cache_key_for_paged({:action => 'index', :page => i})
        expire_fragment("blog_posts_index_#{i}")
        Rails.cache.delete("blog_post_list_page_#{i}")
      end
    end

  end
end
