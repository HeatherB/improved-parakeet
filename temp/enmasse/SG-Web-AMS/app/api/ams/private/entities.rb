module AMS
  module Private
    module Entities
      class Error < Grape::Entity
        expose :error_code, documentation: {type: 'string'}
        expose :error_message, documentation: {type: 'string'}
      end

      class User < Grape::Entity
        expose :id, documentation: {type: 'integer'}
        expose :screen_name, documentation: {type: 'string'}
        expose :email, documentation: {type: 'string'}
        expose :activated_at, documentation: {type: 'datetime'}
        expose :failed_login_attempts, documentation: {type: 'integer'}
        expose :account_status, documentation: {type: 'integer'}
        expose :tos_accepted_at, documentation: {type: 'datetime'}
        expose :eula_accepted_at, documentation: {type: 'datetime'}
        expose :receive_news, documentation: {type: 'boolean'}
        expose :receive_offers, documentation: {type: 'boolean'}
        expose :date_of_birth, documentation: {type: 'Date'}
        expose :registration_ip, documentation: {type: 'string'}
        expose :country_code, documentation: {type: 'string'}
        expose :referrer, documentation: {type: 'string'}
        expose :referrer_domain, documentation: {type: 'string'}
        expose :last_seen_at, documentation: {type: 'datetime'}
        expose :last_login_at, documentation: {type: 'datetime'}
        expose :last_logout_at, documentation: {type: 'datetime'}
        expose :created_at, documentation: {type: 'datetime'}
        expose :updated_at, documentation: {type: 'datetime'}
        expose :timezone, documentation: {type: 'string'}
        expose :latitude, documentation: {type: 'string'}
        expose :longitude, documentation: {type: 'string'}
        expose :city, documentation: {type: 'string'}
        expose :region, documentation: {type: 'string'}
        expose :isp, documentation: {type: 'string'}
        expose :affiliate_code, documentation: {type: 'string'}
        expose :deleted, documentation: {type: 'boolean'}
        expose :temp_screen_name, documentation: {type: 'boolean'}
        expose :language, documentation: {type: 'string'}
        expose :signed_up_page, documentation: {type: 'string'}
      end

      class GameAccount < Grape::Entity
        expose :id, documentation: {type: 'integer'}
        expose :user_id, documentation: {type: 'integer'}
        expose :game_id, documentation: {type: 'integer'}
        expose :game_name, documentation: {type: 'string'}
        expose :sub, documentation: {type: 'string'}
        expose :email, documentation: {type: 'string'}
        expose :game_account_type_id, documentation: {type: 'integer'}
        expose :account_name, documentation: {type: 'string'}
        expose :deleted, documentation: {type: 'boolean'}
        expose :access_level, documentation: {type: 'integer'}
        expose :account_status, documentation: {type: 'integer'}
        expose :creation_path, documentation: {type: 'string'}
      end

      class SecretQuestion < Grape::Entity
        expose :id, documentation: {type: 'integer'}
        expose :question, documentation: {type: 'string'}
      end

      class MailingList < Grape::Entity
        expose :id, documentation: {type: 'integer'}
        expose :name, documentation: {type: 'string'}
        expose :display_name, documentation: {type: 'string'}
        expose :description, documentation: {type: 'string'}
        expose :position, documentation: {type: 'integer'}
        expose :active, documentation: {type: 'boolean'}
        expose :auto_sign_up_for_game, documentation: {type: 'string'}
      end

      class ResultFlag < Grape::Entity
        expose :result, documentation: {type: 'boolean'}
      end

      class ResultIntegerValue < Grape::Entity
        expose :result, documentation: {type: 'integer'}
      end

      class ResultDateTimeValue < Grape::Entity
        expose :result, documentation: {type: 'datetime'}
      end

      class ResultFlagWithSessionKey < Grape::Entity
        expose :result, documentation: {type: 'boolean'}
        expose :session_key, documentation: {type: 'string'}
      end

      class IovationResult < Grape::Entity
        expose :io_result, documentation: {type: 'string'}
        expose :io_reason, documentation: {type: 'string'}
      end

      class LoginSuccess < Grape::Entity
        expose :user, using: User, documentation: {type: 'User'}
        expose :auth_ticket, documentation: {type: 'string'}
        expose :insecure_auth_ticket, documentation: {type: 'string'}
        expose :iovation_result, using: IovationResult, documentation: {type: 'IovationResult'}
      end

      class ActivateSuccess < Grape::Entity
        expose :user, using: User, documentation: {type: 'User'}
        expose :auth_ticket, documentation: {type: 'string'}, if: lambda { |object, options| object[:auth_ticket] }
        expose :insecure_auth_ticket, documentation: {type: 'string'}, if: lambda { |object, options| object[:insecure_auth_ticket] }
        expose :iovation_result, using: IovationResult, documentation: {type: 'IovationResult'}, if: lambda { |object, options| object[:iovation_result] }
      end

      class SignupSuccess < Grape::Entity
        expose :user, using: User, documentation: {type: 'User'}
        expose :session_key, documentation: {type: 'string'}
      end

      class GlobalAlert < Grape::Entity
        expose :id, documentation: {type: 'integer'}
        expose :active, documentation: {type: 'boolean'}
        expose :game_id, documentation: {type: 'integer'}
        expose :level, documentation: {type: 'string'}
        expose :message, documentation: {type: 'string'}
        expose :regex, documentation: {type: 'string'}
        expose :created_at, documentation: {type: 'datetime'}
        expose :updated_at, documentation: {type: 'datetime'}
      end

      class GlobalAlertResponse < Grape::Entity
        expose :global_alert, using: GlobalAlert, documentation: {type: 'GlobalAlert'}
      end

      class GlobalAlertsResponse < Grape::Entity
        expose :global_alerts, using: GlobalAlert, documentation: {type: 'GlobalAlert', is_array: true}
      end

      class Gift < Grape::Entity
        expose :id, documentation: {type: 'integer'}
        expose :source_type, documentation: {type: 'string'}
        expose :source_id, documentation: {type: 'integer'}
        expose :user_id, documentation: {type: 'integer'}
        expose :recipient_id, documentation: {type: 'integer'}
        expose :gift_box_id, documentation: {type: 'integer'}
        expose :recipient_name, documentation: {type: 'string'}
        expose :sender_name, documentation: {type: 'string'}
        expose :message, documentation: {type: 'string'}
        expose :given_at, documentation: {type: 'datetime'}
        expose :opened_at, documentation: {type: 'datetime'}
        expose :opened_by, documentation: {type: 'integer'}
        expose :active, documentation: {type: 'boolean'}
        expose :created_at, documentation: {type: 'datetime'}
        expose :updated_at, documentation: {type: 'datetime'}
        expose :promotion_id, documentation: {type: 'integer'}
        expose :item_code, documentation: {type: 'string'}
        expose :emp, documentation: {type: 'integer'}
        expose :fulfillment_complete, documentation: {type: 'boolean'}
      end

      class GiftResponse < Grape::Entity
        expose :gift, using: Gift, documentation: {type: 'Gift'}
        expose :messages, documentation: {type: 'string'}
      end

      class GiftGetResponse < Grape::Entity
        expose :gift_box_id, documentation: {type: 'integer'}
        expose :received_count, documentation: {type: 'integer'}
        expose :received_gifts, using: Gift, documentation: {type: 'Gift', is_array: true}
        expose :sent_count, documentation: {type: 'integer'}
        expose :sent_gifts, using: Gift, documentation: {type: 'Gift', is_array: true}
        expose :opened_count, documentation: {type: 'integer'}
        expose :opened_gifts, using: Gift, documentation: {type: 'Gift', is_array: true}
        expose :unsent_count, documentation: {type: 'integer'}
        expose :unsent_gifts, using: Gift, documentation: {type: 'Gift', is_array: true}
      end

      class ProgressiveGoalCounter < Grape::Entity
         expose :id, documentation: {type: 'integer'}
         expose :user_id, documentation: {type: 'integer'}
         expose :promotion_id, documentation: {type: 'integer'}
         expose :purchased, documentation: {type: 'integer'}
         expose :opened, documentation: {type: 'integer'}
         expose :sent, documentation: {type: 'integer'}
         expose :created_at, documentation: {type: 'datetime'}
         expose :updated_at, documentation: {type: 'datetime'}
      end

      class GiftByPromotionResponse < Grape::Entity
        expose :promotion_id, documentation: {type: 'integer'}
        expose :received_count, documentation: {type: 'integer'}
        expose :received_gifts, using: Gift, documentation: {type: 'Gift', is_array: true}
        expose :sent_count, documentation: {type: 'integer'}
        expose :sent_gifts, using: Gift, documentation: {type: 'Gift', is_array: true}
        expose :opened_count, documentation: {type: 'integer'}
        expose :opened_gifts, using: Gift, documentation: {type: 'Gift', is_array: true}
        expose :unsent_count, documentation: {type: 'integer'}
        expose :unsent_gifts, using: Gift, documentation: {type: 'Gift', is_array: true}
        expose :progressive_goal_counter, using: ProgressiveGoalCounter, documentation: {type: 'ProgressiveGoalCounter'}
      end

      class GiftBox < Grape::Entity
        expose :id, documentation: {type: 'integer'}
        expose :name, documentation: {type: 'string'}
        expose :game_id, documentation: {type: 'integer'}
        expose :created_at, documentation: {type: 'datetime'}
        expose :updated_at, documentation: {type: 'datetime'}
        expose :image, documentation: {type: 'string'}
      end

      class GiftBoxesResponse < Grape::Entity
        expose :gift_boxes, using: GiftBox, documentation: {type: 'GiftBox', is_array: true}
      end

      class GameItem < Grape::Entity
        expose :display_name, documentation: {type: 'string'}
        expose :game_id, documentation: {type: 'integer'}
        expose :item_code, documentation: {type: 'string'}
        expose :image, documentation: {type: 'string'}
        expose :emp, documentation: {type: 'string'}
      end

      class PossibleGift < Grape::Entity
        expose :emp, documentation: {type: 'integer'}
        expose :game_item_id, documentation: {type: 'integer'}
        expose :image, documentation: {type: 'string'}
        expose :gift_box_id, documentation: {type: 'integer'}
        expose :game_item, using: GameItem, documentation: {type: 'GameItem'}
      end

      class Authorization < Grape::Entity
        expose :id, documentation: {type: 'integer'}
        expose :user_id, documentation: {type: 'integer'}
        expose :provider, documentation: {type: 'string'}
        expose :uid, documentation: {type: 'string'}
        expose :token, documentation: {type: 'string'}
        expose :expires_at, documentation: {type: 'datetime'}
        expose :created_at, documentation: {type: 'datetime'}
        expose :updated_at, documentation: {type: 'datetime'}
      end

      class EventCredit < Grape::Entity
        expose :id, documentation: {type: 'integer'}
        expose :user_id, documentation: {type: 'integer'}
        expose :credit, documentation: {type: 'integer'}
        expose :created_at, documentation: {type: 'datetime'}
        expose :updated_at, documentation: {type: 'datetime'}
      end

      class EventCreditLog < Grape::Entity
        expose :id, documentation: {type: 'integer'}
        expose :event_credit_id, documentation: {type: 'integer'}
        expose :event_type, documentation: {type: 'string'}
        expose :message, documentation: {type: 'string'}
        expose :additional_info, documentation: {type: 'string'}
        expose :created_at, documentation: {type: 'datetime'}
        expose :updated_at, documentation: {type: 'datetime'}
      end

      class GetCreditResponse < Grape::Entity
        expose :credit, documentation: {type: 'integer'}
      end

      class UpdateCreditResponse < Grape::Entity
        expose :before_credit, documentation: {type: 'integer'}
        expose :after_credit, documentation: {type: 'integer'}
      end

      class OpenGiftResponse < Grape::Entity
        expose :gift, using: Gift, documentation: {type: 'Gift'}
        expose :selected_game_item, using: GameItem, documentation: {type: 'GameItem'}
        expose :messages, documentation: {type: 'string', is_array: true}
        expose :before_credit, documentation: {type: 'integer'}
        expose :after_credit, documentation: {type: 'integer'}
      end

      class PurchaseEventCreditsResponse < Grape::Entity
        expose :transaction_id, documentation: {type: 'string'}
        expose :remain_amount, documentation: {type: 'integer'}
        expose :before_credit, documentation: {type: 'integer'}
        expose :after_credit, documentation: {type: 'integer'}
      end

      class PurchaseInfoResponse < Grape::Entity
        expose :price_id, documentation: {type: 'integer'}
        expose :event_id, documentation: {type: 'integer'}
        expose :original_price, documentation: {type: 'integer'}
        expose :discount, documentation: {type: 'integer'}
        expose :price, documentation: {type: 'integer'}
      end

      class VipExpResult < Grape::Entity
        expose :vip_game_exp, documentation: {type: 'integer'}
        expose :vip_pub_exp, documentation: {type: 'integer'}
      end

      class VipPrize < Grape::Entity
        expose :id, documentation: {type: 'integer'}
        expose :name, documentation: {type: 'string'}
        expose :vip_exp, documentation: {type: 'integer'}
        expose :prize_group_code, documentation: {type: 'string'}
        expose :activated, documentation: {type: 'boolean'}
        expose :started_at, documentation: {type: 'datetime'}
        expose :ended_at, documentation: {type: 'datetime'}
      end

      class VipTokenAddResult < Grape::Entity
        expose :box_transaction_id, documentation: {type: 'integer'}
        expose :box_serial_number, documentation: {type: 'integer'}
        expose :log, documentation: {}
      end

      class VipTokenResult < Grape::Entity
        expose :vip_token, documentation: {type: 'integer'}
      end

      class Character < Grape::Entity
        expose :id, documentation: {type: 'integer'}
        expose :name, documentation: {type: 'string'}
        expose :sex, documentation: {type: 'integer'}
        expose :level, documentation: {type: 'integer'}
      end

      class OauthApplication < Grape::Entity
        expose :id, documentation: {type: 'integer'}
        expose :name, documentation: {type: 'string'}
        expose :redirect_uri, documentation: {type: 'string'}
        expose :scopes, documentation: {type: 'string', is_array: true}
        expose :secret, documentation: {type: 'string'}
        expose :uid, documentation: {type: 'string'}
        expose :created_at, documentation: {type: 'datetime'}
        expose :updated_at, documentation: {type: 'datetime'}
      end

    end

  end

end

