class CustomBlocksController < ApplicationController
  respond_to :json
  skip_after_filter :store_location   # prevent to set session[:return_to]

  # /custom_blocks/:key
  def show
    result = {}
    content = CustomBlock.content_for(params[:id])
    result[:content] = content
    respond_with(result, :content_type => 'application/json')
  rescue => ex
    respond_with({:error => ex.message}, :status => 500, :content_type => 'application/json')
  end

end
