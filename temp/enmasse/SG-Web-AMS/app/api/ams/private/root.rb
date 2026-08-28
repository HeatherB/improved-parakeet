module AMS
  module Private
    class Root < Grape::API
      format :json
      prefix :private

      mount AMS::Private::UsersAPI
      mount AMS::Private::GameAccountsAPI
      mount AMS::Private::SecretQuestionsAPI
      mount AMS::Private::MailingListsAPI
      mount AMS::Private::GlobalAlertsAPI
      mount AMS::Private::GiftingAPI
      mount AMS::Private::AuthorizationsAPI
      mount AMS::Private::EventCreditsAPI
      mount AMS::Private::VipPrizesAPI
      mount AMS::Private::OauthApplicationsAPI
      mount AMS::Private::AdminAPI
    end
  end
end
