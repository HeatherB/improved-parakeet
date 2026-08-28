class AccountController < ApplicationController
  def emp
    if session[:account_id]
      @wallet = EME::Billing.get_wallet(session[:account_id])
      if @wallet && @wallet.EMP
        render text: @wallet.EMP[:amount].to_s
      else
        render text: "0"
      end
    else
      render text: "ERROR"
    end
  end
end