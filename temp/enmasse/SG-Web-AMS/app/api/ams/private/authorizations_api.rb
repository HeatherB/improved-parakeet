module AMS
  module Private
    class AuthorizationsAPI < AMS::Private::BaseAPI

      resources :authorizations do

        desc 'List authorizations',
             {
               notes: <<-NOTE

               NOTE
             }
        query_filter [[:user_id, Integer], [:provider, String], [:uid, String], [:token, String]]
        paginate
        get '',
            {
              entity:     AMS::Private::Entities::Authorization,
              http_codes: [
                          ] + standard_error_codes
            } do
          authorization = query_filter_with_paginate([:user_id, :provider, :uid, :token], Authorization)
          present authorization, with: AMS::Private::Entities::Authorization
        end

        route_param :authorization_id do
          desc 'Get the authorization',
               {
                 notes: <<-NOTE

                 NOTE
               }
          params do
            requires :authorization_id, type: Integer
          end
          get '',
              {
                entity:     AMS::Private::Entities::Authorization,
                http_codes: [
                            ] + standard_error_codes
              } do
            authorization = Authorization.find(params[:authorization_id])
            present authorization, with: AMS::Private::Entities::Authorization
          end
        end

      end
    end
  end
end
