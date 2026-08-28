module AMS
  module Public
    module Console
      class TeraAPI < AMS::Public::BaseAPI

        helpers do
          def current_game
            # find game
            game_name = "TERA #{params[:platform].upcase}"
            game      = Rails.cache.fetch("game_#{game_name}", expires_in: 60.seconds) do
              Game.where(name: game_name).first
            end
            error!({error_code: 'not_found', error_message: "No Game with the name '#{game_name}' registered"}, 404) if game.nil?

            game
          end

          def current_game_account
            game = current_game

            user         = User.find(doorkeeper_token.resource_owner_id)
            game_account = user.game_accounts.where(game_id: game.id).first

            error!({error_code: 'not found', error_message: "No game account with game_name '#{game.name}' registered for the given users"}, 404) if game_account.nil?

            game_account
          end

          def get_console_api_client
            game            = current_game

            # get console api server's address through game settings
            console_api_url = Rails.cache.fetch("console_api_url_#{game.name}", expires_in: 60.seconds) do
              game.setting(:console_api_url)
            end

            error!({error_code: 'not_found', error_message: 'console_api_url is not registered in game_settings'}, 404) if console_api_url.nil?

            console_api_access_token = Rails.cache.fetch("console_api_access_token_#{game.name}", expires_in: 60.seconds) do
              game.setting(:console_api_access_token)
            end

            error!({error_code: 'not_found', error_message: 'console_api_access_token is not registered in game_settings'}, 404) if console_api_access_token.nil?

            ConsoleAPI::Client.new(console_api_url, console_api_access_token)
          end
        end

        namespace :tera do
          params do
            requires :platform, type: Symbol, values: [:ps, :xb]
          end

          desc 'Get server lists'
          get 'list_servers' do
            doorkeeper_authorize! :console
            response = Rails.cache.fetch('tera_console_list_servers', expires_in: 60.seconds) do
              get_console_api_client.list_servers
            end
            success!(response)
          end

          desc 'Report TERA errors to AMS'
          params do
            requires :error, type: String
          end
          post 'report_errors' do
            doorkeeper_authorize! :console

            game_account = current_game_account

            result = ::LauncherError.create(user_id: game_account.user_id, :game_account_id => game_account.id, :error_code => params[:error])

            success!({success: !!result})
          end

          desc 'Get Auth Ticket for TERA'
          params do
            optional :client_ip, type: String, desc: 'ip address of the client, if blank, server will determine the value'
          end
          get 'get_auth_ticket' do
            doorkeeper_authorize! :console

            client_ip = params[:client_ip] || env['HTTP_X_FORWARDED_FOR'] || env['REMOTE_ADDR']
            client_ip = client_ip.strip if client_ip.is_a? String

            response = get_console_api_client.ticket_generate(current_game_account.id, client_ip)

            success!(response)
          end

          desc 'Get last connected server id'
          get 'get_last_connected_server_id' do
            doorkeeper_authorize! :console

            response = get_console_api_client.get_last_connected_server_id(current_game_account.id)

            success!(response)
          end

          desc 'Get number of chars per server'
          get 'get_chars_per_server' do
            doorkeeper_authorize! :console

            response = Rails.cache.fetch("tera_console_get_chars_per_server_#{current_game_account.id}", expires_in: 10.seconds) do
              get_console_api_client.get_chars_per_server(current_game_account.id)
            end

            success!(response)
          end

          desc 'Get permission of the given user'
          get 'get_user_permission' do
            doorkeeper_authorize! :console

            permission = current_game_account.game_account_type.permission_mask rescue 0
            response = {user_permission: permission}

            success!(response)
          end

          desc 'Generate encryption key for secure communication between TERA client and TERA server'
          params do
            optional :private_ip, type: String, desc: "client's private ip"
            optional :public_ip, type: String, desc: "client's public ip, if blank, server will determine the value"
            optional :expires_in, type: Integer, default: 600, desc: 'expiration time (secs) for exchange code'
            optional :key_length, type: Integer, values: [128, 192, 256], default: 256, desc: 'encryption key length'
          end
          get 'generate_encryption_key' do
            doorkeeper_authorize! :console

            public_ip  = params[:public_ip] || env['HTTP_X_FORWARDED_FOR'] || env['REMOTE_ADDR']
            public_ip  = public_ip.strip if public_ip.is_a? String
            private_ip = params[:private_ip] || ''
            response   = get_console_api_client.generate_encryption_key(public_ip, private_ip, params[:expires_in], params[:key_length])

            success!(response)
          end

        end
      end
    end

  end
end