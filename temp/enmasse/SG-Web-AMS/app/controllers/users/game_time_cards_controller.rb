class Users::GameTimeCardsController < ApplicationController
  before_filter :login_required
  before_filter :set_user_instance
  before_filter :set_current_app
  skip_after_filter :store_location

  # This is where the pin comes in
  def create
    ret_data = { :success => false, :message => '' }

    logs = AwesomeLogger.new
    logs.formatter = :json

    logs << "Starting redemption"

    logs << "Got the following params #{params.inspect}"

    if params[:pref_account].blank?
      logs << "Don't have a pref_account set, need to know which game account to apply game time to"
      raise IncommRedemption::UnknownGameAccount
    else
      unobfuscated_gid = GameAccount.unobfuscated_id(params[:pref_account])
      @game_account = GameAccount.find_by_id(unobfuscated_gid)
      logs << "Could not find the game account with id #{unobfuscated_gid}" if @game_account.blank?
      # For PromoCode.use_code later
      options = { :pref_acct => @game_account }
    end

    if @game_account.num_failed_incomm_redemptions(15.minutes) >= 5
      raise IncommRedemption::RateLimited
    end

    @pin = params[:game_code]

    # strip all characters other than alphanumeric
    # also truncate pin to be less than 12 characters
    @pin.gsub!(/[^\w\d]/, '')
    @pin = @pin[0..11]

    @redemption = IncommRedemption.create( :game_account => @game_account, :user => @game_account.user, :pin => @pin )
    logs << "Created Incomm Redemption object with ID #{@redemption.id}"

    logs << "Checking if PIN #{@pin} is valid with Incomm"
    pin_valid = Incomm::Pin.valid?(@pin, @redemption)

    logs << "Got response from Incomm for the validity check call:"
    logs << pin_valid[:hash].inspect
    if pin_valid[:result] == true
      redemption_result = Incomm::Pin.redeem(@pin, @redemption)
    else
      message = IncommRedemption::InvalidCard.new.message
      logs << message
      ret_data[:message] = message
      return
    end

    logs << "Got response from Incomm for the redemption call:"
    logs << redemption[:hash].inspect
    if redemption_result[:result]
      @redemption.promo_code = redemption_result[:result]

      logs << "Incomm redemption successful, applied unique code #{ redemption_result.promo_code } to the game account"
      ret_data[:success] = true
      ret_data[:notice] = 'incomm code redemption successful'

      IncommRedemptionNotification.create_initial!(@redemption, request)

      @game_code = @redemption.promo_code
      load_info_for_code(@game_code)
      ret_data[:html] = render_to_string :partial => 'users/game_time_cards/show'
    else
      message = IncommRedemption::CardRedemptionFailure.new.message
      logs << message
      ret_data[:message] = message
    end
  rescue => e
    logs << e.message
    e.backtrace.each { |m| logs << m }
    ret_data[:message] = e.is_a?(IncommRedemption::RateLimited) ? e.message : IncommRedemption::IncommRedemptionException.new.message
  ensure
    logs.formatter = :console
    logs.flush_to_logger Logger.new("#{Rails.root}/log/incomm.log")
    logs.formatter = :json

    if @redemption.present? && @redemption.valid?
      @redemption.status = ret_data[:success] ? "success" : "failed"
      @redemption.save
      IncommRedemptionLog.create( :incomm_redemption_id => @redemption.id, :trace_json => logs.output )
    end
    ret_data[:message] = tslt(ret_data[:message])
    render :text => ret_data.to_json
  end

  def show
    @game_code = current_user.promo_codes.find(params[:id], 
      :include => { :promotion => { :promotion_skus => { :warehouse_sku => :warehouse_sku_assets }  } })
    load_info_for_code(@game_code)
    render :partial => "show"
  rescue ActiveRecord::RecordNotFound => rnf
    flash.now[:error] = tslt("unable to find the requested code")
    render :partial => "shared/ajax_error"
  end

  protected
  
  def set_current_app
    @current_app = "account"
  end  
  
  def set_user_instance
    @user = User.find(current_user.id)
  end

  def load_info_for_code(code)
    @promotion ||= code.promotion
    @skus = @promotion.promotion_skus.collect(&:warehouse_sku)
    @fulfillments = current_user.asset_fulfillments.find(:all, 
      :include => :warehouse_sku_asset,
      :conditions => { :source_type => "PromoCode", :source_id => code.id })
    @unredeemed_assets = {}
    p_rate_limit_exceeded = @promotion.rate_limit_exceeded?(current_user)
    
    @fulfillments.select { |f| !f.complete? }.each do |ur|
      
      if p_rate_limit_exceeded
        if ur.status != AssetFulfillment.fulfillment_status_for(:rate_limited)
          write_log(ur) do |log|
            ur.status = AssetFulfillment.fulfillment_status_for(:rate_limited)
            ur.attempts += 1
            ur.last_attempt_at = Time.now
            ur.save
            log << trace_msg("Campaign rate limit exceeded")
          end
        end
      else
        # we need to attempt to fulfill rate_limited assets when applicable
        if ur.status == AssetFulfillment.fulfillment_status_for(:rate_limited)
          AssetFulfillment.retry_fulfillment(ur.id, { :queue_on_fail_retry => true })
          ur.reload
          next if ur.status == AssetFulfillment.fulfillment_status_for(:complete)
        end
      end
      
      asset = ur.warehouse_sku_asset
      wh_sku_id = asset.warehouse_sku_id
      @unredeemed_assets[wh_sku_id] ||= []
      @unredeemed_assets[wh_sku_id] << ur
    end
    # temp workaround to potential race condition where fulfillment_complete
    # not getting properly updated
    code.update_attribute(:fulfillment_complete, true) if @unredeemed_assets.empty?
  end
  
  def required_fields_entered?(params)
    unless params[:game_account_id].nil?
      return params[:game_account_id].to_i > 0
    end
    true
  end
end
