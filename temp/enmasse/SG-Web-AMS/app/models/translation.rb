# == Schema Information
#
# Table name: translations
#
#  id                   :integer          not null, primary key
#  string_id            :string(255)
#  translation_json     :text
#  num_languages        :integer
#  languages_translated :string(255)
#  created_at           :datetime
#  updated_at           :datetime
#

class Translation < ActiveRecord::Base
  require 'yajl/json_gem'
  
  attr_accessible :string_id, :translation_json, :num_languages, :languages_translated
  
  def self.init_constant
    out = {}
    all.each do |t|
      translations = JSON.parse(t.translation_json)
      out[t.string_id] = translations
    end
    return out
  rescue
    {}
  end
    
end
