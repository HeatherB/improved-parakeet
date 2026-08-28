class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
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

end
