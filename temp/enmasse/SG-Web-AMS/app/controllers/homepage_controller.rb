class HomepageController < ApplicationController
  include ApplicationHelper
  before_filter :set_current_app
  before_filter :set_global_alerts, :only => :index
  before_filter :list_genre, :list_type, :list_platform
  skip_after_filter :store_location, :only => :index

  def index
    @games_all = Game.active.order("created_at DESC").all
    
    if in_launcher?
      redirect_to launcher_path(current_game_id)
    elsif logged_in?
      redirect_to users_account_path
    end
  end

  def gamesearch
    @games_all = Game.active.order("created_at DESC").all
    @search_term = params[:searchbox].downcase.strip
    @search_results = p @games_all.find_all{|h| h['name'].downcase =~ /#{@search_term}/}

    respond_to do |format|
        format.js
    end

  end

  protected

  def set_current_app
    @current_app = "homepage"
    @account_pages = "acct_pages"
  end

  def fetch_regular_login
    respond_to do |format|
        format.js
    end
  end

  def fetch_console_login
    respond_to do |format|
        format.js
    end
  end

  def fetch_signin_or_up
    respond_to do |format|
        format.js
    end
  end

end
