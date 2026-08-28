module AMS
  module Private
    class BaseAPI < AMS::BaseAPI
      def self.inherited(subclass)
        super
        subclass.instance_eval do
          helpers Auth
          before do
            authenticate!
          end

          use IpBlocker do
            allow /^127.0.0.1$/
            allow /^10.63.18.\d+$/
            allow /^10.63.19.\d+$/
            allow /^10.63.20.\d+$/
            allow /^10.63.22.\d+$/
            allow /^10.63.24.\d+$/       # office
            allow /^208.67.48.\d+$/      # live ams web <-> other services and office
            allow /^208.67.49.\d+$/      # live ams web <-> other services and office
            allow /^204.98.2.154/        # office public
          end

        end
      end
    end

    module Auth
      class UnprocessableHeader < ArgumentError; end

      def authenticate!
        header = request.headers["Authorization"]
        token = token(header)
        unauthorized_response unless token == SECURE_CONFIG["api"]["access_token"]
        true
      rescue UnprocessableHeader
        unprocessable_header_response
      end

      def unauthorized_response
        error!({error_code:'unauthorized', error_message: 'Missing authorization header or invalid token'}, 401)
      end

      def unprocessable_header_response
        error!({error_code: 'bad_request', error_message: 'Unprocessable Authorization header'}, 400)
      end

      def token(header)
        token = header.to_s.match(/^Token (.*)/) { |m| m[1] }
        if token
          begin
            values = Hash[token.split(',').map do |value|
              value.strip!                      # remove any spaces between commas and values
              key, value = value.split(/\=\"?/) # split key=value pairs
              value.chomp!('"')                 # chomp trailing " in value
              value.gsub!(/\\\"/, '"')          # unescape remaining quotes
              [key, value]
            end]
            values.delete("token")
          rescue => error
            raise UnprocessableHeader, error
          end
        else
          header
        end
      end
    end

    class IpBlocker < Grape::Middleware::Base
      def initialize(app, opts={}, &block)
        super(app, opts)

        if block_given?
          instance_eval(&block)
        end
      end

      def allow(pattern)
        @options[:allow_ip_patterns] = [] unless @options[:allow_ip_patterns]
        @options[:allow_ip_patterns].push(pattern)
      end

      def ip_allowed?(env)
        client_ip = env['HTTP_X_FORWARDED_FOR'] || env['REMOTE_ADDR']
        client_ip = client_ip.strip if client_ip.is_a? String

        allow_ip_patterns = @options[:allow_ip_patterns] || []
        allow_ip_patterns.each do |pattern|
          return true if client_ip =~ pattern
        end
        return false
      end

      def call(env)
        if ip_allowed?(env)
          super(env)
        else
          [403, { 'Content-Type' => 'application/json' }, [{ error_code: 'forbidden', error_message: 'Cannot access services from the given location' }.to_json]]
        end
      end
    end

  end
end