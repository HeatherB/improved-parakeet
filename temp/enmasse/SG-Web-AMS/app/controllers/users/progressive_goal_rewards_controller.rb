class Users::ProgressiveGoalRewardsController < ApplicationController
  include Extensions::AssetFulfillmentLogEx::ClassMethods

  before_filter :login_required
  before_filter :set_user_instance
  before_filter :set_current_app
  skip_after_filter :store_location

  def show
    @reward = current_user.progressive_goal_rewards.find(params[:id],
      :include => { :reward_promotion => { :promotion_skus => { :warehouse_sku => :warehouse_sku_assets } } })
    load_info_for_reward(@reward)
    render :partial => "show"
  rescue ActiveRecord::RecordNotFound => rnf
    flash.now[:error] = tslt("unable to find the requested code")
    render :partial => "shared/ajax_error"
  end

  def submit_required_info
    @reward = current_user.progressive_goal_rewards.find(params[:id],
      :conditions => { :fulfillment_complete => false },
      :include => { :reward_promotion => { :promotion_skus => :warehouse_sku } }
    )

    if required_fields_entered?(params)
      assets = current_user.asset_fulfillments.find(:all,
        :include => :warehouse_sku_asset,
        :conditions => {
          :source_type => "ProgressiveGoalReward",
          :source_id => @reward.id,
          :status => AssetFulfillment.fulfillment_status_for(:input_required) }
      )

      assets.each do |asset|
        asset.update_attribute(:meta_json, { "game_account_id" => params[:game_account_id] }.to_json)
        AssetFulfillment.retry_fulfillment(asset.id, { :queue_on_fail_retry => true })
      end

      @reward.reload
    else
      @reward_errors = true
      flash.now[:error] = "Selection is missing or invalid"
    end

    load_info_for_reward(@reward)
    render :partial => "reward_status"
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

  def load_info_for_reward(reward)
    @promotion ||= reward.reward_promotion
    @skus = @promotion.promotion_skus.collect(&:warehouse_sku)
    @fulfillments = current_user.asset_fulfillments.find(:all,
      :include => :warehouse_sku_asset,
      :conditions => { :source_type => "ProgressiveGoalReward", :source_id => reward.id })
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
    reward.update_attribute(:fulfillment_complete, true) if @unredeemed_assets.empty?
  end

  def required_fields_entered?(params)
    unless params[:game_account_id].nil?
      return params[:game_account_id].to_i > 0
    end
    true
  end
end
