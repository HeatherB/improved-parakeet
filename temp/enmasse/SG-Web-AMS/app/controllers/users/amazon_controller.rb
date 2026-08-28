class Users::AmazonController < ApplicationController
  include Extensions::SessionsControllerEx

  before_filter :instantiate_request_id, :only => [ :register, :auth, :register_submit ]
  before_filter :instantiate_vars, :only => [ :register_v2, :register_submit_v2 ]
  before_filter :check_request_id, :only => [ :register, :auth, :register_submit ]
  before_filter :instantiate_secret_questions, :only => [ :register, :register_submit, :register_v2, :register_submit_v2 ]
  before_filter :set_current_app

  FORM_FIELDS = { 'form_1' => [ :email, :password, :password_confirmation ],
                  'form_2' => [ :secret_question_id, :secret_answer ] }

  #
  # Amazon Game Connect V2
  #
  def register_v2
    @user ||= User.new
    render 'register_v2', :layout => 'blank'
  end

  def register_submit_v2
    if params[:commit] == "< PREV"
      @form = "form_1"
      register_v2
      return
    else
      @user_params = params[:user] || {}

      @form = "form_#{params[:form_step]}"
      @user = User.new(@user_params)
      @user.email_confirmation = @user.email

      unless form_step_validated?
        register_v2
        return
      end

      # get game object for creating account
      game = nil
      game = Game.find(@game_id) if @game_id.present?

      # (robin) Advance form step if we are not at the end
      if params[:form_step].to_i >= FORM_FIELDS.keys.count
        @user.amazon_request_token = ""
        @user.referrer = session[:original_referrer]
        @user.registration_ip = request.remote_ip
        @user.authorize_next_device = true
        @user.date_of_birth = nil
        @user.receive_news = true

        if @user.save
          @user.call_iovation_create_acct
          @user.set_amazon_token
          @user.activate
          GameAccount.auto_account_creation(@user, true, nil, game, "auto_creation_amazon")
        else
          register_v2
          return
        end

      else
        @form = "form_#{params[:form_step].to_i + 1}"
        register_v2
        return
      end

      #redirect to amazon page
      #infofield1: @user.email
      rtn_url = URI::encode(URI::decode(@redirectUrl) + "&infoField1=#{@user.email}", '+')
      redirect_to rtn_url
      #render :layout => 'blank'
    end
  end
  #
  # Amazon Game Connect V2 (end)
  #

  def register
    @user ||= User.new

    render 'register', :layout => 'blank'
  end

  def register_submit
    if params[:commit] == "< PREV"
      @form = "form_1"
      register
      return
    else
      @user_params = params[:user] || {}

      @form = "form_#{params[:form_step]}"
      @user = User.new(@user_params)
      @user.email_confirmation = @user.email

      unless form_step_validated?
        register
        return
      end

      # (robin) Advance form step if we are not at the end
      if params[:form_step].to_i >= FORM_FIELDS.keys.count
        @user.amazon_request_token = @requestId
        @user.referrer = session[:original_referrer]
        @user.registration_ip = request.remote_ip
        @user.authorize_next_device = true
        @user.date_of_birth = nil
        @user.receive_news = true

        if @user.save
          @user.call_iovation_create_acct
          @user.link_to_amazon!(@user.amazon_request_token, 'REGISTRATION')
          @user.activate
          GameAccount.auto_account_creation(@user, true, nil)
        else
          raise ActiveRecord::RecordNotSaved
        end

      else
        @form = "form_#{params[:form_step].to_i + 1}"
        register
        return
      end

      render :layout => 'blank'
    end
  end

  def auth
    if current_user && current_user != :false
      current_user.link_to_amazon! @requestId, 'LOGIN'
      post_auth
      return
    end

    render :layout => 'blank'
  end

  def post_auth
    render 'post_auth', :layout => 'blank'
  end

  def signin
    create_handler(
      signin_path,
      auth_users_amazon_index_path(:requestId => params[:requestId]),
      auth_users_amazon_index_path(:requestId => params[:requestId])
    )
  end


  #
  # Amazon Game Connect v2 (=Amazon Instant Access or AIA)
  #

  # link pre-existing account
  def account
    begin
      #verify

      operation = params[:operation]
      email = params[:infoField1]

      # check pre-conditions
      raise "operation parameter is nil" if operation == nil
      raise "operation target mismatch" if operation != "GetUserId"
      raise "email is nil" if email == nil

      # get user from email
      user = User.find_by_email(email)
      raise "cannot find user by #{email}" if user == nil

      # check if banned
      raise "user #{user.id} has been banned" if user.account_status == User.account_status_for(:permanent_ban)

      # set amazon_token if not set yet
      user.set_amazon_token

      response = {"response" => "OK", "userId" => "#{user.amazon_token}" }
      render json: response
    rescue => e
      logger.error "[AIA: link account] #{e.message}"
      render json: '{"response": "FAIL_ACCOUNT_INVALID"}'
    end
  end

  # purchase or revoke from Amazon
  class UserNotEligibleException < StandardError; end
  class UserInvalidException < StandardError; end
  class InvalidPurchaseToken < StandardError; end
  class OtherException < StandardError; end

  def fulfill
    begin
      #verify

      operation = params[:operation]
      reason = params[:reason]
      product_id = params[:productId]
      user_id = params[:userId]
      purchase_token = params[:purchaseToken]

      #check pre-conditions
      raise OtherException "operation is nil" if operation == nil
      raise OtherException "productId is nil" if product_id == nil
      raise UserInvalidException "userId is nil" if user_id == nil
      raise InvalidPurchaseToken "purchaseToken is nil" if purchase_token == nil
      raise OtherException "operation target mismatch" if operation != "Purchase" && operation != "Revoke"

      # let's do this
      if operation == "Purchase"
        purchase(product_id, user_id, purchase_token)
      else
        revoke(product_id, user_id, purchase_token)
      end

      response = '{"response":"OK"}'
      render json: response

    rescue UserNotEligibleException => e
      logger.error "[AIA: fulfill] #{e.message}"
      render json: '{"response":"FAIL_USER_NOT_ELIGIBLE"}'
    rescue UserInvalidException => e
      logger.error "[AIA: fulfill] #{e.message}"
      render json: '{"response":"FAIL_USER_INVALID"}'
    rescue InvalidPurchaseToken => e
      logger.error "[AIA: fulfill] #{e.message}"
      render json: '{"response":"FAIL_INVALID_PURCHASETOKEN"}'
    rescue OtherException => e
      logger.error "[AIA: fulfill] #{e.message}"
      render json: '{"response":"FAIL_OTHER"}'
    rescue Exception => e
      logger.error "[AIA: fulfill] #{e.message}"
      render json: '{"response":"FAIL_OTHER"}'
    end

  end

  # fulfill purchase
  def purchase (product_id, user_id, purchase_token)
    ActiveRecord::Base.transaction do
      fulfillment = AmazonFulfillment.new( :purchase_id => purchase_token,
                         :sku => product_id,
                         :amazon_token => user_id )

      user = User.find_by_amazon_token(user_id)
      raise UserInvalidException "could not find user with amazon_token=#{user_id}" if user == nil

      p = PromoCode.use_code(user, product_id, {:creation_path => "amazon"}, true)

      fulfillment.promo_code = p
      fulfillment.user = user

      fulfillment.save!
    end
  end

  # fulfill revoke
  def revoke (product_id, user_id, purchase_token)
    revocation = AmazonRevocation.create( :purchase_id => purchase_token,
                         :sku => product_id,
                         :amazon_token => user_id )

    # we don't handle it
    raise OtherException "unsupported feature"
  end
  #
  # Amazon Game Connect v2 (end)
  #

  protected

  def check_request_id
    unless params[:requestId].present?
      flash[:error] = tslt('missing amazon request token')
      return redirect_to index_path
   end
  end

  def instantiate_vars
    @redirectUrl = params[:redirectUrl]
    @game_id = params[:game_id]
  end

  def instantiate_request_id
    @requestId = params[:requestId]
  end

  def instantiate_secret_questions
    @secret_questions = SecretQuestion.active
  end

  def set_current_app
    @current_app = "amazon"
  end

  def form_step_validated?
    return(false) unless @form.present?
    if @user.invalid?
      FORM_FIELDS[@form].each do |field|
        return false unless @user.errors[field].empty?
      end
      return true
    end
    true
  end

  # Authentication as of Amazon Instant Access
  # 2014.3
  def verify_simple
    # regular verification doesn't seem to work.
    # Step 1. Check the time request was made, and ensure it is within our TIME_TOLERANCE
    request_time = Time.parse(request.headers['x-amz-date'], '%Y%m%dT%H%M%SZ')
    current_time = Time.now.utc
    raise "request time out of range" if current_time - request_time > SECURE_CONFIG['amazon']['time_tolerance_sec']

    # Step 2. Get crendential info from request, and find out paired private key (=secret key)
    authorization = request.headers['Authorization']
    regex = /(\S+) SignedHeaders=(\S+), Credential=(\S+)\/(\S+), Signature=([\S&&[^,]]+)/
    match = regex.match(authorization)
    public_key = match[3]
    private_key = SECURE_CONFIG['amazon']['key_store'][public_key]
    raise 'credential not found' unless private_key.present

    # OK. Good to go.
  end

  def verify

    # definitions
    algorithm_header = "DTA1-HMAC-SHA256"

    # Step 1. Check the time request was made, and ensure it is within our TIME_TOLERANCE
    request_time = Time.parse(request.headers['x-amz-date'], '%Y%m%dT%H%M%SZ')
    current_time = Time.now.utc
    raise "request time out of range" if current_time - request_time > SECURE_CONFIG['amazon']['time_tolerance_sec']

    # Step 2. Get crendential info from request, and find out paired private key (=secret key)
    authorization = request.headers['Authorization']
    regex = /(\S+) SignedHeaders=(\S+), Credential=(\S+)\/(\S+), Signature=([\S&&[^,]]+)/
    match = regex.match(authorization)
    signed_header = match[2]
    signed_sorted_headers = signed_header.split(';').sort!
    public_key = match[3]
    private_key = SECURE_CONFIG['amazon']['key_store'][public_key]
    credential_date = match[4]

    # Step 3. Get 'timed key' from the time(from Step 1) and private key
    timed_key = sign(credential_date, private_key)

    # Step 4. Get 'cannonical request' from request
    url = URI::encode(request.fullpath || "/")

    canonical_header = ""
    signed_sorted_headers.each do |header|
      canonical_header += (header.downcase.gsub(/\s+/, " ") + ":" + request.headers[header.upcase.tr('-', '_')].gsub(/\s+/, " ") + "\n")
    end

    signed_header = ""
    signed_sorted_headers.each do |header|
      signed_header += ";" if signed_header != ""
      signed_header += header.downcase
    end

    sha256 = Digest::SHA256.new
    content_hash = Digest.hexencode(sha256.digest(request.body.read || ""))

    canonical_request = "#{request.method}\n#{url}\n\n#{canonical_header}\n#{signed_header}\n#{content_hash}"

    # Step 5. Get 'string to sign' combining ALGORITH, the time, body, and cannonical request.
    hash_canonical_request = Digest.hexencode(sha256.digest(canonical_request))
    string_to_sign = "#{algorithm_header}\n#{request_time}\n\n#{hash_canonical_request}"

    # Step 6. Sign 'string to sign' with 'timed key' and that is the calculated signature
    signature = sign(string_to_sign, timed_key)

    # Step 7. Compare calculated signature with actual signature
    computed_authorization = "#{algorithm_header} SignedHeaders=#{signed_header}, Credential=#{public_key}/#{credential_date}, Signature=#{signature}"

    # final
    raise "signature mismatch" if computed_authorization != authorization

  end


  # sign using HMAC.sha256
  def sign(message, key)
    Digest.hexencode(OpenSSL::HMAC.digest(OpenSSL::Digest.new('sha256'), key, message))
  end
end

