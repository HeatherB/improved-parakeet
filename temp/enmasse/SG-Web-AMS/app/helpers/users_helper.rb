module UsersHelper
  
  def user_error_css(user, field, show_valid=false) 
    return unless user.present?
    if user.errors[field].present?
      "with_errors"
    else
      "valid" if show_valid && user[field].present?
    end
  end
  
  def account_nav_link(title, current, path, options={})
    css_class = options[:class] || ""
    options[:class] = "active #{css_class}" if title == current
    link_to(title, path, options)
  end

  def post_to_link(url, params, submit_options={:value => 'Submit'})
    output = "<form action=\"#{url}\" method=\"post\">"
    if params.present? && params.size > 0
      params.each do |key, value|
        output += "<input type=\"hidden\" id=\"#{key}\" name=\"#{key}\" value=\"#{value}\" />"
      end
    end
    output += "<input type=\"submit\" name=\"submit\" value=\"#{submit_options[:value]}\" #{submit_options[:class] ? "class=\"#{submit_options[:class]}\"" : ""} />"
    output += "</form>"
    output.html_safe
  end
  
end