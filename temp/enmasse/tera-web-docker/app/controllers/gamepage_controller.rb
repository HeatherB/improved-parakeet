class GamepageController < ApplicationController
  before_filter :assign_page_race
  before_filter :assign_page_class

  #def whatistera
  #  @current_app = "whatistera"
  #	render "/what-is-tera/index"
  #end

  #def racesindex
  #  render "/layouts/race_home", :layout => false
  #end

  #def classesindex
  #  render "/layouts/class_home", :layout => false
  #end

  def assign_page_class
      page = Refinery::Page.find_by_path("/game/classes");

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

  def assign_page_race
      page = Refinery::Page.find_by_path("/game/races");

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