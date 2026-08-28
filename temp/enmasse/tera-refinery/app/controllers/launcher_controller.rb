require './lib/game_adapter'

class LauncherController < ApplicationController
  skip_filter :age_gate_check
  
  layout 'launcher'
  
  def welcome
    render :text => "NOT LOGGED IN!" if !setup_launcher
  end
  
  def index
    setup_launcher
    render :"launcher/welcome"
  end
  
  def setup_launcher
    # Test data
    if Rails.env != "production" && params[:class]
      @character = {
        "character" => {
          "srl" => 73,
          "name" => "Captain.Placeholder",
          "gender" => "Female",
          "race" => "Elin",
          "class" => params[:class],
          "level" => params[:level],
          "server_id" => 4025,
          "game_account_id" => 23,
          "user_id" => 110
        }
      }
    end

    @insecure_sso_ticket = cookies['_ssot']
    @secure_sso_ticket = cookies['serialized']
    # @rss_feeds = LauncherFeeds.all
    if @secure_sso_ticket
      sso_ticket = @secure_sso_ticket
      sso_ticket_type = 'sso'
    elsif @insecure_sso_ticket
      sso_ticket = @insecure_sso_ticket
      sso_ticket_type = 'sso_insecure'
    else
      return false
    end
    #logger.error "SESSION:::"
    #logger.error session.inspect

    if sso_ticket
      adapter = ::GameAdapter.new("#{SimpleSSO::AUTH_SERVICE}:#{SimpleSSO::AUTH_PORT}")
      #Rails.logger.error( adapter.inspect )
      #Rails.logger.error( { ticket: sso_ticket, tt: sso_ticket_type }.inspect )
      res = adapter.make_request(:sso_ticket_verify, { :ticket => sso_ticket }, { :tt => sso_ticket_type }, [], {:timeout => 5, :open_timeout => 5})
      #Rails.logger.error res.inspect
      parsed_res = JSON.parse(res)

      # Structure of parsed_res
      # {
      #  :id => ...,
      #  :email => ...,
      #  :screen_name => ...,
      #  :account_status => ...,
      #  :game_accounts => [
      #    {
      #      :id => ...,
      #      :name => ...,
      #      :founder => ...,
      #      :subscription_active => ...,
      #    },
      #    ...
      
      #res = adapter.make_request(:sso_ticket_verify, { :ticket => '9NPAlkizYXXDaayxniv5rmohou4CeYfen5qktDe5wmoz9qeHDXEyYKa3l-ktRfJt'}, { :tt => 'sso_insecure' }, [], {:timeout => 5, :open_timeout => 5})
      #  ]
      #  :temp_screen_name => ...,
      #  :languate => ...,
      #  :optional => {
      #    :user_id =>
      #    :game_account_id => ...,
      #    :server_id => ...,
      #    :character_id => ...,
      #  }
      # }

      @user_id          = parsed_res["id"]
      @user_email       = parsed_res["email"]
      @screen_name      = parsed_res["screen_name"]
      if parsed_res["optional"]
        @game_account_id  = parsed_res["optional"]["game_account_id"]
        @server_id        = parsed_res["optional"]["server_id"]
        @character_id     = parsed_res["optional"]["character_id"]
        game_account_info = parsed_res["game_accounts"].select { |gacct| gacct["id"] == @game_account_id }
        if game_account_info.length > 0
          @elite_status     = game_account_info[0]["subscription_active"]
        end
        puts "#{@character_id} && #{@server_id}"
        if @character_id && @server_id
          @character = TeraGame.character_find(@character_id, @server_id)
          puts @character.inspect
        end
      end
      return true
    end
  end
end
