module AMS
  module Private
    class MailingListsAPI < AMS::Private::BaseAPI

      resources :mailing_lists do

        desc 'List mailing lists',
             {
               notes: <<-NOTE

               NOTE
             }
        query_filter [[:auto_sign_up_for_game, String], [:active, Boolean]]
        paginate
        get '',
            {
              entity:     AMS::Private::Entities::MailingList,
              http_codes: [
                          ] + standard_error_codes
            } do
          mailing_lists = query_filter_with_paginate([:auto_sign_up_for_game, :active], MailingList)
          present mailing_lists, with: AMS::Private::Entities::MailingList
        end

        desc 'Check the given ip address belongs to anti spam territories',
             {
               notes: <<-NOTE

               NOTE
             }
        params do
          requires :remote_ip, type: String, regexp: /^\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}$/
        end
        get 'check_anti_spam_territory',
            {
              entity:     AMS::Private::Entities::ResultFlag,
              http_codes: [
                          ] + standard_error_codes
            } do
          present({result: User.country_not_permitted?(params[:remote_ip])})
        end

        route_param :mailing_list_id do
          desc 'Get the mailing list',
               {
                 notes: <<-NOTE

                 NOTE
               }
          params do
            requires :mailing_list_id, type: Integer
          end
          get '',
              {
                entity:     AMS::Private::Entities::MailingList,
                http_codes: [
                            ] + standard_error_codes
              } do
            mailing_list = MailingList.find(params[:mailing_list_id])
            present mailing_list, with: AMS::Private::Entities::MailingList
          end
        end

      end
    end
  end
end
