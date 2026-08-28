# == Schema Information
#
# Table name: custom_blocks
#
#  id         :integer          not null, primary key
#  key        :string(255)      not null
#  content    :text             not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class CustomBlock < ActiveRecord::Base
  attr_accessible :key, :content

  after_save :update_memcache
  after_destroy :clean_memcache

  def update_memcache
    Rails.cache.write(self.cache_key, self.content, :expires_in => 1.day)
  end

  def clean_memcache
    Rails.cache.delete(self.cache_key)
  end

  def cache_key
    self.class.cache_key(self.key)
  end

  def self.cache_key(key)
    "custom_block_#{key}"
  end

  def self.update_memcache(key)
    custom_block = self.where(:key => key).first
    return nil unless custom_block
    converted_content = custom_block.content.to_s.force_encoding("UTF-8")
    Rails.cache.write(custom_block.cache_key, converted_content, :expires_in => 1.day)
    converted_content
  rescue => ex
    nil
  end

  def self.content_for(key)
    cached_content = Rails.cache.read(self.cache_key(key))
    if cached_content.nil?
      cached_content = self.update_memcache(key)
    end

    # make sure the cached content is utf8; admin's memcache client sets strings as ASCII-8BIT
    if cached_content.nil? || cached_content.encoding != Encoding::UTF_8
      cached_content = self.update_memcache(key)
    end

    cached_content
  end
end
