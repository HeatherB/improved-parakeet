class IovationController < ApplicationController
  skip_before_filter :verify_authenticity_token
  skip_before_filter :logout_deleted
  skip_before_filter :validate_engarde
  skip_before_filter :validate_additional_requirements
  skip_after_filter :store_location
  skip_after_filter :mark_user_active

  before_filter :restrict_access
  respond_to :json

  def check
    begin
      io_check =  Iovation::CheckTransaction.new(
                    params[:user_id],
                    params[:email],
                    params[:ip],
                    params[:io_black_box],
                    { :io_type => params[:io_type] }
                  )
      io_response = io_check.io_response
      render :json => { :io_response => io_response }
    rescue => ex
      render :json => { :error => ex.message }
    end
  end

  private

  def restrict_access
    authenticate_or_request_with_http_token do |token, options|
      token == SECURE_CONFIG["api"]["access_token"]
    end
  end

end
