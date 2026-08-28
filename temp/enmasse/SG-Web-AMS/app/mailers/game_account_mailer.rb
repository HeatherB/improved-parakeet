class GameAccountMailer < Mailer::Transactional

  def disciplinary_action_created(suspension_id)
    template_name = "disciplinary_action_created"
    suspension = GameAccountSuspension.find(suspension_id, :include => [:user, :offense, :game_account])
    user, game_acct = suspension.user, suspension.game_account

    options = default_options(user, game_acct)  
    options.merge!(:message => suspension.mailer_message, :offense => suspension.offense.name)
    options.merge!(:custom_message => suspension.message) if suspension.message.present?

    return user.id, user.email, template_name, options
  end

  def disciplinary_action_lifted(suspension_id)
    template_name = "disciplinary_action_lifted"
    suspension = GameAccountSuspension.find(suspension_id, :include => [:user, :offense, :game_account])
    user, game_acct = suspension.user, suspension.game_account

    options = default_options(user, game_acct)
    options.merge!(:custom_message => suspension.message) if suspension.message.present?

    return user.id, user.email, template_name, options
  end

  def character_transfer_created(character_transfer_id)
    template_name = "character_transfer_created"
    character_transfer = CharacterTransfer.find(character_transfer_id)
    game_account = character_transfer.game_account
    user = game_account.user
    options = default_options(user, game_account)

    return user.id, user.email, template_name, options
  end

  def character_transfer_completed(character_transfer_id)
    template_name = "character_transfer_completed"
    character_transfer = CharacterTransfer.find(character_transfer_id)
    game_account = character_transfer.game_account
    user = game_account.user
    options = default_options(user, game_account)

    return user.id, user.email, template_name, options
  end

  def character_transfer_errored(character_transfer_id)
    template_name = "character_transfer_errored"
    character_transfer = CharacterTransfer.find(character_transfer_id)
    game_account = character_transfer.game_account
    user = game_account.user
    options = default_options(user, game_account)

    return user.id, user.email, template_name, options
  end

  def referral(referral_id)
    template_name = "referral"
    referral = Referral.find(referral_id)

    external_code = ExternalCode.first_unused

    if external_code
      external_code.use_code! referral
    end

    user = referral.user
    options = default_options(user, referral.game_account)
    options.merge!(:refermessage => referral.message, :refercharacter => referral.character_name, :referserver => referral.server, :referid => referral.obfuscated_id, :external_code => (external_code ? external_code.code : nil), :refername => referral.sender)

    return referral.user_id, referral.email, template_name, options
  end

  protected
    def default_options(user, gacct)
      {
        :name              => user.screen_name_no_temp,
        :language          => user.language,
        :game_account_name => gacct.account_name
      }
    end
end