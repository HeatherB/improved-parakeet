module ContentForHelper
  
  def footer_content(footer_content)
    content_for(:footer_content) { render :partial => footer_content }
  end
    
  # Dynamic title
  def title(page_title)
    content_for(:title) { page_title }
  end
  
  # Dynamic body selector
  def body_id(id)
    content_for(:body_id) { id }
  end
  
  def head(content)
    content_for(:head) { content }
  end

  def extra_css(names_array)
    out = ""
    names_array.each { |n| out << stylesheet_link_tag(n) }
    content_for(:extra_css) { out }
  end
  
  def current_app(current_app)
    content_for(:current_app) { current_app }
  end
  
  def show_app_submenu(current_item)
    content_for(:submenu) { current_item }
  end
  
  def sidebar(sidebar_partial)
    content_for(:sidebar) { render :partial => sidebar_partial }
  end
  
  def content_featured(content_featured_partial)
    content_for(:content_featured) { render :partial => content_featured_partial }
  end
  
end