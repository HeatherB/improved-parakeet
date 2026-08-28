module Users::ReferralsHelper
  include UsersHelper

  def referral_tier(referral)
    return '1' if referral.status == 'active'
    return '3' if referral.subscription_rewarded?
    return '2' if referral.status == 'settled'
    return ''
  end

  def referral_rank_active_class(referral, tier)
    return "completed" if referral_tier(referral).to_i >= tier
    return ""
  end

  def handle_long_text(text)
    text = h(text)
    truncated_text = truncate text, :length => 20
    return content_tag(:span, :title => text) do 
      truncated_text
    end
  end
end
