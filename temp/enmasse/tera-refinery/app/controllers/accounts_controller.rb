class AccountsController < ApplicationController
  require 'billing_adapter_interface'
  layout false
  
  def emp
    if session[:account_id]
      if !cookies[:emp]
        wallet = BillingAdapterInterface.get_wallet(session[:account_id])
        emp = if wallet && wallet.EMP && wallet.EMP[:amount]
          wallet.EMP[:amount]
        else
          'error'
        end
        Rails.logger.debug ["EMP:", emp]
        # expire in 5 minutes to check again.
        cookies[:emp] = { :value => emp.to_s, :expires => 5.minutes.from_now }
        render :text => emp.to_s
      else
        render :text => cookies[:emp].to_s
      end
    else
      reset_session
      # don't store cookie
      #cookies[:emp] = { :value => "error", :expires => 30.seconds.from_now }
      render :text => "error"
    end
  end

  def sign_in
    render "#{params[:page]}.html.erb"
  end
  
  def create
    ams_client = AMS::API::Client.new

    email_configuration = {
      :signup_notification => {
        :template_name => 'signup_notification_tera_refinery',
        :options       => {
          :name   => "%{user.screen_name_no_temp}",
          :ticket => "%{ticket}",
          :url    => "#{request.protocol}#{request.host_with_port}/accounts/%{user.screen_name}/activate?ticket=%{ticket}"
        }
      }
    }

    begin
      ams_client.users.create(params[:email], params[:password], params[:password], 'tera', request.ip,
                              params[:blackbox], email_configuration: email_configuration)
    rescue AMS::API::Error => e
      err = e 
    end

    if err
      flash[:error] = err.error_message
      redirect_to "/sign-up"
    else
      redirect_to "/download", :notice =>  "Thank you for creating a <em>TERA</em> account. You should receive an email with a verification code and instructions for activating your account."
    end
  end


  def email_verification
    ams_client = AMS::API::Client.new
    data = ams_client.users.list(filter: {email: params[:email]})
    render :text => {:exists => data.length > 0}.to_json
  end

  def secret
    ams_client = AMS::API::Client.new

    @username = params[:username]
    @activation_code = params[:ticket]

    # find user information using @username
    response = ams_client.users.list(filter: {screen_name: @username})
    if response.length == 0
      flash[:error] = "user not found"            # TODO: rewrite error message
      redirect_to "/sign-up"
      return
    end
    @user_id = response[0].id

    # check activation code
    response = ams_client.users.check_activation_code(@user_id, @activation_code)
    if response.result == false
      flash[:error] = "Invalid verification code"   # TODO: rewrite error message
      redirect_to "/sign-up"
      return
    end

    @secret_questions = ams_client.secret_questions.all

    # save activation code and user_id to the session for furture reference
    session[:activation_code] = @activation_code
    session[:user_id] = @user_id

    render "#{params[:page]}.html.erb"
  end

  def save_secret
    ams_client = AMS::API::Client.new

    email_configuration = {
      :welcome_to_game => {
        :template_name => 'welcome_to_game_tera_refinery',
        :options       => {
          :name => "%{user.screen_name_no_temp}"
        }
      }
    }

    ams_client.users.activate_without_session(session[:user_id], session[:activation_code], params[:secret_question_id],
                                              params[:secret_answer], email_configuration: email_configuration)

    redirect_to "/download", :notice => "Success! Your <em>TERA</em> account is active. See you in the game."
  end

end
