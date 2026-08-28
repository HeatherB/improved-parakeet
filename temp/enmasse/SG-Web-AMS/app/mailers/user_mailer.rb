class UserMailer < Mailer::Transactional

  def subscription_start_notification(user_id, values)
    user          = User.find(user_id)
    template_name = "subscription_start_notification"
    options       = default_options(user)
    options.merge!({
                     name:            values['name'],
                     email:           values['email'],
                     billing_address: values['billing_address'],
                     purchase_date:   values['purchase_date'],
                     order_id:        values['order_id'],
                     payment_method:  values['payment_method'],
                     product_name:    values['product_name'],
                     subtotal:        values['subtotal'],
                     tax:             values['tax'],
                     grand_total:     values['grand_total']
                   })
    return user.id, user.email, template_name, options
  end

  def subscription_change_notification(user_id, values)
    user          = User.find(user_id)
    template_name = "subscription_change_notification"
    options       = default_options(user)
    options.merge!({
                     name:            values['name'],
                     email:           values['email'],
                     billing_address: values['billing_address'],
                     purchase_date:   values['purchase_date'],
                     renewal_date:    values['renewal_date'],
                     order_id:        values['order_id'],
                     payment_method:  values['payment_method'],
                     product_name:    values['product_name'],
                     subtotal:        values['subtotal'],
                     tax:             values['tax'],
                     grand_total:     values['grand_total']
                   })
    return user.id, user.email, template_name, options
  end

  def subscription_expire_notification(user_id, values)
    user          = User.find(user_id)
    template_name = "subscription_expire_notification"
    options       = default_options(user)
    options.merge!({
                     date_of_cancel:  values['date_of_cancel'],
                     date_of_expire:  values['date_of_expire'],
                     name:            values['name'],
                     email:           values['email'],
                     billing_address: values['billing_address']
                   })
    return user.id, user.email, template_name, options
  end

  def subscription_cancel_notification(user_id, values)
    user          = User.find(user_id)
    template_name = "subscription_cancel_notification"
    options       = default_options(user)
    options.merge!({
                     date_of_expire:  values['date_of_expire'],
                     name:            values['name'],
                     email:           values['email'],
                     billing_address: values['billing_address']
                   })
    return user.id, user.email, template_name, options
  end

  def emp_purchase_notification(user_id, values)
    user          = User.find(user_id)
    template_name = "emp_purchase_notification"
    options       = default_options(user)
    options.merge!({
                     :full_name                  => values['full_name'],
                     :billing_street_address     => values['billing_street_address'],
                     :billing_city_state_country => values['billing_city_state_country'],
                     :billing_zip_code           => values['billing_zip_code'],
                     :product_name               => values['product_name'],
                     :subtotal                   => values['subtotal'],
                     :tax                        => values['tax'],
                     :grand_total                => values['grand_total'],
                     :purchase_date              => values['purchase_date'],
                     :receipt_number             => values['receipt_number'],
                     :payment_type               => values['payment_type'],
                     :last_4_payment_method      => values['last_4_payment_method'],
                     :payment_expiration_date    => values['payment_expiration_date'],
                   })
    return user.id, user.email, template_name, options
  end

  def gift_notification(gift)
    return nil unless user = gift.recipient

    template_name = "gift_notification"
    options       = default_options(user)
    options.merge!({
                     :sender => gift.sender_name, :recipient => gift.recipient_name, :message => gift.message
                   })

    return user.id, user.email, template_name, options
  end

  def eme_gift_notification(gift)
    return nil unless user = gift.recipient

    template_name = "eme_gift_notification"
    options       = default_options(user)
    options.merge!({
                     :sender => gift.sender_name, :recipient => gift.recipient_name, :message => gift.message
                   })

    return user.id, user.email, template_name, options
  end

  def signup_notification(user)
    template_name = "signup_notification_#{user.signed_up_game_name}"
    template_name = "signup_notification" unless Mailer::Template.exists? template_name
    options       = default_options(user)
    options.merge!({
                     :ticket => user.activation_code,
                     :url    => activate_user_url(user.screen_name, :ticket => user.activation_code)
                   })
    return user.id, user.email, template_name, options
  end

  def activation_link(user_id)
    # This is exactly the same with signup_notification
    user          = User.find(user_id)

    template_name = "signup_notification_#{user.signed_up_game_name}"
    template_name = "signup_notification" unless Mailer::Template.exists? template_name

    options       = default_options(user)
    options.merge!({
                     :ticket => user.activation_code,
                     :url => activate_user_url(user.screen_name, :ticket => user.activation_code)
                   })
    return user.id, user.email, template_name, options
  end

  def email_authorization_code(user)
    # AMS Admin makes a delayed job to call User.email_authorization_code when authorization code is needed in CS
    template_name = "email_authorization_code"
    options       = default_options(user)
    options.merge!({
                     :verify => user.authorization_code
                   })

    return user.id, user.email, template_name, options
  end

  def welcome_to_game(user, game_name=nil)
    game_name = (user.signed_up_game_name unless game_name) || ''

    template_name = "welcome_to_game_#{game_name.downcase}"
    template_name = "welcome_to_game_eme" unless Mailer::Template.exists? template_name

    options       = default_options(user)
    return user.id, user.email, template_name, options
  end

  def password_reset_request(user)
    template_name = "password_reset_request"
    options       = default_options(user)
    options.merge!(
      :url => complete_password_reset_user_url(user.screen_name, :ticket => user.forgot_password_key)
    )

    return user.id, user.email, template_name, options
  end

  def password_changed_notice(user)
    template_name = "password_changed_notice"
    options       = default_options(user)
    return user.id, user.email, template_name, options
  end

  def confirm_email_change(user)
    template_name = "confirm_email_change"
    options       = default_options(user)
    options.merge!(
      :url => confirm_email_change_user_url(user.screen_name, :ticket => user.new_email_key)
    )

    return user.id, user.email, template_name, options
  end

  def email_changed_notice(user)
    template_name = "email_changed_notice"
    options       = default_options(user)
    return user.id, user.email, template_name, options
  end

  def engarde_ticket(user, ticket)
    # TODO: this is the same handler with account_armor_ticet, delete this one if there is no one call this.
    template_name = "account_armor_ticket"
    options       = default_options(user)
    options.merge!(:ticket => ticket)

    return user.id, user.email, template_name, options
  end

  def account_armor_ticket(user_id, ticket)
    user          = User.find(user_id)
    template_name = "account_armor_ticket"
    options       = default_options(user)
    options.merge!(:ticket => ticket)

    return user.id, user.email, template_name, options
  end

  def disciplinary_action_created(suspension_id)
    template_name = "disciplinary_action_created"
    suspension    = Suspension.find(suspension_id, :include => [:user, :offense])
    user          = suspension.user
    options       = default_options(user)
    options.merge!(:message => suspension.mailer_message, :offense => suspension.offense.name)
    options.merge!(:custom_message => suspension.message) if suspension.message.present?

    return user.id, user.email, template_name, options
  end

  def disciplinary_action_lifted(suspension_id)
    template_name = "disciplinary_action_lifted"
    suspension    = Suspension.find(suspension_id, :include => [:user, :offense])
    user          = suspension.user
    options       = default_options(user)
    options.merge!(:custom_message => suspension.message) if suspension.message.present?

    return user.id, user.email, template_name, options
  end

  def ticket_created(ticket_full_id)
    template_name = "ticket_created"

    ticket_result, ticket_response = Services::Support::Tickets.find(:conditions => {:full_id => ticket_full_id})

    if ticket_result[:error].nil?
      ticket = Ticket.from_hash(ticket_result[:payload][:ticket])

      user = User.find_by_email(ticket.email)

      if user
        options = default_options(user)
        options.merge!(:url => ticket.public_url, :ticket => ticket.full_id)

        return user.id, user.email, template_name, options
      else
        return nil
      end
    else
      return nil
    end
  end

  def ticket_response_created(ticket_full_id)
    template_name = "ticket_response_created"

    ticket_result, ticket_response = Services::Support::Tickets.find(:conditions => {:full_id => ticket_full_id})

    if ticket_result[:error].nil?
      ticket = Ticket.from_hash(ticket_result[:payload][:ticket])

      user = User.find_by_email(ticket.email)

      if user
        transcript_result, transcript_response = Services::Support::Tickets.transcript(:full_id => ticket_full_id)
        if transcript_result[:error].nil?
          transcript = transcript_result[:payload][:transcript]
        else
          transcript = ""
        end

        options = default_options(user)
        options.merge!(:url => ticket.public_url, :ticket => ticket.full_id, :transcript => transcript)

        return user.id, user.email, template_name, options
      else
        return nil
      end
    else
      return nil
    end
  end

  def survey_created(survey_id)
    template_name = "survey_created"

    survey_result, survey_response = Services::Support::Surveys.find(:conditions => {:id => survey_id})

    if survey_result[:error].nil?
      survey = Survey.from_hash(survey_result[:payload][:survey])

      ticket_result, ticket_response = Services::Support::Tickets.find(:conditions => {:id => survey.ticket_id})

      if ticket_result[:error].nil?
        ticket = Ticket.from_hash(ticket_result[:payload][:ticket])

        user = User.find_by_email(ticket.email)

        if user
          options = default_options(user)
          options.merge!(:url => survey.public_url)

          return user.id, user.email, template_name, options
        else
          return nil
        end
      else
        return nil
      end
    else
      return nil
    end
  end

  protected

  def default_options(user)
    {
      :name     => user.screen_name_no_temp,
      :language => user.language
    }
  end

end
