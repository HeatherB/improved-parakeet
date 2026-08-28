module Tera
  class User
    def self.from_server(token)
      return Bad.new unless token.present?

      uri = Tera::UriHelper.verify_uri(token)

      response = Net::HTTP.post_form(uri, {})

      if response.is_a? Net::HTTPSuccess
        Rails.logger.debug {
          [
            "Tera::User.from_server succeeded.",
            "Token: #{token}",
            "Response Body:",
              response.body
          ].join("\n")
        }

        user = new(JSON.parse(response.body).symbolize_keys)
        Cache.store(user)
        user
      else
        Rails.logger.debug {
          [
            "Tera::User.from_server failed.",
            "URI: #{uri}",
            "Token: #{token}",
            "Response Code: #{response.code}",
            "Response Body:",
            response.body
          ].join("\n")
        }

        Bad.new
      end
    rescue => e
      Airbrake.notify(e)
      Rails.logger.debug { ["#{e.message} (#{e.class})", e.backtrace].join("\n") }
      Bad.new
    end

    def self.from_cache(account_id)
      return Bad.new unless account_id.present?

      Cache.fetch(account_id)
    end

    attr_reader :screen_name, :email, :id, :account_status

    def initialize(params={})
      @screen_name = params[:screen_name]
      @email = params[:email]
      @id = params[:id]
      @account_status = params[:account_status]

      @account_status = @account_status.to_i if @account_status
    end

    def authenticated?
      true
    end

    def can_comment?
      account_status == 1 || account_status == 5
    end

    class Bad
      attr_reader :screen_name, :email, :id, :account_status

      def authenticated?
        false
      end

      def can_comment?
        false
      end
    end

    module Cache
      def fetch(account_id)
        cached = Refinery::Blog::Comment::Author.find_by_account_id(account_id)

        if cached
          Tera::User.new(:screen_name => cached.name, :id => cached.account_id)
        else
          Bad.new
        end
      end

      def store(user)
        Refinery::Blog::Comment::Author.update_name_for(user.id, user.screen_name)
      end

      extend self
    end
  end
end
