module Tera
  module UserHeaderHelper

    #def tera_header
    #
    #  # TODO: Remove when reactivating SSO
    #  #content_tag :div, :id => "eme-bar-wrapper" do
    #  #  content_tag :div, (logo_image + my_account_link), :id => "eme-bar"
    #  #end
    #
    #  # TODO: Uncomment when reactivating SSO
    #  content_tag( :div,
    #  content_tag( :div, [ logo_image,
    #  content_tag( :div, :id => "register" ) do
    #    if tera_user_signed_in?
    #      authenticated_header
    #    else
    #      unauthenticated_header
    #    end
    #  end].join.html_safe, :id => "eme-bar" ), :id => "eme-bar-wrapper")
    #
    #end

    def logo_image
      link_to "http://www.enmasse.com", :id => "eme-link" do
        image_tag "eme-logo-small-trans.png"
      end
    end

    def authenticated_header
      [content_tag(:span, "Welcome: #{session['screen_name'] || 'Player'}"),
      link_to("Sign Out", sign_out_uri)].join.html_safe
    end

    def unauthenticated_header
      [ link_to("Sign In", sign_in_uri),
        link_to("Register", register_uri)
      ].join.html_safe
    end

    def my_account_link
      content_tag :div, :id => "my-account-link" do
        link_to  "My Account", "http://account.enmasse.com/"
      end
    end
  end
end
