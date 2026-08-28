module Tera
  module UriHelper
    SIGN_IN, SIGN_OUT, REGISTER = %w[signin signout register].map do |action|
      URI::HTTP.build(
        :host => Rails.application.config.account_server,
        :path => "/sso/" + action,
        :query => "site=#{Rails.application.config.site_key}&p="
      ).to_s
    end

    def sign_in_uri(path=nil)
      "#{SIGN_IN}#{encoded_path(path)}"
    end

    def sign_out_uri(path=nil)
      "#{SIGN_OUT}#{encoded_path(path)}"
    end

    def register_uri(path=nil)
      "https://" + Rails.application.config.account_server.to_s + "/tera/sign-up"
    end

    def encoded_path(path=nil)
      CGI.escape(path || request.fullpath)
    end

    SERVER_LIST_URI = URI(Rails.application.config.server_list_uri)
    CCU_URI = URI(Rails.application.config.ccu_uri)

    def server_list_uri
      SERVER_LIST_URI
    end
    
    def ccu_uri
      CCU_URI
    end

    host, port = Rails.application.config.auth_server.split(":")

    AUTH = URI::HTTP.build(
      :host => host,
      :port => (port || 80).to_i,
      :path => "/sso/ticket/"
    ).to_s

    def verify_uri token
      URI("#{AUTH}#{token}/verify")
    end

    extend self
  end
end
