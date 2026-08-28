class StaticController < ApplicationController

	def staticpage
		render "#{params[:page_name]}.html.erb"
	end
	
end