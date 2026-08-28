require 'securerandom'

module AMS
  module Private

    class JsonStringValidator < Grape::Validations::Base
      def validate_param!(attr_name, params)
        if params[attr_name]
          json_hash = JSON.load params[attr_name] rescue nil
          if json_hash.nil?
            raise Grape::Exceptions::Validation, params: [@scope.full_name(attr_name)], message: 'must be json string'
          end
        end
      end
    end

    class UsersAPI < AMS::Private::BaseAPI

      helpers do
        def send_email(email_configuration, mail_action, user, *args)
          # example of email_configuration
          #     {
          #       :confirm_email_change     => {
          #         :template_name => 'confirm_email_change',
          #         :options     => {
          #           :name => "%{user.screen_name_no_temp}",
          #           :url  => "http://account.enmasse.com/users/%{user.screen_name}/confirm_email_change?ticket=%{ticket}"
          #         }
          #       },
          #       :account_armor_ticket     => {
          #         :template_name => 'account_armor_ticket',
          #         :options     => {
          #           :name   => "%{user.screen_name_no_temp}",
          #           :ticket => "%{ticket}"
          #         }
          #       },
          #       :welcome_to_game          => {
          #         :template_name => 'welcome_to_game',
          #         :options     => {
          #           :name => "%{user.screen_name_no_temp}"
          #         }
          #       },
          #       :password_reset_request   => {
          #         :template_name => 'password_reset_request',
          #         :options     => {
          #           :name => "%{user.screen_name_no_temp}",
          #           :url  => "http://account.enmasse.com/users/%{user.screen_name}/complete_password_reset?ticket=%{ticket}"
          #         }
          #       },
          #       :password_changed_notice  => {
          #         :template_name => 'password_changed_notice',
          #         :options     => {
          #           :name => "%{user.screen_name_no_temp}"
          #         }
          #       },
          #       :signup_notification => {
          #         :template_name => 'signup_notification',
          #         :options     => {
          #           :name   => "%{user.screen_name_no_temp}",
          #           :ticket => "%{ticket}",
          #           :url  => "http://account.enmasse.com/users/%{user.screen_name}/activate?ticket=%{ticket}"
          #         }
          #       },
          #       :email_changed_notice     => {
          #         :template_name => 'email_changed_notice',
          #         :options     => {
          #           :name => "%{user.screen_name_no_temp}"
          #         }
          #       }
          #     }

          # retrieve email_configuration
          configuration    = email_configuration[mail_action.to_s] || {}
          template_name    = configuration['template_name']
          template_options = configuration['options']

          # if there is a user configuration, use it or use system.
          if template_name && template_options
            # use user passed email configurations
            user_id            = user.id
            user_email_address = user.email
            ticket             = nil
            case mail_action.to_sym
              when :confirm_email_change
                ticket = user.new_email_key
              when :account_armor_ticket
                ticket = args[0]
              when :password_reset_request
                ticket = user.forgot_password_key
              when :signup_notification
                ticket = user.activation_code
            end

            template_variables = {
              :'ticket'                   => ticket,
              :'user.id'                  => user.id,
              :'user.screen_name'         => user.screen_name,
              :'user.screen_name_no_temp' => user.screen_name_no_temp,
              :'user.email'               => user.email,
              :'user.country_code'        => user.country_code,
              :'user.timezone'            => user.timezone,
              :'user.language'            => user.language,
              :'user.signed_up_page'      => user.signed_up_page
            }
            # expand template string in template_options
            template_options.each_key do |key|
              template_options[key] = template_options[key] % template_variables
            end
          else
            # use the system defined email configuration
            args                                                         = [user] + args
            user_id, user_email_address, template_name, template_options = UserMailer.new.send(mail_action.to_s, *args)
            template_options                                             ||= {}
          end
          UserMailer.queue_transaction(user_id, user_email_address, template_name, template_options)
        end

        def do_login(params)
          email_configuration = JSON.load(params[:email_configuration]) || {} rescue {}
          oauth = JSON.load(params[:oauth]) || {} rescue {}

          if User.country_not_permitted?(params[:remote_ip])
            error!({error_code: 'authentication_error', error_message: 'login country limited'}, 403)
          elsif User.login_rate_limit_reached?(params[:remote_ip])
            error!({error_code: 'authentication_error', error_message: 'login rate limit reached'}, 403)
          else
            authorization              = nil
            user                       = nil
            email                      = nil
            skip_activation_code_check = false
            if params[:email]
              user  = User.find_by_email(params[:email])
              email = params[:email]
            elsif oauth
              user                       = User.find_by_email(oauth['info']['email'])
              email                      = oauth['info']['email']
              skip_activation_code_check = true

              # create a new authorization record if not exists
              authorization              = Authorization.find_by_provider_and_uid(oauth['provider'], oauth['uid'])
              if authorization.nil?
                if oauth['extension'] && oauth['extension']['token']
                  token = oauth['extension']['token']
                else
                  token = oauth['credentials']['token']
                end
                # calculate expires_at date
                expiry     = oauth['credentials']['expires_at']
                expires_at = Time.now + expiry.to_i if expiry

                authorization = Authorization.create!(:user_id => user.id, :uid => oauth['uid'], :provider => oauth['provider'], :token => token, :expires_at => expires_at)
              end
            end

            if user.nil?
              error!({error_code: 'not_found', error_message: 'user is not found'}, 404)
            elsif user.banned?
              error!({error_code: 'authentication_error', error_message: 'user was banned'}, 403)
            elsif authorization.nil? && !user.authenticated?(params[:password])
              error!({error_code: 'authentication_error', error_message: 'password mismatch'}, 401)
            else
              login_success   = false
              iovation_result = {
                io_result: nil,
                io_reason: nil
              }
              if params[:iovation_data]
                iovation_type = params[:iovation_type].to_s.sub(/^game_login/, 'game-login')
                if user.update_iovation!(params[:remote_ip], params[:iovation_data], iovation_type) == false
                  error!({error_code: 'argument_error', error_message: 'iovation_data is invalid'}, 422)
                end
                iovation_result = {
                  io_result: user.io_result,
                  io_reason: user.io_reason
                }
                if user.iovation_denied? # removing '&& user.iovation_denied_by_deny_action?' as a new rule
                  error!({error_code: 'authentication_error', error_message: "user was denied by iovation (reason='#{user.io_reason}'"}, 403)
                else
                  login_success = true
                end
              else
                login_success = true
              end

              if login_success == true
                if !user.activated?
                  # make a new session key which will last for 10 minutes
                  # store login information on the session_key
                  session_key = new_session({
                                              session_type:               'login_not_activated',
                                              email:                      email,
                                              skip_activation_code_check: skip_activation_code_check,
                                              remote_ip:                  params[:remote_ip],
                                              iovation_result:            iovation_result
                                            }, :expires_in => 10.minutes)

                  error!({error_code: 'not_activated_error', error_message: 'user was not activated', session_key: session_key}, 403)
                elsif params[:iovation_data] && user.io_auth_required?
                  if user.authorize_next_device?
                    # if authorize_next_device? is true and a user signs in for the first time, allow it
                    device = user.user_devices.find_by_io_device_alias(user.io_device_alias)
                    if device.present?
                      device.authorization_required = false
                      device.save!
                      user.io_auth_required      = false
                      user.authorize_next_device = false
                      user.save!
                    end
                  else
                    # device authorization is needed
                    # make a new session key which will last for 10 minutes
                    # store login information on the session_key
                    session_key = new_session({
                                                session_type:    'login_device_not_authorized',
                                                email:           email,
                                                remote_ip:       params[:remote_ip],
                                                iovation_result: iovation_result,
                                                io_device_alias: user.io_device_alias
                                              }, :expires_in => 10.minutes)

                    # generate account armor code and email it
                    ticket      = Rails.cache.read(User.engarde_ticket_cache_key(user.id, user.io_device_alias))
                    ticket      ||= User.generate_engarde_ticket(user.id, user.io_device_alias)
                    raise RuntimeError.new('Failed to generate authentication ticket') unless ticket.present?

                    # send email
                    send_email(email_configuration, :account_armor_ticket, user, ticket)

                    error!({error_code: 'device_not_registered_error', error_message: 'device has not been authorized', session_key: session_key}, 403)
                  end
                end

                auth_ticket = Rails.cache.read(User.auth_ticket_for_user_cache_key("sso", user.id))
                auth_ticket ||= user.create_auth_ticket("sso", SESSION_TIMEOUT)

                insecure_auth_ticket = Rails.cache.read(User.auth_ticket_for_user_cache_key("sso_insecure", user.id))
                insecure_auth_ticket ||= user.create_auth_ticket("sso_insecure", SESSION_TIMEOUT)

                status 200
                present({
                          user:                 user,
                          auth_ticket:          auth_ticket,
                          insecure_auth_ticket: insecure_auth_ticket,
                          iovation_result:      iovation_result
                        }, with: AMS::Private::Entities::LoginSuccess)
              end
            end
          end
        end

        def do_create(params)
          email_configuration = JSON.load(params[:email_configuration]) || {} rescue {}
          oauth = JSON.load(params[:oauth]) || {} rescue {}
          mailing_list_ids = []
          if params[:mailing_list_ids]
            params[:mailing_list_ids].split(",").each do |mailing_list_id|
              mailing_list_id = mailing_list_id.to_i
              unless MailingList.exists?(mailing_list_id)
                error!({error_code: 'argument_error', error_message: "mailing_list_id (#{mailing_list_id}) is invalid"}, 422)
              else
                mailing_list_ids.push(mailing_list_id)
              end
            end
          end

          if params[:ga_cookies] and params[:ga_cookies]
            cookies = {
              '__utmz' => params[:ga_cookies][:__utmz],
              '__utma' => params[:ga_cookies][:__utma],
              '__utmb' => params[:ga_cookies][:__utmb]
            }
          end

          if oauth.present?
            user = User.create_user_phase1(email:           oauth['info']['email'],
                                           date_of_birth:   (oauth['extra']['raw_info'] && oauth['extra']['raw_info']['birthday']) ? Date.strptime(oauth['extra']['raw_info']['birthday'], '%m/%d/%Y') : nil,
                                           signed_up_page:  params[:signed_up_page],
                                           registration_ip: params[:registration_ip],
                                           io_black_box:    params[:iovation_data],
                                           referrer:        params[:http_referer])
            User.create_user_phase2(user,
                                    cookies:                       cookies,
                                    auto_subscribing_mailing_list: false,
                                    mailing_list_ids:              mailing_list_ids,
                                    referral_id:                   nil)

            # create authorization record
            if oauth['extension'] && oauth['extension']['token']
              token = oauth['extension']['token']
            else
              token = oauth['credentials']['token']
            end
            # calculate expires_at date
            expiry     = oauth['credentials']['expires_at']
            expires_at = Time.now + expiry.to_i if expiry

            authorization = Authorization.create!(:user_id => user.id, :uid => oauth['uid'], :provider => oauth['provider'], :token => token, :expires_at => expires_at)

            # make a new session key which will last for 10 minutes
            # store login information on the session_key
            session_key   = new_session({
                                          session_type:               'signup',
                                          email:                      oauth['info']['email'],
                                          skip_activation_code_check: true # since email is already verified by oauth, skip checking activation code
                                        }, :expires_in => 10.minutes)

          else
            user = User.create_user_phase1(email:                 params[:email],
                                           password:              params[:password],
                                           password_confirmation: params[:password_confirmation],
                                           signed_up_page:        params[:signed_up_page],
                                           registration_ip:       params[:registration_ip],
                                           io_black_box:          params[:iovation_data],
                                           referrer:              params[:http_referer])
            User.create_user_phase2(user,
                                    cookies:                       cookies,
                                    auto_subscribing_mailing_list: false,
                                    mailing_list_ids:              mailing_list_ids,
                                    referral_id:                   nil,
                                    email_handler:                 Proc.new { |email_action, *args| send_email(email_configuration, email_action, *args) })

            # make a new session key which will last for 10 minutes
            # store login information on the session_key
            session_key = new_session({
                                        session_type:               'signup',
                                        email:                      params[:email],
                                        skip_activation_code_check: false
                                      }, :expires_in => 10.minutes)

          end

          present({
                    user:        user,
                    session_key: session_key
                  }, with: AMS::Private::Entities::SignupSuccess)
        end

        def do_activate(params)
          email_configuration = JSON.load(params[:email_configuration]) || {} rescue {}

          if params[:session_key]
            session_data = get_session_data(params[:session_key])
            if session_data.nil? || (session_data['session_type'] != 'signup' && session_data['session_type'] != 'login_not_activated')
              error!({error_code: 'invalid_session', error_message: 'session_key is invalid'}, 440)
            end

            user = User.find_by_email(session_data['email'])
            if user.nil?
              error!({error_code: 'not_found', error_message: 'user is not found'}, 404)
            end

            unless session_data['skip_activation_code_check']
              if user.activation_code.to_s.upcase != params[:activation_code].to_s.upcase # compare codes case-insensitively
                error!({error_code: 'argument_error', error_message: 'activation_code is invalid'}, 422)
              end
            end
          elsif params[:user_id]
            user = User.find_by_id(params[:user_id])
            if user.nil?
              error!({error_code: 'not_found', error_message: 'user is not found'}, 404)
            end
            if user.activation_code.to_s.upcase != params[:activation_code].to_s.upcase # compare codes case-insensitively
              error!({error_code: 'argument_error', error_message: 'activation_code is invalid'}, 422)
            end
          end

          # activate the given user
          User.create_user_phase3(user,
                                  secret_question_id: params[:secret_question_id],
                                  secret_answer:      params[:secret_answer],
                                  :email_handler      => Proc.new { |email_action, *args| send_email(email_configuration, email_action, *args) })

          # if user is not valid for some reason, raise exception by using save! method
          user.save! unless user.valid?

          # prepare response
          if session_data
            delete_session_data(params[:session_key])
            if session_data['session_type'] != 'signup'
              # session_type is 'signin'

              # check if io_auth is required
              if user.io_auth_required?
                if user.authorize_next_device?
                  # if authorize_next_device? is true and a user signs in for the first time, allow it
                  device = user.user_devices.find_by_io_device_alias(user.io_device_alias)
                  if device.present?
                    device.authorization_required = false
                    device.save!
                    user.io_auth_required      = false
                    user.authorize_next_device = false
                    user.save!
                  end
                else
                  # device authorization is needed
                  # make a new session key which will last for 10 minutes
                  # store login information on the session_key
                  session_key = new_session({
                                              session_type:    'login_device_not_authorized',
                                              email:           user.email,
                                              remote_ip:       session_data['remote_ip'],
                                              iovation_result: session_data['iovation_result'],
                                              io_device_alias: user.io_device_alias
                                            }, :expires_in => 10.minutes)

                  # generate account armor code and email it
                  ticket      = Rails.cache.read(User.engarde_ticket_cache_key(user.id, user.io_device_alias))
                  ticket      ||= User.generate_engarde_ticket(user.id, user.io_device_alias)
                  raise RuntimeError.new('Failed to generate authentication ticket') unless ticket.present?

                  # send email
                  send_email(email_configuration, :account_armor_ticket, user, ticket)

                  error!({error_code: 'device_not_registered_error', error_message: 'device has not been authorized', session_key: session_key}, 403)
                end
              end

              auth_ticket = Rails.cache.read(User.auth_ticket_for_user_cache_key("sso", user.id))
              auth_ticket ||= user.create_auth_ticket("sso", SESSION_TIMEOUT)

              insecure_auth_ticket = Rails.cache.read(User.auth_ticket_for_user_cache_key("sso_insecure", user.id))
              insecure_auth_ticket ||= user.create_auth_ticket("sso_insecure", SESSION_TIMEOUT)
            else
              auth_ticket          = nil
              insecure_auth_ticket = nil
            end

            status 200
            if session_data['session_type'] == 'signup'
              present({
                        user: user
                      }, with: AMS::Private::Entities::ActivateSuccess)
            else
              present({
                        user:                 user,
                        auth_ticket:          auth_ticket,
                        insecure_auth_ticket: insecure_auth_ticket,
                        iovation_result:      {
                          io_result: session_data['iovation_result']['io_result'],
                          io_reason: session_data['iovation_result']['io_reason']
                        }
                      }, with: AMS::Private::Entities::ActivateSuccess)
            end
          else
            status 200
            present({
                      user: user
                    }, with: AMS::Private::Entities::ActivateSuccess)
          end
        end
      end

      resources :users do

        desc 'Create a new user',
             {
               notes: <<-NOTE

               NOTE
             }
        params do
          requires :email, type: String
          requires :password, type: String
          requires :password_confirmation, type: String
          requires :signed_up_page, type: Symbol, values: [:eme, :tera, :zmr, :tera_launcher, :zmr_launcher]
          requires :registration_ip, type: String, regexp: /^\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}$/
          requires :iovation_data, type: String
          optional :mailing_list_ids, type: String, regexp: /^[0-9,]*$/
          optional :http_referer, type: String
          optional :ga_cookies, type: Hash do
            optional :__utmz, type: String
            optional :__utma, type: String
            optional :__utmb, type: String
          end
          optional :email_configuration, type: String, json_string: true
        end
        post '',
             {
               entity:     AMS::Private::Entities::SignupSuccess,
               http_codes: [
                             [422, "{'error_code': 'argument_error', 'error_message': 'mailing_list_id (...) is invalid'}"]
                           ] + standard_error_codes
             } do
          do_create(params)
        end

        desc 'Create a new user using oauth',
             {
               notes: <<-NOTE

               NOTE
             }
        params do
          requires :oauth, type: String, json_string: true
          requires :signed_up_page, type: Symbol, values: [:eme, :tera, :zmr, :tera_launcher, :zmr_launcher]
          requires :registration_ip, type: String, regexp: /^\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}$/
          requires :iovation_data, type: String
          optional :mailing_list_ids, type: String, regexp: /^[0-9,]*$/
          optional :http_referer, type: String
          optional :ga_cookies, type: Hash do
            optional :__utmz, type: String
            optional :__utma, type: String
            optional :__utmb, type: String
          end
        end
        post 'create_using_oauth',
             {
               entity:     AMS::Private::Entities::SignupSuccess,
               http_codes: [
                             [422, "{'error_code': 'argument_error', 'error_message': 'mailing_list_id (...) is invalid'}"]
                           ] + standard_error_codes
             } do
          do_create(params)
        end

        desc 'List users',
             {
               notes: <<-NOTE

               NOTE
             }
        params do
        end
        query_filter [[:email, String], [:screen_name, String], [:country_code, String], [:signed_up_page, String]]
        paginate
        get '',
            {
              entity:     AMS::Private::Entities::User,
              http_codes: [
                          ] + standard_error_codes
            } do
          users = query_filter_with_paginate([:email, :screen_name, :country_code, :signed_up_page], User)
          present users, with: AMS::Private::Entities::User
        end

        desc 'Let the given user login',
             {
               notes: <<-NOTE

               NOTE
             }
        params do
          requires :email, type: String
          requires :password, type: String
          requires :remote_ip, type: String, regexp: /^\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}$/
          optional :iovation_data, type: String
          optional :iovation_type, type: String, values: ['login', 'game_login', 'login_zmr', 'game_login_zmr']
          all_or_none_of :iovation_data, :iovation_type
          optional :email_configuration, type: String, json_string: true
        end
        post 'login',
             {
               entity:     AMS::Private::Entities::LoginSuccess,
               http_codes: [
                             [401, "{'error_code': 'authentication_error', 'error_message': 'password mismatch'}"],
                             [403, "{'error_code': 'authentication_error', 'error_message': 'login country limited'}"],
                             [403, "{'error_code': 'authentication_error', 'error_message': 'login rate limit reached'}"],
                             [403, "{'error_code': 'authentication_error', 'error_message': 'user was denied by iovation (reason='...')'}"],
                             [403, "{'error_code': 'not_activated_error', 'error_message': 'user was not activated', session_key: '...'}"],
                             [403, "{'error_code': 'device_not_registered_error', 'error_message': 'device has not been authorized', session_key: '...'}"],
                             [404, "{'error_code': 'not_found', 'error_message': 'user is not found'}"],
                             [422, "{'error_code': 'argument_error', 'error_message': 'iovation_data is invalid'}"],
                           ] + standard_error_codes
             } do
          do_login(params)
        end

        desc 'Let the given user login using oauth',
             {
               notes: <<-NOTE

               NOTE
             }
        params do
          requires :oauth, type: String, json_string: true
          requires :remote_ip, type: String, regexp: /^\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}$/
          optional :iovation_data, type: String
          optional :iovation_type, type: String, values: ['login', 'game_login', 'login_zmr', 'game_login_zmr']
          all_or_none_of :iovation_data, :iovation_type
          optional :email_configuration, type: String, json_string: true
        end
        post 'login_using_oauth',
             {
               entity:     AMS::Private::Entities::LoginSuccess,
               http_codes: [
                             [403, "{'error_code': 'authentication_error', 'error_message': 'login country limited'}"],
                             [403, "{'error_code': 'authentication_error', 'error_message': 'login rate limit reached'}"],
                             [403, "{'error_code': 'authentication_error', 'error_message': 'user was denied by iovation (reason='...')'}"],
                             [403, "{'error_code': 'not_activated_error', 'error_message': 'user was not activated', session_key: '...'}"],
                             [403, "{'error_code': 'device_not_registered_error', 'error_message': 'device has not been authorized', session_key: '...'}"],
                             [404, "{'error_code': 'not_found', 'error_message': 'user is not found'}"],
                             [422, "{'error_code': 'argument_error', 'error_message': 'iovation_data is invalid'}"],
                           ] + standard_error_codes
             } do

          do_login(params)
        end

        desc 'Let the given user logout',
             {
               notes: <<-NOTE

               NOTE
             }
        params do
          requires :auth_ticket, type: String
          requires :insecure_auth_ticket, type: String
        end
        post 'logout',
             {
               entity:     AMS::Private::Entities::SecretQuestion,
               http_codes: [
                             [403, "{'error_code': 'authentication_error', 'error_message': 'auth_ticket is invalid'}"]
                           ] + standard_error_codes
             } do
          user, ex = User.find_by_auth_ticket('sso', params[:auth_ticket])
          error!({error_code: 'authentication_error', error_message: 'auth_ticket is invalid'}, 403) unless user

          Rails.cache.delete(User.auth_ticket_for_user_cache_key("sso", user.id))
          Rails.cache.delete(User.auth_ticket_cache_key("sso", params[:auth_ticket]))

          Rails.cache.delete(User.auth_ticket_for_user_cache_key("sso_insecure", user.id))
          Rails.cache.delete(User.auth_ticket_cache_key("sso_insecure", params[:insecure_auth_ticket]))

          status 200
          present({result: true}, with: AMS::Private::Entities::ResultFlag)
        end

        desc 'Activate the user in the given login session and finish the login',
             {
               notes: <<-NOTE

               NOTE
             }
        params do
          requires :session_key, type: String
          requires :activation_code, type: String
          requires :secret_question_id, type: Integer
          requires :secret_answer, type: String
          optional :email_configuration, type: String, json_string: true
        end
        post 'activate',
             {
               entity:     AMS::Private::Entities::ActivateSuccess,
               http_codes: [
                             [404, "{'error_code': 'not_found', 'error_message': 'user is not found'}"],
                             [422, "{'error_code': 'argument_error', 'error_message': 'activation_code is invalid'}"],
                             [440, "{'error_code': 'invalid_session', 'error_message': 'session_key is invalid'}"],
                           ] + standard_error_codes
             } do
          do_activate(params)
        end

        desc 'Activate the user without using session and finish the activation',
             {
               notes: <<-NOTE

               NOTE
             }
        params do
          requires :user_id, type: Integer
          requires :activation_code, type: String
          requires :secret_question_id, type: Integer
          requires :secret_answer, type: String
          optional :email_configuration, type: String, json_string: true
        end
        post 'activate_without_session',
             {
               entity:     AMS::Private::Entities::ActivateSuccess,
               http_codes: [
                             [404, "{'error_code': 'not_found', 'error_message': 'user is not found'}"],
                             [422, "{'error_code': 'argument_error', 'error_message': 'activation_code is invalid'}"],
                             [440, "{'error_code': 'invalid_session', 'error_message': 'session_key is invalid'}"],
                           ] + standard_error_codes
             } do
          do_activate(params)
        end

        desc 'Register the given device finish the login',
             {
               notes: <<-NOTE

               NOTE
             }
        params do
          requires :session_key, type: String
          requires :account_armor_code, type: String
          requires :remember_device, type: Boolean
        end
        post 'register_device',
             {
               entity:     AMS::Private::Entities::LoginSuccess,
               http_codes: [
                             [404, "{'error_code': 'not_found', 'error_message': 'user is not found'}"],
                             [422, "{'error_code': 'argument_error', 'error_message': 'account_armor_code is invalid'}"],
                             [440, "{'error_code': 'invalid_session', 'error_message': 'session_key is invalid'}"],
                           ] + standard_error_codes
             } do
          session_data = get_session_data(params[:session_key])
          if session_data.nil? || session_data['session_type'] != 'login_device_not_authorized'
            error!({error_code: 'invalid_session', error_message: 'session_key is invalid'}, 440)
          end

          user = User.find_by_email(session_data['email'])
          if user.nil?
            error!({error_code: 'not_found', error_message: 'user is not found'}, 404)
          end

          if User.consume_engarde_ticket!(user.id, session_data['io_device_alias'], params[:account_armor_code], params[:remember_device])
            delete_session_data(params[:session_key])

            auth_ticket = Rails.cache.read(User.auth_ticket_for_user_cache_key("sso", user.id))
            auth_ticket ||= user.create_auth_ticket("sso", SESSION_TIMEOUT)

            insecure_auth_ticket = Rails.cache.read(User.auth_ticket_for_user_cache_key("sso_insecure", user.id))
            insecure_auth_ticket ||= user.create_auth_ticket("sso_insecure", SESSION_TIMEOUT)

            status 200
            present({
                      user:                 user,
                      auth_ticket:          auth_ticket,
                      insecure_auth_ticket: insecure_auth_ticket,
                      iovation_result:      {
                        io_result: session_data['iovation_result']['io_result'],
                        io_reason: session_data['iovation_result']['io_reason']
                      }
                    }, with: AMS::Private::Entities::LoginSuccess)
          else
            error!({error_code: 'argument_error', error_message: 'account_armor_code is invalid'}, 422)
          end
        end

        desc 'Resend account activation code',
             {
               notes: <<-NOTE

               NOTE
             }
        params do
          requires :session_key, type: String
          optional :email_configuration, type: String, json_string: true
        end
        post 'resend_activation',
             {
               entity:     AMS::Private::Entities::ResultFlag,
               http_codes: [
                             [404, "{'error_code' : 'not_found', 'error_message' : 'user is not found'}"],
                             [440, "{'error_code': 'invalid_session', 'error_message': 'session_key is invalid'}"],
                           ] + standard_error_codes
             } do
          email_configuration = JSON.load(params[:email_configuration]) || {} rescue {}

          session_data = get_session_data(params[:session_key])
          if session_data.nil? || (session_data['session_type'] != 'login_not_activated' && session_data['session_type'] != 'signup')
            error!({error_code: 'invalid_session', error_message: 'session_key is invalid'}, 440)
          end

          user = User.find_by_email(session_data['email'])
          if user.nil?
            error!({error_code: 'not_found', error_message: 'user is not found'}, 404)
          end

          user.resend_activation(:email_handler => Proc.new { |email_action, *args| send_email(email_configuration, email_action, *args) })

          status 200
          present({result: true}, with: AMS::Private::Entities::ResultFlag)
        end

        desc 'Resend account armor code',
             {
               notes: <<-NOTE

               NOTE
             }
        params do
          requires :session_key, type: String
          optional :email_configuration, type: String, json_string: true
        end
        post 'resend_account_armor_code',
             {
               entity:     AMS::Private::Entities::ResultFlag,
               http_codes: [
                             [404, "{'error_code': 'not_found', 'error_message': 'user is not found'}"],
                             [440, "{'error_code': 'invalid_session', 'error_message': 'session_key is invalid'}"],
                           ] + standard_error_codes
             } do
          email_configuration = JSON.load(params[:email_configuration]) || {} rescue {}

          session_data = get_session_data(params[:session_key])
          if session_data.nil? || session_data['session_type'] != 'login_device_not_authorized'
            error!({error_code: 'invalid_session', error_message: 'session_key is invalid'}, 440)
          end

          user = User.find_by_email(session_data['email'])
          if user.nil?
            error!({error_code: 'not_found', error_message: 'user is not found'}, 404)
          end

          # generate account armor code and email it
          ticket = Rails.cache.read(User.engarde_ticket_cache_key(user.id, user.io_device_alias))
          ticket ||= User.generate_engarde_ticket(user.id, user.io_device_alias)
          raise RuntimeError.new("Failed to generate authentication ticket") unless ticket.present?

          # send email
          send_email(email_configuration, :account_armor_ticket, user, ticket)

          status 200
          present({result: true}, with: AMS::Private::Entities::ResultFlag)
        end


        desc 'Check the given email was registered',
             {
               notes: <<-NOTE

               NOTE
             }
        params do
          requires :email, type: String
        end
        get 'check_email_registered',
            {
              entity:     AMS::Private::Entities::ResultFlag,
              http_codes: [
                          ] + standard_error_codes
            } do
          if User.where(email: params[:email]).count > 0
            present({result: true}, with: AMS::Private::Entities::ResultFlag)
          else
            present({result: false}, with: AMS::Private::Entities::ResultFlag)
          end
        end

        desc 'Request password reset',
             {
               notes: <<-NOTE

               NOTE
             }
        params do
          requires :email
          requires :secret_answer
          optional :email_configuration, type: String, json_string: true
        end
        post 'reset_password',
             {
               entity:     AMS::Private::Entities::SecretQuestion,
               http_codes: [
                             [401, "{'error_code': 'authentication_error', 'error_message': 'secret_answer does not match'}"],
                             [404, "{'error_code': 'not_found', 'error_message': 'user is not found'}"]
                           ] + standard_error_codes
             } do
          email_configuration = JSON.load(params[:email_configuration]) || {} rescue {}

          user = User.find_by_email(params[:email])
          if user.present?
            if user.legacy_account?
              # skip secret question validation for legacy accounts since we don't know it
              user.request_password_reset(:email_handler => Proc.new { |email_action, *args| send_email(email_configuration, email_action, *args) })
              status 200
              present({result: true}, with: AMS::Private::Entities::ResultFlag)
            else
              if user.secret_answer_matched? params[:secret_answer]
                user.request_password_reset(:email_handler => Proc.new { |email_action, *args| send_email(email_configuration, email_action, *args) })
                status 200
                present({result: true}, with: AMS::Private::Entities::ResultFlag)
              else
                error!({error_code: 'authentication_error', error_message: 'secret_answer does not match'}, 401)
              end
            end
          else
            error!({error_code: 'not_found', error_message: 'user is not found'}, 404)
          end
        end

        desc 'Complete reset password process',
             {
               notes: <<-NOTE

               NOTE
             }
        params do
          requires :screen_name, type: String
          requires :ticket, type: String
          requires :new_password, type: String
          requires :new_password_confirmation, type: String
          optional :email_configuration, type: String, json_string: true
        end
        post 'complete_reset_password',
             {
               entity:     AMS::Private::Entities::ResultFlag,
               http_codes: [
                             [403, "{'error_code': 'not_permitted_error', 'error_message': 'you cannot reset your password at this time'}"],
                             [422, "{'error_code': 'argument_error', 'error_message': 'password should not be blank'}"],
                             [422, "{'error_code': 'argument_error', 'error_message': '...'"]
                           ] + standard_error_codes
             } do
          email_configuration = JSON.load(params[:email_configuration]) || {} rescue {}

          user = User.find_by_screen_name(params[:screen_name])

          unless user && user.can_reset_password?(params[:ticket])
            error!({error_code: 'not_permitted_error', error_message: 'you cannot reset your password at this time'}, 403)
          else
            user.password              = params[:new_password]
            user.password_confirmation = params[:new_password_confirmation]
            if user.password.blank?
              error!({error_code: 'argument_error', error_message: 'password should not be blank'}, 422)
            elsif user.save
              # send email
              send_email(email_configuration, :password_changed_notice, user)
              present({result: true}, with: AMS::Private::Entities::ResultFlag)
            else
              error!({error_code: 'argument_error', error_message: user.errors.full_messages.to_sentence}, 422)
            end
          end
        end

        desc 'Update email',
             {
               notes: <<-NOTE

               NOTE
             }
        params do
          requires :email, type: String
          requires :new_email, type: String
          requires :new_email_confirmation, type: String
          requires :password, type: String
          optional :email_configuration, type: String, json_string: true
        end
        post 'update_email',
             {
               entity:     AMS::Private::Entities::ResultFlag,
               http_codes: [
                             [401, "{'error_code': 'authentication_error', 'error_message': 'password mismatch'}"],
                             [404, "{'error_code': 'not_found', 'error_message': 'user is not found'}"],
                             [422, "{'error_code': 'argument_error', 'error_message': '...'}"],
                           ] + standard_error_codes
             } do
          email_configuration = JSON.load(params[:email_configuration]) || {} rescue {}

          user = User.find_by_email(params[:email])
          if user.nil?
            error!({error_code: 'not_found', error_message: 'user is not found'}, 404)
          elsif user.authenticated?(params[:password])
            errs = User.validate_field(:email, params[:new_email])
            if user.email == params[:new_email]
              user.clear_new_email_request!
            elsif errs.size > 0
              error!({error_code: 'argument_error', error_message: "Email #{errs.to_sentence}"}, 422)
            else
              user.new_email              = params[:new_email]
              user.new_email_confirmation = params[:new_email_confirmation]
              user.new_email_key          = String.generate_random_code(20).downcase
              if user.save
                # send email
                send_email(email_configuration, :confirm_email_change, user)
                status 200
                present({result: true}, with: AMS::Private::Entities::ResultFlag)
              else
                user.clear_new_email_request
                error!({error_code: 'argument_error', error_message: user.errors.full_messages.to_sentence}, 422)
              end
            end
          else
            error!({error_code: 'authentication_error', error_message: 'password mismatch'}, 401)
          end
        end

        desc 'Complete update email process',
             {
               notes: <<-NOTE

               NOTE
             }
        params do
          requires :screen_name, type: String
          requires :ticket, type: String
          optional :email_configuration, type: String, json_string: true
        end
        post 'complete_update_email',
             {
               entity:     AMS::Private::Entities::ResultFlag,
               http_codes: [
                             [403, "{'error_code': 'not_permitted_error', 'error_message': 'invalid ticket or email has already been taken'}"],
                             [404, "{'error_code': 'not_found', 'error_message': 'user is not found'}"],
                             [422, "{'error_code': 'argument_error', 'error_message': '...'"]
                           ] + standard_error_codes
             } do
          email_configuration = JSON.load(params[:email_configuration]) || {} rescue {}

          user = User.find_by_screen_name(params[:screen_name])

          unless user && user.confirm_email_change(params[:ticket])
            error!({error_code: 'not_permitted_error', error_message: 'invalid ticket or email has already been taken'}, 403)
          else
            UserMailer.queue(:email_changed_notice, user)
            # send email
            send_email(email_configuration, :email_changed_notice, user)
            status 200
            present({result: true}, with: AMS::Private::Entities::ResultFlag)
          end
        end

        route_param :user_id do

          desc 'Get the given user',
               {
                 notes: <<-NOTE

                 NOTE
               }
          params do
            requires :user_id, type: Integer
          end
          get '',
              {
                entity:     AMS::Private::Entities::User,
                http_codes: [
                            ] + standard_error_codes
              } do
            user = User.find(params[:user_id])
            present user, with: AMS::Private::Entities::User
          end

          desc 'Get the secret question of the given user',
               {
                 notes: <<-NOTE

                 NOTE
               }
          params do
            requires :user_id, type: Integer
          end
          get 'secret_question',
              {
                entity:     AMS::Private::Entities::SecretQuestion,
                http_codes: [
                            ] + standard_error_codes
              } do
            user = User.find(params[:user_id])
            if user.secret_question_id
              question = SecretQuestion.find(user.secret_question_id).question
            else
              question = nil
            end
            secret_question = {
              id:       user.secret_question_id,
              question: question,
            }
            present secret_question, with: AMS::Private::Entities::SecretQuestion
          end

          desc 'Check the secret answer for the given user',
               {
                 notes: <<-NOTE

                 NOTE
               }
          params do
            requires :user_id, type: Integer
            requires :secret_answer, type: String
          end
          post 'check_secret_question',
               {
                 entity:     AMS::Private::Entities::ResultFlag,
                 http_codes: [
                             ] + standard_error_codes
               } do
            user = User.find(params[:user_id])
            if user.secret_answer_matched? params[:secret_answer]
              present({result: true}, with: AMS::Private::Entities::ResultFlag)
            else
              present({result: false}, with: AMS::Private::Entities::ResultFlag)
            end
          end

          desc 'Update the secret question and answer of the given user',
               {
                 notes: <<-NOTE

                 NOTE
               }
          params do
            requires :user_id, type: Integer
            requires :secret_question_id, type: Integer
            requires :secret_answer, type: String
          end
          post 'update_secret_question',
               {
                 entity:     AMS::Private::Entities::SecretQuestion,
                 http_codes: [
                             ] + standard_error_codes
               } do
            user                    = User.find(params[:user_id])
            question                = SecretQuestion.find(params[:secret_question_id]).question # check the given secret_question_id is valid or not
            user.secret_question_id = params[:secret_question_id]
            user.secret_answer      = params[:secret_answer]
            user.save!
            secret_question = {
              id:       user.secret_question_id,
              question: question,
            }
            present secret_question, with: AMS::Private::Entities::SecretQuestion
          end

          desc 'Update password',
               {
                 notes: <<-NOTE

                 NOTE
               }
          params do
            requires :user_id, type: Integer
            requires :old_password, type: String
            requires :new_password, type: String
            requires :new_password_confirmation, type: String
            optional :email_configuration, type: String, json_string: true
          end
          post 'update_password',
               {
                 entity:     AMS::Private::Entities::ResultFlag,
                 http_codes: [
                               [401, "{'error_code': 'authentication_error', 'error_message': 'password mismatch'}"],
                               [422, "{'error_code': 'argument_error', 'error_message': 'password should not be blank'}"],
                               [422, "{'error_code': 'argument_error', 'error_message': '...'}"],
                             ] + standard_error_codes
               } do
            email_configuration = JSON.load(params[:email_configuration]) || {} rescue {}

            user = User.find(params[:user_id])
            if user.authenticated?(params[:old_password])
              user.password              = params[:new_password]
              user.password_confirmation = params[:new_password_confirmation]
              if user.password.blank?
                error!({error_code: 'argument_error', error_message: 'password should not be blank'}, 422)
              elsif user.save
                # send email
                send_email(email_configuration, :password_changed_notice, user)
                status 200
                present({result: true}, with: AMS::Private::Entities::ResultFlag)
              else
                error!({error_code: 'argument_error', error_message: user.errors.full_messages.to_sentence}, 422)
              end
            else
              error!({error_code: 'authentication_error', error_message: 'password mismatch'}, 401)
            end
          end

          desc 'Update account armor enabled flag',
               {
                 notes: <<-NOTE

                 NOTE
               }
          params do
            requires :user_id, type: Integer
            requires :enable, type: Boolean
          end
          post 'update_account_armor_enabled',
               {
                 entity:     AMS::Private::Entities::ResultFlag,
                 http_codes: [
                             ] + standard_error_codes
               } do
            user                 = User.find(params[:user_id])
            user.engarde_enabled = params[:enable]
            user.save!
            status 200
            present({result: true}, with: AMS::Private::Entities::ResultFlag)
          end

          desc 'Get account armor enabled flag',
               {
                 notes: <<-NOTE

                 NOTE
               }
          params do
            requires :user_id, type: Integer
          end
          get 'account_armor_enabled',
              {
                entity:     AMS::Private::Entities::ResultFlag,
                http_codes: [
                            ] + standard_error_codes
              } do
            user = User.find(params[:user_id])
            present({result: user.engarde_enabled}, with: AMS::Private::Entities::ResultFlag)
          end

          desc 'Get mailing lists',
               {
                 notes: <<-NOTE

                 NOTE
               }
          params do
            requires :user_id, type: Integer
          end
          get 'mailing_lists',
              {
                entity:     AMS::Private::Entities::MailingList,
                http_codes: [
                            ] + standard_error_codes
              } do
            user = User.find(params[:user_id])
            present user.mailing_lists, with: AMS::Private::Entities::MailingList
          end

          desc 'Update mailing lists',
               {
                 notes: <<-NOTE

                 NOTE
               }
          params do
            requires :user_id, type: Integer
            requires :mailing_list_ids, type: String, regexp: /^[0-9,]+$/
          end
          post 'update_mailing_lists',
               {
                 entity:     AMS::Private::Entities::ResultFlag,
                 http_codes: [
                               [422, "{'error_code': 'argument_error', 'error_message': 'mailing_list_id (...) is invalid'}"]
                             ] + standard_error_codes
               } do
            user                         = User.find(params[:user_id])
            subscribed_mailing_list_ids  = user.mailing_lists.map { |m| m.id }
            subscribe_mailing_list_ids   = []
            unsubscribe_mailing_list_ids = subscribed_mailing_list_ids.clone

            # check if mailing_list_ids is valid
            if params[:mailing_list_ids]
              params[:mailing_list_ids].split(",").each do |mailing_list_id|
                mailing_list_id = mailing_list_id.to_i
                unless MailingList.exists?(mailing_list_id)
                  error!({error_code: 'argument_error', error_message: "mailing_list_id (#{mailing_list_id}) is invalid"}, 422)
                else
                  subscribe_mailing_list_ids.push(mailing_list_id) unless subscribed_mailing_list_ids.include? mailing_list_id
                  unsubscribe_mailing_list_ids.delete(mailing_list_id)
                end
              end
            end

            # subscribe mailing list
            subscribe_mailing_list_ids.each do |mailing_list_id|
              mailing_list = MailingList.find(mailing_list_id) rescue nil
              if mailing_list && mailing_list.active == true
                logger.info "Subscribing to: #{mailing_list.name}"
                mailing_list.subscribe(user.id)
              end
            end

            # unsubscribe mailing list
            unsubscribe_mailing_list_ids.each do |mailing_list_id|
              mailing_list = MailingList.find(mailing_list_id) rescue nil
              if mailing_list && mailing_list.active == true
                logger.info "Unubscribing to: #{mailing_list.name}"
                mailing_list.unsubscribe(user.id)
              end
            end

            status 200
            present({result: true}, with: AMS::Private::Entities::ResultFlag)
          end

          desc 'Get the amount of emp of the given user'
          params do
            requires :user_id, type: Integer
          end
          get 'get_emp',
              {
                entity:     AMS::Private::Entities::ResultIntegerValue,
                http_codes: standard_error_codes
              } do
            emp = User.get_emp_wallet_balance(params[:user_id])
            present({result: emp}, with: AMS::Private::Entities::ResultIntegerValue)
          end

          desc 'Get the amount of event credit of the given user'
          params do
            requires :user_id, type: Integer
          end
          get 'get_event_credit',
              {
                entity:     AMS::Private::Entities::ResultIntegerValue,
                http_codes: standard_error_codes
              } do
            user = User.find(params[:user_id])
            if user.event_credit.nil?
              EventCredit.create!({user_id: user.id, credit: 0})
              user.reload
            end
            present({result: user.event_credit.credit}, with: AMS::Private::Entities::ResultIntegerValue)
          end

          desc 'Check the given activation code is valid'
          params do
            requires :user_id, type: Integer
            requires :activation_code, type: String
          end
          get 'check_activation_code',
              {
                entity:     AMS::Private::Entities::ResultFlag,
                http_codes: standard_error_codes
              } do
            user = User.find(params[:user_id])
            if user.activation_code == nil || user.activation_code.to_s == ''
              result = false
            else
              if user.activation_code.to_s.upcase != params[:activation_code].to_s.upcase
                result = false
              else
                result = true
              end
            end
            present({result: result}, with: AMS::Private::Entities::ResultFlag)
          end

          desc 'Get the last active date'
          params do
            requires :user_id, type: Integer
          end
          get 'get_last_active_date',
              {
                entity:     AMS::Private::Entities::ResultDateTimeValue,
                http_codes: [
                            ] + standard_error_codes
              } do
            user                      = User.find(params[:user_id])
            web_authtntication_record = WebAuthenticationRecord.where(user_id: user.id, in_launcher: true).last
            if web_authtntication_record
              last_active_date = web_authtntication_record.updated_at
            else
              last_active_date = Time.now.utc
            end
            response = {result: last_active_date}
            status 200
            present(response, with: AMS::Private::Entities::ResultDateTimeValue)
          end

          desc 'Get the maximum level among the characters'
          params do
            requires :user_id, type: Integer
          end
          get 'get_max_character_level',
              {
                entity:     AMS::Private::Entities::ResultIntegerValue,
                http_codes: [
                            ] + standard_error_codes
              } do
            user      = User.find(params[:user_id])
            max_level = 0
            user.game_accounts.each do |game_account|
              game_account.characters.each do |character|
                max_level = character['level'] if character['level'] && max_level < character['level']
              end
            end
            response = {result: max_level}
            status 200
            present(response, with: AMS::Private::Entities::ResultDateTimeValue)
          end

        end

      end

    end
  end
end
