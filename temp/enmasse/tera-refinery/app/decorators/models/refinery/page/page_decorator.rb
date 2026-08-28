Refinery::Page.class_eval do
#  # worry about expiring cache asfter cache works.
#  #after_update :expire_updated_pages
#  #
#  #def expire_updated_pages
#  #  expire_page :action => :index
#  #  expire_page :action => :home
#  #  # expires all ids?  (need to rebuild the navigation on each page possibly)
#  #  expire_page :action => :show
#  #end
#  
  def self.site_wide_alert
    Rails.cache.fetch('site-wide') do
      begin
        page = Refinery::Page.find("site-wide-alert")
      rescue
        return false
      end
      data = page.parts.select{|p| p.title == "Body" }
      return false if data.empty?
      value = data[0].body.strip
      return false if value.nil?
      return value
    end
  end
  
  def self.sweep_site_wide_alert_cache
    Rails.cache.delete('site-wide')
    #Rails.cache.delete('site-wide')
  end
  
  # Updates to Refinery have made finding pages more path driven, This is to by-pass that is only one page with the name exists, and also to cache the results.
  def self.find_by_path(path)
    Rails.cache.fetch("page-finder/#{path}", :expires_in => 900.seconds) do
      split_path = path.to_s.split('/').reject(&:blank?)
      pages = ::Refinery::Page.by_slug(split_path.last).all
      return pages[0] if pages.length == 1
  
      # try the old method. if you did not find just one page.
      #split_path = path.to_s.split('/').reject(&:blank?)
      page = ::Refinery::Page.by_slug(split_path.shift, :parent_id => nil).first
      page = page.children.by_slug(split_path.shift).first until page.nil? || split_path.empty?
  
      return page
    end
  end
end
