module WidgetsHelper
  def grouped_blog_archive_widget(locals = {})
    posts = Refinery::Blog::Post.live.select('published_at').all
    return nil if posts.blank?
    
    grouped_archives = {}
    # Group blog posts by year and month (2011-05, etc.)
    archives = posts.group_by { |post| post.published_at.strftime("%Y-%m") }
    # Generates a hash structure to store the counts of each month's blog posts
    # and stores them by year.
    # { 2011 => [ { :month => '05', :count => 10 }, { :month => '04', :count => 11 } ] }
    archives.each do |year_month, blog_posts|
      year, month = year_month.split('-')
      grouped_archives[year] = [] unless grouped_archives[year].is_a?(Array)
      grouped_archives[year] << { :month => month, :count => blog_posts.length }
    end
    
    render :partial => "/refinery/blog/shared/blog_archive", :locals => locals.merge!(:grouped_archives => grouped_archives)
  end
  
  # Generate a link for the grouped blog archive widget widget using the year 
  # and month provided.
  #
  # A span tag containing the name of the month will be returned if the
  # link to be generated would represent the active page.
  def link_for_grouped_archive_blog_widget(year, month)
    if params[:year] == year && params[:month] == month
      content_tag(:span, monthname_for_number(month))
    else
      link_to monthname_for_number(month), refinery.blog_archive_posts_path(:year => year, :month => month)
    end
  end

  def blog_rss_link(options = {:header_corner => false})
    if(options[:header_corner] == true)
      # eme-specific 'render in the corner of the section header' styling
      link_to t('.subscribe'), "/blog/rss", :title => "RSS", :class => "rss"
    else
      # default refinery styling
      link_to t('.subscribe'), "/blog/rss", :title => "RSS", :id => "rss_feed_subscribe"
    end
  end
  
  # fix for broken blogs
  def blog_post_teaser_enabled?
    true
  end
  
  def blog_post_teaser(post)
    return post.custom_teaser.html_safe
  end
  
end
