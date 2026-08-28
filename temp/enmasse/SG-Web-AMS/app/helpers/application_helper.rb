# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
  include TsltHelper, ContentForHelper, StringHelper, DateFunctionsHelper, ErrorsHelper
  
  
  def include_js(src)
    head(javascript_include_tag(src))
  end

  def get_update_token
    update_token = Digest::SHA1.hexdigest( Time.now.to_s.split(//).sort_by {rand}.join )
    session[:update_token] = update_token
    hidden_field_tag "update_token", update_token
  end
  
  def clear
    content_tag(:div, '', :class => 'clear');
  end

  def machine_hostname
    `hostname`.strip
  end

  def list_genre
    @genre_filters_all = ['MMORPG', 'FPS']
    @genre_mmorpg = 'MMORPG'
    @genre_fps = 'FPS'
  end

  def list_type
    @type_filters_all = ['Epic', 'Fantasy', 'Online', 'Stylish', 'Arcade']
    @type_epic = 'Epic'
    @type_fantasy = 'Fantasy'
    @type_online = 'Online'
    @type_stylish = 'Stylish'
    @type_arcade = 'Arcade'
  end

  def list_platform
    @platform_filters_all = ['PC', 'XB', 'PS']
    @platform_PC = 'PC'
    @platform_Xbox = 'XB'
    @platform_PS = 'PS'
  end
  
end