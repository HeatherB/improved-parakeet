module CustomValidationsHelper

  class EmailVeracityValidator < ActiveModel::EachValidator
    def validate_each(record, attribute, value)
      email_arr = value.split("@")
      if email_arr.size == 2
        email_name, email_domain = email_arr[0].downcase.strip, email_arr[1].downcase.strip
        if RESERVED_DOMAINS.include?(email_domain)
          record.errors[attribute] << "contains a reserved domain"
        elsif BLACKLISTED_DOMAINS.include?(email_domain)
          record.errors[attribute] << "provider is not supported, try another email address"
        elsif value =~ /spam/i
          record.errors[attribute] << "cannot contain the word \"spam\""
        else
          # erase any string after +: all+test => all
          # erase any dot: a.l.l. => all
          normalize_email_name = email_name.sub(/\+.+/, "").gsub(".", "")
          BLACKLISTED_NAMES.each do |blacklisted_name|
            if normalize_email_name == blacklisted_name.downcase
              record.errors[attribute] << "address is not allowed"
              break
            end
          end
        end
      end
    end
  end

  class UserValidator < ActiveModel::Validator
    def validate(record)
      if record.authenticated?(record.new_email.split('@')[0] || '')
        record.errors[:new_email] << "cannot contain your password"
      end
    end
  end

  def validates_swear_free(*attr_names)
    # configuration is everything after the fields list
    configuration = { :message => I18n.translate('activerecord.errors.messages.invalid'), :on => :save }
    configuration.update(attr_names.extract_options!)

    # validate each field passed in
    validates_each(attr_names, configuration) do |record, attr_name, value|
      record.errors.add(attr_name, configuration[:message]) if value && !SWEAR_FILTER.allows?(value.mgsub([[/-/,''],[/_/,'']]))
    end
  end

  def validates_mail_recipients(*attr_names)
    # configuration is everything after the fields list
    configuration = { :message => I18n.translate('activerecord.errors.messages.invalid'), :on => :save }
    configuration.update(attr_names.extract_options!)

    # validate each field passed in
    validates_each(attr_names, configuration) do |record, attr_name, value|
      users, errors = Mail.parse_users(value)
      record.errors.add('', format("Can't find user(s): %s", errors.to_sentence)) if errors.size > 0
    end
  end

  def validates_age_of(*attr_names)
    # configuration is everything after the fields list
    configuration = { :message => I18n.translate('activerecord.errors.messages.invalid'), :on => :save, :atleast => nil }
    configuration.update(attr_names.extract_options!)

    # throw an error if the developer left out the :atleast value we check against
    # don't have to translate this... it's a message to developer
    raise(ArgumentError, "A minimum age must be supplied as the :atleast option of the configuration hash") if configuration[:atleast].nil?

    # validate each field passed in
    validates_each(attr_names, configuration) do |record, attr_name, value|
      record.errors.add(attr_name, configuration[:message]) if value.to_i < configuration[:atleast].to_i
    end
  end

  def validates_promo_code(*attr_names)
    configuration = { :message => I18n.translate('activerecord.errors.messages.invalid'), :on => :create }
    configuration.update(attr_names.extract_options!)

    # validate each field passed in
    validates_each(attr_names, configuration) do |record, attr_name, value|
      record.errors.add(attr_name, configuration[:message]) unless (value && (GroupPromoCode.available?(value) || PromoCode.available?(value)))
    end
  end

  # Author: Bob Tsai (mailto:btsai@sleepygiant.com)
  #
  # ==== Description
  #
  # Custom validation to check if user can create a cs ticket w/in this category
  #
  # ==== Examples
  #
  # validates_premium_category_access :cs_ticket_category_id
  #
  # ==== Change History
  # <tt>10/08/09</tt>:: Created by Bob Tsai (mailto:btsai@sleepygiant.com)
  def validates_not_premium(*attr_names)
    configuration = { :message => "is for premium subscribers only." }
    configuration.update(attr_names.extract_options!)

    # validate each field passed in
    validates_each(attr_names, configuration) do |record, attr_name, value|
      record.errors.add(attr_name, configuration[:message]) if CsTicketCategory.is_premium_category?(value)
    end
  end

  def validates_password(*attr_names)
    # configuration is everything after the fields list
    configuration = { :message => I18n.translate('activerecord.errors.messages.invalid'), :on => :save }
    configuration.update(attr_names.extract_options!)

    # validate each field passed in
    validates_each(attr_names, configuration) do |record, attr_name, value|
      if value && !valid_password?(value, record.email)
        record.errors.add(attr_name, configuration[:message])
      end
    end
  end

  def valid_password?(password, email)
    if email.present?
      email_arr = email.split("@")
      email_name, email_domain = email_arr[0], email_arr[1]
      return false if password.downcase.include?(email_name.downcase)
      return false if email_domain.present? && password.downcase.include?(email_domain[0, (email_domain.rindex(".") || email_domain.length)].downcase)
    end

    password.length >= 8 && password.length <= 99 &&
    password =~ /(?=.*[A-Z])(?=.*[^A-Z])[\S]+|(?=.*[a-z])(?=.*[^a-z])[\S]+$|(?=.*[0-9])(?=.*[^0-9])[\S]+$/
  end
end
