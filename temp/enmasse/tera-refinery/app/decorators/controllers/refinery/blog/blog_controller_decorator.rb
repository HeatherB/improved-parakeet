Refinery::Blog::BlogController.class_eval do
  
  skip_before_filter :find_all_blog_categories
  
  def find_page
   @page = Rails.cache.fetch("blog_page") do
     Refinery::Page.find_by_link_url("/news")
   end
  end
end
