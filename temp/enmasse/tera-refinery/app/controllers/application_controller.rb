class ApplicationController < ActionController::Base
  skip_before_filter :find_page, :find_pages_for_menu, :refinery_user_required?
  helper :all
  
  before_filter :age_gate_check, :emp_check
  
  def emp_check
    if session[:account_id] && session[:emp].nil?
      wallet = BillingAdapterInterface.get_wallet(session[:account_id])
      session[:emp] = if wallet && wallet.EMP && wallet.EMP[:amount]
        wallet.EMP[:amount]
      else
        'error'
      end
    end
  end

  if Rails.env == "development"
    before_filter :clear_cache
    def clear_cache
      Rails.cache.clear
    end
  end
  
  protect_from_forgery
  
  def age_gate_check
    return if request.path == "/age-gate-failed"
    redirect_to("/age-gate-failed") if cookies['of_age'] == 'false'
  end
  
  def tera_user_signed_in?
    cookies["_ssot"].present?
  end
end
