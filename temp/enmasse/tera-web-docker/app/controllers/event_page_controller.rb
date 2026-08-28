class EventPageController < ApplicationController

  layout 'event_page'

  def staticpage
    render "#{params[:page]}.html.erb"
  end
  
end