class Sso::SessionsController < ApplicationController
  before_filter :set_portal_next, :except => [:signout]
  skip_before_filter :validate_engarde, :only => [:signout]
  skip_before_filter :validate_additional_requirements, :only => [:signout]
  skip_after_filter :store_location, :except => [:signin, :register]

  def signin
    if logged_in? && cookies["serialized"].present?
      session[:sso_portal_signed_in] = true
      flash[:notice] = nil
      redirect_to get_portal_next
    else
      logout_user if logged_in?
      flash[:warning] = tslt(params[:msg]) if params[:msg].present?
      redirect_to signin_path
    end
  end

  def signout
    if params[:site]
      set_portal_next
      session[:redirect_to_portal] = true
    end
    session[:sso_portal_signed_in] = nil
    redirect_to signout_path
  end

  def register
    if logged_in?
      signin
    else
      redirect_to '/sign-up'
    end
  end

  protected

  def get_portal_next
    # if we don't have a valid redirect, send to AMS home
    session[:sso_portal_next] || index_url
  end

  def set_portal_next
    config = SECURE_CONFIG["sso"]
    site = params[:site]

    if config.nil? || config["sites"].nil? || config["sites"][site].nil?
      flash[:error] = "Unknown service"
      redirect_to index_path
    else
      domain = config["sites"][site].strip
      protocol = params[:s].to_i == 1 ? "https://" : "http://"
      path = params[:p]
      session[:sso_portal_next] = "#{protocol}#{domain}#{path}"
    end
  end

end
