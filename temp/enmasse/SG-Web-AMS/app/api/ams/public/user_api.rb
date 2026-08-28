module AMS
  module Public
    class UserAPI < AMS::Public::BaseAPI
      resource :user do
        get '' do
          doorkeeper_authorize! :public

          user = User.find(doorkeeper_token.resource_owner_id)
          present(user, with: AMS::Private::Entities::User)
        end
      end
    end
  end
end