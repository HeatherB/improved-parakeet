class Users::MigrationController < ApplicationController
  before_filter :login_required

  class MigrationError < RuntimeError
  end

  class UndefinedGameError < MigrationError
  end

  class AlreadyMigratedFromEmeError < MigrationError
  end

  class AlreadyMigratedFromAeriaError < MigrationError
  end

  class FailedToGenerateRandomTokenError < MigrationError
  end

  class InvalidTokenError < MigrationError
  end

  class InvalidTokenFormatError < MigrationError
  end

  class NotSuccessResponseError < MigrationError
  end

  class NoMatchingMigrationDataError < MigrationError
  end

  class UserInformationMismatchingError < MigrationError
  end

  class MissingTokenError < MigrationError
  end

  class InternalError < MigrationError
  end

  class NoAvaAccountInAeriaError < MigrationError
  end

  def start
    begin
      # debug code: emulate error cases
      raise UndefinedGameError if params[:test].to_i == 1
      raise FailedToGenerateRandomTokenError if params[:test].to_i == 2
      raise AlreadyMigratedFromEmeError if params[:test].to_i == 3

      # check 'game' parameter
      raise UndefinedGameError if params[:game].nil? || params[:game].downcase != 'ava'

      # check if the user was already migrated
      migration = AvaAccountMigration.where(user_id: current_user.id).first
      if migration && migration.completed == true
        # already migrated
        raise AlreadyMigratedFromEmeError
      else
        if migration.nil?
          migration         = AvaAccountMigration.new
          migration.user_id = current_user.id
        end

        if migration.random_token.nil?
          # generate a new random token
          success = false
          10.times do
            migration.random_token = AVA::Migration.generate_random_token
            if migration.save
              success = true
              break
            end
          end

          raise FailedToGenerateRandomTokenError.new(migration.errors.full_messages.clone.to_sentence) if success == false
        end

        # encrypt random token
        encrypted_random_token     = AVA::Migration.encrypt_string(migration.random_token)

        # make a url to reach out AERIA GAME's migration start page
        @aeria_migration_start_url = SECURE_CONFIG['ava']['migration']['start_url'] + "?token=#{CGI::escape(encrypted_random_token)}"
      end
    rescue FailedToGenerateRandomTokenError => e
      flash[:error] = "failed to generate a random token (#{e})"
      redirect_to users_account_path
    rescue UndefinedGameError
      flash[:error] = "Undefined game parameter '#{params[:game]}' passed"
      redirect_to users_account_path
    rescue AlreadyMigratedFromEmeError
      # already migrated
      flash[:error] = 'Your account already has been migrated.'
      redirect_to users_account_path
    end
  end

  def success
    begin
      # debug code: emulate error cases
      return render if params[:test].to_i == 1
      raise MissingTokenError if params[:test].to_i == 2
      raise InvalidTokenError if params[:test].to_i == 3
      raise InvalidTokenFormatError if params[:test].to_i == 4
      raise NotSuccessResponseError if params[:test].to_i == 5
      raise NoMatchingMigrationDataError if params[:test].to_i == 6
      raise AlreadyMigratedFromAeriaError if params[:test].to_i == 7
      raise AlreadyMigratedFromEmeError if params[:test].to_i == 8
      raise UserInformationMismatchingError if params[:test].to_i == 9
      raise UndefinedGameError if params[:test].to_i == 10
      raise GameAccount::NoPromotionError if params[:test].to_i == 11
      raise InternalError if params[:test].to_i == 12
      raise NoAvaAccountInAeriaError if params[:test].to_i == 13

      # check 'game' parameter
      raise UndefinedGameError if params[:game].nil? || params[:game].downcase != 'ava'

      # decrypt token
      raise MissingTokenError if params[:token].nil?
      begin
        response_from_aeria = AVA::Migration.decrypt_string(params[:token])
      rescue OpenSSL::Cipher::CipherError
        raise InvalidTokenError
      end

      # response_from_aeria format:
      #   "SUCCESS:RANDOM_TOKEN:USN"
      response = response_from_aeria.split(':')
      raise InvalidTokenFormatError if response.count != 3

      success, random_token, ava_usn = response
      raise NotSuccessResponseError if (success.to_i rescue 0) != 1
      ava_usn = ava_usn.to_i rescue 0
      raise NoAvaAccountInAeriaError if ava_usn == 0

      # find migration data using random_token
      migration                          = AvaAccountMigration.where(random_token: random_token).first
      migration.last_response_from_aeria = response_from_aeria
      migration.save
      begin
        raise NoMatchingMigrationDataError if migration.nil?
        raise AlreadyMigratedFromEmeError if migration.completed == true
        raise UserInformationMismatchingError if migration.user_id != current_user.id

        # find migration data using ava_usn, if found then raise error
        migration_by_aeria_uid = AvaAccountMigration.where(ava_usn: ava_usn).first
        raise AlreadyMigratedFromAeriaError if migration_by_aeria_uid && migration_by_aeria_uid.user_id != migration.user_id

        if params[:confirm] == '1'
          ava_game         = Game.find_by_name('AVA')
          ava_game_account = current_user.game_accounts.where(game_id: ava_game.id).first

          if ava_game_account.nil?
            # it can throw
            #   GameAccount::NoPromotionError
            #   GameAccount::AlreadyExistError
            begin
              GameAccount.auto_account_creation(current_user, true, '/', ava_game, 'auto_creation_ava_migration',
                                                true, raise_exception: true)
            rescue GameAccount::AlreadyExistError
              # ignore this error, because the user already has the game account
            end
            ava_game_account = current_user.game_accounts.where(game_id: ava_game.id).first
          end

          if ava_game_account
            migration.game_account_id = ava_game_account.id

            ava_gametools_client = GameTools::AVA::API.new
            case ava_gametools_client.check_membership_status(ava_game_account.id)['status']
              when 'not_registered'
                # create a new mapping
                res                             = ava_gametools_client.create_mapping(ava_game_account.id, ava_usn)
                migration.last_response_from_sp = res.to_json
                raise InternalError if res['error_code']
              when 'registered_from_eme'
                # update the existing mapping
                res                             = ava_gametools_client.update_mapping(ava_game_account.id, ava_usn)
                migration.last_response_from_sp = res.to_json
                raise InternalError if res['error_code']
              when 'registered_from_aeria'
                # INTERNAL_ERROR: already migrated in AVA_GT_MEMBER, we should manually fix the problem in the database
                raise InternalError
            end
          end

          migration.ava_usn    = ava_usn
          migration.completed  = true
          migration.last_error = nil
          unless migration.save
            flash[:error] = migration.errors.full_messages.clone.to_sentence
            return redirect_to users_migration_start_path(game: params[:game])
          else
            flash[:notice] = 'Migration completed'
            return redirect_to users_account_path
          end
        else
          # render confirmation page
          @migration_confirmation_url = users_migration_success_path(game: params[:game], token: params[:token], confirm: 1)
        end
      rescue Exception => e
        backtrace            = Utils::clean_trace(e.backtrace).join("\n")
        migration.last_error = "#{e}, backtrace:\n#{backtrace}"
        migration.save
        raise e
      end
    rescue GameAccount::NoPromotionError
      flash[:message_title] = 'Creating game account failed'
      flash[:message_body]  = 'System is not properly configured to create a game account. Please retry later.'
      flash[:message_class] = :error
      redirect_to users_migration_start_path(game: params[:game])
    rescue MissingTokenError
      flash[:message_title] = 'Missing token'
      flash[:message_body]  = '"token" parameter is missing. Please click the "Begin Account Migration" button to retry.'
      flash[:message_class] = :error
      redirect_to users_migration_start_path(game: params[:game])
    rescue InvalidTokenError
      flash[:message_title] = 'Invalid token'
      flash[:message_body]  = 'The passed token was invalid.'
      flash[:message_class] = :error
      redirect_to users_migration_start_path(game: params[:game])
    rescue InvalidTokenFormatError
      flash[:message_title] = 'Unknown token format'
      flash[:message_body]  = 'The passed token has unknow format.'
      flash[:message_class] = :error
      redirect_to users_migration_start_path(game: params[:game])
    rescue NotSuccessResponseError
      flash[:message_title] = 'Not a success response'
      flash[:message_body]  = 'Not a success response was received.'
      flash[:message_class] = :error
      redirect_to users_migration_start_path(game: params[:game])
    rescue NoMatchingMigrationDataError
      flash[:message_title] = 'An existing AVA game account could not be found.'
      flash[:message_body]  = 'We could not find an existing AVA game account associated with the Aeria Games account you provided.'
      flash[:message_list]  = '<ul><li>If you would like to try a different Aeria Games account, click "Try Again".</li><li>If you have not created an AVA character on the Aeria Games account you provided, you will not be able to migrate that account.</li></ul>'
      flash[:message_class] = :error
      redirect_to users_migration_start_path(game: params[:game])
    rescue AlreadyMigratedFromAeriaError
      flash[:message_title] = 'Your AVA account has already been linked to a different En Masse account than the account that is currently logged in.'
      flash[:message_body]  = 'You have two options:'
      flash[:message_list]  = '<ul><li>If you believe you received this message in error, you can attempt to transfer the account again; or</li><li>If you have another En Masse account which might be linked to your AVA account, click "Cancel", then log into the other En Masse account and attempt the migration again.</li></ul>'
      flash[:message_class] = :error
      redirect_to users_migration_start_path(game: params[:game])
    rescue AlreadyMigratedFromEmeError
      flash[:error] = 'Your account already has been migrated.'
      redirect_to users_account_path
    rescue UserInformationMismatchingError
      flash[:message_title] = 'User information mismatching'
      flash[:message_body]  = 'User information from the passed token does not matching with the game account.'
      flash[:message_class] = :error
      redirect_to users_migration_start_path(game: params[:game])
    rescue NoAvaAccountInAeriaError
      flash[:message_title] = 'No Ava account information'
      flash[:message_body]  = 'No Ava account information was returned from Aeria Games.'
      flash[:message_class] = :error
      redirect_to users_migration_start_path(game: params[:game])
    rescue InternalError
      flash[:message_title] = 'Internal Error occurred'
      flash[:message_body]  = 'Please contact support to solve this problem.'
      flash[:message_class] = :error
      redirect_to users_migration_start_path(game: params[:game])
    rescue UndefinedGameError
      flash[:error] = "Undefined game parameter '#{params[:game]}' passed"
      redirect_to users_account_path
    end
  end

  def error
    begin
      # check 'game' parameter
      raise UndefinedGameError if params[:game].nil? || params[:game].downcase != 'ava'

      # check if the user was already migrated
      migration = AvaAccountMigration.where(user_id: current_user.id).first
      if migration && migration.completed == true
        # already migrated
        raise AlreadyMigratedFromEmeError
      else
        if migration.nil?
          migration         = AvaAccountMigration.new
          migration.user_id = current_user.id
          unless migration.save
            flash[:error] = migration.errors.full_messages.clone.to_sentence
            return redirect_to users_migration_start_path(game: params[:game])
          end
        end

        if migration.random_token.nil?
          # generate a new random token
          success = false
          10.times do
            migration.random_token = AVA::Migration.generate_random_token
            if migration.save
              success = true
              break
            end
          end

          raise FailedToGenerateRandomTokenError if success == false
        end

        # encrypt random token
        encrypted_random_token     = AVA::Migration.encrypt_string(migration.random_token)

        # make a url to reach out AERIA GAME's migration start page
        @aeria_migration_start_url = SECURE_CONFIG['ava']['migration']['start_url'] + "?token=#{CGI::escape(encrypted_random_token)}"
      end
    rescue FailedToGenerateRandomTokenError
      flash[:error] = 'failed to generate a random token'
      redirect_to users_account_path
    rescue UndefinedGameError
      flash[:error] = "Undefined game parameter '#{params[:game]}' passed"
      redirect_to users_account_path
    rescue AlreadyMigratedFromEmeError
      # already migrated
      flash[:error] = 'Your account already has been migrated.'
      redirect_to users_account_path
    end
  end

end