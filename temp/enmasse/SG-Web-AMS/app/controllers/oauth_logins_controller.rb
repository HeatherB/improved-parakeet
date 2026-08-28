class OauthLoginsController < ApplicationController

  def index
    @return_to = session[:oauth_retry_url]
    render layout: 'simple'
  end

end
