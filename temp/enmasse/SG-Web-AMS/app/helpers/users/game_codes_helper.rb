module Users::GameCodesHelper
  include UsersHelper

  def sku_status_text(promotion, game_code, sku, unredeemed_arr)
    out = ""
    if unredeemed_arr.nil? || unredeemed_arr.empty?
      out = "<p><span class='complete'>#{tslt("code fulfillment complete")}</span></p>"
    else
      status_hash = {}
      unredeemed_arr.each do |af|
        status_hash[af.status] ||= []
        status_hash[af.status] << af
      end

      if (arr = status_hash[AssetFulfillment.fulfillment_status_for(:fail_fatal)]).present?
        out = "<p class='failed'>#{tslt("code fulfillment failed")}</p>"
      elsif (arr = status_hash[AssetFulfillment.fulfillment_status_for(:rate_limited)]).present?
        rate_limit_lifted = promotion.rate_limit_lifted_for(current_user)
        out = "<p><span class='pending'>#{format(tslt("code fulfillment rate limited"), promotion.rate_limit_amount, promotion.rate_limit_duration, rate_limit_lifted)}</span></p>"
      elsif (arr = status_hash[AssetFulfillment.fulfillment_status_for(:input_required)]).present?

        # display fields for user input
        fields = arr.collect(&:warehouse_sku_asset).collect(&:fields_for_user_input).flatten.uniq
        out << "<form id='game-code-info-form' action='#{submit_required_info_users_game_code_path(game_code)}' data-div='redeemed-code' method='post'>"
        out << "<input type='hidden' name='authenticity_token' value='#{form_authenticity_token}' />"
        has_items = false
        fields.each do |f|
          f_out, f_has_items = html_for_required_input(f, sku)
          out << f_out
          has_items ||= f_has_items
        end
        out << "<a href='#' class='default-button btn-4 game-code-submit pseudo-submit-link' data-form='game-code-info-form'>Submit</a><div class='clear'></div>" if has_items
        out << "</form>"

      elsif (arr = status_hash[AssetFulfillment.fulfillment_status_for(:redemption_limited)]).present?
        out = "<p><span class='pending'>#{tslt("code redemption limit reached")}</span></p>"
      else
        out = "<p><span class='pending'>#{tslt("code fulfillment pending")}</span></p>"
      end
    end
    out.html_safe
  end

  # currently, only required field is game_account_id
  # if more are added, just add case for it
  def html_for_required_input(field, sku)
    out, has_items = "", false
    case field.to_s
    when "game_account_id"
      accts = sku.applicable_game_accounts(current_user)
      if accts.empty?
        out << "<p class='pending'>#{tslt("code fulfillment no eligible accounts")}</p>"
      else
        out << "<label>Select the game account to apply your code to:</label>"
        out << select_tag(:game_account_id,
          options_for_select([["Select Game Account",""]] + accts.collect { |acct| [acct.account_name,acct.id] })
        )
        has_items = true
      end
    end
    return out.html_safe, has_items
  end

end
