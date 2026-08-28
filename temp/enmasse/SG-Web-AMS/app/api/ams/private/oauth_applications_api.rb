module AMS
  module Private
    class OauthApplicationsAPI < AMS::Private::BaseAPI

      resources :oauth_applications do
        desc 'List oauth applications'
        query_filter [[:name, String], [:uid, String]]
        paginate
        get '',
            {
              entity:     AMS::Private::Entities::OauthApplication,
              http_codes: [
                          ] + standard_error_codes
            } do
          oauth_applications = query_filter_with_paginate([:auto_sign_up_for_game, :active], Doorkeeper::Application)
          present oauth_applications, with: AMS::Private::Entities::OauthApplication
        end

        desc 'Create an oauth application'
        params do
          requires :name, type: String
          requires :redirect_uri, type: String
          requires :scopes, type: String
        end
        post '',
             {
               entity:     AMS::Private::Entities::OauthApplication,
               http_codes: [
                           ] + standard_error_codes
             } do
          oauth_application = Doorkeeper::Application.new(
            {
              name:         params[:name],
              redirect_uri: params[:redirect_uri],
              scopes:       params[:scopes]
            }
          )
          oauth_application.save!
          status 200
          present oauth_application, with: AMS::Private::Entities::OauthApplication
        end

        route_param :oauth_application_id do
          desc 'Get the oauth application'
          params do
            requires :oauth_application_id, type: Integer
          end
          get '',
              {
                entity:     AMS::Private::Entities::OauthApplication,
                http_codes: [
                            ] + standard_error_codes
              } do
            oauth_application = Doorkeeper::Application.find(params[:oauth_application_id])
            present oauth_application, with: AMS::Private::Entities::OauthApplication
          end

          desc 'Update the oauth application'
          params do
            requires :oauth_application_id, type: Integer
            optional :name, type: String
            optional :redirect_uri, type: String
            optional :scopes, type: String
          end
          post '',
               {
                 entity:     AMS::Private::Entities::OauthApplication,
                 http_codes: [
                             ] + standard_error_codes
               } do
            oauth_application              = Doorkeeper::Application.find(params[:oauth_application_id])
            oauth_application.name         = params[:name] if params[:name]
            oauth_application.redirect_uri = params[:redirect_uri] if params[:redirect_uri]
            oauth_application.scopes       = params[:scopes] if params[:scopes]
            oauth_application.save!
            status 200
            present oauth_application, with: AMS::Private::Entities::OauthApplication
          end

          desc 'Delete the oauth application'
          params do
            requires :oauth_application_id, type: Integer
          end
          delete '', {
            entity:     AMS::Private::Entities::ResultFlag,
            http_codes: [
                        ] + standard_error_codes
          } do
            oauth_application = Doorkeeper::Application.find(params[:oauth_application_id])
            oauth_application.destroy
            status 200
            present({result: true}, AMS::Private::Entities::ResultFlag)
          end

        end
      end
    end
  end
end
