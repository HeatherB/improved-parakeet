module AMS
  module Private
    class GiftingAPI < AMS::Private::BaseAPI

      helpers do
        def verify_ticket
          user, ex = User.find_by_auth_ticket(params[:ticket_type], params[:ticket])
          error!({error_code: 'forbidden', error_message: 'Invalid ticket'}, 403) unless user
          user
        end
      end

      resource :gifting do

        desc 'Get gift box',
             {
               notes: <<-NOTE

               NOTE
             }
        params do
          requires :gift_box_id, type: Integer
          requires :ticket_type, type: String
          requires :ticket, type: String
        end
        get '/gifts/:gift_box_id',
            {
              entity:     AMS::Private::Entities::GiftGetResponse,
              http_codes: [
                            [403, "{'error_code': 'forbidden', 'error_message': 'Invalid ticket'}"],
                            [404, "{'error_code': 'not_found', 'error_message': 'No gift box found'}"]
                          ] + standard_error_codes
            } do
          user = verify_ticket
          begin
            gift_box = GiftBox.find(params[:gift_box_id], :include => :gifts)
          rescue ActiveRecord::RecordNotFound
            error!({error_code: 'not_found', error_message: 'No gift box found'}, 404)
          end

          opened_gifts   = gift_box.gifts.active.where({:opened_by => user.id})
          received_gifts = gift_box.gifts.active.received_by(user)
          sent_gifts     = gift_box.gifts.active.created_by(user).sent
          unsent_gifts   = gift_box.gifts.active.created_by(user).unopened.unsent

          result                  = {}
          result[:gift_box_id]    = gift_box.id
          result[:received_count] = received_gifts.count
          result[:received_gifts] = received_gifts
          result[:sent_count]     = sent_gifts.count
          result[:sent_gifts]     = sent_gifts
          result[:opened_count]   = opened_gifts.count
          result[:opened_gifts]   = opened_gifts
          result[:unsent_count]   = unsent_gifts.count
          result[:unsent_gifts]   = unsent_gifts

          present result, with: AMS::Private::Entities::GiftGetResponse
        end

        desc 'Open gift',
             {
               notes: <<-NOTE

               NOTE
             }
        params do
          requires :gift_id, type: Integer
          requires :game_account_id, type: Integer
          requires :ticket_type, type: String
          requires :ticket, type: String
        end
        post '/gifts/open/:gift_id',
             {
               entity:     AMS::Private::Entities::GiftResponse,
               http_codes: [
                             [403, "{'error_code': 'forbidden', 'error_message': 'Invalid ticket'}"],
                             [403, "{'error_code': 'forbidden', 'error_message': 'Gift has already been opened'}"],
                             [403, "{'error_code': 'forbidden', 'error_message': 'You cannot open this gift'}"],
                             [404, "{'error_code': 'not_found', 'error_message': 'No active gift found'}"],
                             [404, "{'error_code': 'not_found', 'error_message': 'No active game account found'}"]
                           ] + standard_error_codes
             } do
          user = verify_ticket
          begin
            gift = Gift.active.find(params[:gift_id])
          rescue ActiveRecord::RecordNotFound
            error!({error_code: 'not_found', error_message: 'No active gift found'}, 404)
          end

          error!({error_code: 'forbidden', error_message: 'Gift has already been opened'}, 403) if gift.opened?
          error!({error_code: 'forbidden', error_message: 'You cannot open this gift'}, 403) unless gift.can_open?(user)

          begin
            game_account = user.game_accounts.active.find(params[:game_account_id])
          rescue ActiveRecord::RecordNotFound
            error!({error_code: 'not_found', error_message: 'No active game account found'}, 404)
          end

          messages = gift.open!(game_account)

          result            = {}
          result[:gift]     = gift
          result[:messages] = messages

          present result, with: AMS::Private::Entities::GiftResponse
        end

        desc 'Send gift',
             {
               notes: <<-NOTE

               NOTE
             }
        params do
          requires :gift_id, type: Integer
          requires :ticket_type, type: String
          requires :ticket, type: String
        end
        post '/gifts/send/:gift_id',
             {
               entity:     AMS::Private::Entities::GiftResponse,
               http_codes: [
                             [403, "{'error_code': 'forbidden', 'error_message': 'Invalid ticket'}"],
                             [403, "{'error_code': 'forbidden', 'error_message': 'Gift has already been opened'}"],
                             [403, "{'error_code': 'forbidden', 'error_message': 'Gift has already been sent'}"],
                             [403, "{'error_code': 'forbidden', 'error_message': 'Gift cannot be sent to this recipient'}"],
                             [404, "{'error_code': 'not_found', 'error_message': 'No active unsent gift found'}"],
                             [404, "{'error_code': 'not_found', 'error_message': 'No user found'}"]
                           ] + standard_error_codes
             } do
          user = verify_ticket
          begin
            gift = user.gifts.active.unsent.find(params[:gift_id])
          rescue ActiveRecord::RecordNotFound
            error!({error_code: 'not_found', error_message: 'No active unsent gift found'}, 404)
          end

          error!({error_code: 'forbidden', error_message: 'Gift has already been opened'}, 403) if gift.opened?
          error!({error_code: 'forbidden', error_message: 'Gift has already been sent'}, 403) if gift.sent?

          begin
            recipient = User.find(params[:recipient_id])
          rescue ActiveRecord::RecordNotFound
            error!({error_code: 'not_found', error_message: 'No user found'}, 404)
          end

          error!({error_code: 'forbidden', error_message: 'Gift cannot be sent to this recipient'}, 403) unless gift.can_receive?(recipient)

          messages = gift.send!(recipient, params[:recipient_name], params[:sender_name], params[:message])

          result            = {}
          result[:gift]     = gift
          result[:messages] = messages

          present result, with: AMS::Private::Entities::GiftResponse
        end

        desc 'Get possible gifts',
             {
               notes: <<-NOTE
           Response Example:

               {"possible_gifts" :
                  {"1" :
                     [{"emp" : 0, "game_item_id" : 16, "image" : ""},
                      {"emp" : 0, "game_item_id" : 1, "image" : ""}],
                   "2" :
                     [{"emp" : 0, "game_item_id" : 18, "image" : ""},
                      {"emp" : 0, "game_item_id" : 2, "image" : ""},
                      {"emp" : 0, "game_item_id" : 13, "image" : ""}]
                  }
               }
               NOTE
          }
        params do
          requires :gift_box_id, type: String
        end
        get '/possible/:gift_box_id',
            {
              entity:     nil,
              http_codes: [
                            [404, "{'error_code': 'not_found', 'error_message': 'No gift box found'}"],
                          ] + standard_error_codes
            } do
          ids       = params[:gift_box_id].split("_").map { |x| x.to_i }
          giftboxes = GiftBox.where(:id => ids).includes({:possible_gifts => :game_item})

          error!({error_code: 'not_found', error_message: 'No gift box found'}, 404) if giftboxes.empty?

          result                  = {}
          result[:possible_gifts] = {}
          giftboxes.each do |gift_box|
            result[:possible_gifts][gift_box.id] = gift_box.possible_gifts.map { |possible_gift| possible_gift.hash_with_game_item }
          end

          present result
        end

        desc 'Get gift boxes',
             {
               notes: <<-NOTE

               NOTE
             }
        get '/gift_boxes',
            {
              entity:     AMS::Private::Entities::GiftBoxesResponse,
              http_codes: [
                          ] + standard_error_codes
            } do
          result              = {}
          result[:gift_boxes] = GiftBox.all

          present result, with: AMS::Private::Entities::GiftBoxesResponse
        end

        desc 'Get gifts by promotion',
             {
               notes: <<-NOTE

               NOTE
             }
        params do
          requires :promotion_id, type: Integer
          requires :ticket_type, type: String
          requires :ticket, type: String
        end
        get '/promotions/:promotion_id/gifts',
            {
              entity:     AMS::Private::Entities::GiftByPromotionResponse,
              http_codes: [
                            [403, "{'error_code': 'forbidden', 'error_message': 'Invalid ticket'}"],
                            [404, "{'error_code': 'not_found', 'error_message': 'No giftable campaign found'}"]
                          ] + standard_error_codes
            } do
          user = verify_ticket
          begin
            campaign = Promotion.giftable.find(params[:promotion_id])
          rescue ActiveRecord::RecordNotFound
            error!({error_code: 'not_found', error_message: 'No giftable campaign found'}, 404)
          end
          # gather subpromotion ids
          promo_ids = [campaign.id] + Promotion.where(:gift_promotion_id => campaign.id).pluck(:id)

          opened_gifts   = Gift.active.in_promotion_range(promo_ids).where({:opened_by => user.id})
          received_gifts = Gift.active.in_promotion_range(promo_ids).received_by(user)
          sent_gifts     = Gift.active.in_promotion_range(promo_ids).created_by(user).sent
          unsent_gifts   = Gift.active.in_promotion_range(promo_ids).created_by(user).unopened.unsent

          # use the gift promotion if it exists
          if campaign.gift_promotion.present?
            progressive_goal_counter = user.progressive_goal_counters.find_or_initialize_by_promotion_id(campaign.gift_promotion_id)
          else
            progressive_goal_counter = user.progressive_goal_counters.find_or_initialize_by_promotion_id(campaign.id)
          end

          result                            = {}
          result[:promotion_id]             = campaign.id
          result[:received_count]           = received_gifts.count
          result[:received_gifts]           = received_gifts
          result[:sent_count]               = sent_gifts.count
          result[:sent_gifts]               = sent_gifts
          result[:opened_count]             = opened_gifts.count
          result[:opened_gifts]             = opened_gifts
          result[:unsent_count]             = unsent_gifts.count
          result[:unsent_gifts]             = unsent_gifts
          result[:progressive_goal_counter] = progressive_goal_counter

          present result, with: AMS::Private::Entities::GiftByPromotionResponse
        end
      end
    end
  end
end
