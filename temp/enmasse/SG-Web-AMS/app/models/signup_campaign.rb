# == Schema Information
#
# Table name: signup_campaigns
#
#  id                            :integer          not null, primary key
#  background_big                :string
#  background_medium             :string
#  background_small              :string
#  youtube_video_url             :string
#  youtube_poster_url            :string
#  level                         :string
#  hidden                        :boolean          default(FALSE)
#  active                        :boolean          default(FALSE)
#  custom_css                    :text
#  offer_image_url               :string
#  download_link                 :string
#  game_logo_url                 :string
#  copyright                     :text
#  game                          :string
#  name                          :string
#  campaign_name                 :string
#  frequency                     :integer          default(1)
#  created_at                    :datetime         not null
#  updated_at                    :datetime         not null
#  confirmation_additional_html  :text
#  success_img_url               :string
#  tracking_start_html           :text
#  tracking_email_sent_html      :text
#  tracking_email_clicked_html   :text
#  tracking_activated_html       :text
#  tracking_activate_failed_html :text
#

class SignupCampaign < PGModel

  attr_accessible :active, :background_big, :background_medium, :background_small, :campaign_name, :copyright, :created_at, :custom_css, :download_link,
    :frequency, :game, :success_img_url, :game_logo_url, :hidden, :id, :level, :name, :offer_image_url, :updated_at, :youtube_poster_url, :youtube_video_url,
    :confirmation_additional_html, :loaded_campaign, :loaded_revision, :tracking_start_html, :tracking_email_clicked_html, :tracking_activated_html,
    :tracking_activate_failed_html, :tracking_email_sent_html

  attr_accessor :loaded_campaign, :loaded_revision

  def view_url
    case self.level.downcase
    when 'master'
      return "/sign-up"
    when 'game'
      return "/#{self.game}/sign-up"
    when 'campaign'
      return "/#{self.game}/sign-up/#{self.name}"
    else # revision
      return "/#{self.game}/sign-up/#{self.campaign_name}?v=#{self.name}"
    end
  end
  
  def page_data
    game = nil
    campaign = nil
    revision = nil
    case self.level.downcase
    when 'game'
      game = self.game
    when 'campaign'
      game = self.game
      campaign = self.name
    else
      game = self.game
      revision = self.name
      campaign = self.campaign_name
    end
    return SignupCampaign.fetch_page_info(game, campaign, revision)
  end

  def self.fetch_page_info(game = nil, campaign = nil, revision = nil)
    @page_data = {}
    if revision
      page = SignupCampaign.where(level: 'Revision', game: game, active: true).where('lower(name) = ? and lower(campaign_name) = ?', revision.downcase, campaign.downcase ).first
      update_hash(@page_data, page.as_json) if page
    elsif campaign
      pages = SignupCampaign.where(level: 'Revision', game: game, active: true).where('lower(campaign_name) = ?', campaign.downcase ).all
      pages.shuffle! and update_hash(@page_data, pages[0].as_json) if pages.length > 0
    end
    if campaign
      page = SignupCampaign.where(level: 'Campaign', game: game, active: true).where('lower(name) = ?', campaign.downcase ).first
      update_hash(@page_data, page.as_json) if page
    end
    if game
      page = SignupCampaign.where(level: 'Game', game: game, active: true).first
      update_hash(@page_data, page.as_json) if page
    end
    page = SignupCampaign.where(level: 'Master', active: true).first
    update_hash(@page_data, page.as_json) if page
    SignupCampaign.new(@page_data)
  end

  def self.fetch_page_info_by_user(user)
    if user
      campaign_info = (JSON.load(user.signed_up_campaign) rescue {}) || {}
      game = campaign_info['game'] || user.signed_up_game_name
      campaign = campaign_info['campaign']
      revision = campaign_info['revision']
    else
      game = nil
      campaign = nil
      revision = nil
    end
    fetch_page_info(game, campaign, revision)
  end

  def self.update_hash(hash, new_vals)
    hash["loaded_#{new_vals['level'].downcase}"] = new_vals['name'] if ["campaign", "revision"].include?(new_vals['level'].downcase)
    new_vals.each {|k, v| hash[k] = v if hash[k].nil? || hash[k] == "" }
  end
  
end
