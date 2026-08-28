class MediaController < ApplicationController
	before_filter :assign_page
  before_filter :checkPlatformFilter
  before_filter :checkQueryFilter


	def index
    	@current_app = "media"
    	@screenshot_images = Dir.glob("app/assets/images/media/screenshots/thumbs/*.jpg")

      if(@screenshot_images)
        @screenshot_images_sliced = @screenshot_images.each_slice(9).to_a
      end

      @moreScreens = @screenshot_images_sliced[0]

      @concept_images = Dir.glob("app/assets/images/media/concepts/thumbs/*jpg")
  		render "/media/index"
  end


  def reRollScreenshots
    screenshot_images = Dir.glob("app/assets/images/media/screenshots/thumbs/*.jpg")

    if(screenshot_images)
      screenshot_images_sliced = screenshot_images.each_slice(9).to_a
    end
    #
   # i ||= 0;
   # if i < screenshot_images_sliced.length 
   #   @moreScreens =  screenshot_images_sliced[i+1];
   #   i += 1;
   # end
    #

    @moreScreens = screenshot_images_sliced[0] + screenshot_images_sliced[1]

    respond_to do |format|
      format.js
    end
  end


  def checkPlatformFilter
    @current_platform_filter = session[:current_platform_filter]
  end

  def checkQueryFilter
    if params[:ver]

      if params[:ver] == "xbox"
        @queryFilter = "xbox"
        @current_platform_filter = "xbox"
        session[:current_platform_filter] = "xbox"
      end

      if params[:ver] == "xboxone"
        @queryFilter = "xbox"
        @current_platform_filter = "xbox"
        session[:current_platform_filter] = "xbox"
      end

      if params[:ver] == "playstation"
        @queryFilter = "playstation"
        @current_platform_filter = "playstation"
        session[:current_platform_filter] = "playstation"
      end

      if params[:ver] == "ps"
        @queryFilter = "playstation"
        @current_platform_filter = "playstation"
        session[:current_platform_filter] = "playstation"
      end

      if params[:ver] == "windows"
        @queryFilter = "windows"
        @current_platform_filter = "windows"
        session[:current_platform_filter] = "windows"
      end

      if params[:ver] == "pc"
        @queryFilter = "windows"
        @current_platform_filter = "windows"
        session[:current_platform_filter] = "windows"
      end

      if params[:ver] == "all"
        @queryFilter = "all"
        @current_platform_filter = "all"
        session[:current_platform_filter] = "all"
      end
    end
  end



	def assign_page
      #page = Refinery::Page.find("43");
      page = Refinery::Page.find_by_path("/game/media");
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

end