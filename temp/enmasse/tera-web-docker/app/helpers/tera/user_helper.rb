module Tera
  module UserHelper
    SECURE_COOKIE = 'serialized'
    INSECURE_COOKIE = "_ssot"

    def current_tera_user
      Rails.logger.debug {
        [ "Tera::UserHelper#current_tera_user called.",
          "secure cookie: #{cookies[SECURE_COOKIE].inspect}",
        ].join("\n")
      }

      Tera::User.from_server(cookies[SECURE_COOKIE])
    end
    
    def tera_user_signed_in?
      cookies["_ssot"].present?
    end
  end
end
