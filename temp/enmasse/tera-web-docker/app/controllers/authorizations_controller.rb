class AuthorizationsController < ApplicationController
    def callback
      begin
        oauth = request.env['omniauth.auth']
        if params[:mode] == 'signin'
          begin
            result = ams_client.users.login_using_oauth(oauth, request.ip, params[:blackbox], 'login')
            session[:user] = result.user
            session[:auth_ticket] = result.auth_ticket
            session[:insecure_auth_ticket] = result.insecure_auth_ticket
            session[:iovation_result] = result.iovation_result
            render :json => {result: true}
          rescue AMS::API::Error => e
            if e.error_code == 'not_activated_error'
              session[:session_key] = e.session_key
              session[:hide_activation_code] = true
              render :json => {error_class: e.class.to_s, error_message: e.message, error_code: e.error_code}
            elsif e.error_code == 'device_not_registered_error'
              session[:session_key] = e.session_key
              render :json => {error_class: e.class.to_s, error_message: e.message, error_code: e.error_code}
            else
              raise e
            end
          end
        elsif params[:mode] == 'signup'
          subscribed_mailing_list_ids = []
          ams_client.mailing_lists.all.each do |mailing_list|
            subscribed_mailing_list_ids.push(mailing_list.id) if params.has_key? "mailing_list_#{mailing_list.id}"
          end
          http_referrer = session[:original_referrer]
          ga_cookies = {
            __utma: cookies['__utma'],
            __utmb: cookies['__utmb'],
            __utmz: cookies['__utmz']
          }
          result = ams_client.users.create_using_oauth(oauth,
                                                       'eme',
                                                       request.ip,
                                                       params[:blackbox],
                                                       subscribed_mailing_list_ids,
                                                       http_referrer, ga_cookies)
          session[:session_key] = result.session_key
          session[:hide_activation_code] = true
          render :json => {result: true}
        else
          raise RuntimeError.new("undefined mode '#{params[:mode]}'")
        end
      rescue => e
        puts "Error: #{e}, Backtrace: #{e.backtrace.join("\n")}"
        session[:error_obj] = e        
        if params[:mode] == 'signup'
          session[:go_back_url] = '/signup'
        else
          session[:go_back_url] = '/signin'
        end
        render :json => {error_class: e.class.to_s, error_message: e.message}
      end
    end
end