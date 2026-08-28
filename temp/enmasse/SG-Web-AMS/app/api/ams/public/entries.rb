module AMS
  module Public
    module Entities
      class Error < Grape::Entity
        expose :error_code, documentation: {type: 'string'}
        expose :error_message, documentation: {type: 'string'}
      end

      class User < Grape::Entity
        expose :screen_name, documentation: {type: 'string'}
        expose :email, documentation: {type: 'string'}
      end
    end
  end
end
