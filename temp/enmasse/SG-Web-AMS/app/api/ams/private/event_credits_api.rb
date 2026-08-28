module AMS
  module Private
    class EventCreditsAPI < AMS::Private::BaseAPI

      resources :event_credits do

        desc 'List event credits'
        query_filter [[:user_id, Integer]]
        paginate
        get '',
            {
              entity:     AMS::Private::Entities::EventCredit,
              http_codes: [
                          ] + standard_error_codes
            } do
          event_credits = query_filter_with_paginate([:user_id], EventCredit)
          present event_credits, with: AMS::Private::Entities::EventCredit
        end

        desc 'Get credit of the given user'
        params do
          requires :user_id, type: Integer, desc: 'user id'
        end
        get 'get_credit',
            {
              entity:     AMS::Private::Entities::GetCreditResponse,
              http_codes: [
                          ] + standard_error_codes
            } do
          user = User.find(params[:user_id])
          if user.event_credit.nil?
            EventCredit.create!({user_id: user.id, credit: 0})
            user.reload
          end
          present({credit: user.event_credit.credit}, with: AMS::Private::Entities::GetCreditResponse)
        end

        desc 'Add credit to the given user'
        params do
          requires :user_id, type: Integer, desc: 'user id'
          requires :credit_added, type: Integer, desc: 'credit to be added'
          requires :message, type: String, desc: 'message for the addition to be written to logs'
          optional :additional_info, type: String, desc: 'additional info to be written to logs'
        end
        post 'add_credit',
             {
               entity:     AMS::Private::Entities::UpdateCreditResponse,
               http_codes: [
                             [422, "{'error_code': 'argument_error', 'error_message': 'credit_added should be a positive number'}"],
                           ] + standard_error_codes
             } do
          if params[:credit_added] <= 0
            error!({error_code: 'argument_error', error_message: 'credit_added should be a positive number'}, 422)
          end
          if params[:additional_info].nil? || params[:additional_info].empty?
            additional_info = {}
          else
            additional_info = JSON.load(params[:additional_info]) rescue {}
          end
          user = User.find(params[:user_id])
          if user.event_credit.nil?
            EventCredit.create!({user_id: user.id, credit: 0})
            user.reload
          end
          before_credit, after_credit = EventCredit.transaction do
            event_credit = user.event_credit
            event_credit.lock!
            before_credit       = event_credit.credit
            event_credit.credit += params[:credit_added]
            after_credit        = event_credit.credit
            event_credit.save!

            additional_info[:credit_added]  = params[:credit_added]
            additional_info[:before_credit] = before_credit
            additional_info[:after_credit]  = after_credit
            additional_info                 = additional_info.to_json
            event_credit.event_credit_logs.create!({event_type: 'add', message: params[:message], additional_info: additional_info})

            [before_credit, after_credit]
          end

          present({before_credit: before_credit, after_credit: after_credit}, with: AMS::Private::Entities::UpdateCreditResponse)
        end

        desc 'Remove credit from the given user'
        params do
          requires :user_id, type: Integer, desc: 'user id'
          requires :credit_removed, type: Integer, desc: 'credit to be remove'
          requires :message, type: String, desc: 'message for the removal to be written to logs'
          optional :additional_info, type: String, desc: 'additional info to be written to logs'
        end
        post 'remove_credit',
             {
               entity:     AMS::Private::Entities::UpdateCreditResponse,
               http_codes: [
                             [422, "{'error_code': 'argument_error', 'error_message': 'credit_removed should be a positive number'}"],
                           ] + standard_error_codes
             } do
          if params[:credit_removed] <= 0
            error!({error_code: 'argument_error', error_message: 'credit_removed should be a positive number'}, 422)
          end
          if params[:additional_info].nil? || params[:additional_info].empty?
            additional_info = {}
          else
            additional_info = JSON.load(params[:additional_info]) rescue {}
          end
          user = User.find(params[:user_id])
          if user.event_credit.nil?
            EventCredit.create!({user_id: user.id, credit: 0})
            user.reload
          end
          before_credit, after_credit = EventCredit.transaction do
            event_credit = user.event_credit
            event_credit.lock!
            if event_credit.credit < params[:credit_removed]
              error!({error_code: 'conflict_error', error_message: 'credit_removed should be smaller than the current credit'}, 409)
            end
            before_credit       = event_credit.credit
            event_credit.credit -= params[:credit_removed]
            after_credit        = event_credit.credit
            event_credit.save!

            additional_info[:credit_removed] = params[:credit_removed]
            additional_info[:before_credit]  = before_credit
            additional_info[:after_credit]   = after_credit
            additional_info                  = additional_info.to_json
            event_credit.event_credit_logs.create!({event_type: 'remove', message: params[:message], additional_info: additional_info})

            [before_credit, after_credit]
          end

          present({before_credit: before_credit, after_credit: after_credit}, with: AMS::Private::Entities::UpdateCreditResponse)
        end

        helpers do
          def get_possible_gift_game_items(gift_box_id)
            cache_key = "event_credit_possible_gift_game_items_#{gift_box_id}"
            possible_gift_game_items = JSON.load Rails.cache.read(cache_key) rescue nil
            unless possible_gift_game_items
              possible_gift_game_items = GiftBox.find(gift_box_id).possible_gifts.map do |possible_gift|
                game_item = possible_gift.game_item
                if game_item
                  {
                    'display_name' => game_item.display_name,
                    'game_id'      => game_item.game_id,
                    'item_code'    => game_item.item_code,
                    'image'        => possible_gift.image,
                    'emp'          => possible_gift.emp
                  }
                else
                  {
                    'display_name' => nil,
                    'game_id'      => nil,
                    'item_code'    => nil,
                    'image'        => possible_gift.image,
                    'emp'          => possible_gift.emp
                  }
                end
              end
              Rails.cache.write(cache_key, possible_gift_game_items.to_json, :expires_in => 10.minutes)
            end
            possible_gift_game_items
          end
        end

        desc 'Open and get a gift using the given user\'s credit'
        params do
          requires :user_id, type: Integer, desc: 'user id'
          requires :game_account_id, type: Integer, desc: 'game account id of the user'
          requires :group_promo_code, type: String, desc: 'group_promo_code for gift promotion'
          requires :credit_used, type: Integer, default: 5, desc: 'number of credits to be used for the purchase'
          optional :additional_info, type: String, desc: 'additional info to be written to logs'
        end
        post 'open_gift',
             {
               entity:     AMS::Private::Entities::OpenGiftResponse,
               http_codes: [
                             [422, "{error_code: 'argument_error', error_message: 'the promotion associated with the given group promo code is not a giftable promotion'}"],
                             [422, "{error_code: 'argument_error', error_message: 'invalid game_account_id'}"],
                             [422, "{error_code: 'argument_error', error_message: 'undefined group promo_code'}"],
                             [409, "{error_code: 'conflict_error', error_message: 'insufficient user's event credit'}"]
                           ] + standard_error_codes
             } do
          # check if the given group promotion is gifting promotion
          user = User.find(params[:user_id])

          game_account = GameAccount.find(params[:game_account_id])
          if game_account.user_id != user.id
            error!({error_code: 'argument_error', error_message: 'invalid game_account_id'}, 422)
          end

          if params[:additional_info].nil? || params[:additional_info].empty?
            additional_info = {}
          else
            additional_info = JSON.load(params[:additional_info]) rescue {}
          end

          promo_code  = params[:group_promo_code]
          group_promo = GroupPromoCode.find_by_promo_code(promo_code)
          if group_promo.nil?
            error!({error_code: 'argument_error', error_message: 'undefined group promo_code'}, 422)
          end
          unless group_promo.promotion.giftable
            error!({error_code: 'argument_error', error_message: 'the promotion associated with the given group promo code is not a giftable promotion'}, 422)
          end

          # check if the user has enough event credit
          if user.event_credit.nil?
            EventCredit.create!({user_id: user.id, credit: 0})
            user.reload
          end

          gift, selected_game_item, messages, before_credit, after_credit = EventCredit.transaction do
            event_credit = user.event_credit
            event_credit.lock!
            before_credit = event_credit.credit
            if event_credit.credit < params[:credit_used]
              error!({error_code: 'conflict_error', error_message: 'insufficient user\'s event credit'}, 409)
            end
            event_credit.credit -= params[:credit_used]
            after_credit        = event_credit.credit
            used_promo_code     = PromoCode.use_code(user, promo_code, {}, true)
            asset_fulfillment   = used_promo_code.asset_fulfillments.first
            unless used_promo_code.fulfillment_complete
              error!({error_code: 'internal_error', error_message: "AssetFulfillmentError: #{asset_fulfillment.last_error_message}"}, 500)
            end
            gift = Gift.where(source_type: 'AssetFulfillment', source_id: asset_fulfillment.id).first
            unless gift
              error!({error_code: 'internal_error', error_message: 'Gift was not created correctly'}, 500)
            end

            # open the gift
            messages           = gift.open!(game_account)

            # find selected game item
            selected_game_item = nil
            get_possible_gift_game_items(gift.gift_box_id).each do |game_item|
              if (gift.item_code && game_item['item_code'] == gift.item_code) || (gift.emp > 0 && game_item['emp'] == gift.emp)
                selected_game_item = {
                  display_name: game_item['display_name'],
                  game_id:      game_item['game_id'],
                  item_code:    game_item['item_code'],
                  image:        game_item['image'],
                  emp:          game_item['emp']
                }
                break
              end
            end
            event_credit.save!

            # write log
            additional_info[:credit_used]      = params[:credit_used]
            additional_info[:group_promo_code] = params[:group_promo_code]
            additional_info[:before_credit]    = before_credit
            additional_info[:after_credit]     = after_credit
            additional_info[:gift_id]          = gift.id
            additional_info[:emp]              = gift.emp
            additional_info[:game_item]        = selected_game_item
            additional_info                    = additional_info.to_json

            if selected_game_item[:emp] && selected_game_item[:emp] > 0
              message = "Gift '#{selected_game_item[:emp]} EMP' opened using #{params[:credit_used]} credits, credit balance is #{after_credit}"
            else
              message = "Gift '#{selected_game_item[:display_name]}' opened using #{params[:credit_used]} credits, credit balance is #{after_credit}"
            end

            event_credit.event_credit_logs.create!({event_type: 'open_gift', message: message, additional_info: additional_info})

            [gift, selected_game_item, messages, before_credit, after_credit]
          end

          present({gift: gift, selected_game_item: selected_game_item, messages: messages, before_credit: before_credit, after_credit: after_credit}, with: AMS::Private::Entities::OpenGiftResponse)
        end

        class GetPurchaseInfoError < StandardError
        end

        helpers do

          def _get_purchase_info(external_offer_id)
            payletter_client = Payletter::Client.new
            begin
              item = payletter_client.get_game_item('TERA', external_offer_id)
            rescue Payletter::Client::PayletterError => e
              if e.err_code == 5000 # cannot find paid-server-transfer item because it is undefined.
                item = nil
              end
            end
            if item
              if item.prices.nil?() || item.prices.length() == 0
                raise GetPurchaseInfoError.new("no price is set for '#{external_offer_id}' in Payletter")
              end
              price         = item.prices[0]

              # find appropriate promotion and apply to the purchase info
              purchase_info = {
                :price_id       => price.price_id,
                :event_id       => nil,
                :original_price => price.original_price,
                :discount       => 0,
                :price          => price.original_price
              }

              item.promotions.each do |promotion|
                if promotion.event_dc_amount > purchase_info[:discount]
                  purchase_info[:event_id] = promotion.event_id
                  purchase_info[:discount] = promotion.event_dc_amount
                  purchase_info[:price]    = price.original_price - promotion.event_dc_amount
                end
              end
              purchase_info
            else
              raise GetPurchaseInfoError.new("no item is defined for '#{external_offer_id}' in Payletter")
            end
          end

          def get_purchase_info(external_offer_id)
            cache_key = "event_credit_purchase_info_#{external_offer_id}"
            purchase_info = JSON.load Rails.cache.read(cache_key) rescue nil
            unless purchase_info
              purchase_info = _get_purchase_info(external_offer_id)
              Rails.cache.write(cache_key, purchase_info.to_json, :expires_in => 1.minutes)
            end
            purchase_info.symbolize_keys!
          end

        end

        desc 'Purchase event credits using EMP'
        params do
          requires :user_id, type: Integer, desc: 'user id'
          requires :game_account_id, type: Integer, desc: 'game account id of the user'
          requires :external_offer_id, type: String, desc: 'external offer id of the item in Payletter'
          requires :credit, type: Integer, desc: 'number of credits to be purchased'
          optional :additional_info, type: String, desc: 'additional info to be written to logs'
        end
        post 'purchase_credit',
             {
               entity:     AMS::Private::Entities::PurchaseEventCreditsResponse,
               http_codes: [
                             [422, "{error_code: 'argument_error', error_message: 'invalid game_account_id'}"],
                             [422, "{error_code: 'argument_error', error_message: 'credit should be a positive number'}"],
                             [422, "{error_code: 'configuration_error', error_message: e.message}"],
                             [500, "{error_code: 'internal_error', error_message: 'cannot retrieve purchase info'}"]
                           ] + standard_error_codes
             } do
          user = User.find(params[:user_id])

          game_account = GameAccount.find(params[:game_account_id])
          if game_account.user_id != user.id
            error!({error_code: 'argument_error', error_message: 'invalid game_account_id'}, 422)
          end

          credit = params[:credit]
          if params[:credit] <= 0
            error!({error_code: 'argument_error', error_message: 'credit should be a positive number'}, 422)
          end

          if params[:additional_info].nil? || params[:additional_info].empty?
            additional_info = {}
          else
            additional_info = JSON.load(params[:additional_info]) rescue {}
          end

          if game_account.user_id != user.id
            error!({error_code: 'argument_error', error_message: 'invalid game_account_id'}, 422)
          end

          user_subset = 'normal'

          # retrieve purchase info for the given external_offer_id
          begin
            purchase_info = get_purchase_info(params[:external_offer_id])
          rescue GetPurchaseInfoError => e
            error!({error_code: 'configuration_error', error_message: e.message}, 422)
          end
          error!({error_code: 'internal_error', error_message: 'cannot retrieve purchase info'}, 500) if purchase_info.nil?

          payletter_client = Payletter::Client.new
          result           = payletter_client.purchase(user.id, user.email, game_account.id, 'TERA', user_subset, purchase_info[:price_id],
                                                       purchase_info[:price], 1, 'tera-web', purchase_info[:event_id])

          begin
            before_credit, after_credit = EventCredit.transaction do
              event_credit = user.event_credit
              event_credit.lock!
              before_credit       = event_credit.credit
              event_credit.credit += credit
              after_credit        = event_credit.credit
              event_credit.save!

              additional_info[:credit_purchased] = credit
              additional_info[:emp_used]         = purchase_info[:price]
              additional_info[:transaction_id]   = result.transaction_id
              additional_info[:emp_remain]       = result.remain_amount
              additional_info[:before_credit]    = before_credit
              additional_info[:after_credit]     = after_credit
              additional_info                    = additional_info.to_json

              message = "#{credit} credits were purchased using #{purchase_info[:price]} EMP, credit balance is #{after_credit}, EMP balance is #{result.remain_amount}"

              event_credit.event_credit_logs.create!({event_type: 'purchase_credit', message: message, additional_info: additional_info})

              [before_credit, after_credit]
            end
          rescue Exception => e
            payletter_client.cancel_purchase(user.id, result.transaction_id)
            raise e
          end

          result = {transaction_id: result.transaction_id,
                    remain_amount:  result.remain_amount,
                    before_credit:  before_credit,
                    after_credit:   after_credit}

          present(result, with: AMS::Private::Entities::PurchaseEventCreditsResponse)
        end

        desc 'Get purchase of the given external_offer_id'
        params do
          requires :external_offer_id, type: String, desc: 'external offer id of the item in Payletter'
        end
        get 'get_purchase_info',
            {
              entity:     AMS::Private::Entities::PurchaseEventCreditsResponse,
              http_codes: [
                            [422, "{error_code: 'configuration_error', error_message: e.message}"],
                            [500, "{error_code: 'internal_error', error_message: 'cannot retrieve purchase info'}"]
                          ] + standard_error_codes
            } do
          begin
            purchase_info = get_purchase_info(params[:external_offer_id])
          rescue GetPurchaseInfoError => e
            error!({error_code: 'configuration_error', error_message: e.message}, 422)
          end
          error!({error_code: 'internal_error', error_message: 'cannot retrieve purchase info'}, 500) if purchase_info.nil?

          present(purchase_info, with: AMS::Private::Entities::PurchaseInfoResponse)
        end

        route_param :event_credit_id do

          desc 'Get the given event credit'
          params do
            requires :event_credit_id, type: Integer, desc: 'event credit id'
          end
          get '',
              {
                entity:     AMS::Private::Entities::EventCredit,
                http_codes: [
                            ] + standard_error_codes
              } do
            event_credit = EventCredit.find(params[:event_credit_id])
            present event_credit, with: AMS::Private::Entities::EventCredit
          end

          desc 'Get logs for the given event credit'
          params do
            requires :event_credit_id, type: Integer, desc: 'event credit id'
          end
          paginate
          get 'logs',
              {
                entity:     AMS::Private::Entities::EventCreditLog,
                http_codes: [
                            ] + standard_error_codes
              } do
            event_credit_logs = paginate(EventCredit.find(params[:event_credit_id]).event_credit_logs)
            present event_credit_logs, with: AMS::Private::Entities::EventCreditLog
          end

        end

      end

    end

  end

end
