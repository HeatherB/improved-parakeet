module ApplicationHelper
	  def is_legal?
	    return request.path.include?('legal')
	  end

	  def is_media?
	    return request.path == '/media'
	  end

	  def is_ambassador?
	  	return request.path.include?('ambassador-program')
	  end

	  def is_shopping?
	  	return request.path.include?('collectors-edition')
	    #return request.path.include?('founders-packs')
	  end

	  def is_timegate?
	  	return request.path.include?('bai-release-test')
	    #return request.path.include?('founders-packs')
	  end

	  def is_receipt?
	    return request.path.include?('receipt')
	  end
end
