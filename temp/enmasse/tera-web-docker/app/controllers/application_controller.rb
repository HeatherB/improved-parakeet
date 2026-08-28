class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  before_action :set_locale
  before_action :set_page_app
  include ApplicationHelper


  PartNames = {  header: "Article Header",
                  body: "Body",
                  wide_body: "Wide Body",
                  side_body: "Side Body",
                  footer: "Article Footer"}
	def page_parts(slug)
	    page = Refinery::Page.where(slug: slug).first
	    parts = {}
	    if page && page.parts
	      PartNames.each {|label, part_name| parts[label] = page.parts.select{|a| a.title == part_name }.first }
	    end
	    page_data = {}
	    PartNames.keys.each {|label| page_data[label] = parts[label] ? parts[label].body : "" }
	    return page_data
	end

	def set_page_app
		if is_charrace?
			@current_app = 'races_page'
		end

		if is_charracehome?
			@current_app = 'races_page'
		end

		if is_charclass?
			@current_app = 'classes_page'
		end

		if is_charclasshome?
			@current_app = 'classes_page'
		end

		if is_whatistera?
			@current_app = 'whatistera_page'
		end
	end


  private

	def set_locale
    	@locale ||= params[:locale] || session[:locale] || I18n.default_locale
    	I18n.locale = session[:locale] = @locale
  	end

	def default_url_options
		{ locale: I18n.locale }
	end

	

end
