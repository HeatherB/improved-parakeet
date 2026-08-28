# == Schema Information
#
# Table name: persistent_caches
#
#  id         :integer          not null, primary key
#  key        :string(255)
#  value      :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  expired_at :datetime
#

class PersistentCache < ActiveRecord::Base

  attr_accessible :key, :value, :expired_at

  def self.read(key)
    value = nil
    entry = find_by_key(key)
    if entry.present?
      if entry.expired_at.present? and entry.expired_at < Time.now
        # abandon and delete entry since it was expired
        entry.delete
        entry = nil
      else
        value = YAML.load entry.value
      end
    end
    return value
  end

  def self.read_value_and_updated_at(key)
    value = nil
    updated_at = nil
    entry = find_by_key(key)
    if entry.present?
      if entry.expired_at.present? and entry.expired_at < Time.now
        # abandon and delete entry since it was expired
        entry.delete
        entry = nil
      else
        value = YAML.load entry.value
        updated_at = entry.updated_at
      end
    end
    return value, updated_at
  end

  def self.write(key, value, options={})
    expired_at = nil
    if options.has_key? :expired_at
      expired_at = options[:expired_at]
    elsif options.has_key? :expires_at
      expired_at = options[:expires_at]
    elsif options.has_key? :expired_in
      expired_at = options[:expired_in].from_now
    elsif options.has_key? :expires_in
      expired_at = options[:expires_in].from_now
    end

    value = YAML.dump(value)

    self.transaction do
      entry = self.find_by_key(key)
      if entry.present?
        # Update the entry
        entry.value = value
        entry.expired_at = expired_at
        entry.save
      else
        begin
          # Insert a new entry
          self.create(:key => key, :value => value, :expired_at => expired_at)
        rescue ActiveRecord::StatementInvalid
          # The entry was already inserted by another thread/process.
          entry = self.find_by_key(key)
          entry.value = value
          entry.expired_at = expired_at
          entry.save
        end
      end
    end
  end

  def self.remove(key)
    entry = self.find_by_key(key)
    if entry.present?
      entry.delete
    end
  end

  def self.exists?(key)
    entry = find_by_key(key)
    if entry.present?
      if entry.expired_at.present? and entry.expired_at < Time.now
        entry.delete
        false
      else
        true
      end
    else
      false
    end
  end

  def self.flush()
    self.delete_all()
  end

end
