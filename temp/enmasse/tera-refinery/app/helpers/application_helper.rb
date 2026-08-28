module ApplicationHelper
  
  def find_pages_for_menu
    # Compile the menu
    @menu_pages = Rails.cache.fetch("menu_pages") do
      ::Refinery::Menu.new(::Refinery::Page.fast_menu)
    end
  end
  
  def cdnify(link)
    if defined?(CDNS) && CDNS.length > 0 && link[0] == "/"
      CDNS.sort_by{rand}[0] + link
    else
      return link
    end
  end
  
  def version
    TeraRefinery.version
  end

  def is_home?
    return request.path == '/'
  end

  def is_what_is_tera?
    return request.path == '/game-guide/what-is-tera'
  end
end
