Refinery::PagesController.class_eval do
  
  skip_before_filter :find_all_blog_categories
  helper :'refinery/blog/posts'
  
  def home
    @posts = Rails.cache.fetch("home_page_blog_posts") do
      Refinery::Blog::Post.where(:draft => false).order("published_at desc").limit(3).all
    end
  end
  
  #def cache_page?(c)
    
  #end
  
  #def write_cache?
  #  puts "CHRIS' DEBUG $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$"
  #  puts "Refinery::Pages.cache_blacklist : #{Refinery::Pages.cache_blacklist}"
  #  puts "Refinery::Pages.cache_blacklist.include?(page.friendly_id) : Refinery::Pages.cache_blacklist.include?(#{page.friendly_id}) : #{Refinery::Pages.cache_blacklist.include?(page.friendly_id)}"
  #  if Refinery::Pages.cache_pages_full && !refinery_user? && !Refinery::Pages.cache_blacklist.include?(page.friendly_id)
  #    puts "IN THE IF!!!!!!!"
  #    cache_page(response.body, File.join('', 'refinery', 'cache', 'pages', request.path.sub("//", "/")).to_s)
  #  end
  #end
end
