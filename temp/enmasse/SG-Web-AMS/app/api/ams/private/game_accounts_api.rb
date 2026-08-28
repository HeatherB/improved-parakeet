module AMS
  module Private
    class GameAccountsAPI < AMS::Private::BaseAPI

      resources :game_accounts do

        desc 'List game accounts'
        query_filter [[:master_account_id, Integer], [:game_id, Integer]]
        paginate
        get '',
            {
              entity:     AMS::Private::Entities::GameAccount,
              http_codes: [
                          ] + standard_error_codes
            } do
          game_accounts = query_filter_with_paginate([:master_account_id, :game_id], GameAccount)
          present game_accounts, with: AMS::Private::Entities::GameAccount
        end

        desc 'List game accounts for a master account'
        params do
          requires :master_account_id, type: Integer
        end
        paginate
        get 'all/:master_account_id',
            {
              entity:     AMS::Private::Entities::GameAccount,
              http_codes: [
                          ] + standard_error_codes
            } do
          game_accounts = GameAccount.where(master_account_id: master_account_id, deleted: false).all
          present game_accounts, with: AMS::Private::Entities::GameAccount
        end

        route_param :game_account_id do
          desc 'Get game account'
          params do
            requires :game_account_id, type: Integer
          end
          get '',
              {
                entity:     AMS::Private::Entities::GameAccount,
                http_codes: [
                            ] + standard_error_codes
              } do
            game_account = GameAccount.where(deleted: false, id: params[:game_account_id]).first
            present game_account, with: AMS::Private::Entities::GameAccount
          end

          desc 'Get vip_game_exp and vip_pub_exp of the given game account'
          params do
            requires :game_account_id, type: Integer
          end
          get 'get_vip_exp',
              {
                entity:     AMS::Private::Entities::VipExpResult,
                http_codes: standard_error_codes
              } do
            vip_exp = VipExp.transaction do
              VipExp.get_vip_exp(params[:game_account_id])
            end
            status 200
            present({vip_game_exp: vip_exp.game_exp, vip_pub_exp: vip_exp.pub_exp}, with: AMS::Private::Entities::VipExpResult)
          end

          desc 'Get vip_token of the given game account'
          params do
            requires :game_account_id, type: Integer
          end
          get 'get_vip_token',
              {
                entity:     AMS::Private::Entities::VipTokenResult,
                http_codes: standard_error_codes
              } do
            game_account   = GameAccount.find(params[:game_account_id])
            vip_game_token = game_account.get_vip_game_token
            status 200
            present({vip_token: vip_game_token}, with: AMS::Private::Entities::VipTokenResult)
          end

          desc 'Update vip_pub_exp of the given game account'
          params do
            requires :game_account_id, type: Integer
            requires :vip_pub_exp, type: Integer
            optional :message, type: String, desc: 'message to be written to logs'
          end
          post 'update_vip_pub_exp',
               {
                 entity:     AMS::Private::Entities::VipExpResult,
                 http_codes: standard_error_codes
               } do
            vip_exp = VipExp.transaction do
              VipExp.update_vip_pub_exp(params[:game_account_id], params[:vip_pub_exp], params[:message])
            end
            status 200
            present({vip_game_exp: vip_exp.game_exp, vip_pub_exp: vip_exp.pub_exp}, with: AMS::Private::Entities::VipExpResult)
          end

          desc 'Notify change in vip_game_exp'
          params do
            requires :game_account_id, type: Integer
            requires :vip_game_exp, type: Integer
          end
          post 'notify_vip_game_exp_change',
               {
                 entity:     AMS::Private::Entities::VipExpResult,
                 http_codes: standard_error_codes
               } do
            vip_exp = VipExp.transaction do
              VipExp.notify_vip_game_exp_change(params[:game_account_id], params[:vip_game_exp])
            end
            status 200
            present({vip_game_exp: vip_exp.game_exp, vip_pub_exp: vip_exp.pub_exp}, with: AMS::Private::Entities::VipExpResult)
          end

          desc 'Add vip_pub_exp_add to vip_pub_exp'
          params do
            requires :game_account_id, type: Integer
            requires :vip_pub_exp_add, type: Integer
            optional :message, type: String, desc: 'message to be written to logs'
          end
          post 'add_vip_pub_exp',
               {
                 entity:     AMS::Private::Entities::VipExpResult,
                 http_codes: standard_error_codes
               } do
            vip_exp = VipExp.transaction do
              VipExp.add_vip_pub_exp(params[:game_account_id], params[:vip_pub_exp_add], params[:message])
            end
            status 200
            present({vip_game_exp: vip_exp.game_exp, vip_pub_exp: vip_exp.pub_exp}, with: AMS::Private::Entities::VipExpResult)
          end

          desc 'Remove vip_pub_exp_remove from vip_pub_exp'
          params do
            requires :game_account_id, type: Integer
            requires :vip_pub_exp_remove, type: Integer
            optional :message, type: String, desc: 'message to be written to logs'
          end
          post 'remove_vip_pub_exp',
               {
                 entity:     AMS::Private::Entities::VipExpResult,
                 http_codes: standard_error_codes
               } do
            vip_exp = VipExp.transaction do
              begin
                VipExp.remove_vip_pub_exp(params[:game_account_id], params[:vip_pub_exp_remove], params[:message])
              rescue VipExp::InsufficientVipPubExp
                error!({error_code: 'conflict_error', error_message: 'vip_pub_exp_remove should be smaller than the current vip pub exp'}, 409)
              end
            end
            status 200
            present({vip_game_exp: vip_exp.game_exp, vip_pub_exp: vip_exp.pub_exp}, with: AMS::Private::Entities::VipExpResult)
          end

          desc 'Add vip tokens to the given game account'
          params do
            requires :game_account_id, type: Integer
            requires :vip_token, type: Integer, desc: 'Number of vip tokens to be added'
            optional :message, type: String, desc: 'message to be written to logs'
            optional :external_transaction_id, type: String, desc: 'External transaction id for this add'
            optional :use_delayed_job_on_failure, type: Boolean, desc: 'use delayed job if fails to send'
          end
          post 'add_vip_token',
               {
                 entity:     AMS::Private::Entities::VipTokenAddResult,
                 http_codes: standard_error_codes
               } do

            external_transaction_id = (params[:external_transaction_id] || 0) rescue 0
            game_account               = GameAccount.find(params[:game_account_id])
            num_vip_tokens_to_add      = params[:vip_token]
            message                    = params[:message]
            use_delayed_job_on_failure = params[:use_delayed_job_on_failure]

            error!({error_code: 'argument_error', error_message: 'vip_token should a positive number'}, 422) if num_vip_tokens_to_add <= 0

            if use_delayed_job_on_failure == true
              begin
                response = game_account.add_vip_token(num_vip_tokens_to_add, external_transaction_id: external_transaction_id, message: message)
              rescue GameAccount::VipTokenItemNotFoundError, GameAccount::VipTokenItemNotConfiguredError, Box::BoxError => e
                # create a delayed job to send vip token
                Delayed::Job.enqueue GameAccount::AddVipTokenJob.new(game_account.id, num_vip_tokens_to_add, external_transaction_id, message), 10
                response = {box_transaction_id: nil, box_serial_number: nil, log: nil}
              end
            else
              begin
                response = game_account.add_vip_token(num_vip_tokens_to_add, external_transaction_id: external_transaction_id, message: message)
              rescue GameAccount::VipTokenItemNotFoundError => e
                error!({error_code: 'not_found', error_message: e.message}, 404)
              rescue GameAccount::VipTokenItemNotConfiguredError => e
                error!({error_code: 'internal_error', error_message: e.message}, 500)
              rescue Box::BoxError => e
                error!({error_code: 'box_error', error_message: e.message, log: e.log}, 500)
              end
            end
            status 200
            present(response, with: AMS::Private::Entities::VipTokenAddResult)
          end

          desc 'Get the last active date'
          params do
            requires :game_account_id, type: Integer
          end
          get 'get_last_active_date',
              {
                entity:     AMS::Private::Entities::ResultDateTimeValue,
                http_codes: [
                            ] + standard_error_codes
              } do
            game_account              = GameAccount.find(params[:game_account_id])
            web_authtntication_record = WebAuthenticationRecord.where(user_id: game_account.user_id, in_launcher: true, game_name: game_account.game.name).last
            if web_authtntication_record
              last_active_date = web_authtntication_record.updated_at
            else
              last_active_date = Time.now.utc
            end
            response = {result: last_active_date}
            status 200
            present(response, with: AMS::Private::Entities::ResultDateTimeValue)
          end

          helpers do
            def get_normalized_characters(game_account)
              game_account.characters.map do |character|
                case game_account.game.name.upcase
                  when 'TERA'
                    {
                      'id'    => character['char_srl'],
                      'name'  => character['char_name'],
                      'sex'   => character['char_gender'],
                      'level' => character['char_level']
                    }
                  when 'ZMR'
                    {
                      'id'    => character['character_id'],
                      'name'  => character['character_name'],
                      'sex'   => character['sex'],
                      'level' => character['level']
                    }
                end
              end
            end
          end

          desc 'Get the maximum level among the characters'
          params do
            requires :game_account_id, type: Integer
          end
          get 'get_max_character_level',
              {
                entity:     AMS::Private::Entities::ResultIntegerValue,
                http_codes: [
                            ] + standard_error_codes
              } do
            game_account = GameAccount.find(params[:game_account_id])
            max_level    = 0
            characters   = get_normalized_characters(game_account)
            if characters && !characters.empty?
              max_level = (characters.max { |character| character['level'] })['level']
            end
            response = {result: max_level}
            status 200
            present(response, with: AMS::Private::Entities::ResultDateTimeValue)
          end

          resources :characters do
            desc 'List characters'
            params do
              requires :game_account_id, type: Integer
            end
            paginate
            get '',
                {
                  entity:     AMS::Private::Entities::Character,
                  http_codes: [
                              ] + standard_error_codes
                } do
              game_account = GameAccount.find(params[:game_account_id])
              characters   = paginate(get_normalized_characters(game_account))
              # convert hash to open struct
              characters   = characters.map { |x| OpenStruct.new(x) }
              present characters, with: AMS::Private::Entities::Character
            end

            route_param :character_id do
              desc 'Get character'
              params do
                requires :game_account_id, type: Integer
                requires :character_id, type: Integer
              end
              get '',
                  {
                    entity:     AMS::Private::Entities::Character,
                    http_codes: [
                                ] + standard_error_codes
                  } do
                game_account = GameAccount.find(params[:game_account_id])
                characters   = get_normalized_characters(game_account)
                characters   = characters.select { |character| character['id'].to_s == params[:character_id].to_s }
                if characters.count > 0
                  character = characters[0]
                else
                  character = nil
                end
                # convert hash to open struct
                character = OpenStruct.new(character)
                present character, with: AMS::Private::Entities::Character
              end

            end
          end
        end
      end
    end
  end
end
