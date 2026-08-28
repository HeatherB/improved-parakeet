# == Schema Information
#
# Table name: site_pages_content
#
#  id           :integer          not null, primary key
#  site_page_id :integer
#  language_id  :integer
#  title        :string(255)
#  body         :text
#  created_at   :datetime
#  updated_at   :datetime
#

class SitePagesContent < ActiveRecord::Base
  self.table_name = "site_pages_content"
  belongs_to :language
  belongs_to :site_page

  attr_accessible :site_page_id, :language_id, :title, :body
end
