module StringHelper
  def get_form_notice_boxes(field_name)
    return "<div class='field-notice'>
            <div id='#{field_name}-notice' class='field-notice-blue'></div>
            </div>".html_safe
  end
  
  def nil_to_string(val, default)
    val && !val.empty? ? val : default
  end

  def snippet(text, wordcount, omission)
    text.split[0..(wordcount-1)].join(" ") + (text.split.size > wordcount ? " " + omission : "")
  end

  # replaces new line characters w/ <br> BUT does not allow more than 2 subsequent breaks
  def add_breaks(text)
    # text.mgsub([[/\r/, ''], [/[\n]/, '<br />'], [/(\<br \/>){3,}/, '<br /><br />']])
    
    # use this one b/c the order of replace is important (e.g. the one above doesn't work quite right)
    text.gsub(/\r/, '').gsub(/[\n]/, '<br />').gsub(/(\<br \/>){3,}/, "<br /><br />").gsub(/(\<p>&nbsp;<\/p>){3,}/, "<p>&nbsp;</p><p>&nbsp;</p>").html_safe
  end
    
  def get_current_app_class(current_app, app)
    current_app == app ? "main-menu-item-current" : "main-menu-item"
  end

  def get_current_submenu_class(current_submenu, item)
    current_submenu == item ? "nav-#{item}-current" : "nav-#{item}"
  end
  
  def tab_bar(&block)
    concat(content_tag(:ul, capture(&block), :class => 'tab-bar'))
  end
  
  def tab(label,url,tab_options={},link_options={})
    unlinked_tab link_to(label,url,link_options), tab_options
  end
  
  def unlinked_tab(content,options={})
    content_tag :li, content, options
  end
end