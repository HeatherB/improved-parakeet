class GamePortalController < ApplicationController
  caches_action :index
  caches_action :elections, :expires_in => 1800
  caches_action :guild_battles_leaderboard, :expires_in => 1800,
                :cache_path => proc { "lb/guild_battles_leaderboard/#{params[:board]}" }
      
  caches_action :instance_runs_leaderboard, :expires_in => 1800
  
  skip_before_filter :find_page, :find_pages_for_menu, :refinery_user_required?
  layout "blank_with_navbar"
  
  before_filter :log_it, :if => proc { tera_user_signed_in? }, :except => [:guild_logo]
  
  def index
    @dungeons = Dungeon.where(:dungeon_id => [9724, 9725, 9773, 9775, 9776]).order(:dungeon_name).all
  end
  
  def elections
    record_last_updated_at
    @message = Rails.cache.fetch('game-portal-elections-message') do
      begin
        Refinery::Page.find("game-portal-elections-message")
      rescue
        "none"
      end
    end
    @message = nil if @message == "none"
    @server_names = []
    @continent_names = []
    @election = Election.now
    @campaigns = nil
    @vanarchs = nil
    if @election.state == :reign
      @vanarchs = Rails.cache.fetch('vanarchs', :expires_in => 3600) do
        Vanarch.where(:vanarch_round => @election.round).all
      end
    else
      @campaigns = Rails.cache.fetch('campaigns', :expires_in => 300) do
        Campaign.where(:vanarch_round => @election.round - 1).all
      end
    end
    
    @server_names = Campaign.server_dropdown
    @continent_names = Campaign.continent_dropdown
    render :layout => "application"
  end
  
  def guild_battles_leaderboard
    record_last_updated_at
    #sample data for layout work while waiting for the real tables -cr-
    @server_name = params[:server]
    @server_name = "all" if @server.nil?
    
    @board = params[:board] || "wins"
    
    @guilds = if( @board == "battles")
      Guild.most_battles(@server_name, 100)
    elsif( @board == "points")
      Guild.most("battle_points", @server_name, 100)
    else
      Guild.most("battle_wins", @server_name, 100)
    end
    
    @guild_count = @guilds.length > 2 ? 3 : @guilds.length
    
    if( @board == "battles")
      render "guild_battles"
    elsif( @board == "points")
      render "guild_battle_points"
    else
      render "guild_battle_wins"
    end
  end
  
  def account_guild_battles_leaderboard
    if(session['account_id'].nil?)
      render :text => {"guilds" => [] }.to_json and return
    end
    
    board = params[:board] || "wins"
    characters = Character.all_for_master_account(session['account_id'])
    lookup = Guild.where(:guild_id => characters.collect{|c| c.guild_id}.uniq).includes(:server)
    if board == "wins"
      lookup.order("battle_wins desc")
    elsif board == "points"
      lookup.order("battle_points desc")
    end
    guilds = lookup.all
    if board == "battles"
      guilds.sort!{|a,b| b.total_battles <=> a.total_battles }
    end
    guilds.each do |g|
      g.set_server_name
      g.set_rank(board)
    end
    
    render :text => {"guilds" => guilds }.to_json
  end

  def instance_runs_leaderboard
    record_last_updated_at
    @dungeons = Dungeon.where(:dungeon_id => [9724, 9725, 9773, 9775, 9776]).order(:dungeon_name).all
    @current_dungeon = @dungeons.select{|d| d.clean_name == params[:dungeon]}[0]
    raise RuntimeError, "DUNGEON NOT FOUND! [#{params[:dungeon]}]" if @current_dungeon.nil?
    @board = params[:board] || "fastest"
    
    if @board == "completions"
      @runs = InstanceRunTotal.most(@current_dungeon.id)
      render "most_instance_runs_leaderboard"
    else
      redirect_to "/data/leaderboards/dungeons/#{params[:dungeon]}/completions"
    #  @runs = Instance.fastest(@current_dungeon.id, 100)
    #  render "fastest_instance_runs_leaderboard"
    end
  end
  
  def account_instance_runs_leaderboard
    if(session['account_id'].nil?)
      #raise RuntimeError, "Account ID not found"
      render :text => {}.to_json and return
    end
    dungeons = Dungeon.where(:dungeon_id => [9724, 9725, 9773, 9775, 9776]).order(:dungeon_name).all
    current_dungeon = dungeons.select{|d| d.clean_name == params[:dungeon]}[0]
    raise RuntimeError, "DUNGEON NOT FOUND! [#{params[:dungeon]}]" if current_dungeon.nil?
    board = params[:board] || "fastest"
    
    characters = Character.all_for_master_account(session['account_id'])
    render :text => {"runs" => []}.to_json and return if characters.empty?
    
    runs = if board == "completions"
      InstanceRunTotal.most_for_characters(characters, current_dungeon.id, board)
    else
      Instance.fastest_for_characters(characters, current_dungeon.id)
    end
    runs.each{ |r| r.set_rank(current_dungeon.id, board) }
    
    runs.collect!{|r| {"character_name" => r.character.name, "server_name" => r.character.server.name, "rank" => r.rank, board.to_s => r.send(board.to_sym)} }
    render :text => {"runs" => runs}.to_json
  end
  
  def guild_logo
    g = Guild.find(params[:id])
    send_data(g.logo, :filename => "guild.bmp", :type => "image/bmp")
  end
  
  private
  def log_it
    curtime = Time.now.utc
    filename = "#{HOSTNAME}_leaderboard_views_#{curtime.strftime('%Y_%m_%d')}"
    File.open(File.join(Rails.root, "log", filename), "a"){ |f|
      f.puts "#{curtime.strftime('%Y-%m-%d %H:%M:%S')} \"#{request.fullpath}\" #{session['account_id']}"
    }
  end
  
  def record_last_updated_at
    lookup = Character.connection.select_one("select max(processed_date) AS last_updated_at from etl_processed_tables")
    @last_updated_at = lookup["last_updated_at"] ? lookup["last_updated_at"] : nil
  end
  
  HOSTNAME = `hostname`.strip
end
