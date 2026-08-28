module AMS
  module Public
    module Console
      class Root < Grape::API
        format :json
        prefix 'public/console'

        mount AMS::Public::Console::TeraAPI
        mount AMS::Public::Console::AccountAPI
      end
    end
  end
end
