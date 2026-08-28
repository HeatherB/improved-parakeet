class ObjectShim < OpenStruct
  include ActiveModel::Validations

  def self.from_hash(hash)
    return nil unless hash
    # add errors to the instantiated object later
    errors_hash = hash.delete("errors") if hash.has_key?("errors")

    # instantiate associations if they're in the hash
    associations_array = hash.delete("associations") if hash["associations"]

    if associations_array
      associations_array.each do |key|
        association = hash.delete(key) if hash.has_key?(key)
        if association
          if association.is_a?(Array)
            hash[key] = key.classify.constantize.from_hashes(association)
          else
            hash[key] = key.classify.constantize.from_hash(association)
          end
        end
      end
    end

    object = self.new(hash)
    errors_hash.each { |k, v| object.errors.add(k, v.to_sentence) } if errors_hash
    object
  end

  def self.from_hashes(hashes)
    return nil unless hashes
    hashes.map { |hash| hash[self.name.underscore] ? self.from_hash(hash[self.name.underscore]) : self.from_hash(hash) }
  end
end
