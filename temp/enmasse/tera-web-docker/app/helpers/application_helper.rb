module ApplicationHelper	
	  def is_legal?
	    return request.path.include?('legal')
	  end

	  def is_media?
	    return request.path == '/media'
	  end

	  def is_download?
	    return request.path.include?('/download')
	  end

	  def is_whatistera?
	    return request.path.include?('/what-is-tera')
	  end

	  def is_ambassador?
	  	return request.path.include?('ambassador-program')
	  end

	  def is_charracehome?
	  	return request.path.include?('races')
	  end

	  def is_charrace?
	  	return request.path.include?('races/')
	  end

	  def is_charclasshome?
	  	return request.path.include?('classes')
	  end

	  def is_charclass?
	  	return request.path.include?('classes/')
	  end

	  def is_showfilters?
	  	return request.path.include?('founders-packs') || request.path.include?('legal')
	  end

	  def is_newscats?
	  	return request.path.include?('/news/categories/')
	  end

	  def is_newsposts?
	  	return request.path.include?('/news/posts/')
	  end
	  
	  def is_partner_page?
	  	return request.path.include?('/partners')
	  end

	  def is_partner_program?
	  	return request.path.include?('/partner-program')
	  end
end
