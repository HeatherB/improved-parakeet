class GameAccountsController < ApplicationController
  before_filter :login_required

  def characters
    @game_account = current_user.game_accounts.find(GameAccount.unobfuscated_id(params[:id]))
    @servers = GameServer.all_in_hash(@game_account)
    @characters = @game_account.characters

    @characters.map!{|character| character['server_name'] = @servers[character['server_id']].name; character}

    render :json => @characters
  end
  
  def add
    game = Game.find(params[:id])
    redir = "/users/account"
    if game && game.deleted == false
      redir = GameAccount.auto_account_creation(current_user, true, redir, game)
      flash[:notice] = "Adding #{game.name} to your account, this could take a couple seconds."
    else
      flash[:error] = "Can not add that game."
    end
    redirect_to redir
  end
end
