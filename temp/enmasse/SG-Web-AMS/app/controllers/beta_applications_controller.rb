class BetaApplicationsController < ApplicationController
  before_filter :login_required

  def withdraw
    @beta_app = BetaApplication.where(user_id: current_user.id, game_id: @game.id).first
    @beta_app.withdrawn_at = Time.now
    @beta_app.save
    redirect_to "/users/account"
  end

  def apply
    # ensure loged in and has a game_id
    @error = false
    if current_user && params[:game_id]
      @game = Game.nolock.find(params[:game_id])
      if @game && @game.beta_applications_open

        # signup newsletter
        game_name = @game.name.downcase
        mailing_lists = MailingList.where(:auto_sign_up_for_game => game_name)
        if mailing_lists.present?
          m = mailing_lists.first
          m.subscribe(current_user.id)
        end

        @beta_app = BetaApplication.where(user_id: current_user.id, game_id: @game.id).first
        @beta_app ||= BetaApplication.create(user_id: current_user.id, game_id: @game.id, applied_at: Time.now)
        @beta_app.withdrawn_at = nil
        if !@beta_app.accepted_at && params[:beta_code] && params[:beta_code].chomp.size > 4
          # check if code is a beta code, is valid, and is for this game...
          valid_code = false
          @code = PromoCode.where(promo_code: params[:beta_code].chomp, used_by: nil).first
          @code = GroupPromoCode.where(promo_code: params[:beta_code].chomp).first if !@code
          if @code && @code.promotion
            @code.promotion.promotion_skus.each do |psku|
              break if valid_code
              psku.warehouse_sku.warehouse_sku_assets.each do |wasku|
                if wasku.type == "WhAssetBetaAccess"
                  meta_json = JSON.parse(wasku.meta_json)
                  if meta_json["game_id"].to_i == params[:game_id].to_i
                    valid_code = true
                    break
                  end
                end
              end
            end
          end
          # if okay, apply code.
          if valid_code
            error_messages = PromoCode.check_code_precondition(current_user, params[:beta_code], {:game_id => @game.id })
            if error_messages.nil? || error_messages.empty?
              begin
                PromoCode.use_code(current_user, params[:beta_code], {:game_id => @game.id })
                @message = "Code Accepted."
              rescue
                @error = true
                @message = "Code Failed."
                send_waitlist_email(@beta_app, current_user, @game)
              end
            else
              @error = true
              @message = error_messages.join(" ")
            end
          else
            send_waitlist_email(@beta_app, current_user, @game)
            @error = true
            @message = "Invalid Code (added to waitlist)."
          end
        else
          if @beta_app.accepted_at
            @error = true
            @message = "Active"
          else
            @message = "Added to Waitlist."
            send_waitlist_email(@beta_app, current_user, @game)
          end
        end
      else
        @error = true
        @message = "No Active Beta."
      end
    else
      @error = true
      @message = "Sign in to Apply."
    end
    @beta_app.reload
    respond_to do |format|
      format.html {render json: {error: @error, message: @message}}
      format.js
    end
  end

  def show_status
    data = { status: "Not Applied" }
    if current_user && params[:game_id]
      @game = Game.nolock.find(params[:game_id])
      if @game && @game.beta_applications_open
        beta_app = BetaApplication.where(user_id: current_user.id, game_id: @game.id).first
        data = { status: beta_app.status } if beta_app
      elsif @game
        data = { status: "Beta Applications Closed" }
      else
        data = { status: "Game Not Found" }
      end
    end
    render json: data
  end

  private
  def send_waitlist_email(beta_app, user, game)
    if beta_app.applied_at > (Time.now - 10.seconds)
      EME::Email.send_email({to: user.email, master_account_id: user.id, template_name: "API_beta_waitlist_#{game.seo_id}"})
    end
  end
end
