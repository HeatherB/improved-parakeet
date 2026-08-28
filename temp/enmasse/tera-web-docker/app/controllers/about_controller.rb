class AboutController < ApplicationController
    before_filter :assign_page
    
    def assign_page
        #page = Refinery::Page.find("43");
        page = Refinery::Page.find_by_path("about");
        #page = Refinery::Page.find_by_slug('about').refinery_page

        header_part = page.parts.select{|a| a.title == "Article Header"}.first if page && page.parts
        @custom_header = header_part ? header_part.body : ""

        body_part = page.parts.select{|a| a.title == "Body"}.first if page && page.parts
        @custom_body = body_part ? body_part.body : ""
        
        wide_part = page.parts.select{|a| a.title == "Wide Body"}.first if page && page.parts
        @custom_wide = wide_part ? wide_part.body : ""

        side_part = page.parts.select{|a| a.title == "Side Body"}.first if page && page.parts
        @custom_side = side_part ? side_part.body : ""

        footer_part = page.parts.select{|a| a.title == "Article Footer"}.first if page && page.parts
        @custom_footer = footer_part ? footer_part.body : ""
    end

    def index
        if cookies[:tera_first_time_redirect]
          @bodyclass = "firstabout"
          cookies.delete(:tera_first_time_redirect)
        end
        render "/about/index"
    end

    def show
    end

end