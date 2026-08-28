class CustomerSupport::SessionsController < ApplicationController
  before_filter :set_portal_next, :except => [:signout]
  skip_after_filter :store_location, :except => [:signin]
  
  def signin
    if logged_in?
      pta = RightNow::PassThroughAuth.new(SECURE_CONFIG)
      redirect = get_portal_next
      session[:rn_portal_signed_in] = true
      redirect_to pta.login_url(redirect, current_user)
    else
      access_denied
    end
  end
  
  def signout
    session[:rn_portal_next] = nil
    session[:rn_portal_signed_in] = nil
    redirect_to signout_path
  end
  
  def register
    if logged_in?
      signin
    else
      redirect_to '/sign-up'
    end
  end
  
  def error
    @error_code = params[:code]
  end
  
  protected
  
  def get_portal_next
    session[:rn_portal_next] || "home"
  end
  
  def set_portal_next
    session[:rn_portal_next] = params[:next] if params[:next].present?
  end
  
end