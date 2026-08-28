module AMS
  module Public
    class Root < Grape::API
      format :json
      prefix :public

      mount AMS::Public::UserAPI
      mount AMS::Public::LauncherV2API
      mount AMS::Public::Console::Root
      mount AMS::Public::InGameReportAPI
    end
  end
end
