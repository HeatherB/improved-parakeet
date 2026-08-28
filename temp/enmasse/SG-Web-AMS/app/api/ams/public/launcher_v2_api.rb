require 'openssl'
require 'digest/sha1'
require 'base64'

module AMS
  module Public
    class LauncherError < RuntimeError
      attr_reader :error_code
      def initialize(error_code, message)
        @error_code, @message = error_code, message
      end
      def message
        @message
      end
    end

    class LauncherResult
      attr_accessor :success, :error_code, :info
      def self.success(custom = nil, display = nil, state = nil)
        obj = new
        obj.success = true

        info = {}
        info[:display] = display if display.present?
        info[:state] = state if state.present?
        info[:custom] = custom if custom.present?
        obj.info = info if info.present?

        obj
      end

      def self.failure(error_code, info = nil)
        obj = new
        obj.success = false
        obj.error_code = error_code
        obj.info = info if info.present?
        obj
      end

      def pack
        result = {}
        result[:success] = @success
        result[:error_code] = @error_code if @error_code.present?
        result[:info] = @info if @info.present?
        return result
      end
    end

    class LauncherV2API < AMS::Public::BaseAPI

      #
      # unhandled exceptions come here
      rescue_from :all do |e|
        Rails.logger.debug e.message
        Rails.logger.debug e.backtrace.join("\n")
        # check if we have good error code
        # or we use execption class name
        if e.class.instance_methods(true).include?(:error_code)
          error_code = e.error_code
        else
          error_code = e.class.to_s.upcase
        end

        error! (LauncherResult.failure(error_code).pack)
        # return LauncherResult
        #return LauncherResult.failure(error_code).pack
      end

      helpers do
        def response(response)
          return {:error => false, :response => response }
        end
        def error(error)
          error_code = error.respond_to?('error_code')? error.error_code : 0
          return {:error => true, :response => {:error_code => error_code, :message => error.message}}
        end
        def get_error_code_from_code_exception(messages)
          case message
          when "invalid code"
            return 'S0020'
          when "not eligible to redeem this code"
            return 'S0021'
          when "not eligible to redeem internal code"
            return 'S0022'
          when "redemption limit overflow"
            return 'S0023'
          else
            return 'S0024'
          end
        end
      end

      def self.cache
        @@cache ||= new_cache
      end

      def self.new_cache
        memd_config = YAML::load(IO.read(File.join("config", "memcached.yml")))
        UberCache.new("games-api", memd_config[Rails.env.to_s]["servers"].to_s.split(","))
      end

      resource :launcher_v2 do
        get 'games' do

          # games = [
          #   {
          #     :id => 1,
          #     :name => 'TERA',
          #     :game => 'tera',
          #     :background_url => 'http://qa.axt.com:8080/launcher_v2_front/img/game-area-bg.jpg',
          #     :thumbnail_sprite_url => 'http://qa.axt.com:8080/launcher_v2_front/img/games/thumb_tera.jpg'
          #   },
          #   {
          #     :id => 2,
          #     :name => 'ZMR',
          #     :game => 'zmr',
          #     :background_url => 'http://qa.axt.com:8080/launcher_v2_front/img/game-area-bg.jpg',
          #     :thumbnail_sprite_url => 'http://qa.axt.com:8080/launcher_v2_front/img/games/thumb_zmr.jpg',
          #     :gumballs => [
          #       {:image_url => 'http://qa.axt.com:8080/launcher_v2_front/img/gumball/hip-hop.jpg', :body => 'ZMR GB 1'},
          #       {:image_url => 'http://qa.axt.com:8080/launcher_v2_front/img/gumball/hip-hop.jpg', :tagline => 'ZMR GB 2'},
          #       {:image_url => 'http://qa.axt.com:8080/launcher_v2_front/img/gumball/hip-hop.jpg', :tagline => 'ZMR GB 3'}
          #     ]
          #   },
          #   {
          #     :id => 1003,
          #     :name => 'ava',
          #     :game => 'ava',
          #     :show_languages => true,
          #     :show_code_redemption => true,
          #     :background_url => 'http://qa.axt.com:8080/launcher_v2_front/img/game-area-bg.jpg',
          #     :thumbnail_sprite_url => 'http://qa.axt.com:8080/launcher_v2_front/img/games/thumb_ava.jpg',
          #     :languages => [
          #       {:value => 'en', :title => 'English'},
          #       {:value => 'ko', :title => 'Korean'},
          #       {:value => 'jp', :title => 'Japanese'},
          #       {:value => 'sp', :title => 'Spanish'},
          #       {:value => 'fr', :title => 'France'}
          #     ],
          #     :game_options => [
          #       {:value => '', :title => 'do this', :action => 'link_to'},
          #       {:value => '', :title => 'do that', :action => 'link_to'}
          #     ],
          #     :gumballs => [
          #       {:image_url => 'http://qa.axt.com:8080/launcher_v2_front/img/gumball/hip-hop.jpg', :body => 'This is body.'},
          #       {:image_url => 'http://qa.axt.com:8080/launcher_v2_front/img/gumball/hip-hop.jpg', :tagline => '2'},
          #       {:image_url => 'http://qa.axt.com:8080/launcher_v2_front/img/gumball/hip-hop.jpg', :tagline => '3'}
          #     ]
          #   },
          #   {
          #     :id => 3,
          #     :name => 'KRITIKA',
          #     :game => 'kritika',
          #     :background_url => 'http://qa.axt.com:8080/launcher_v2_front/img/game-area-bg.jpg',
          #     :thumbnail_sprite_url => 'http://qa.axt.com:8080/launcher_v2_front/img/games/thumb_kritika.jpg',
          #     :gumballs => [
          #       {:image_url => 'http://qa.axt.com:8080/launcher_v2_front/img/gumball/hip-hop.jpg', :body => 'ZMR GB 1'},
          #       {:image_url => 'http://qa.axt.com:8080/launcher_v2_front/img/gumball/hip-hop.jpg', :tagline => 'ZMR GB 2'},
          #       {:image_url => 'http://qa.axt.com:8080/launcher_v2_front/img/gumball/hip-hop.jpg', :tagline => 'ZMR GB 3'}
          #     ]
          #   },
          # ]
          games = AMS::Public::LauncherV2API.cache.obj_read_or_write("laucher_games", ttl: 900) {
            LauncherGame.where(active: true).order(:position).includes(:launcher_game_options, :launcher_game_languages, :launcher_gumballs).where("launcher_game_options.active = true AND launcher_game_languages.active = true AND gumballs.active = true").all
          }
          return LauncherResult.success(games).pack
        end

        post 'user_beta_access' do

          doorkeeper_authorize! :launcher, :public
          user = User.find(doorkeeper_token.resource_owner_id)

          games = params['games']
          result = {}
          if games.instance_of? Hashie::Array
            games.each do |g|
              game = Game.find_by_name(g.name)
              wsa = WhAssetBetaAccess.where(:game_id => game.id).first
              if wsa.present?
                asf = AssetFulfillment.where(:user_id => user.id, :warehouse_sku_asset_id => wsa.id)
                if asf.count > 0
                  result[g.name] = true
                else
                  result[g.name] = false
                end
              end
            end
          else
            return LauncherResult.failure('S0030').pack
          end

          return LauncherResult.success(result).pack
        end

        get 'user' do
          doorkeeper_authorize! :launcher, :public

          user = User.find(doorkeeper_token.resource_owner_id)
          present :success, true
          present :info, user, with: AMS::Private::Entities::User
          #present(:info, ( present(:custom, user, with: AMS::Private::Entities::User) ) )
        end

        get 'commandline_option' do
          game_id = params[:game_id]
          doorkeeper_authorize! :launcher, :public

          user = User.find(doorkeeper_token.resource_owner_id)

          # create game account if not exist
          game_account = user.game_accounts.where(:game_id => game_id).first
          if !game_account.present?
            GameAccount.auto_account_creation(user, false, nil, Game.find(game_id), nil, true)
          end

          Rails.logger.info(user.inspect)

          if user.present?
            game_accounts = user.game_accounts.where(:game_id => game_id)
            if game_accounts.present?
              game = Game.find(game_id)
              game_account = game_accounts.first
              Rails.logger.info(game_account)
              result = game_account.get_commandline_options(game)
              return LauncherResult.success(result).pack
              #return result
            end
          end
          return LauncherResult.failure('S0001').pack
          #return {:error => true, :response => {:error_code => 0, :message => 'user or game account not found'}}
        end

        get 'check_user_status' do
          begin
            # params
            # => user
            # => user->io_black_box
            # => user->steam_app_id   : option
            # => user->rid            : option
            # newsletter_id           : option
            # game_id ==> (X)
            # access_token

            doorkeeper_authorize! :launcher, :public

            u, error, error_msg  = nil, nil, nil

            u = User.find(doorkeeper_token.resource_owner_id)
            p = JSON.parse(params['user'])
            in_launcher = true
            in_steam = false          # need to get as parameter
            #game = Game.find(params[:game_id])
            remote_ip = env['HTTP_X_FORWARDED_FOR'] || env['REMOTE_ADDR']

                # if u.activation_code.present?
                #   result[:response] = {:activation_needed => true}
                # elsif u.secret_question_id.present?
                #   result[:response] = {:secret_qa_needed => true}
                # elsif u.deleted?
                #   error_master = true
                #   error, error_msg = User.auth_error_code_for(:not_found), "account has been disabled"
                #   result[:response] = {:error_code => error, :error_msg => error_msg}
                # elsif u.legacy_account?
                #   error_master = true
                #   error, error_msg = User.auth_error_code_for(:legacy_account), "please complete the setup of your new En Masse account"
                #   result[:response] = {:error_code => error, :error_msg => error_msg}
                # elsif u.suspended_from_game?
                #   error_master = true
                #   error, error_msg = User.auth_error_code_for(:suspended), "this account is currently banned or suspended"
                #   result[:response] = {:error_code => error, :error_msg => error_msg}
                # else
                # end

            #
            # check critical error cases first
            # play need to go outside of launcher, do something needed
            # or simply can not play
            #
            if u.deleted?                     # error #1: not found
              error, error_msg = User.auth_error_code_for(:not_found), "account has been disabled"
            elsif u.legacy_account?           # error #2: legacy account
              error, error_msg = User.auth_error_code_for(:legacy_account), "please complete the setup of your new En Masse account"
            elsif u.suspended_from_game?      # error #3: suspended
              error, error_msg = User.auth_error_code_for(:suspended), "Your account has been banned or suspended"
            elsif (p.nil? || p['io_black_box'].empty?)  # error #4: missing blackbox information
              error, error_msg = User.auth_error_code_for(:missing_black_box), "failed to generate device signature"
            end
            return LauncherResult.success(nil, error_msg, 'bad_user').pack if (error != nil)
          #  return {:error => true, :response => {:error_code => error, :message => error_msg}} if (error != nil)

            #
            # get user from steam ticket, or return error
            if p['steam_app_id'].present? && p['steam_auth_ticket'].present?
              u, error, error_msg = User.find_user_by_steam_auth_ticket(p['steam_app_id'], p['steam_auth_ticket'])
            end
            return LauncherResult.failure('S0002').pack if error || error_msg
            #return {:error => true, :response => {:error_code => error, :message => error_msg}} if error || error_msg

            #
            # step 1. IOVation
            begin
              io_type = "login_universal"
              u.update_iovation!(remote_ip, p['io_black_box'], io_type)
              #return {:error => false, :response => {:error_code => 'error', :message => u}}

              #if u.iovation_denied?
              if u.io_result == "D"
                #if u.iovation_denied_by_deny_action?
                  #error = User.auth_error_code_for(:IOVATION_DENIED)
                  error_msg = "User Authentication Failed"
                  return LauncherResult.success(nil, error_msg, 'bad_user').pack
                  #return {:error => true, :response => {:error_code => error, :message => error_msg}}
                #end

              # new part
              #if u.io_result == "D"
              #  return {:error => false, :response => {:error_code => User.auth_error_code_for(:IOVATION_DENIED), :message => 'banned iovation sign in error'}}

              end
              #end new part

              #if u.iovation_denied?
              #  if u.iovation_denied_by_deny_action?
              #    error = User.auth_error_code_for(:IOVATION_DENIED)
              #    error_msg = "banned iovation sign in error"
              #    return {:error => true, :response => {:error_code => error, :message => error_msg}}
              #  end
              #end
            rescue => e
              logger.error e
              logger.error e.backtrace.join("\n")
              return LauncherResult.failure('S0003').pack
              #error = User.auth_error_code_for(:IOVATION_NOT_AVAIL)
              #error_message = "iovation not available"
              #return {:error => true, :response => {:error_code => error, :message => error_msg}}
            end

            #
            # step 2. Account Activation
            if u.activation_code.present?
              return LauncherResult.success(nil, nil, 'activation_needed').pack
              #return {:error => false, :response => {:activation_needed => true}}
            end

            #
            # step 3. Secret QA
            if !u.secret_question_id.present?
              return LauncherResult.success(nil, nil, 'secret_qa_needed').pack
              #return {:error => false, :response => {:secret_qa_needed => true}}
            end

            #
            # step 4. Account Armor
            if u.io_auth_required? && !u.authorize_next_device?
              # check if we need to send email
              ticket  = Rails.cache.read(User.engarde_ticket_cache_key(u.id, u.io_device_alias))
              if !ticket.present?
                ticket = User.generate_engarde_ticket(u.id, u.io_device_alias)
                return LauncherResult.failure('S0019').pack unless ticket.present?

                # send email
                UserMailer.queue(:engarde_ticket, u, ticket)
              end

              return LauncherResult.success(nil, nil, 'account_armor_needed').pack
              #return {:error => false, response: {:engard_needed => true}}
            end

            ###########################
            # passed all requirements #
            ###########################

            error_message = nil
            notice_message = nil

            referral = Referral.find_by_id(Referral.unobfuscated_id(p['rid'])) if p['rid']
            if referral.present? && u.referral_id.blank? && u.can_apply_referral?
              u.update_attribute(:referral_id, referral.id)
              referral.update_attribute(:target_user_id, u.id)
              referral.active!
            end

            # newsletter check hack ZMR and other games
            if params['newsletter_id']
              ml = MailingList.find(params['newsletter_id']) rescue nil
              if ml && ml.active
                if u.mailing_lists.include?(ml)
                    #notice_message = "You're already set up to get the #{ml.name}!"
                else
                  ml.subscribe(u.id)
                  #send email
                  UserMailer.queue(:welcome_to_game, u, ml.auto_sign_up_for_game) unless ml.auto_sign_up_for_game.empty?
                  #notice_message = "You are now subscribed to #{ml.name}"
                end
              end
            end
            #/hack

            referral_message = ''
            if referral.present? && !u.can_apply_referral?
              referral_message = "referral cannot accept referral invite due to having a refer a friend account"
            end

            #
            # finally, we're good
            custom = {:referral_applied => u.can_apply_referral?, :referral_message => referral_message}
            return LauncherResult.success(custom, nil, 'good').pack;
            #return {:error => false, response: {:referral_applied => u.can_apply_referral?, :referral_message => referral_message}}

          rescue => e
            Rails.logger.error e
            Rails.logger.error e.backtrace.join("\n")
            return LauncherResult.failure('S0004').pack
            #error = 0
            #error_msg = "internal error"
            #return {:error => true, :response => {:error_code => error, :message => error_msg}}
          ensure
            game_name = nil;
            options = { :ip_address => remote_ip, :success => error.nil?, :error_code => error,
                :in_launcher => in_launcher, :in_steam => in_steam, :game_name => game_name}
            options.merge!(:user_id => u.id) if u.present?
            WebAuthenticationRecord.create(options)
          end
        end

        get 'check_iovation_game' do
          begin
            # params
            # => game_id
            # => user
            # => user->io_black_box
            # => user->steam_app_id   : option

            doorkeeper_authorize! :launcher, :public

            u, error, error_msg  = nil, nil, nil

            u = User.find(doorkeeper_token.resource_owner_id)
            p = JSON.parse(params['user'])
            game = Game.find(params['game_id'])

            in_launcher = true
            in_steam = false          # need to get as parameter
            remote_ip = env['HTTP_X_FORWARDED_FOR'] || env['REMOTE_ADDR']

            #
            # check critical error cases first
            # play need to go outside of launcher, do something needed
            # or simply can not play
            #
            code = nil
            if u.deleted?                     # error #1: not found
              error, error_msg = User.auth_error_code_for(:not_found), "account has been disabled"
            elsif u.legacy_account?           # error #2: legacy account
              error, error_msg = User.auth_error_code_for(:legacy_account), "please complete the setup of your new En Masse account"
            elsif u.suspended_from_game?      # error #3: suspended
              error, error_msg = User.auth_error_code_for(:suspended), "Your account has been banned or suspended"
            end
            return LauncherResult.success(nil, error_msg, 'bad_user').pack if (error != nil)
            #return LauncherResult.failure(code).pack if (error != nil)

            #
            # call iovation
            begin
              io_type = "game-login"
              game_name = (game && "tera" != game.seo_id) ? "_#{game.seo_id}" : ""
              u.update_iovation!(remote_ip, p['io_black_box'], io_type + game_name)
              if u.io_result == "D"
                error_msg = "User Authentication Failed"
                return LauncherResult.success(nil, error_msg, 'bad_user').pack
                #return LauncherResult.failure('S0033').pack
              end
            rescue => e
              logger.error e
              logger.error e.backtrace.join("\n")
              return LauncherResult.failure('S0034').pack
            end

            ###########################
            # passed all requirements #
            ###########################

            #
            # finally, we're good
            return LauncherResult.success().pack

          # rescue => e
          #   Rails.logger.error e
          #   Rails.logger.error e.backtrace.join("\n")
          #   return LauncherResult.failure('S0004').pack
          end
        end

        post 'verify_activation_code' do
          #begin
            doorkeeper_authorize! :launcher, :public
            user = User.find(doorkeeper_token.resource_owner_id)

            if user && user.activation_code.present?
              if user.activation_code.to_s.upcase == params['activation_code'].to_s.upcase # compare codes case-insensitively
                user.activation_code = nil
                user.save!
                return LauncherResult.success(nil, nil, 'activation_code_match').pack
                #return response(nil)
              else
                return LauncherResult.success(nil, nil, 'activation_code_mismatch').pack
                #raise LauncherError.new('not_matched'), 'Activation code mismatch. Please check it again, or resend it.'
              end
            end

            return LauncherResult.success(nil, nil, 'resend_activation_code').pack

          #rescue => e
          #  Rails.logger.error e
          #  Rails.logger.error e.backtrace.join("\n")
          #  return error(e)

          #end
        end

        post 'resend_activation' do
          #begin
            doorkeeper_authorize! :launcher, :public
            user = User.find(doorkeeper_token.resource_owner_id)

            user.resend_activation
            return LauncherResult.success().pack
            #return response(nil)
          # rescue => e
          #   Rails.logger.error e
          #   Rails.logger.error e.backtrace.join("\n")
          #   return error(e)
          # end
        end

        post 'send_account_armor_code' do
          #begin
            doorkeeper_authorize! :launcher, :public
            user = User.find(doorkeeper_token.resource_owner_id)

            ticket = user.generate_engarde_ticket
            return LauncherResult.success(nil, "Failed to generate authentication ticket", 'send_account_armor_ticket_absent').pack unless ticket.present?
            #raise LauncherError.new ('account_armor_ticket_absent'), "Failed to generate authentication ticket" unless ticket.present?


            UserMailer.queue(:engarde_ticket, user, ticket)

            return LauncherResult.success(nil, nil, 'account_armor_code_sent').pack
            #return response(nil)
          # rescue => e
          #   Rails.logger.error e.message
          #   Rails.logger.error e.backtrace.join("\n")
          #   return error(e)
          # end
        end

        get 'verify_account_armor_code' do
          # engarde_ticket
          # remember_device
          #begin
            doorkeeper_authorize! :launcher, :public

            user = User.find(doorkeeper_token.resource_owner_id)

            if user.consume_engarde_ticket!(params['engarde_ticket'], params['remember_device'])
              return LauncherResult.success(nil, nil, 'account_armor_match').pack
              #return response(nil)
            else
              return LauncherResult.success(nil, nil, 'account_armor_mismatch').pack
              #return error({:error_code => 'account_armor_not_matched', :message => 'account armor not matched'})
            end
          # rescue => e
          #   Rails.logger.error e.message
          #   Rails.logger.error e.backtrace.join("\n")
          #   return error(e)
          # end
        end

        #
        # @TODO: this function is used by only regular launcher
        #
        post 'redeem_code' do
          doorkeeper_authorize! :launcher, :public
          user = User.find(doorkeeper_token.resource_owner_id)

          code = params[:game_code]
          pref_account   = params[:pref_account]
          options        = pref_account.present? ? {:pref_acct => GameAccount.unobfuscated_id(pref_account)} : {}
          error_messages = PromoCode.check_code_precondition(user, code, options)

          unless error_messages.empty?
            return LauncherResult.failure('S0025', error_messages).pack
            #return {:error => true, :response => {:error_code => 0, :message => error_messages[0], :messages => error_messages}}
          else
            begin
              game_code = PromoCode.use_code(user, code, options)
              promotion, skus = game_code.force_redeem!(user)
            rescue PromoCode::CodeException => ce
              game_code, promotion = nil, nil
              return LauncherResult.failure('S0026', [ce.message]).pack
              #return {:error => true, :response => {:error_code => 0, :message => ce.message}}
            end
            return LauncherResult.success({:promotion => promotion, :skus => skus}).pack
            #return {:error => false, :response => {:promotion => promotion, :skus => skus}}
          end

          unless game_code.present?
            return LauncherResult.failure('S0027').pack
            #return {:error => true, :response => {:error_code => 0, :message => 'system error'}}
          end
        end

        post 'sign_up' do
          # user
          # => signed_up_page
          # => email
          # => password
          # => password_confirmation
          # => io_black_box
          # => disable_auto_subscribing
          # in_steam
          # rid
          # receive_news_<:id>
          # game_name
          begin
            remote_ip = env['HTTP_X_FORWARDED_FOR'] || env['REMOTE_ADDR']
            game_name = params['game_name']

            #p = JSON.parse(params['user'])
            p = params['user']
            p['date_of_birth'] = nil
            p['terms'] = "1"

            if params['in_steam'] == "true"
              p['signed_up_page'] = "#{game_name} Steam Launcher"
            else
              p['signed_up_page'] = "Universal Launcher"
            end

            user = User.create_user_phase1( :email                 => p['email'],
                                            :password              => p['password'],
                                            :password_confirmation => p['password_confirmation'],
                                            :date_of_birth         => p['date_of_birth'],
                                            :terms                 => p['terms'],
                                            :signed_up_page        => p['signed_up_page'],
                                            :io_black_box          => p['io_black_box'],
                                            :referrer              => nil, #session['original_referrer'],
                                            :registration_ip       => remote_ip
            )
            User.create_user_phase2(user,
                                    :cookies                       => cookies,
                                    :auto_subscribing_mailing_list => (params['disable_auto_subscribing'] == '1') ? false : true,
                                    :mailing_list_ids              => MailingList.all.map { |mailing_list| mailing_list.id if params["receive_news_#{mailing_list.id}"] == '1' }.compact,
                                    :referral_id                   => params['rid']
            )
            return LauncherResult.success(nil, nil, 'signup_good').pack
            #return response(nil)
          rescue ActiveRecord::RecordNotSaved
            if user.errors["email"] && user.errors["email"].include?("has already been taken")
              return LauncherResult.success(nil, 'Email already registered. Log in to your exisiting En Masse account.', 'signup_email_exist').pack
              #e = LauncherError.new(0, 'Email already registered. Log in to your exisiting En Masse account.')
              #return error(e)
              #return error({:error_code => 'email_already_taken', :message => 'Email already registered. Log in to your exisiting En Masse account.'})
            else
              errors = user.errors.full_messages.clone
              errors.delete(" Failed to save record, retry later.")
              return LauncherResult.success(nil, errors.to_sentence, 'signup_other_reason').pack
              #e = LauncherError.new(0, errors.to_sentence)
              #return error(e)
              #return error(LauncherError.new(0), errors.to_sentence)
            end
          end
        end

        post "signup_with_external_auth" do
          # in_steam
          # campaign
          # email
          # birthday
          # token
          # uid
          # provider
          # auto_subscribe_newsletters
          # newsletter_ids
          # blackbox
          begin
            in_launcher = true
            in_steam = params['in_steam'] == "true"
            remote_ip = env['HTTP_X_FORWARDED_FOR'] || env['REMOTE_ADDR']
            game_name = ""

            if params['campaign']
              signed_up_campaign = params['campaign'].to_json
            else
              signed_up_campaign = {}.to_json
            end

            success = true
            u, error, error_msg = nil

            #auth_hash = request.env['omniauth.auth']
            # let's prepare auth_hash from scratch... this must be part of omniauth.
            auth_hash = {
              'info' => {
                'email' => params['email']
              },
              'extra' => {
                'raw_info' => {
                  'birthday' => params['birthday']
                },
                'ip_address' => remote_ip
              },
              'credentials' => {
                'token' => params['token']
              },
              'uid' => params['uid'],
              'provider' => params['provider']
            }
            if auth_hash
              authorization = Authorization.find_by_provider_and_uid(auth_hash['provider'], auth_hash['uid'])

              if authorization
                new_user = false
              else
                logger.info "Creating User using hash=#{auth_hash}, game=#{game_name}, auto_subscribe_newsletters=#{params['auto_subscribe_newsletters']}, newsletter_ids=#{params['newsletter_ids']}, in_launcher=#{in_launcher}, in_steam=#{in_steam}"
                authorization, new_user = Authorization.create_from_hash(auth_hash,
                                                                         :cookies => cookies,
                                                                         :game => game_name,
                                                                         :user => u,
                                                                         :auto_subscribe_newsletters => params['auto_subscribe_newsletters'],
                                                                         :newsletter_ids => params['newsletter_ids'],
                                                                         :io_black_box => params['blackbox'],
                                                                         :original_referrer => nil, #session[:original_referrer],
                                                                         :in_launcher => in_launcher,
                                                                         :in_steam => in_steam,
                                                                         :signed_up_campaign => signed_up_campaign
                )
              end
            end

            if authorization
              u = authorization.user

              # Facebook-specific actions
              if authorization.provider == 'facebook'
                authorization.extend_token!(auth_hash['credentials']['token'])
              end

              return LauncherResult.success({:new_user => new_user}).pack
              #return {:error => false, :response => {:new_user => new_user}}
            else
              return LauncherResult.failure('S0005').pack
              #error, error_msg = User.auth_error_code_for(:provider_failure), "invalid authorization"
              #return {:error => true, :response => {error_code => error, :message => error_msg}}
            end
          rescue => e
            Rails.logger.error e
            Rails.logger.error e.backtrace.join("\n")
            return LauncherResult.failure('S0006').pack
            #return error(e)
          ensure
            options = { :ip_address => remote_ip, :success => error == nil, :error_code => error,
                        :in_launcher => in_launcher, :in_steam => in_steam, :game_name => game_name}
            options.merge!(:user_id => u.id) if u.present?
            WebAuthenticationRecord.create(options)
          end
        end

        # post 'activate' do
        #   begin
        #     doorkeeper_authorize! :launcher, :public
        #     user = User.find(doorkeeper_token.resource_owner_id)
        #   end
        # end

        get 'secrete_questions' do
          #begin
            secret_questions = SecretQuestion.active
            return LauncherResult.success({:secret_questions => secret_questions}).pack
            #return response ({:secret_questions => secret_questions})
          # rescue => e
          #   Rails.logger.error e
          #   Rails.logger.error e.backtrace.join("\n")
          #   return error(e)
          # end
        end

        post 'secret_answer' do
          # secret_question_id
          # secret_answer
          # access_token
          #begin
            doorkeeper_authorize! :launcher, :public
            user = User.find(doorkeeper_token.resource_owner_id)

            result = User.answer_secret_question(
              user,
              params['secret_question_id'],
              params['secret_answer']
            )
            if result
              return LauncherResult.success().pack
              #return response(nil)
            else
              return LauncherResult.failure('S0007').pack
              #raise 'internal error'
            end

          # rescue => e
          #   Rails.logger.error e.message
          #   Rails.logger.error e.backtrace.join("\n")
          #   return error(e)
          # end
        end

        # associate third party user id (for example steam) with master account id
        post 'associate_steam' do
          # provider
          # steam_auth_ticket
          # steam_app_id
          #begin
            doorkeeper_authorize! :launcher, :public
            user = User.find(doorkeeper_token.resource_owner_id)
            if params['provider'] == "steam"
              if params['steam_auth_ticket'] && params['steam_app_id']
                error_msg = user.associate_with_steam(params['steam_app_id'], params['steam_auth_ticket'], params['steam_user_id'])
                if error_msg.nil?
                  return LauncherResult.success().pack
                  #return {:error => false}
                else
                  return LauncherResult.failure('S0008').pack
                  #return {:error => true, :response => {:error_code => 0, :message => error_msg}};
                end
              else
                return LauncherResult.failure('S0009').pack
                #return {:error => true, :response => {:error_code => 0, :message => 'missing steam_auth_ticket'}}
              end
            else
              return LauncherResult.failure('S0010').pack
              #return {:error => true, :response => {:error_code => 0, :message => 'undefined provider'}}
            end
          #end
        end

        # steam related
        post 'check_steam_dlc_activated' do
          # Check if the given steam DLCs are activated
          #
          # Request:
          #   curl -X POST -d "dlc_list[0][dlc_id]=1&dlc_list[0][name]=test1&dlc_list[1][dlc_id]=2&dlc_list[1][name]=test2" http://localhost:3000/launcher/1/check_steam_dlc_activated
          #     OR
          #   $.post('/launcher/1/check_steam_dlc_activated', {dlc_list: [{dlc_id:1, name:"test1"}, {dlc_id:2, name:"test2"}]}, function(data) { console.log(data) })
          #
          # Params:
          #   params => {"dlc_list"=>{"0"=>{"dlc_id"=>"1", "name"=>"test1"}, "1"=>{"dlc_id"=>"2", "name"=>"test2"}}, "launcher_id"=>"1"}

          # dlc_list
          doorkeeper_authorize! :launcher, :public
          user = User.find(doorkeeper_token.resource_owner_id)

          steam_authorization = user.authorizations.where(:provider => 'steam').first
          if steam_authorization
            steam_user_id = steam_authorization.uid
            dlc_list = []

            if params['dlc_list'].nil?
              return LauncherResult.failure('S0011').pack
              #render :json => {'result-message' => 'dlc_list is missing'}
              #return
            end

            params['dlc_list'].each do |dlc|
              dlc_id = dlc['dlc_id']
              dlc_name = dlc['name']

              if dlc_id.nil?
                return LauncherResult.failure('S0012').pack
                #render :json => {'result-message' => 'dlc_id is missing in the dlc_list element'}
                #return
              end

              if dlc_name.nil?
                return LauncherResult.failure('S0013').pack
                #render :json => {'result-message' => 'name is missing in the dlc_list element'}
                #return
              end

              # find dlc activation record
              dlc_activation = SteamDlcActivation.where(:steam_user_id => steam_user_id, :steam_dlc_id => dlc_id).first
              if dlc_activation
                if dlc_activation.activated_at.present?
                  dlc_list.push({:dlc_id => dlc_id, :name => dlc_name, :activated => true})
                else
                  dlc_activation_job = SteamDlcActivationJob.find_by_steam_dlc_activation_id(dlc_activation.id)
                  if dlc_activation_job
                    dlc_activation_job.refresh_expired_at
                    dlc_list.push({:dlc_id => dlc_id, :name => dlc_name, :activated => false, :will_be_activated => true})
                  else
                    dlc_list.push({:dlc_id => dlc_id, :name => dlc_name, :activated => false, :will_be_activated => false})
                  end
                end
              else
                dlc_list.push({:dlc_id => dlc_id, :name => dlc_name, :activated => false, :will_be_activated => false})
              end
            end
            return LauncherResult.success(dlc_list).pack
            #render :json => {'result-message' => 'ok', 'dlc_list' => dlc_list}
          else
            return LauncherResult.failure('S0014').pack
            #render :json => {'result-message' => 'no authorization record for steam'}
          end
        end

        post 'activate_steam_dlc' do
          # Active the given steam DLCs
          #
          # Request:
          #   curl -X POST -d "dlc_id_list[]=1&dlc_id_list[]=2&dlc_id_list[]=3" http://localhost:3000/launcher/1/activate_steam_dlc
          #     OR
          #   $.post('/launcher/1/activate_steam_dlc', {dlc_id_list: [1, 2, 3]}, function(data) { console.log(data) })
          #
          # Params:
          #   params => {"dlc_id_list"=>["1","2","3"], "launcher_id"=>"1"}

          # game_id
          # dlc_id_list

          doorkeeper_authorize! :launcher, :public
          user = User.find(doorkeeper_token.resource_owner_id)
          game_id = params['game_id']

          # check parameters
          dlc_id_list = params['dlc_id_list']
          if dlc_id_list.nil?
            return LauncherResult.failure('S0015').pack
            #render :json => {'result-message' => 'dlc_id_list is missing'}
            #return
          end

          # check the current user is associated with steam
          steam_authorization = user.authorizations.where(:provider => 'steam').first
          if steam_authorization.nil?
            return LauncherResult.failure('S0016').pack
            #render :json => {'result-message' => 'no authorization record for steam'}
            #return
          end

          steam_user_id = steam_authorization.uid
          account_id = user.game_accounts.where(:game_id => game_id).first.id

          SteamDlcActivation.transaction do
            dlc_id_list.each do |dlc_id|
              dlc_activation = SteamDlcActivation.where(:steam_user_id => steam_user_id, :steam_dlc_id => dlc_id).first
              if dlc_activation.nil?
                dlc_activation = SteamDlcActivation.create({:user_id         => user.id,
                                                            :game_account_id => account_id,
                                                            :steam_user_id   => steam_user_id,
                                                            :steam_dlc_id    => dlc_id})
              end

              # check dlc is already activated or in progress of activating
              if dlc_activation.activated_at.nil?
                # not activated
                if dlc_activation.steam_dlc_activation_job.nil?
                  # not in progress of activating
                  # activating dlc now
                  SteamDlcActivationJob.create_job(dlc_activation.id)
                end
              end
            end
          end

          return LauncherResult.success().pack
          #render :json => {'result-message' => 'ok'}
        end

        # check and apply login promotion
        post 'apply_login_promotion' do
          # params:
          # game_id

          doorkeeper_authorize! :launcher, :public
          user = User.find(doorkeeper_token.resource_owner_id)

          game_id = params['game_id']
          accounts = user.game_accounts.where(:game_id => game_id)
          if accounts.present?
            account = accounts.first;

            #@track_args = [] # @TODO: google analystics for BI # don't know what to do this time #
            result = FreePromotion.auto_fulfillment(user, account)

            return LauncherResult.success(result).pack
          else
            return LauncherResult.failure('S0018').pack
          end
        end

        # get sso ticket for opening store
        # before calling this API, you have to visit '/landing' page with oauth token,
        # so, ams generate session cache and cookies
        get 'sso_auth_ticket' do
          # game_id
          doorkeeper_authorize! :launcher, :public
          user = User.find(doorkeeper_token.resource_owner_id)

          game_id = params['game_id']
          accounts = user.game_accounts.where(:game_id => game_id)
          if accounts.present?
            account = accounts.first;

            ticket = LauncherSSO.get_sso_auth_ticket(user.id, account.id, params)
            return LauncherResult.success(ticket).pack
          end

          # no game accounts found
          return LauncherResult.failure('S0017').pack;
        end

        # encrypt refresh token with client device id
        post 'encrypt_refresh_token' do
          # refresh_token
          # io_black_box
          return LauncherResult.failure('S0028').pack unless params['refresh_token'].present?
          return LauncherResult.failure('S0029').pack unless params['io_black_box'].present?

          cipher = OpenSSL::Cipher::Cipher.new("aes-256-cbc")
          cipher.encrypt

          # you will need to store these for later, in order to decrypt your data
          key = Digest::SHA1.hexdigest(params['io_black_box'][0,32])
          iv = Base64.strict_decode64(SECURE_CONFIG["oauth"]["cipher_iv"])

          # load them into the cipher
          cipher.key = key
          cipher.iv = iv

          # encrypt the message
          encrypted = cipher.update(params['refresh_token'])
          encrypted << cipher.final

          return LauncherResult.success(Base64.strict_encode64(encrypted)).pack
        end

        # decrypt refresh token with client device id
        post 'decrypt_refresh_token' do
          # encrypted_refresh_token
          # io_black_box
          return LauncherResult.failure('S0028').pack unless params['encrypted_refresh_token'].present?
          return LauncherResult.failure('S0029').pack unless params['io_black_box'].present?

          # now we create a sipher for decrypting
          cipher = OpenSSL::Cipher::Cipher.new("aes-256-cbc")
          cipher.decrypt

          # you will need to store these for later, in order to decrypt your data
          key = Digest::SHA1.hexdigest(params['io_black_box'][0,32])
          iv = Base64.strict_decode64(SECURE_CONFIG["oauth"]["cipher_iv"])

          cipher.key = key
          cipher.iv = iv

          raw = Base64.strict_decode64(params['encrypted_refresh_token'])

          # and decrypt it
          decrypted = cipher.update(raw)
          decrypted << cipher.final

          return LauncherResult.success(decrypted).pack
        end

        # get beta access grant code 
        get 'get_user_beta_access_code' do

          doorkeeper_authorize! :launcher, :public
          user = User.find(doorkeeper_token.resource_owner_id)

          game_id = params['game_id']

          return LauncherResult.failure('S0035').pack unless user.present?
          return LauncherResult.failure('S0036').pack unless game_id.present?

          code = BetaAccessWindow.get_grant_code(game_id, user)
          code = '__system_deny__' if code == nil
          
          return LauncherResult.success(code).pack
        end
      end
    end
  end
end

__END__

















