require "./lib/js_connect"

class SsoController < ApplicationController
  def index
    # 1. Get your client ID and secret here. These must match those in your jsConnect settings.
    # SECURE_CONFIG!!!

    # 2. Grab the current user from your session management system or database here.
    

    # 3. Fill in the user information in a way that Vanilla can understand.
    user = {}

    if logged_in? && !current_user.suspended_from_forum?
      u = current_user
      user["uniqueid"] = u.id
      user["name"] = u.screen_name
      user["email"] = u.email
      user["photourl"] = ""
      user["roles"] = "member"

      if u.email =~ /@enmasse\.com$/
        user["roles"] << ",EME Staff"
      end
    end

    # 4. Generate the jsConnect string.
    secure = true # this should be true unless you are testing.
    json = JsConnect.getJsConnectString(user, params, SECURE_CONFIG["jsconnect"]["client_id"], SECURE_CONFIG["jsconnect"]["secret"], secure)
    # To use a different digest such as SHA1 
    # json = JsConnect.getJsConnectString(user, self.params, client_id, secret, secure, Digest::SHA1)

    render :js => json
  end

end
