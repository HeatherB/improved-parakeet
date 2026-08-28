module ErrorsHelper
  def error_messages_for(*params)
    options = params.extract_options!.symbolize_keys

    if object = options.delete(:object)
      objects = [object].flatten
    else
      objects = params.collect {|object_name| instance_variable_get("@#{object_name}") }.compact
    end

    count  = objects.inject(0) {|sum, object| sum + object.errors.count }
    unless count.zero?
      html = {}
      [:id, :class].each do |key|
        if options.include?(key)
          value = options[key]
          html[key] = value unless value.blank?
        else
          html[key] = 'errorExplanation'
        end
      end
      options[:object_name] ||= params.first

      I18n.with_options :locale => options[:locale], :scope => [:activerecord, :errors, :template] do |locale|
        header_message = if options.include?(:header_message)
          options[:header_message]
        else
          object_name = options[:object_name].to_s.gsub('_', ' ')
          object_name = I18n.t(object_name, :default => object_name, :scope => [:activerecord, :models], :count => 1)
          locale.t :header, :count => count, :model => object_name
        end
        message = options.include?(:message) ? options[:message] : locale.t(:body)
        error_messages = objects.sum {|object| full_flat_messages(object).map {|msg| content_tag(:li, ERB::Util.html_escape(msg)) } }.join

        contents = ''
        contents << content_tag(options[:header_tag] || :h2, header_message) unless header_message.blank?
        contents << content_tag(:p, message) unless message.blank?
        contents << content_tag(:ul, error_messages, nil, false)

        content_tag(:div, contents, html, false)
      end
    else
      ''
    end
  end  
  
  ####################
  #
  # added to make the errors display in a single line per field
  #
  ####################
  def full_flat_messages(object)
    full_messages = []
    errors_hash = {}
    object.errors.each do |k, v|
      if k.nil? || k.to_s.strip.empty?
        errors_hash["base"] = (errors_hash["base"] || []).concat(v.to_a) 
      else
        errors_hash[k] = (errors_hash[k] || []).concat(v.to_a) 
      end
    end
    errors_hash.each_key do |attrib|
      msg_part=msg=''
      errors_hash[attrib].each do |message|
        next unless message
        if attrib == "base"
          full_messages << message
        else
          msg=object.class.human_attribute_name(attrib)
          msg_part+= I18n.t('activerecord.errors.format.separator', :default => ' ') + (msg_part=="" ? '': ' & ' ) + message
        end
      end
      full_messages << "#{msg} #{msg_part}" if msg!=""
    end
    full_messages
  end
  
  def condensed_error_messages_for(object)
    out = ""
    if object && object.errors && object.errors.size > 0
      out << "<div class='error'><ul>"
      object.errors.each do |attr, msg|
        out << "<li>#{attr.capitalize} #{msg.downcase}</li>"
      end
      out << "</ul></div>"
    end
    return out.html_safe
  end
  
  def condensed_ver_error_messages_for(object)
    out = ""
    if object && object.errors && object.errors.size > 0
      out << "<div class='error'><ul>"
      object.errors.each do |attr, msg|
        out << "<li> #{msg}</li>"
      end
      out << "</ul></div>"
    end
    return out.html_safe
  end

end