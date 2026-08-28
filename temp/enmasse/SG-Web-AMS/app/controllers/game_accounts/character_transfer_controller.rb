class GameAccounts::CharacterTransferController < ApplicationController
  before_filter :login_required
  before_filter :set_current_app
  before_filter :set_global_alerts, :only => :new

  def new
    game_account_id = GameAccount.unobfuscated_id(params[:game_account_id])
    @game_account = current_user.game_accounts.find game_account_id

    @transfers = @game_account.character_transfers.reverse

    # (robin) Makes a hash that looks like { server_id => [ array_of_character_ids ] } for easy lookup
    @in_progress_transfers = {}
    @transfers.select{ |transfer| [ CharacterTransfer::PROGRESS, CharacterTransfer::PENDING ].include?(transfer.status) }.each do |transfer|
      server_id = transfer.from_server_id
      @in_progress_transfers[server_id] ||= []
      @in_progress_transfers[server_id] << transfer.character_id
    end

    @character_transfer = CharacterTransfer.new :status => CharacterTransfer::ERROR

    begin
      @servers = GameServer.all_with_characters current_user.game_accounts.find game_account_id
    rescue
      flash[:error] = "Unable to establish connection to the transfer servers, please try again later"
      return redirect_to users_account_path
    end

    unless @servers
      flash[:error] = "There was an error retrieving your account information, please try again later"
      Rails.logger.error "CharacterTransfer Logging - Could not get server list from SLS, possible service down or unreachable"
      return redirect_to users_account_path
    end

    begin
      @normal_purchase_info = CharacterTransfer.get_paid_server_transfer_normal_purchase_info
      @elite_purchase_info = CharacterTransfer.get_paid_server_transfer_elite_purchase_info
      @purchase_info = CharacterTransfer.get_paid_server_transfer_purchase_info current_user, game_account_id
      if @purchase_info.nil?
        raise RuntimeError.new "purchase_info is not ready."
      end
    rescue => e
      flash[:error] = "There was an error retrieving purchase information, please try again later"
      Rails.logger.error e.message + "\n " + e.backtrace.join("\n ")
      return redirect_to users_account_path
    end
  rescue ActiveRecord::RecordNotFound
    flash[:error] = "That is not a valid game account"
    return redirect_to users_account_path
  end

  def create

    @game_account = current_user.game_accounts.find GameAccount.unobfuscated_id(params[:game_account_id])

    transfer_params = params[:character_transfer]
    transfer_params.each{ |k,v| transfer_params[k] = v.strip }

    @character_transfer = @game_account.character_transfers.build({ :character_id => transfer_params[:character_id],
                                                                    :from_server_id => transfer_params[:from_server_id],
                                                                    :to_server_id => transfer_params[:to_server_id],
                                                                    :character_name => transfer_params[:character_name],
                                                                    :from_server_name => transfer_params[:from_server_name],
                                                                    :to_server_name => transfer_params[:to_server_name],
                                                                    :status => CharacterTransfer::PENDING })

    if @character_transfer.save
      @character_transfer.queue_fulfillment
      render :partial => 'game_accounts/character_transfer/transfer_status_popup',
             :locals => { :character_transfer => @character_transfer }
    else
      render :text => false
    end
  end

  def check_eligibility
    @game_account = current_user.game_accounts.find GameAccount.unobfuscated_id(params[:game_account_id])
    @transfer = CharacterTransfer.new({ :character_id => params[:character_srl],
                                        :from_server_id => params[:server_id],
                                        :game_account_id => @game_account.id })

    eligibility = @transfer.check_eligibility
    eligibility.map!{ |e| tslt(e) } if eligibility.is_a?(Array)
    render :json => eligibility
  end

  def status_popup
    @game_account = current_user.game_accounts.find GameAccount.unobfuscated_id(params[:game_account_id])
    @character_transfer = @game_account.character_transfers.find params[:id]

    render :partial => 'game_accounts/character_transfer/transfer_history_popup', :locals => { :character_transfer => @character_transfer, :game_account => @game_account }
  end

  private

  def set_current_app
    @current_app = "character_transfer"
  end
end
