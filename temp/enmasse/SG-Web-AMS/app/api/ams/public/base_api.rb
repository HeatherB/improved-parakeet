require 'doorkeeper/grape/helpers'

module AMS
  module Public
    class BaseAPI < AMS::BaseAPI

      def self.inherited(subclass)
        super
        subclass.instance_eval do
          helpers Doorkeeper::Grape::Helpers

          helpers do
            def doorkeeper_render_error_with(error)
              case error.status
                when :unauthorized
                  error!({ error_code: 'unauthorized', error: 'The access token is invalid' }, 401, error.headers)
                when :forbidden
                  error!({ error_code: 'forbidden', error: 'The scope of the access token does not match' }, 403, error.headers)
              end
            end
          end

          before do
            #doorkeeper_authorize!
          end
        end
      end

    end
  end
end