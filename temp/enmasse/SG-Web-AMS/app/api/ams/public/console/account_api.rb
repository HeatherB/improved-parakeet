module AMS
  module Public
    module Console
      class AccountAPI < AMS::Public::BaseAPI
        desc 'Link Account'
        params do
          requires :access_token, type:String
          requires :email, type: String
          requires :password, type: String
          requires :game_code, type: String
          optional :dry_run, type: Boolean, default: false
        end
        post 'link_account' do
          doorkeeper_authorize! :console

          ActiveRecord::Base.transaction do

            # find target game
            game = Game.find_by_name(params["game_code"])
            error!({:error_code => "game_not_found", :error_message => "Target game doesn't exist"}, 404) if !game.present?

            # find current user
            user = User.find(doorkeeper_token.resource_owner_id)

            # find current account
            account = user.game_accounts.where(:game_id => game.id).first
            error!({:error_code => "already_moved", :error_message => "Game account already moved"}) if !account.present?

            # find target user
            target_user = User.find_by_email(params["email"])
            error!({:error_code => "mismatch", :error_message => "Mismatch"}) if !target_user.present?
            error!({:error_code => "mismatch", :error_message => "Mismatch"}) if !target_user.authenticated?(params["password"])

            # make sure this user doesn't have game account for the target game
            accounts = target_user.game_accounts.where(:game_id => game.id)
            error!({:error_code => "already_linked", :error_message => "Target user already have link"}) if accounts.count > 0

            # do this only if this is NOT dry-mode
            if !params["dry_run"]
              # replace user of current game account
              account.user_id = target_user.id
              account.save!

              # insert linkage record
              link = ConsoleAccountLink.new({:source_user_id => user.id, :game_id => game.id, :target_user_id => target_user.id})
              link.save!
            end

            success!({success: true, target_user_screen_name: target_user.screen_name, target_user_email: target_user.email})
          end
        end

        desc 'UnLink Account'
        params do
          requires :access_token, type:String
          requires :game_code, type: String
        end
        post 'unlink_account' do
          doorkeeper_authorize! :console

          ActiveRecord::Base.transaction do

            # find target game
            game = Game.find_by_name(params["game_code"])
            error!({:error_code => "game_not_found", :error_message => "Mismatch"}) if !game.present?

            # find current user
            user = User.find(doorkeeper_token.resource_owner_id)

            # make sure this user doesn't have game account for the target game
            accounts = user.game_accounts.where(:game_id => game.id)
            error!({:error_code => "already_unlinked", :error_message => "Game account already unlinked"}) if accounts.count > 0

            # find relevant link record
            link = ConsoleAccountLink.where({:source_user_id => user.id, :game_id => game.id}).first
            error!({:error_code => "already_unlinked", :error_message => "Game account already unlinked"}) if !link.present?

            # find target user
            target_user = User.find(link.target_user_id)
            error!({:error_code => "target_user_not_found", :error_message => "Target user not found"}) if !target_user.present?

            # make sure target user have the game account
            account = target_user.game_accounts.where(:game_id => game.id).first
            error!({:error_code => "already_moved", :error_message => "Target account already moved"}) if !account.present?

            # replace user of current game account
            account.user_id = user.id
            account.save!

            # delete linkage record
            link.destroy

          end

          success!({success: true})
        end
      end

      # class GameNotFound < StandardError; end
      # class TargetUserNotFound < StandardError; end
      # class GameAccountNotFound < StandardError; end
      # class GameAccountAlreadyExist < StandardError; end
      # class UserNotEligibleForAccountLink < StandardError; end
      # class EmailPasswordMismatch < StandardError; end
    end
  end
end