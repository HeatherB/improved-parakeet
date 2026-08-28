# == Schema Information
#
# Table name: site_pages
#
#  id          :integer          not null, primary key
#  page_type   :string(255)
#  title       :string(255)
#  body        :text
#  created_at  :datetime
#  updated_at  :datetime
#  page_seo_id :string(255)      not null
#  url_prefix  :string(255)
#  status      :boolean          default(FALSE)
#  plain_text  :boolean          default(FALSE)
#

class SitePage < ActiveRecord::Base
  has_one :site_pages_content
  
  scope :eula, :limit => 1, :conditions => ["page_type = ?", "eula"]
	scope :privacy_policy, :limit => 1, :conditions => ["page_type = ?", "privacy_policy"]
	scope :terms_of_use, :limit => 1, :conditions => ["page_type = ?", "terms_of_use"]
	scope :terms_of_service, :limit => 1, :conditions => ["page_type = ?", "terms_of_service"]
	scope :rules_of_conduct, :limit => 1, :conditions => ["page_type = ?", "rules_of_conduct"]
	scope :parents_guide, :limit => 1, :conditions => ["page_type = ?", "parents_guide"]
	scope :game_info, :limit => 1, :conditions => ["page_type = ?", "game_info"]
	
	scope :pages, :conditions => ["url_prefix = ?", "pages"]
	scope :docs, :conditions => ["url_prefix = ?", "docs"]
	
	scope :published, :conditions => ["status = ?", true]
	
	
	scope :for_language, lambda { |lang| { :conditions => { :site_pages_content => { :language_id => lang }}, :include =>  { :site_pages_content => :language } }}
	
  attr_accessible :page_type, :title, :body, :page_seo_id, :url_prefix, :status, :plain_text
  
	def title
    content.title
  end
  
  def body
    content.body
  end
    
  def content
    self.site_pages_content || SitePagesContent.new
  end
end
