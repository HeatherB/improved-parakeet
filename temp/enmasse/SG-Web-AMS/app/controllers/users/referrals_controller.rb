class Users::ReferralsController < ApplicationController
  include ActionView::Helpers::SanitizeHelper
  extend ActionView::Helpers::SanitizeHelper::ClassMethods

  before_filter :login_required, :except => :show
  before_filter :referral_requirements, :only => :new
  before_filter :set_current_app

  def new
    @user = current_user

    @referral = Referral.new
    @game_accounts = current_user.game_accounts
    @referrals = Referral.find_all_by_user_id(current_user.id, :order => 'created_at DESC')

    begin
      # @servers = @user.all_characters
      @servers = GameServer.all_in_hash(@user.game_accounts.first)
      @active_servers = @user.game_accounts.first.active_servers
    rescue => e
      render :text => e.message
      # redirect_to users_account_path
      return
    end
  end

  def create
    @user = current_user

    if @user.email == params[:referral][:email]
      return render :json => { :status => 'redirect', :url => new_users_referral_path, :error => tslt('referral you cannot refer yourself')}
    end

    unless Referral.user_can_invite?(@user)
      return render :json => { :status => 'redirect', :url => users_account_path, :error => tslt('referral rate limited') }
    end

    @game_account = current_user.game_accounts.find_by_id(GameAccount.unobfuscated_id(params[:referral][:game_account_id])) || nil

    p = params[:referral]
    p.each { |k,v| p[k] = strip_tags(v) }
    p[:message] = tslt("referral default email") unless p[:message].length > 0
    p[:message] = p[:message].slice(0,300)
    p[:sender] = p[:sender].slice(0,20)
    @referral = Referral.new(p)

    if @game_account.nil?
      render :json => { :status => 'redirect', :url => new_users_referral_path, :error => tslt('referral you must choose a character')}
      return
    end

    @referral.game_account_id = @game_account.id
    @referral.user_id = @game_account.user.id
    @referral.save

    render :json => { :status => 'success' }
  end

  def show
    unless current_user
      render :text => 'error - need to log in'
      return
    end

    @referral = Referral.find_by_id_and_user_id(Referral.unobfuscated_id(params[:id]),current_user.id)
    render :partial => 'referral_status_modal', :locals => { :referral => @referral }
  end

  def gacct_character
    @game_account = current_user.game_accounts.find(GameAccount.unobfuscated_id(params[:id]))
    @servers = GameServer.all_in_hash(@game_account)
    @active_servers = @game_account.active_servers
    @servers = @active_servers.map{ |s| @servers[s] }

    raise Referral::NoCharactersForAccount if @game_account.characters.count == 0

    render :json => { 'status' => 'success',
                      'html' => render_to_string(:partial => 'users/referrals/game_account_characters',
                                                 :locals => { :servers => @servers }) }
  rescue Referral::NoCharactersForAccount => e
    render :json => { 'status' => 'failure', 'html' => tslt(e.message) }
  # rescue => e
  #   render :json => { 'status' => 'failure', 'html' => tslt('referral generic character retrieval error') }
  end

  def resend_email
    @referral = Referral.find(Referral.unobfuscated_id(params[:id]))
    @referral.resend! if @referral.can_resend?

    render :json => { 'status' => 'success' }
  end

  private

  def set_current_app
    @current_app = "referrals"
  end

  def referral_requirements
    unless current_user.able_to_refer?
      flash[:error] = tslt('not qualified to refer friends')
      redirect_to users_account_path
    end
  end
end
