class SessionsController < ApplicationController
  include Extensions::SessionsControllerEx

  def create
    create_handler(
      signin_path,
      params[:fail_to] || params[:return_to] || index_path(:slogin => true),
      params[:return_to] || session[:return_to] || users_account_path(:login => true)
    )
  end
end
