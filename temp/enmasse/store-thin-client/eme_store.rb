require 'bundler/setup'
require 'sinatra'
require "sinatra/activerecord"
require 'sinatra/sprockets-helpers'
require 'compass'
require 'cgi'
require 'sinatra/support'
require './lib/monkey_patch'
require './lib/billing_data'
require './lib/steam_api'
require './lib/pay_letter_issues_logger'
require './lib/issue_logger'
require 'eme_services_client'
require 'eme_global_assets'
require './lib/ams_api_client_helper'
require 'json'

require "sinatra/reloader" if development?

require 'digest/sha1'

configure :production do
  require 'newrelic_rpm'
end

SECURE_CONFIG = YAML.load_file('config/secure_config.yml')

def get_or_post(path, opts={}, &block)
  get(path, opts, &block)
  post(path, opts, &block)
end

class EMEStore < Sinatra::Base
  require 'logger'

  #register Sinatra::Synchrony
  require File.dirname(__FILE__) + '/lib/simple_sso'
  require 'rack/session/dalli'
# upgraded the flash#  require 'sinatra/flash'
  require 'rack-flash'
  require 'sinatra/redirect_with_flash'
 # require 'sinatra/cookies'

  #require "./config/general"
  require File.dirname(__FILE__) + "/config/#{Sinatra::Application.environment}"
  require File.dirname(__FILE__) + '/lib/tera_sso'
  require File.dirname(__FILE__) + '/lib/tera_item'
  require File.dirname(__FILE__) + '/lib/gifting'
  require File.dirname(__FILE__) + '/lib/tera_game'
  require File.dirname(__FILE__) + '/lib/easy_hash'
  require "sass"

  configure :production, :qa, :edge do
    #allow Airbrake to record errors
    require 'airbrake'

    Airbrake.configure do |config|
      config.api_key = '0c01cdb91d09f23d4a28e581d4a62354'
      config.environment_name = ENV['RACK_ENV']
      config.async do |notice| # send errors Async
        Thread.new { Airbrake.sender.send_to_airbrake(notice) }
      end
    end

    use Airbrake::Rack
    enable :raise_errors
  end

  # TODO refactor into chef config
  configure :development, :test do
    register Sinatra::Reloader
    set :logging, nil
    logger = Logger.new STDOUT
    logger.level = Logger::DEBUG
    logger.datetime_format = '%a %d-%m-%Y %H%M '
    $logger = logger
    enable :logging
    set :logger, logger
  end

  configure :qa, :edge do
    set :logging, nil
    logger = Logger.new(File.join('log', "#{Sinatra::Application.environment}.log"))
    logger.level = Logger::DEBUG
    logger.datetime_format = '%a %d-%m-%Y %H%M '
    set :logger, logger
  end

  configure :production, :deployment do
    set :logging, nil
    logger = Logger.new(File.join('log', "#{Sinatra::Application.environment}.log"))
    logger.level = Logger::INFO
    logger.datetime_format = '%a %d-%m-%Y %H%M '
    set :logger, logger

    error do
      File.read(File.join('public', '500.html'))
    end
    not_found do
      File.read(File.join('public', '404.html'))
    end
  end

  class ApiError < Exception; end
  error ApiError do
    @error_title = "Ackkk...  The server is having a heart attack."
    @error = ["We are having an issues"]
    erb :'500', :layout => "layouts/#{@game}_layout".to_sym
  end

  #config asset pipeline
  set :root, File.dirname(__FILE__)
  register Sinatra::CompassSupport
  register Sinatra::ActiveRecordExtension

  set :sprockets, Sprockets::Environment.new(root)
  set :assets_prefix, '/assets'
  set :digest_assets, !development?

  register Sinatra::Sprockets::Helpers

  configure do
    sprockets.append_path File.join(root, 'assets', 'javascripts')
    sprockets.append_path File.join(root, 'assets', 'css')
    sprockets.append_path File.join(root, 'assets', 'images')
    sprockets.append_path File.join(root, 'assets', 'fonts')
    sprockets.cache = Sprockets::Cache::FileStore.new(File.join(root, 'tmp'))
    Compass.sass_engine_options[:load_paths].each do |path|
      sprockets.append_path path.root if path.is_a? Sass::Importers::Filesystem
    end

    unless development?
      sprockets.js_compressor  = :uglifier
      sprockets.css_compressor = :scss
    end
    sprockets.gzip = false

    configure_sprockets_helpers do |helper|
      unless development?
        helper.asset_host  = Proc.new do |uri|
          hosts = AssetConfig::STATIC_ASSET_HOSTS
          host = hosts[Digest::MD5.hexdigest(uri).to_i(16) % hosts.length]
          host.gsub(/^((http|https):)?\/\//, '').gsub(/(:[0-9]+)?\/?$/, '')
        end
        helper.protocol = :relative
      end
      helper.environment = sprockets
      helper.prefix      = assets_prefix
      helper.digest      = digest_assets
      helper.public_path = public_folder
    end
  end

  if development?
    get "/assets/*" do
      env["PATH_INFO"].sub!("/assets", "")
      settings.sprockets.call(env)
    end
  end

  set :assets_path, File.join(public_folder, 'assets')
  set :assets_precompile, %w(
    app.js
    emeqc.js
    steam.js
    potions.js
    tera_dailydeal.js
    tera_giftingwindow.js
    temp.js
    strangerthings.js
    app.scss
    closers.scss
    tera.scss
    eme.scss
    emp.scss
    breach.scss
    strangerthings.scss
    extralife.scss
    elitesub.scss
    blackfridaysales.scss
    blackfridayemp.scss
    gifting.scss
    gifting_front.scss
    closersstore.scss
    gleam.scss
    potions.scss
    tera_dailydeal.scss
    tera_giftingwindow.scss
    tera/ie.css
    gifting/ie.css
    *.ico
    *.png
    *.jpg
    *.jpeg
    *.gif
    *.svg
    *.eot
    *.ttf
    *.woff
    *.woff2
  )

  if StoreAPI.memcache?
    settings.logger.info( "Using memcached." )
    require 'dalli'
    opts = {:secret => AppSettings::SECRET_KEY,
            :secure => false }  # secure is off because we have http behind the load balancer.
    use Rack::Session::Dalli, {:cache => Dalli::Client.new(StoreAPI.memcache_hosts)}.merge(opts)
    set :cache, Dalli::Client.new(StoreAPI.memcache_hosts)
  else
    settings.logger.info( "Memcached disabled." )
    enable :sessions
  end
  set :session_secret, AppSettings::SESSION_SECRET_KEY
  #set :protection, :origin_whitelist => ['http://billing.enmasse.com']
  set :protection, :except => [:http_origin]

  # upgraded Sinatra flash
  #register Sinatra::Flash
  use Rack::Flash
  helpers Sinatra::RedirectWithFlash
  use SimpleSSO

  NO_GAME_ACCOUNT_MESSAGE = "You have no active game accounts. Please visit <a href=\"#{SimpleSSO::ACCOUNT_SERVER_SECURE_URL}\">account management</a> to activate it or contact <a href=\"http://support.enmasse.com/tera\">customer support</a>, then log back in."

  if !production?
    set :show_exceptions, true
  end

  #require models
  ['offsite_transaction'].each do |mod|
    require File.join(".", "models", mod)
  end

  before do
    #settings.logger.debug( "before filter" )
    #settings.logger.debug( "session: #{session.inspect}" )
    #settings.logger.debug( "session: #{session['account_info']['io_result']}" )
    #settings.logger.debug( "request.cookies: #{request.cookies.inspect}" )

    #settings.logger.debug request.path
    unless /^\/(js|css|assets)\// =~ request.path
      @username, @wallet = TeraSSO.setup(session, request.cookies)
      if @username
        game = request.path.split("/")[1]
        @game_accounts = session["account_info"]["game_accounts"].select{|x| x["name"] && x["name"].downcase.include?(game.downcase) } if game
      end

      # check from_steam params
      session['from_steam'] = params['from_steam'] if params['from_steam'].present?
    end

    #settings.logger.debug( "@username: #{@username}" )
    #settings.logger.debug( "@wallet: #{@wallet}" )
    #settings.logger.debug( "session[:screen_name]: #{session[:screen_name]}" )
    #settings.logger.debug( "session[:account_id]: #{session[:account_id]}" )
    #settings.logger.debug( "session[:account_info]: #{session[:account_info]}" )
  end

  def redeemed_before(user_id, group_code)
    begin
      ams_base = SECURE_CONFIG["ams_api"]["host"]
      ams_url = "/api/private/users/#{user_id}/redeemed"
      url = ams_base + ams_url
      token = SECURE_CONFIG["ams_api"]["token"]

      query = {
          "group_code" => group_code
      }

      headers = {
          "Authorization" => "Token token=#{token}"
      }
      response = HTTParty.get(url, :query => query, :headers => headers)

      result = JSON.parse(response.body) rescue {}

      if result["error_code"]
        return false
      end

      if result["redeemed"].present?
        return result["redeemed"]
      end

      return false
    rescue Exception => ex
      settings.logger.debug("in redeemed_before: #{ex.message}, #{ex.backtrace.join("\n")}")
      return false
    end

  end

  get "/?" do
    #redirect ("/tera") # redirect to the only game now.
    erb :index, :layout => :layout
  end

  get "/breach/?" do
     redirect "/"
  end

  get "/gleam" do
    erb :gleam, :layout => false
  end

  get "/apps/heartbeat" do
    return "88MPH"
  end

  get "/emp/?" do
    @game = (params[:game] || "enmasse").downcase
    redirect ("/#{@game}/emp")
  end

  get "/account/emp/?" do
    good_domain = /^https+\:\/\/[^\/]*\.enmasse\.com/.match(request.referrer).to_s.split("//")[1]
    response.headers['Access-Control-Allow-Origin'] = good_domain if good_domain
    return 200, @wallet.EMP[:amount].to_s if @wallet && @wallet.EMP
    return 200, "0" if @username
    return 404
  end

  get '/refresh-user/?' do
    return {loggedIn: false}.to_json if session["account_id"].nil?
    user = TeraSSO.refresh_data(session["account_id"])
    #compare results with session.

    user_account_info = {"screen_name" => user["screen_name"], }

    if session["account_info"]["game_accounts"].collect{|a| "#{a['id']}:#{a['subscription_active']}"}.sort == user["game_accounts"].collect{|a| "#{a['id']}:#{a['subscription_active']}"}.sort
      #The commented-out line below is used for quick dev testing of an account status change
      #return {loggedIn: true, changed: true, drastic: false, accounts: user["game_accounts"].each{|ga| ga["subscription_active"] = true}, hard_coded: true }.to_json if session["account_id"] == 952
      return {loggedIn: true, changed: false}.to_json
    elsif session["account_info"]["email"] != user["email"] || session["account_info"]["game_accounts"].length != user["game_accounts"].length
      return {loggedIn: true, changed: true, drastic: true}.to_json
    else
      SimpleSSO.setup_user_session(user, session)
      return {loggedIn: true, changed: true, drastic: false, accounts: user["game_accounts"] }.to_json
    end
  end

  # backup for no JS on - otherwise using the AMS logout now.
  get "/logout/?" do
    TeraSSO.teardown(session, response)
    if request.referer
      redirect (request.referer.include?("logout") ? "/" : request.referer), :flash => {:message =>  "You have successfully signed out.", :logout => true}
    else
      redirect "/", :flash => {:message =>  "You have successfully signed out.", :logout => true}
    end
  end

  post "/usazips" do
    @check = params["zipcode"]
    @zips = File.read(File.join('public', 'json/usazips.json'))
    @zips = JSON.parse(@zips)
    if @zips.has_key?(@check)
      return @zips[@check].to_json
    else 
      return false
    end
    #return @zips.has_key?(@check).to_s
  end

  post "/canzips" do
    @check = params["zipcode"]
    @zips = File.read(File.join('public', 'json/canzips.json'))
    @zips = JSON.parse(@zips)
    if @zips.has_key?(@check)
      return @zips[@check].to_json
    else 
      return false
    end
    #return @zips.has_key?(@check).to_s
  end

  get "/Closers/items" do
    redirect "/closers/items"
  end

  get "/Kritika/items" do
    redirect "/"
  end
  get "/kritika/items" do
    redirect "/"
  end

  get "/closers/items" do
    @title = "En Masse Store | Closers"
    if session['account_info']
      @gameaccounts = get_game_accounts("Closers")
      if @gameaccounts.length > 0
        @gameaccounts = @gameaccounts[0]["id"]
      else 
        @gameaccounts = 0
      end 
    else 
      @gameaccounts = 0;
    end
    #@code = StoreItem.by_keyword("free", :game_id => 'CLOSERS')
    @items = StoreItem.by_keyword("daily_deals", :game_id => 'CLOSERS')
    @items = StoreItem.sort_items(@items)
    #@category = "loot_boxes"
    #@skip_filter = true;
    erb :closersstore, :layout => false
  end

  

  get "/tera/gifting-window" do
    redirect ("http://store.enmasse.com") #redirect, remove during gifting event
    @title = "Tera Gifting Window"
    @game = "tera"

    @app_styles = "tera_giftingwindow"
    #@app_scripts = "tera_giftingwindow"

    @user = TeraSSO.refresh_data(session["account_id"])

    if @user['id']
      @emp = AMS::API::Client.new.users.get_emp(@user['id']).result
      user_id = @user['id']
    end

    if session['account_info']
      @gameaccounts = get_game_accounts("Tera")
      if @gameaccounts.length > 0
        @gameaccounts = @gameaccounts[0]["id"]
      else 
        redirect ("http://store.enmasse.com/500")
      end 
    else 
      redirect ("http://store.enmasse.com/500")
    end

    # read game_account_id from the in-game window
    # this comment seems wrong this is reading from session variable....
    # I just wanted to add to the conversation with my own comment :(
    game_account_id = @user['optional']['game_account_id'] rescue nil

    if @user.nil? && game_account_id.nil?
      settings.logger.error("------------------ERROR------------------")
      settings.logger.error("ERROR FINDING USER IN TERA GIFTING WINDOW PURCHASE")
      settings.logger.error("@user: #{@user.inspect}")
      return {:error => true, :message => "User and or account not found."}.to_json
    end

    @my_gifts = Gifting.get_gifts(request.cookies["_ssot"], "tera")

    erb :tera_giftingwindow, :layout => "layouts/#{@game}_min_layout".to_sym
  end

  get "/tera/dailydeals-testing" do
    @title = "Internal Testing"

    @game = "tera"

    session["path"] = "dailydeals"
    @app_styles = "tera_dailydeal"
    @app_scripts = "tera_dailydeal"


  #  if session[:account_id] && session["account_info"]["game_accounts"].empty? # logged in and no active accounts
  #    flash[:warn] = NO_GAME_ACCOUNT_MESSAGE
  #  end

    # load basic information from AMS
  #  @user = TeraSSO.refresh_data(session["account_id"])
  #  @game_id = 24
  #  if @user['id']
  #    @emp = AMS::API::Client.new.users.get_emp(@user['id']).result
  #  else
      # return to not logged in page???
  #  end

  #  if session['account_info']
  #    @gameaccounts = get_game_accounts("tera")
  #    if @gameaccounts.length > 0
  #      puts 'AAAAAAAAAAAAAA'
  #      puts 'AAAAAAAAAAAAAAA'
  #      puts @gameaccounts.inspect
  #      puts 'AAAAAAAAAAAAAA'
  #      puts 'AAAAAAAAAAAAAAA'
        #@gameaccounts = @gameaccounts[0]["id"]
  #    else 
  #      @gameaccounts = 0
  #    end 
  #  else 
  #    @gameaccounts = 0;
  #  end


    # alternate section from potion shack to correct game account issue
    @user = TeraSSO.refresh_data(session["account_id"])

    @game = "tera"
    if @user['id']
      @emp = AMS::API::Client.new.users.get_emp(@user['id']).result
      user_id = @user['id']
    end

    # read game_account_id from the in-game window
    # this comment seems wrong this is reading from session variable....
    game_account_id = @user['optional']['game_account_id'] rescue nil

    # if failed, determine game_account_id as user's first game_account
    unless game_account_id
      game_account_id = get_game_accounts(@game)[0]['id'] rescue nil
    end

    @gameaccounts = game_account_id

    #if @user.nil? OR game accounts nil...  we got to get out.
    if @user.nil? && game_account_id.nil?
      settings.logger.error("------------------ERROR------------------")
      settings.logger.error("ERROR FINDING USER IN TERA DAILY DEALS PURCHASE")
      settings.logger.error("@user: #{@user.inspect}")
      settings.logger.error("game_accounts (get_game_accounts(@game): #{get_game_accounts(@game)}")
      return {:error => true, :message => "User and or account not found."}.to_json
    end
    # end alternate section


    # find out if user is elite
    @subs = EME::Subscription.fetch_active(session[:account_id])["subscriptions"]

    # check if user has an active TERA Elite status subscription
    if @username
      @eliteAccount = @game_accounts.select{|account| account['game_id'] == 1 && account['subscription_active'] == true}
      @existing_sub != @eliteAccount.blank?

      # get subscription information if there is an existing subscription
      if @existing_sub
        @sub_info = EME::Subscription.subscription_info_for_game_account(@eliteAccount[0]["id"])
      end
    end

    # find out if currently subscribed to elite
       subs = EME::Subscription.fetch_active(session[:account_id])
       @existing_sub = subs["subscriptions"].select{|x| x["game_account_id"] == @eliteAccount[0]["id"]}[0] if subs["subscriptions"]
    # end find out if user is elite



    @items = StoreItem.by_keyword("daily_deals_internal", :game_id => 'TERA')
    @items = StoreItem.sort_items(@items)

    erb :tera_dailydeals, :layout => "layouts/#{@game}_min_layout".to_sym
  end

  get "/tera/dailydeals" do
    @title = "En Masse Store | TERA | Daily Deals"

    @game = "tera"

    session["path"] = "dailydeals"
    @app_styles = "tera_dailydeal"
    @app_scripts = "tera_dailydeal"


  #  if session[:account_id] && session["account_info"]["game_accounts"].empty? # logged in and no active accounts
  #    flash[:warn] = NO_GAME_ACCOUNT_MESSAGE
  #  end

    # load basic information from AMS
  #  @user = TeraSSO.refresh_data(session["account_id"])
  #  @game_id = 24
  #  if @user['id']
  #    @emp = AMS::API::Client.new.users.get_emp(@user['id']).result
  #  else
      # return to not logged in page???
  #  end

  #  if session['account_info']
  #    @gameaccounts = get_game_accounts("tera")
  #    if @gameaccounts.length > 0
  #      puts 'AAAAAAAAAAAAAA'
  #      puts 'AAAAAAAAAAAAAAA'
  #      puts @gameaccounts.inspect
  #      puts 'AAAAAAAAAAAAAA'
  #      puts 'AAAAAAAAAAAAAAA'
        #@gameaccounts = @gameaccounts[0]["id"]
  #    else 
  #      @gameaccounts = 0
  #    end 
  #  else 
  #    @gameaccounts = 0;
  #  end


    # alternate section from potion shack to correct game account issue
    @user = TeraSSO.refresh_data(session["account_id"])

    @game = "tera"
    if @user['id']
      @emp = AMS::API::Client.new.users.get_emp(@user['id']).result
      user_id = @user['id']
    end

    # read game_account_id from the in-game window
    # this comment seems wrong this is reading from session variable....
    game_account_id = @user['optional']['game_account_id'] rescue nil

    # if failed, determine game_account_id as user's first game_account
    unless game_account_id
      game_account_id = get_game_accounts(@game)[0]['id'] rescue nil
    end

    @gameaccounts = game_account_id

    #if @user.nil? OR game accounts nil...  we got to get out.
    if @user.nil? && game_account_id.nil?
      settings.logger.error("------------------ERROR------------------")
      settings.logger.error("ERROR FINDING USER IN TERA DAILY DEALS PURCHASE")
      settings.logger.error("@user: #{@user.inspect}")
      settings.logger.error("game_accounts (get_game_accounts(@game): #{get_game_accounts(@game)}")
      return {:error => true, :message => "User and or account not found."}.to_json
    end
    # end alternate section


    # find out if user is elite
    @subs = EME::Subscription.fetch_active(session[:account_id])["subscriptions"]

    # check if user has an active TERA Elite status subscription
    if @username
      @eliteAccount = @game_accounts.select{|account| account['game_id'] == 1 && account['subscription_active'] == true}
      @existing_sub != @eliteAccount.blank?

      # get subscription information if there is an existing subscription
      if @existing_sub
        @sub_info = EME::Subscription.subscription_info_for_game_account(@eliteAccount[0]["id"])
      end
    end

    # find out if currently subscribed to elite
       subs = EME::Subscription.fetch_active(session[:account_id])
       @existing_sub = subs["subscriptions"].select{|x| x["game_account_id"] == @eliteAccount[0]["id"]}[0] if subs["subscriptions"]
    # end find out if user is elite



    @items = StoreItem.by_keyword("daily_deals", :game_id => 'TERA')
    @items = StoreItem.sort_items(@items)

    erb :tera_dailydeals, :layout => "layouts/#{@game}_min_layout".to_sym
  end

  get "/breach/early-access-pass" do
    redirect "/"
    #@title = "En Masse Store | Breach"

    #if session[:account_id] && session["account_info"]["game_accounts"].empty? # logged in and no active accounts
    #  flash[:warn] = NO_GAME_ACCOUNT_MESSAGE
    #end

    # load basic information from AMS
    #@user = TeraSSO.refresh_data(session["account_id"])
    #@game_id = 24
    #if @user['id']
    #  @emp = AMS::API::Client.new.users.get_emp(@user['id']).result
    #  @qcpoints = fetch qc points
    #else
      # return to not logged in page???
    #end

    #if session['account_info']
    #  @gameaccounts = get_game_accounts("breach")
    #  if @gameaccounts.length > 0
    #    @gameaccounts = @gameaccounts[0]["id"]
    #  else 
    #    @gameaccounts = 0
    #  end 
    #else 
    #  @gameaccounts = 0;
    #end


    #@code = StoreItem.by_keyword("free", :game_id => 'CLOSERS')
    #@items = StoreItem.by_keyword("daily_deals", :game_id => 'BREACH')
    #@items = StoreItem.sort_items(@items)
    #erb :"purchase-flow/breach/early-access-pass/show", :layout => "breach_layout".to_sym
  end

  get "/strangerthings3thegame" do 
    @game = "st3"
    @show_errors = session.delete(:show_errors)

    @breadcrumbs = [{text: "Store Home", href: "/#{@game}"}]
    @title = "EME Store | Stranger Things 3"

    session[:redirect_url_on_error] = '/strangerthings3thegame'

    erb :"purchase-flow/strangerthings/purchase/show", :layout => "layouts/strangerthings3thegame_layout".to_sym
  end

  get_or_post "/st3/:product_type/confirm" do
    #redirect "/"
    @game = 'st3'

    @product_type = params[:product_type].downcase

    unless ['game-purchase'].include? @product_type
     flash[:error] = "Invalid product_type"
     redirect (session[:redirect_url_on_error] || "/strangerthings3thegame")
    end

    @show_errors = session.delete(:show_errors)

    @breadcrumbs = [{text: "Store Home", href: "/#{@game}"},
                   {text: "ST3 Billing"}]
    @title = "ST3 Billing | #{game_title}"

    if session[:account_id].nil?
     flash[:error] = "Please log in to purchase."
     redirect (session[:redirect_url_on_error] || "/strangerthings3thegame")
    end

    product_id = params[:product_id]

    if product_id.nil?
     flash[:error] = "product has not been chosen."
     redirect (session[:redirect_url_on_error] || "/strangerthings3thegame")
    end

    offers = StoreAPI.offers(@game)

    offer = offers.select { |offer| offer[:OFFERID].upcase == product_id.upcase }.first

    if offer.nil?
     flash[:error] = "Item has not been registered."
     redirect (session[:redirect_url_on_error] || "/strangerthings3thegame")
    end

    #settings.logger.debug( "offer: #{offer.inspect}")
    #settings.logger.debug( "session: #{session.inspect}")
    already_purchased = redeemed_before(session['account_info']['id'], offer[:INGAMEID])
    if already_purchased
      flash[:message] = "This game has already been unlocked on this account."
      redirect ("/strangerthings3thegame")
      #redirect (session[:redirect_url_on_error] || "/strangerthings3thegame")
    end

    currencies = StoreAPI.currencies(@game, ["XSOLLA_DIRECT"], kind: 'USD')

    currency = currencies.currencies.select { |currency| currency.cost == offer[:PRICES].first["ORGPRICE"] }.first

    if currency.nil?
     flash[:error] = "Currency has not been registered."
     redirect (session[:redirect_url_on_error] || "/st3/#{@product_type}")
    end

    @billing = BillingData.new(
     :payment_method => 'XSOLLA_DIRECT',
     :name => offer[:NAME],
     :amount_id => currency.id,
     :item_id => offer[:PRICES].first["PRICEID"],
     :email => session[:account_info]["email"],
     :gamecode => @game
    )

    session['billing'] = @billing

    puts 'test'
    puts @billing.inspect

    erb :"purchase-flow/strangerthings/purchase/confirm", :layout => "layouts/strangerthings3thegame_layout".to_sym
  end

  # back to school sale page
  get "/back-to-school" do
    #redirect to the home page
    redirect "/"

    # @page_name = "bts_packs"

    # @show_errors = session.delete(:show_errors)

    # @breadcrumbs = [{text: "Store Home", href: "/back-to-school"}]
    # @title = "Back to School"

    # session[:redirect_url_on_error] = "/back-to-school"
    
    # if session[:account_id] && session["account_info"]["game_accounts"].empty? # logged in and no active accounts
    #   flash[:warn] = NO_GAME_ACCOUNT_MESSAGE
    # end

    # erb :"purchase-flow/bts/show", :layout => "layouts/eme_layout".to_sym
  end
  # end back to school sale page

  get "/:game/?" do
    get_game

    redirect ("/") if @game.downcase == "ava"
    redirect ("/") if @game.downcase == "kritika"
    redirect ("/closers/emp") if @game == "closers"
    redirect ("/") if @game == "breach"
    redirect ("/") if @game == "st3"
    redirect ("/") if @game == "qcpoints"
    redirect ("/") if @game == "eme"
    redirect ("/") if @game == "enmasse"
    redirect ("/") if @game == "extralife"

    @breadcrumbs = []
    @title = "En Masse Store | #{game_title}"
    @items = StoreItem.by_keyword("featured", :game_id => @game)[0..7]
    @items = StoreItem.filter_items(@items, {:race => params[:race], :class => params[:class]})
    @items = StoreItem.sort_items(@items)
    @category = "featured"
    @skip_filter = true;

    @featured_page = true
    game_layout = "layouts/#{@game}_layout".to_sym
    
    #if @game == "enmasse"
    #  game_layout = "emp_layout".to_sym
    #elsif @game == "closers"
    #  game_layout = "closersgifting_layout".to_sym # FOR GIFTING EVENT, REMOVED AFTER
    #else
    #  game_layout = "#{@game}_layout".to_sym
    #end
    erb :game, :layout => game_layout, :locals => { :skip_sub_menu => true}
  end

  #get '/ava/error' do
  #  game_layout = "emp_layout".to_sym
  #  erb :avaerror, :layout => game_layout, :locals => { :skip_sub_menu => true}
  #end

  # new shop page for closers 
  get "/closers/packs" do
    @game = "closers"
    @page_name = "closers_packs"

    @show_errors = session.delete(:show_errors)

    @breadcrumbs = [{text: "Store Home", href: "/#{@game}"}]
    @title = "Packs | #{game_title}"

    session[:redirect_url_on_error] = '/closers/packs'
    
    if session[:account_id] && session["account_info"]["game_accounts"].empty? # logged in and no active accounts
      flash[:warn] = NO_GAME_ACCOUNT_MESSAGE
    end

    erb :"purchase-flow/closers/packs/show", :layout => "layouts/closers_layout".to_sym
  end

  get_or_post "/closers/:product_type/confirm" do
    @game = 'closers'
    @page_name = "closers_packs"

    @product_type = params[:product_type].downcase

    unless ['packs'].include? @product_type
      flash[:error] = "Invalid product_type"
      redirect (session[:redirect_url_on_error] || "/closers/packs")
    end

    @show_errors = session.delete(:show_errors)

    @breadcrumbs = [{text: "Store Home", href: "/#{@game}"},
                    {text: "Packs Billing"}]
    @title = "Packs Billing | #{game_title}"

    if session[:account_id].nil?
      flash[:error] = "Please log in to purchase."
      redirect (session[:redirect_url_on_error] || "/closers/packs")
    end

    product_id = params[:product_id]

    if product_id.nil?
      flash[:error] = "product has not been chosen."
      redirect (session[:redirect_url_on_error] || "/closers/packs")
    end

    offers = StoreAPI.offers(gamecode(@game))

    offer = offers.select { |offer| offer[:OFFERID].upcase == product_id.upcase }.first

    if offer.nil?
      flash[:error] = "Item has not been registered."
      redirect (session[:redirect_url_on_error] || "/closers/packs")
    end

    #settings.logger.debug( "offer: #{offer.inspect}")
    #settings.logger.debug( "session: #{session.inspect}")
    # restrict some packs to only one purchase
    if offer[:OFFERID] == "CloserEssStartPack" || offer[:OFFERID] == "CloserPlatPack" || offer[:OFFERID] == "CloserSilvPack" || offer[:OFFERID] == "closersbts2019" || offer[:OFFERID] == "CloserSignaturePack" || offer[:OFFERID] == "CloserEnterprisePack"
      already_purchased = redeemed_before(session['account_info']['id'], offer[:INGAMEID])
      if already_purchased
        flash[:message] = "This pack has already been purchased on this account."
        redirect ("/closers/packs")
        #redirect (session[:redirect_url_on_error] || "/strangerthings3thegame")
      end
    end

    currencies = StoreAPI.currencies(gamecode(@game), ["XSOLLA_DIRECT"], kind: 'USD')

    currency = currencies.currencies.select { |currency| currency.cost == offer[:PRICES].first["ORGPRICE"] }.first

    if currency.nil?
      flash[:error] = "Currency has not been registered."
      redirect (session[:redirect_url_on_error] || "/closers/packs")
    end

    @billing = BillingData.new(
      :payment_method => 'XSOLLA_DIRECT',
      :name => offer[:NAME],
      :amount_id => currency.id,
      :item_id => offer[:PRICES].first["PRICEID"],
      :email => session[:account_info]["email"],
      :gamecode => gamecode(@game)
    )

    session['billing'] = @billing

    erb :"purchase-flow/closers/packs/confirm", :layout => "layouts/closers_layout".to_sym
  end
  # end new closer shop

  # and a generic version of the packs flow
  get "/:game/packs" do
    get_game

    if @game.downcase == "tera"
      redirect "/tera"
    end

    @page_name = "#{@game}_packs"

    @show_errors = session.delete(:show_errors)

    @breadcrumbs = [{text: "Store Home", href: "/#{@game}"}]
    @title = "Packs | #{game_title}"

    session[:redirect_url_on_error] = "/#{@game}/packs"
    
    if session[:account_id] && session["account_info"]["game_accounts"].empty? # logged in and no active accounts
      flash[:warn] = NO_GAME_ACCOUNT_MESSAGE
    end

    erb :"purchase-flow/packs/show", :layout => "layouts/eme_layout".to_sym
  end

  get_or_post "/:game/:product_type/confirm" do
    get_game

    @page_name = "#{@game}_packs"

    @product_type = params[:product_type].downcase

    unless ['packs'].include? @product_type
      flash[:error] = "Invalid product_type"
      redirect (session[:redirect_url_on_error] || "/#{@game}/packs")
    end

    @show_errors = session.delete(:show_errors)

    @breadcrumbs = [{text: "Store Home", href: "/#{@game}"},
                    {text: "Packs Billing"}]
    @title = "Packs Billing | #{game_title}"

    if session[:account_id].nil?
      flash[:error] = "Please log in to purchase."
      redirect (session[:redirect_url_on_error] || "/#{@game}/packs")
    end

    product_id = params[:product_id]

    if product_id.nil?
      flash[:error] = "product has not been chosen."
      redirect (session[:redirect_url_on_error] || "/#{@game}/packs")
    end

    offers = StoreAPI.offers(gamecode(@game))

    offer = offers.select { |offer| offer[:OFFERID].upcase == product_id.upcase }.first

    if offer.nil?
      flash[:error] = "Item has not been registered."
      redirect (session[:redirect_url_on_error] || "/#{@game}/packs")
    end

    #settings.logger.debug( "offer: #{offer.inspect}")
    #settings.logger.debug( "session: #{session.inspect}")
    if offer[:OFFERID] == "terabts2019"
      already_purchased = redeemed_before(session['account_info']['id'], offer[:INGAMEID])
      if already_purchased
        flash[:message] = "This pack has already been purchased on this account."
        redirect ("/#{@game}/packs")
        #redirect (session[:redirect_url_on_error] || "/strangerthings3thegame")
      end
    end


    currencies = StoreAPI.currencies(gamecode(@game), ["XSOLLA_DIRECT"], kind: 'USD')

    currency = currencies.currencies.select { |currency| currency.cost == offer[:PRICES].first["ORGPRICE"] }.first

    if currency.nil?
      flash[:error] = "Currency has not been registered."
      redirect (session[:redirect_url_on_error] || "/#{@game}/packs")
    end

    @billing = BillingData.new(
      :payment_method => 'XSOLLA_DIRECT',
      :name => offer[:NAME],
      :amount_id => currency.id,
      :item_id => offer[:PRICES].first["PRICEID"],
      :email => session[:account_info]["email"],
      :gamecode => gamecode(@game)
    )

    session['billing'] = @billing

    erb :"purchase-flow/packs/confirm", :layout => "layouts/eme_layout".to_sym
  end
  # end generic packs flow


  get "/eme/elite" do
    redirect ("/") # redirect to main page
    @title = "En Masse Store | Elite Status"
    game_layout = "eme_layout".to_sym # this has been reskinned as a generic eme flow, rework and remake for eleite, if it ever comes back

    erb :elitesubscription, :layout => game_layout, :locals => { :skip_sub_menu => true}
  end

  get '/:game/clear-cache' do
    if env['RACK_ENV'] != 'deployment' || params[:password] = 'psunsaysso'
      StoreItem.reload_cache
      return "cache cleared."
    end
    return
  end

  get '/:game/is-reloading' do
    return { reloading: StoreItem.reloading? }.to_json
  end

  # footer link redirects
  get "/legal/privacy-policy" do
    redirect ("https://enmasse.com/legal/privacy-policy") # redirect to the enmasse site legal stuff.
    #erb :index, :layout => :layout
  end

  get "/legal/terms-of-service" do
    redirect ("https://enmasse.com/legal/terms-of-service") # redirect to the enmasse site legal stuff.
    #erb :index, :layout => :layout
  end

  get "/legal/rules-of-conduct" do
    redirect ("https://enmasse.com/legal/rules-of-conduct") # redirect to the enmasse site legal stuff.
    #erb :index, :layout => :layout
  end

  post "/:game/buy-item/?" do
    @price = params[:item_price].to_i

    get_game
    @item = StoreItem.find(params[:item_id], :game_id => @game)

    @game_account_id = params[:game_account_id].to_i

    game_account = session['account_info']['game_accounts'].select{|x| x["id"] == @game_account_id }[0]

    if @username    # Check if is elite, and elite price first, then for sale price, then normal price id.  #TODO
      purchase_opts = {:game_account_id => @game_account_id, :price_point_id => @item.prices[:normal].id, :amount => @item.normal_price,
        :elite => game_account["subscription_active"], :email => session['account_info']['email'], :location => "#{@game.downcase}-web", :game_code => gamecode(@game) }

      if @item.elite_price && game_account && game_account["subscription_active"]
        return JSON.dump({"message" => "The price of this item has changed from <span class='emp-icon small'></span>#{@item.elite_price} to <span class='emp-icon small'></span>#{@price}.", "error" => true}) if @price != @item.elite_price
        #purchase_opts[:price_point_id] = @item.prices[:elite].id
        purchase_opts[:campaign_id] = @item.prices[:elite].campaign_id
        purchase_opts[:amount] = @item.elite_price
      else
        return JSON.dump({"message" => "The price of this item has changed from <span class='emp-icon small'></span>#{@item.price} to <span class='emp-icon small'></span>#{@price}.", "error" => true}) if @price != @item.price
        if @item.sale_price
          #purchase_opts[:price_point_id] = @item.prices[:sale].id
          purchase_opts[:campaign_id] = @item.prices[:sale].campaign_id
          purchase_opts[:amount] = @item.sale_price
        end
      end

      IssueLogger.time_log("Purchasing Item: |#{session["account_id"]}| #{session["account_info"].inspect}")

      temp = StoreAPI.purchase(session["account_id"], @item, "EMP", purchase_opts)

      # erase gifts cache here if was gift purchase -CR- GIFTING
      if(["goldengift1", "goldengift2"].include?(params[:item_id]))
        Gifting.clear_gift_cache(request.cookies["_ssot"], params[:game].downcase)
      end

      #wallet = StoreAPI.reload_wallet(session["account_id"], "EMP", :username => @username,
      #  :email => session["account_info"]["email"], :game_accounts => session["account_info"]["game_accounts"])
      RefreshWalletWorker.new.async.perform(session["account_id"], "EMP", { :username => @username,
        :email => session["account_info"]["email"], :game_accounts => session["account_info"]["game_accounts"] })
      if temp["message"] == "value.invalid.externalPricePointId"
        StoreItem.schedule_reload
        temp["message"] = "The price for this item is currently being updated and should be finished updating in a moment. This page will refresh at that time."
        temp["reload_watcher"] = true
      elsif temp["params"] && temp["params"]["human_readable:en"]
        temp["message"] = temp["params"]["human_readable:en"]
      end

      # MOVING THIS CODE TO THE BILLING_ADAPTER -cr-
      #### Deliver VIP points, exp
      #if AMS::API.settings[:vip] && AMS::API.settings[:vip]['active'] && temp["transaction_id"] && temp["error"] == false
      #  price = temp["price"].to_i * (temp["quantity"] || 1).to_i
      #  amsapi = AMS::API::Client.new()
      #  data_exp = amsapi.game_accounts.add_vip_pub_exp(@game_account_id, (price*AMS::API.settings[:vip]['exp_factor']).ceil, temp["transaction_id"])
      #  data_tokens = amsapi.game_accounts.add_vip_token(@game_account_id, (price*AMS::API.settings[:vip]['token_factor']).ceil, temp["transaction_id"])
      #  # maybe check success of token delivery?
      #end
      return JSON.dump(temp)
    else
      return JSON.dump({"message" => "Please sign in to complete your purchase.", "error" => true})
    end
  end

  get "/:game/items/?:category?/?" do
    get_game
    @category = params[:category]
    if @game.downcase != "tera"
      # throw error
    end

    # redirect from daily deals in webstore, we only want them in the launcher welcome window
    if @game.downcase == "tera" && (@category.downcase == "daily_deals" || @category.downcase == "internal_daily_deals" || @category.downcase == "exclude")
      redirect ("/tera")
    end

    # filter game accounts by game_name if possible
    if @game_accounts
      @game_accounts = @game_accounts.select do |account|
        (account['game_name'] && account['game_name'].downcase == @game.downcase)
      end
    end

    @current_page = (params[:page] || 1).to_i

    if @category
      @items = StoreItem.by_keyword(@category, :game_id => @game)
      if(@category == "mounts")
        @items.push *StoreItem.by_keyword("pets_category", :game_id => @game)
      end
      cat_prop_name = @category.split('-').map{ |w| w.capitalize}.join(" ")
      @breadcrumbs = [{text: "Store Home", href: "/#{@game}"}]

      if( @category == "accessories" || @category == "costumes" || @category == "weapon-skins" )
        @breadcrumbs.push( {text: "Character", href: "/#{@game}/items/character/" } )
      end

      #settings.logger.debug cat_prop_name
      if ( cat_prop_name == "Mounts")
        cat_prop_name = "Mounts &amp; Pets"
      end

      @breadcrumbs.push( {text: cat_prop_name } )
      @title = "En Masse Store | #{game_title} | Items | #{cat_prop_name}"
    else
      @breadcrumbs = [{text: "Store Home", href: "/#{@game}"},
                      {text: "Items"}]
      @title = "En Masse Store | #{game_title} | Items"
      @items = StoreItem.all(:game_id => @game)
    end

    @items = StoreItem.filter_items(@items, {:race => params[:race], :class => params[:class]})
    @items = StoreItem.sort_items(@items)

    @last_page = @items.length / StoreItem::ITEMS_PER_PAGE
    @last_page += 1 if @items.length % StoreItem::ITEMS_PER_PAGE != 0

    @current_page = 1 if @current_page > @last_page

    @items = StoreItem.paged(@items, @current_page)
    #if @username
    #  @game_accounts = session["account_info"]["game_accounts"]
    #end
    erb :items, :layout => "layouts/#{@game}_layout".to_sym
  end

  get "/:game/item/:id/?*?" do
    get_game
    @item = StoreItem.find(params[:id], :game_id => @game)

    #if @game.downcase != "tera"
      # throw error
    #end

    # filter game accounts by game_name if possible
    if @game_accounts
      @game_accounts = @game_accounts.select do |account|
        (account['game_name'] && account['game_name'].downcase == @game.downcase)
      end
    end

    @breadcrumbs = [{text: "Store Home", href: "/#{@game}"}]
    if @item

      case @item.id
      when "paid_server_transfer", "elites30", "elites90", "catalyst_1", "catalyst_5", "catalyst_10", "catalyst_25"
        redirect ("/tera")
      end

      @item.categories.each do |cat|
        cat_prop_name = cat.split('-').map{ |w| w.capitalize}.join(" ")
        if cat_prop_name == "Mounts"
          cat_prop_name = "Mounts &amp; Pets"
        end
        @breadcrumbs.push( {text: cat_prop_name, href: "/#{@game}/items/#{cat}"} )
      end
      @breadcrumbs.push( {text: @item.name } )
      @title = "En Masse Store | #{game_title} | #{@item.name}"

      erb :item, :layout => "layouts/#{@game}_layout".to_sym
    else
      erb :"no-item", :layout => "layouts/#{@game}_layout".to_sym
    end
  end

  get "/:game/cache-reloading" do
    StoreItem.reloading?
  end

  get "/:game/transaction-history/?:page?/?" do
    get_game
    @current_page = (params[:page] || 1).to_i
    @results_per_page = 10

    @breadcrumbs = [{text: "Store Home", href: "/#{@game}"},
                    {text: "Transactions"}]
    @title = "Transaction History | #{game_title}"

    if @username
      @transactions = []
      @transactions, @total_records = StoreAPI.transactions(session[:account_id], @current_page, @results_per_page)
      total_records = @total_records
      results_per_page = @results_per_page
      @last_page = (total_records.to_f / results_per_page).ceil
    #  @game_accounts = session["account_info"]["game_accounts"]
    end

    settings.logger.debug( "Transactions: #{@transactions.inspect}")

    game_layout = "layouts/#{@game}_layout".to_sym
    erb :transaction_history, :layout => game_layout
  end

  #GIFTING
  get "/:game/gifts" do
    redirect '/', flash: {message:"The recent gifting promotion has ended, and the Gifting Center is currently closed.<br /><br />If you would like to be notified about future gifting promotions, please sign up for the TERA newsletter. Simply change the notification preferences on the <a href='https://account.enmasse.com/users/account/profile'>Account Overview page</a> of your En Masse account."} unless Gifting.settings[:enabled]
    if params[:game].downcase == 'tera'
      redirect '/tera', flash: {message:"The recent TERA gifting promotion has ended, and the Gifting Center is currently closed.<br /><br />If you would like to be notified about future gifting promotions, please sign up for the TERA newsletter. Simply change the notification preferences on the <a href='https://account.enmasse.com/users/account/profile'>Account Overview page</a> of your En Masse account."} unless Gifting.settings[:tera]["enabled"]
    end
    if params[:game].downcase == 'closers'
      redirect '/', flash: {message:"The recent CLOSERS gifting promotion has ended, and the Gifting Center is currently closed.<br /><br />If you would like to be notified about future gifting promotions, please sign up for the CLOSERS newsletter. Simply change the notification preferences on the <a href='https://account.enmasse.com/users/account/profile'>Account Overview page</a> of your En Masse account."} unless Gifting.settings[:closers]["enabled"]
    end
    get_game
    @breadcrumbs = [{text: "Store Home", href: "/#{@game}"},
                    {text: "Gifting Center"}]
    @title = "En Masse Gift Exchange"

    @possible = {}
    poss = Gifting.get_possible(params[:game].downcase)
    if poss["possible_gifts"]
      poss["possible_gifts"].each{ |k,p|
        @possible[k] = {}
        p.each do |item|
          if item["game_item"]
            @possible[k][item["game_item"]["item_code"].to_s] = item["game_item"]
            @possible[k][item["game_item"]["item_code"].to_s]["image"] = item["image"]
            @possible[k][item["game_item"]["item_code"].to_s]["emp"] = item["emp"]
          end
        end
      }
    end
    @game_servers = TeraGame.servers

    #if @username
    #  @game_accounts = session["account_info"]["game_accounts"]
    #end

    @my_gifts = Gifting.get_gifts(request.cookies["_ssot"], params[:game].downcase)

    #erb "#{params[:game]}_gifts".to_sym, :layout => "#{params[:game]}_layout".to_sym, :locals => { :skip_sub_menu => true, :gifting_layout => true}
    erb "gifts".to_sym, :layout => "layouts/gifts_layout".to_sym, :locals => { :skip_sub_menu => true, :gifting_layout => true}
  end

  post "/:game/gifts/open/:gift_id" do
    @opened = Gifting.open_gift(request.cookies["_ssot"], params[:gift_id], params[:game_account_id])
    return @opened.to_json
  end

  post "/:game/gifts/send/:gift_id" do
    if params[:to_master_account_id].to_i == session["account_id"].to_i
      return {:error => true, :message => "You cannot sent gifts to yourself."}.to_json
    end
    @sent = Gifting.send_gift(request.cookies["_ssot"], params[:gift_id], params[:to_master_account_id], h(params[:to]), h(params[:from]), h(params[:message]), h(params[:game]))
    #settings.logger.debug "SENT:" + @sent.inspect
    @sent[:message] = "Unable to send that gift to that user." if @sent[:error]
    return @sent.to_json
  end

  post "/:game/gifts/find_character" do
    if params[:game].downcase == 'tera'
      if params[:name].nil? || params[:name] == "" && params[:server_id].nil? || params[:server_id] == ""
        return {"error" => true, "message" => "Please select a server and enter a character name."}.to_json
      end
      if params[:name].nil? || params[:name] == ""
        return {"error" => true, "message" => "Please enter a character name."}.to_json
      end
      if params[:server_id].nil? || params[:server_id] == ""
        return {"error" => true, "message" => "Please select a server."}.to_json
      end

      @character = TeraGame.character_find(params[:name], params[:server_id])
      #settings.logger.debug "TERA FIND CHARACTER:" + @character.inspect

      @character[:message] = "Unable to find character #{params[:name]}." if @character[:error]
      return @character.to_json
    end

    if params[:game].downcase == 'closers'
      if params[:name].nil? || params[:name] == "" && params[:server_id].nil? || params[:server_id] == ""
        return {"error" => true, "message" => "Please select a world and enter a character name."}.to_json
      end
      if params[:name].nil? || params[:name] == ""
        return {"error" => true, "message" => "Please enter a character name."}.to_json
      end
      if params[:server_id].nil? || params[:server_id] == ""
        return {"error" => true, "message" => "Please select a world."}.to_json
      end
    end

    if params[:game].downcase == 'closers'
      ams_base = SECURE_CONFIG["ams_api"]["host"]
      ams_url = '/api/private/gifting/get_game_account_id_by_character_name'
      url = ams_base + ams_url
      token = SECURE_CONFIG["ams_api"]["token"]
   
      query = { 
        "character_name" => params[:name],
        "world" => params[:server_id],
        "game_seo_id" => params[:game].downcase
      }
      headers = {
        "Authorization" => "Token token=#{token}"
      }
      response = HTTParty.get(url, :query => query, :headers => headers)
      #settings.logger.debug "URL:" + url.inspect
      #settings.logger.debug "QUERY:" + query.inspect
      #settings.logger.debug "HEADERS:" + headers.inspect
      #settings.logger.debug "FIND CHARACTER:" + response.inspect
      #settings.logger.debug "RESPONSE BODY:" + response.body
      if response.body["error_code"]
        return {"error" => true, "message" => "Unable to find character #{params[:name]}."}.to_json
      end
      @character = response.body
      #return response.body.to_json
    end

    #@character[:message] = "Unable to find character #{params[:name]}." if @character[:error]
    return @character.to_json
  end


  post "/:game/gifts/find_account" do
    if session[:account_info].nil?
      return {:error => true, :message => "Not signed in, or error in your account."}.to_json
    elsif session[:account_info]["email"] && params[:email] && params[:email].downcase == session[:account_info]["email"].downcase
      return {:error => true, :message => "You cannot sent gifts to yourself."}.to_json
    end
    return {"error" => true, "message" => "Please supply valid email."}.to_json if params[:email].nil? || params[:email] == ""
    @account = TeraGame.find_account_by_email(params["email"])
    #settings.logger.debug "ACCOUNT:" + @account.inspect
    @account[:message] = "Unable to find account with this email address." if @account[:error]
    return @account.to_json
  end

#  get "/test_api_call" do
    #ams_base = 'http://account-edge.enmasse.com'
#    ams_base = SECURE_CONFIG["ams_api"]["host"]
#    ams_url = '/api/private/gifting/get_game_account_id_by_character_name'
#    url = ams_base + ams_url
    #token = "ef29bf65f9096bf682ddadff868ca14b"
#    token = SECURE_CONFIG["ams_api"]["token"]
 
#    query = { 
#      "character_name" => "Knoxxer",
#      "world" => "",
#      "game_seo_id" => "ava"
#    }
#    headers = {
#      "Authorization" => "Token token=#{token}"
#    }
#    response = HTTParty.get(url, :query => query, :headers => headers)
#    return {result: response.body}
#  end

  helpers do
    def page_link(page, label = nil, kind = :normal)
      path, link_params = request.fullpath.split('?')
      link_params ||= ""
      if kind == :param
        if link_params.include?('page=')
          link_params.gsub!(/page=\d+/, "page=#{page}")
        else
          link_params += "#{'&' if link_params.length > 1}page=#{page}"
        end
        "<a href=\"#{path}?#{link_params}\">#{label || page}</a>"
      else
        path.gsub!(/\/\d+\/{0,1}$/, '')
        path.gsub!(/\/*$/, '')
        "<a href=\"#{path}/#{page}#{'?' if link_params.length > 2}#{link_params}\">#{label || page}</a>"
      end
    end

    def rm_amount_id_field(pay_type, default_amount_id, existing_sub, checked)
      return "<input type='radio' name='amount_id' id='cur#{pay_type.gsub(" ", "").downcase}' value='#{ default_amount_id }' #{'checked=\'checked\'' if checked} />"
    end

    def img_url(path)
      image_path path.gsub(/^\/assets\//, '')
    end

    def css(*args)
      assets_for(args) do |name, options|
        stylesheet_tag name.to_s, options
      end
    end

    def js(*args)
      assets_for(args) do |name, options|
        javascript_tag name.to_s, options
      end
    end

    def assets_for(args)
      names = []
      while args.first.is_a?(Symbol) || args.first.is_a?(String)
        names << args.shift
      end
      options = args.first || {}

      combined = ''
      names.each do |name|
        combined += yield name, options
      end
      combined
    end
  end

  def h(data) # escape the HTML inputs
    CGI::escapeHTML(data)
  end

  get "/:game/purchase-item/:id/?:safe_name?/?" do
    @show_errors = session.delete(:show_errors)

    get_game
    @breadcrumbs = [{text: "Store Home", href: "/#{@game}"},
                    {text: "Buy EMP"}]

    @item = StoreItem.find(params[:id], :game_id => @game)
    if @item.nil? || !@item.cash?
      redirect "/#{@game}", :warn => "Unable to purchase that item."
    end

    @title = "Purchase: #{@item.name} | #{game_title}"

    @ip_addr = request.env['REMOTE_ADDR']

    @billing = params[:clear] ? nil : session["billing"]
    @billing ||= BillingData.new()
    @billing.email = session[:account_info]["email"] if session[:account_info] && @billing.email.nil?
    session["path"] = "emp"


    @user = TeraSSO.refresh_data(session["account_id"])

    if @user && !@user[:error]
      @check_cc = StoreAPI.billing_info(@user["id"])
      @previous_cc = @check_cc if @check_cc["CCACCT"] != ""
    end

    @hide_footer_nav = true

    if session[:account_id] && session["account_info"]["game_accounts"].empty? # logged in and no active accounts
      flash[:warn] = NO_GAME_ACCOUNT_MESSAGE
    end
    @cash_pay_types = StoreAPI.cash_payment_types(@game)

    erb :"purchase-flow/item-start", :layout => "layouts/#{@game}_layout".to_sym
  end

  post "/:game/item-confirm/:item_id/?" do
    get_game
    @breadcrumbs = [{text: "Store Home", href: "/#{@game}"},
                    {text: "Buy EMP"}]
    @title = "Item purchase | #{game_title}"

    item = StoreItem.find(params[:item_id], :game_id => @game)

    if item.nil?
      redirect "/#{@game}", :warn => "I can't find that item."
      return
    end

    billing = BillingData.new(
      :payment_method => params[:payment_method],
      :price => params[:price].to_i,
      :name => params[:name],
      :item_id => params[:item_id],
      :address => params[:address],
      :zip => params[:zip],
      :city => params[:city],
      :country => params[:country],
      :state => params[:state],
      :phone => params[:phone],
      :auth_flag => false,
      :amount_id => params[:amount_id],
      :gamecode => gamecode(params[:game]),
      :rmt_item_id => item.rmt_item_id
    )
    billing.email = session[:account_info]["email"] if session[:account_info]
    #settings.logger.debug billing.inspect

    session["billing"] = billing

    tax_rate = BillingData.tax_amount(
      params[:country],
      params[:state],
      params[:zip]
    )
    @tax_amount = if tax_rate > 0
      settings.logger.debug "item: #{billing.item}"
      settings.logger.debug "tax_rate.to_f * billing.price / 100.0: #{tax_rate.to_f} * #{billing.price} / 100.0"
      tax_rate.to_f * billing.price / 100.0
    else
      0
    end

    #if !billing.valid?
    #  session[:show_errors] = true
    #  redirect "/#{params[:game]}/emp"
    #  return
    #end

    @billing = session["billing"]

    erb :"purchase-flow/confirm", :layout => "layouts/#{@game}_layout".to_sym
  end

  # buy elite status flow
  get "/:game/elite-status/?" do
    get_game
    @breadcrumbs = [{text: "Store Home", href: "/#{@game}"},
                    {text: "Elite Status"}]
    @title       = "Elite Status | Subscriptions | #{game_title}"

    #@hide_footer_nav = true

    if @game_accounts
      # filter game accounts by game_name if possible
      @game_accounts = @game_accounts.select do |account|
        (account['game_name'] && account['game_name'].downcase == @game.downcase)
      end

      # retrieve subscription information
      subs = EME::Subscription.fetch_active(session[:account_id])["subscriptions"]

      # attach subscription to the game_account
      @game_accounts.each do |account|
        sub = subs.select { |sub| sub['game_account_id'] == account['id'] }.first
        if sub
          # add remaining_time
          time_now = Time.now
          time_ending = Time.parse(sub["ended_at"])
          time_left = (time_ending - time_now) / 1.day
          time_left_years = time_left.to_i / 365
          time_left_days = time_left.to_i % 365
          if time_left_years >= 2
            remaining_time = time_left_years.to_s + " years and " + time_left_days.to_s + " days"
          elsif time_left_years == 1
            remaining_time = time_left_years.to_s + " year and " + time_left_days.to_s + " days"
          else
            remaining_time = time_left_days.to_s + " days"
          end
          sub['remaining_time'] = remaining_time
        end
        account['subscription'] = sub
      end
      puts @game_accounts.inspect
    end

    if session[:account_id] && session["account_info"]["game_accounts"].empty? # logged in and no active accounts
      flash[:warn] = NO_GAME_ACCOUNT_MESSAGE
    end

    erb :"purchase-flow/subs/show", :layout => "layouts/#{@game}_layout".to_sym
  end

  get "/:game/elite-status/get-promo/?" do
    get_game
    gaccounts = get_game_accounts(@game)
    ret_val = if !EME::Subscription.settings[:promo_price]
      {:error => true, :message => "Promo is not active."}
    elsif !@username
      {:error => true, :message => "Not logged in."}
    elsif gaccounts.empty? # logged in and no active accounts
      {:error => true, :message => NO_GAME_ACCOUNT_MESSAGE}
    else
      count = 0
      subs = EME::Subscription.fetch_active(session[:account_id])["subscriptions"]
      subs.each do |x|
        EME::Subscription.update_renew_price_by_game_account(x["game_account_id"], EME::Subscription.settings[:promo_price])
        count += 1
      end
      {:error => false, :message => "You successfully updated your subscription to lock in the promo price.", :count => count, :price => EME::Subscription.settings[:promo_price]}
    end
    return ret_val.to_json
  end

  post "/:game/elite-status/?" do
    get_game
    @breadcrumbs = [{text: "Store Home", href: "/#{@game}"},
                    {text: "Elite Status"}]

    if @username
      @ip_addr = request.env['REMOTE_ADDR']

      @billing = params[:clear] ? nil : session["billing"]
      @billing ||= BillingData.new()
      @billing.email = session[:account_info]["email"] if session[:account_info] && @billing.email.nil?
      @billing.game_account_id = params[:game_account_id]
      session["path"] = "elite-status"

      active_exisiting = EME::Subscription.fetch_active_for_game_account(params[:game_account_id])
      # Need succcess check on this call, does not always succeed.

      if active_exisiting["subscriptions"] && active_exisiting["subscriptions"].length > 0
        sub_info = EME::Subscription.subscription_info_for_game_account( params[:game_account_id] )
        sub_info["subscription_info"] = {} if sub_info[:error] # set to blank data if no info
      else
        sub_info = { "subscription_info" => {} }
      end

      if !sub_info[:error] # set to blank data if no info
        settings.logger.warn("HERE IS THE PREVIOUS SUB INFO!!!  #{sub_info}")
        @billing.previous_curr_id = sub_info["subscription_info"]["currency_id"]
        @billing.previous_price = sub_info["subscription_info"]["price"]
        #@billing.previous_payment_method = sub_info["subscription_info"]["pg_code"],
        @billing.previous_sub_item_id = sub_info["subscription_info"]["item_id"]
      end

      @user = TeraSSO.refresh_data(session["account_id"])

      if @user && !@user[:error]
        @check_cc = StoreAPI.subscription_billing_info(@user["id"])
        #@previous_cc = @check_cc if @check_cc["CCACCT"] && @check_cc["CCACCT"] != ""
      end
      @previous_cc = nil

      @sub_pg_codes = StoreAPI.subscriptions(gamecode(@game))
      @existing_sub = nil
      subs = EME::Subscription.fetch_active(session[:account_id])

      @existing_sub = subs["subscriptions"].select{|x| x["game_account_id"] == params[:game_account_id].to_i}[0] if subs["subscriptions"]
      @billing.auth_flag = !!@existing_sub
      if @existing_sub
        session['existing_sub_id'] = @existing_sub["id"]
      else
        session['existing_sub_id'] = nil
      end

      @billing.payment_method = "SUBSCRIPTION_CC"
      settings.logger.error "IT IS SETTING THE SUB: #{@billing.inspect}" if @existing_sub
    else
      redirect ("/#{@game}/elite-status")
    end

    erb :"purchase-flow/subs/form", :layout => "layouts/#{@game}_layout".to_sym
  end

  post "/:game/elite-status/cancel/?" do
    get_game
    @breadcrumbs = [{text: "Store Home", href: "/#{@game}"},
                    {text: "Elite Status"}]

    error = nil
    @existing_sub = nil
    if @username
      subs = EME::Subscription.fetch_active(session[:account_id])
      @existing_sub = subs["subscriptions"].select{|x| x["id"] == params[:id].to_i}[0] if subs["subscriptions"]
      if @existing_sub
        res = EME::Subscription.cancel(@existing_sub["id"])
        if !res["error"]
          flash[:notice] = "Successfully canceled your subscription, it will not renew."
        else
          error = "API error."
        end
      else
        error = "We could not find you subscription to cancel."
      end
    else
      error = "You must log in again to cancel this subscription."
    end

    if error
      redirect "/#{@game}/elite-status", :error => error
    else
      erb :"purchase-flow/subs/canceled", :layout => "layouts/#{@game}_layout".to_sym
    end
  end
  # end buy elite status flow

  # Breach / QC Points Founders Packs pages
   get "/breach/founders-packs" do
     redirect "/"
     #flash[:warn] = "Founders's Packs are no longer available. Check out these items instead."

     #redirect "/breach/early-access-pass"


     #@game = "breach"

     #@show_errors = session.delete(:show_errors)

     #@breadcrumbs = [{text: "Store Home", href: "/#{@game}"},
      #               {text: "Founders Packs"}]
     #@title = "Founders Packs | #{game_title}"

     #session[:redirect_url_on_error] = '/breach/founders-packs'

     #erb :"purchase-flow/breach/founders-packs/show", :layout => "breach_layout".to_sym
   end

   # Breach Spark / QC Points / qcpoints purchase pages
   get "/breach/qcpoints" do
     redirect "/"
     #@game = "breach"

     #redirect ("/#{@game}/emp") if @game.downcase != "breach"

     #@show_errors = session.delete(:show_errors)

    # @breadcrumbs = [{text: "Store Home", href: "/#{@game}"},
  #                  {text: "Buy QC Points"}]
     #@title = "QC Points | #{game_title}"

     #session[:redirect_url_on_error] = '/breach/qcpoints'
    
     #if session[:account_id] && session["account_info"]["game_accounts"].empty? # logged in and no active accounts
     #  flash[:warn] = NO_GAME_ACCOUNT_MESSAGE
     #end

     #erb :"purchase-flow/breach/qcpoints/show", :layout => "breach_layout".to_sym
   end

   get_or_post "/breach/:product_type/confirm" do
     redirect "/"
     #@game = 'breach'

     #@product_type = params[:product_type].downcase

     #unless ['qcpoints', 'founders-packs', 'early-access-pass'].include? @product_type
     # flash[:error] = "Invalid product_type"
     # redirect (session[:redirect_url_on_error] || "/breach/qcpoints")
     #end

     #@show_errors = session.delete(:show_errors)

     #@breadcrumbs = [{text: "Store Home", href: "/#{@game}"},
      #              {text: "QC Points Billing"}]
     #@title = "QC Points Billing | #{game_title}"

     #if session[:account_id].nil?
     # flash[:error] = "Please log in to purchase."
     # redirect (session[:redirect_url_on_error] || "/breach/#{@product_type}")
     #end

     #product_id = params[:product_id]

     #if product_id.nil?
     # flash[:error] = "product has not been chosen."
     # redirect (session[:redirect_url_on_error] || "/breach/#{@product_type}")
     #end

     #offers = StoreAPI.offers(gamecode(@game))

     #offer = offers.select { |offer| offer[:OFFERID].upcase == product_id.upcase }.first

     #if offer.nil?
     # flash[:error] = "Item has not been registered."
     # redirect (session[:redirect_url_on_error] || "/breach/#{@product_type}")
     #end

     #currencies = StoreAPI.currencies(gamecode(@game), ["XSOLLA_DIRECT"], kind: 'USD')

     #currency = currencies.currencies.select { |currency| currency.cost == offer[:PRICES].first["ORGPRICE"] }.first

     #if currency.nil?
     # flash[:error] = "Currency has not been registered."
     # redirect (session[:redirect_url_on_error] || "/breach/#{@product_type}")
     #end

     #@billing = BillingData.new(
     # :payment_method => 'XSOLLA_DIRECT',
     # :name => offer[:NAME],
     # :amount_id => currency.id,
     # :item_id => offer[:PRICES].first["PRICEID"],
     # :email => session[:account_info]["email"],
     # :gamecode => gamecode(@game)
     #)

     #session['billing'] = @billing

     #if @product_type == 'qcpoints'
     # erb :"purchase-flow/breach/qcpoints/confirm", :layout => "breach_layout".to_sym
     #elsif @product_type == 'early-access-pass'
     # erb :"purchase-flow/breach/early-access-pass/confirm", :layout => "breach_layout".to_sym
     #else
     # erb :"purchase-flow/breach/founders-packs/confirm", :layout => "breach_layout".to_sym
     #end
   end

  # buy emp purchase flow
  get "/:game/emp/?" do
    @show_errors = session.delete(:show_errors)

    get_game

    redirect ("/") if @game.downcase == "ava"
    redirect ("/") if @game.downcase == "kritika"
    

    @breadcrumbs = [{text: "Store Home", href: "/#{@game}"},
                    {text: "Buy EMP"}]
    @title = "En Masse Points (EMP) | #{game_title}"

    @ip_addr = request.env['REMOTE_ADDR']

    @billing = params[:clear] ? nil : session["billing"]
    @billing ||= BillingData.new()
    @billing.email = session[:account_info]["email"] if session[:account_info] && @billing.email.nil?
    session["path"] = "emp"

    session['existing_sub_id'] = nil # erase this when thinking about EMP.

    @user = TeraSSO.refresh_data(session["account_id"])

    if @user && !@user[:error]
      @check_cc = StoreAPI.billing_info(@user["id"])
      @previous_cc = @check_cc if @check_cc["CCACCT"] != ""
    end

    @hide_footer_nav = true
    pay_opts = if request.env["HTTP_GEOIP_COUNTRY_CODE"] && request.env["HTTP_GEOIP_COUNTRY_CODE"] == "BR"
                 ["BOACOMPRA"]
               else
                 # uncomment the below to disable the previous credit card which is a part of CREDITCARD (PAYPAL)
                 #@previous_cc = nil

                 # disable CREDITCARD (PAYPAL CREDITCARD) due to lack of fraud guard
                 #  ["CREDITCARD", "PAYPAL", "XSOLLA", "BOACOMPRA"]
                 # Use XSOLLA_CREDIT instead
                 ["XSOLLA_CREDIT", "PAYPAL", "XSOLLA", "BOACOMPRA"]
               end
    if @previous_cc && pay_opts.exclude?("CREDITCARD")
      pay_opts << "CREDITCARD"
      @virtual_currencies = StoreAPI.currencies(gamecode(params[:game]), pay_opts)
      @virtual_currencies.display_payment_types.delete("CREDITCARD")
    else
      @virtual_currencies = StoreAPI.currencies(gamecode(params[:game]), pay_opts)
    end

    if(@virtual_currencies.currencies.empty? && !flash[:error])
      flash[:error] = "We could not retrieve the EMP options. Signing in may resolve this error."
    end

    if session[:account_id] && session["account_info"]["game_accounts"].empty? # logged in and no active accounts
      flash[:warn] = NO_GAME_ACCOUNT_MESSAGE
    end

    erb :"purchase-flow/emp/show", :layout => "layouts/emp_layout".to_sym
  end

  get "/:game/confirm/?" do
    get_game
    @breadcrumbs = [{text: "Store Home", href: "/#{@game}"},
                    {text: "Buy EMP"}]
    @title = "En Masse Points (EMP) | #{game_title}"

    if (@billing = session["billing"])
      if @billing.subscription?
        @breadcrumbs[-1] = {text: "Elite Status"}
        @title = "Elite Status | #{game_title}"
        @billing.check_for_override!
      end

      if @billing.subscription?
        erb :"purchase-flow/confirm", :layout => "layouts/#{@game}_layout".to_sym
      else
        erb :"purchase-flow/emp/confirm", :layout => "layouts/emp_layout".to_sym
      end

      #erb :"purchase-flow/confirm", :layout => "#{@game}_layout".to_sym
      #erb :"purchase-flow/emp/confirm", :layout => "emp_layout".to_sym
    else
      redirect ("/#{@game}/")
    end
  end

  post "/:game/confirm/?" do
    get_game

    if session[:account_id].nil?
      flash[:error] = "Please log in to purchase EMP."
      redirect ("/#{@game}/")
    elsif user_iovation_denied?
      flash[:error] = "You are unable to purchase EMP from your account at this time. Please contact our support team for more information."
      redirect ("/#{@game}/")
    end
    @breadcrumbs = [{text: "Store Home", href: "/#{@game}"},
                    {text: "Buy EMP"}]
    @title = "En Masse Points (EMP) | #{game_title}"

    settings.logger.error("existing_sub_id: #{session['existing_sub_id']}")
    active_exisiting = EME::Subscription.fetch_active_for_game_account(params[:game_account_id])
    if active_exisiting[:error]
      raise RuntimeError.new(active_exisiting[:message])
    elsif active_exisiting["subscriptions"] && active_exisiting["subscriptions"].length > 0
      sub_info = EME::Subscription.subscription_info_for_game_account( params[:game_account_id] )
      sub_info["subscription_info"] = {} if sub_info[:error] # set to blank data if no info
    else
      sub_info = { "subscription_info" => {} }
    end

    billing = BillingData.new(
      :payment_method => params[:payment_method],
      :emp_amount => params[:emp_amount].to_i,
      :price => params[:price].to_i,
      :name => params[:name],
      :address => params[:address],
      :zip => params[:zip],
      :city => params[:city],
      :country => params[:country],
      :state => params[:state],
      :phone => params[:phone],
      :amount_id => params[:amount_id],
      :email => session[:account_info]["email"],
      :auth_flag => (params[:auth_flag].to_i == 1),
      :previous_curr_id => sub_info["subscription_info"]["currency_id"],
      :previous_price => sub_info["subscription_info"]["price"],
      :previous_sub_item_id => sub_info["subscription_info"]["item_id"],
      #:previous_payment_method => sub_info["subscription_info"]["pg_code"],
      :gamecode => gamecode(params[:game]),
      :item_id => params[:item_id],
      :game_id => params[:game_id],
      :game_account_id => params[:game_account_id]
    )

    if billing.subscription?
      @breadcrumbs[-1] = {text: "Elite Status"}
      @title = "Elite Status | #{game_title}"
      billing.check_for_override! if billing.subscription?
    end

    session["billing"] = billing

    tax_rate = BillingData.tax_amount(
      params[:country],
      params[:state],
      params[:zip]
    )
    @tax_amount = if tax_rate > 0
      tax_rate.to_f * billing.price / 100.0
    else
      0
    end

    if !billing.valid?
      session[:show_errors] = true
      settings.logger.warn("===========MISSING DATA FROM SUBMITS...===================")
      settings.logger.warn(billing.inspect)
      settings.logger.warn(billing.errors.inspect)
      settings.logger.warn("==========================================================")
      if billing.subscription?
        redirect "/#{params[:game]}/elite-status", :error => "Please fill in all the required data."
      else
        redirect "/#{params[:game]}/emp", :error => "Please fill in all the required data."
      end
      return
    end

    @billing = session["billing"]

    if billing.subscription?
      puts "SUB LAYOUT"
      erb :"purchase-flow/confirm", :layout => "layouts/#{@game}_layout".to_sym
    else
      puts "NOT SUB LAYOUT"
      erb :"purchase-flow/emp/confirm", :layout => "layouts/emp_layout".to_sym
    end
  end
  # end emp purchase flow


  # buy steam emp purchase flow
  get "/:game/steam-emp/?" do
    @show_errors = session.delete(:show_errors)

    get_game

    @virtual_currencies = StoreAPI.currencies(gamecode(params[:game]), ["STEAM"])
    @breadcrumbs = [{text: "Store Home", href: "/#{@game}"},
                    {text: "Buy EMP"}]
    @title = "En Masse Points (EMP) | #{game_title}"

    @ip_addr = request.env['HTTP_X_FORWARDED_FOR'] || request.env['REMOTE_ADDR']

    @steam_id = nil
    @steam_name = nil
    if session[:account_info] && session[:account_info]["optional"]
      @steam_id = session[:account_info]["optional"]["steam_user_id"]
      @steam_name = session[:account_info]["optional"]["steam_user_persona_name"]
    end

    session["path"] = "steam-emp"

    @user = TeraSSO.refresh_data(session["account_id"])

    @hide_footer_nav = true

    if session[:account_id] && session["account_info"]["game_accounts"].empty? # logged in and no active accounts
      flash[:warn] = NO_GAME_ACCOUNT_MESSAGE
    end

    erb :"purchase-flow/emp/steam", :layout => "layouts/#{@game}_min_layout".to_sym
  end

  post "/:game/steam-emp/purchase/?" do
    get_game

    @steam_id = nil
    if session[:account_info] && session[:account_info]["optional"]
      @steam_id = session[:account_info]["optional"]["steam_user_id"]
    end

    @virtual_currencies = StoreAPI.currencies(gamecode(params[:game]))
    @item = @virtual_currencies.currencies_by_payment_type("STEAM").select{|x| x.id == params["amount_id"].to_i }[0]
    @ip_addr = request.env['HTTP_X_FORWARDED_FOR'] || request.env['REMOTE_ADDR']

    @ip_addr = "209.66.124.124" if env['RACK_ENV'] == "development"
    #"209.66.124.124"
    # step 1
    # make sure all the data is here
    errors = []
    errors << "Can not purchase because you are not logged in." if session[:account_id].nil?
    errors << "You are unable to purchase EMP from your account at this time. Please contact our support team for more information." if user_iovation_denied?
    errors << "Can not purchase through steam because you are not logged in through steam." if @steam_id.nil?
    errors << "Can not purchase because we lost track of what game you are in/steam store not set up for that game." if @game.nil? || SteamAPI::APP_IDS[@game].nil?
    errors << "Can not find item you are trying to purchase through steam" if @item.nil?
    #errors << "Still in process of builing this code."
    #return errors.to_json

    return errors.to_json if !errors.empty?
    # step 2
    # initialize the transaction

    ot = OffsiteTransaction.create(:vendor => "steam", :player_id => session[:account_id], :item_id => @item.id)
    setup = SteamAPI.initTxn(:order_id => ot.id, :steam_user_id => @steam_id, :game => @game, :ip => @ip_addr, :items => [{:id => @item.id, :amount => (@item.cost * 100), :description => @item.name}])
    # {"response"=>{"result"=>"Failure", "params"=>{"orderid"=>"4"}, "error"=>{"errorcode"=>3, "errordesc"=>"Invalid parameter"}}}

    #{"response"=>{"result"=>"OK", "params"=>{"orderid"=>"21", "transid"=>"165827240821739679", "steamurl"=>"https://store.steampowered.com/checkout/approvetxn/165827240821739679/"}}}
    if setup["response"] && setup["response"]["result"] == "OK"
      # we are in business
      ot.ref_num = setup["response"]["params"]["transid"].to_s
      ot.state = "in-progress"
      ot.save
      redirect setup["response"]["params"]["steamurl"] + "?returnurl=#{request.env['HTTP_ORIGIN']}/#{@game}/steam-emp/receipt"
    elsif setup["response"] && setup["response"]["result"] == "Failure"
      return "Sadly failed due to: " + setup["response"]["error"]["errordesc"]
    else
      return "Sadly failed due to: an unknown error."
    end
    @hide_footer_nav = true
  end

  get "/:game/steam-emp/receipt/?" do
    @show_errors = session.delete(:show_errors)
    get_game
    @errors = []
    @ip_addr = request.env['HTTP_X_FORWARDED_FOR'] || request.env['REMOTE_ADDR']
    ot = OffsiteTransaction.where(:vendor => "steam", :player_id => session[:account_id], :state => "in-progress").order("created_at DESC").first
    @finalized = false

    if ot
      @query_transx = SteamAPI.queryTxn(ot.ref_num, @game)
      # {"response"=>{"result"=>"OK", "params"=>{"orderid"=>21, "transid"=>165827240821739679, "steamid"=>76561198040913661, "status"=>"Init", "currency"=>"USD", "time"=>"2014-09-03T00:15:40Z", "country"=>"US", "usstate"=>"", "timecreated"=>"2014-09-03T00:15:40Z", "items"=>[{"itemid"=>28, "qty"=>1, "amount"=>4000, "vat"=>0}]}}}
      # status MUST BE "Succeeded"

      #{"response"=>{"result"=>"OK", "params"=>{"orderid"=>17, "transid"=>224374037354699139, "steamid"=>76561197979253400, "status"=>"Approved", "currency"=>"USD", "time"=>"2014-09-08T21:47:23Z", "country"=>"US", "usstate"=>"", "timecreated"=>"2014-09-08T21:47:13Z", "items"=>[{"itemid"=>26, "qty"=>1, "amount"=>1000, "vat"=>0}]}}}

      if @query_transx && @query_transx["response"] && @query_transx["response"]["result"] == "OK" && @query_transx["response"]["params"]["status"] == "Approved"
        # send the emp
        # item_id from query in case it changed items at steam page.
        ot.state = "ready-to-bill"
        ot.save
        item_hash = @query_transx["response"]["params"]["items"][0]
        item_id = item_hash["itemid"]
        @virtual_currencies = StoreAPI.currencies(gamecode(params[:game]))
        @item = @virtual_currencies.currencies_by_payment_type("STEAM").select{|x| x.id == item_id }[0]

        billing_data = BillingAdapterInterface.add_offsite_emp(session[:account_id], @item.purchase_amount, {:user_email => session[:account_info]["email"], :publisher => "STEAM", :pay_amount => convert_pennies_to_pl_dollars(item_hash["amount"]), :tax_amount => convert_pennies_to_pl_dollars(item_hash["vat"]), :order_id => ot.id, :ip_address => @ip_addr, :game_code => gamecode(@game) })
        if billing_data["TRANSACTIONID"]
          ot.state = "item-delivered"
          ot.save
          finalize_transx = SteamAPI.finalizeTxn(ot.id, @game)
          settings.logger.debug "finalize_transx"
          settings.logger.debug finalize_transx.inspect
          if finalize_transx && finalize_transx["response"] && finalize_transx["response"]["result"] == "OK"
            @finalized = true
            settings.logger.debug "MAJOR SUCCESS"
          else
            PayLetterIssuesLogger.log("Oh crap!%^$@@")
            settings.logger.error "Oh crap!%^$@@ - check the pay_letter_issues.log file"
            PayLetterIssuesLogger.log( "NEED TO REVERSE THIS EMP: #{finalize_transx['response'].inspect} : #{@query_transx['response'].inspect}" )
            # ERROR WE NEED TO REMOVE THE EMP NOW...  GAH WE NEED AN API FOR THAT>>>>>   LOG THEM ALL FOR NOW SOMEWHERE UNTIL PAYLETTER REVERSAL API EXISTS.
            #BillingAdapterInterface.remove_offsite_emp(session[:account_id], ot.id)
          end

        else
          PayLetterIssuesLogger.log( "PAYLETTER FAILED TO DELIVER EMP: #{@query_transx['response'].inspect}" )
          settings.logger.debug "DELIVERY_FAIL!"  # LOG THIS SOMEWHERE ALSO
        end
      elsif @query_transx && @query_transx["response"] && @query_transx["response"]["result"] == "OK"
        @errors << "Steam has not succeeded in charging the amount."
      elsif @query_transx && @query_transx["response"]
        @errors << "Error with steam processing."
      end
    end

    @breadcrumbs = [{text: "Store Home", href: "/#{@game}"},
                    {text: "Buy EMP", href: "/#{@game}/steam-emp"},
                    {text: "EMP Receipt"}]
    @title = "En Masse Points (EMP) | #{game_title}"

    @user = TeraSSO.refresh_data(session["account_id"])

    @hide_footer_nav = true
    erb :"purchase-flow/emp/steam-receipt", :layout => "layouts/#{@game}_min_layout".to_sym
  end

  get "/:game/steam/voucher/?" do
    get_game
    do_not_cache

    session["path"] = "steam"

    @steam_items = TeraItem.by_keyword("steam", :game_id => @game)
    @steam30 = @steam_items.select{|x| x.id == "elites30" }[0]
    @steam90 = @steam_items.select{|x| x.id == "elites90" }[0]

    @emp = 0
    if session[:account_id]
      wallet = BillingAdapterInterface.reload_wallet(session[:account_id])
      @emp = wallet.EMP[:amount] if wallet && wallet.EMP
    end

    erb :"purchase-flow/voucher/steam", :layout => "layouts/#{@game}_min_layout".to_sym
  end

  post "/:game/steam/voucher/purchase/?" do
    get_game
    @price = params[:item_price].to_i
    @item = StoreItem.find(params[:item_id], :game_id => @game)
    @game_account_id = params[:game_account_id].to_i
    game_account = session['account_info']['game_accounts'].select{|x| x["id"] == @game_account_id }[0]
    settings.logger.error "PARAMS STEAM VOUCHER PURCHASE!!!"
    settings.logger.error params.inspect
    error = false

    if @username    # Check if is elite, and elite price first, then for sale price, then normal price id.  #TODO
      purchase_opts = {:game_account_id => @game_account_id, :price_point_id => @item.prices[:normal].id, :amount => @item.normal_price,
        :elite => game_account["subscription_active"], :email => session['account_info']['email'], :location => "#{@game.downcase}-web", :game_code => gamecode(@game) }

      if @item.elite_price && game_account && game_account["subscription_active"]
        error = "The price of this item has changed from <span class='emp-icon small'></span>#{@item.elite_price} to <span class='emp-icon small'></span>#{@price}." if @price != @item.elite_price
        #purchase_opts[:price_point_id] = @item.prices[:elite].id
        purchase_opts[:campaign_id] = @item.prices[:elite].campaign_id
        purchase_opts[:amount] = @item.elite_price
      else
        error = "The price of this item has changed from <span class='emp-icon small'></span>#{@item.price} to <span class='emp-icon small'></span>#{@price}." if @price != @item.price
        if @item.sale_price
          #purchase_opts[:price_point_id] = @item.prices[:sale].id
          purchase_opts[:campaign_id] = @item.prices[:sale].campaign_id
          purchase_opts[:amount] = @item.sale_price
        end
      end

      settings.logger.error "PURCHASE OPTS"
      settings.logger.error purchase_opts

      if !error
        temp = StoreAPI.purchase(session["account_id"], @item, "EMP", purchase_opts)

        RefreshWalletWorker.new.async.perform(session["account_id"], "EMP", { :username => @username,
          :email => session["account_info"]["email"], :game_accounts => session["account_info"]["game_accounts"] })
        if temp["message"] == "value.invalid.externalPricePointId"
          StoreItem.schedule_reload
          error = "The price for this item is currently being updated and should be finished updating in a moment. This page will refresh at that time."
          temp["reload_watcher"] = true
        elsif temp["params"] && temp["params"]["human_readable:en"]
          error = temp["params"]["human_readable:en"]
        end
      end
    else
      error = "Please sign in to complete your purchase."
    end

    if error
      redirect "/#{@game}/steam/voucher", :error => error
    else
      erb :"purchase-flow/voucher/steam-receipt", :layout => "layouts/#{@game}_min_layout".to_sym
    end
  end
  # end steam emp purchase flow

  # receipt page
  post "/:game/payment-confirmation/?" do
    @billing = session["billing"]
    #@game = (@billing && @billing.game) || get_game
    @game = (@billing && @billing.game) || (params[:game] || "enmasse").downcase
    # settings.logger.debug "PC: [#{@billing.game}] [#{@game}]"

    @page_name = "#{@game}_packs"

    #settings.logger.error("===========ERROR SESSION???===================")
    #settings.logger.error( "@billing::: #{@billing.inspect}")
    #settings.logger.error( "PayLetter PARAMS: #{params.inspect}")
    settings.logger.info("===========INFO SESSION???===================")
    settings.logger.info( "@billing::: #{@billing.inspect}")
    settings.logger.info( "PayLetter PARAMS: #{params.inspect}")

    results = { "resultcode" => params["resultcode"],
                "resultmsg" => params["resultmsg"],
                "userno" => params["userno"],
                "gameuserno" => params["gameuserno"],
                "gamecode" => params["gamecode"],
                "pgcode" => params["pgcode"],
                "cashno" => params["cashno"],
                "tid" => params["tid"],
                "payamt" => params["payamt"],
                "taxamt" => params["taxamt"],
                "cashidentifier" => params["cashidentifier"],
                "realcashamt" => params["realcashamt"],
                "bonuscashamt" => params["bonuscashamt"],
                "paypaltender" => params["paypaltender"],
                "cardtype" => params["cardtype"],
                "cardacct" => params["cardacct"],
                "cardexpdate" => params["cardexpdate"],
                "paypalemail" => params["paypalemail"],
                "username" => params["username"],
                "address" => params["address"],
                "zipcode" => params["zipcode"],
                "city" => params["city"],
                "country" => params["country"],
                "state" => params["state"],
                "phonenumber" => params["phonenumber"],
                "email" => params["email"]
              }
    #@billing.payment_method = results["pgcode"] # payletter stopped sending us this....(caused a bunch of issues)
    @billing.purchase_info = results
    session["billing"] = @billing

    erb :"purchase-flow/popdown", :layout => false
  end

  post "/:game/xsolla-payment-confirmation/?" do
    @billing = session["billing"]
    @game = (@billing && @billing.game) || get_game

    if params['resultcode'] == '301' && params['tid'] == '0'
      # The payment was cancelled by the user
      @billing.purchase_info['resultcode'] = '301'    # set resultcode as cancelled
      session['billing']                   = @billing
    else
      res     = StoreAPI.get_payment_info(params["tid"])
      results = {"resultcode"     => res["RETCODE"] || params["resultcode"],
                 "resultmsg"      => res["ERRMSG"] || params["resultmsg"],
                 "userno"         => res["USERNO"],
                 "gameuserno"     => res["GAMEUSERNO"],
                 "gamecode"       => res["GAMECODE"],
                 "pgcode"         => res["PGCODE"],
                 "cashno"         => res["CASHNO"],
                 "tid"            => res["TID"],
                 "payamt"         => res["PAYAMT"],
                 "taxamt"         => res["TAXAMT"],
                 "cashidentifier" => res["CASHIDENTIFIER"],
                 "realcashamt"    => res["REALCASHAMT"],
                 "bonuscashamt"   => res["BONUSCASHAMT"]
      }
      @billing.purchase_info = results
      session['billing']     = @billing
    end

    return {success: true}.to_json
  end

  get "/:game/xsolla-payment-confirmation/?" do
    @billing = session["billing"]
    @game = (@billing && @billing.game) || get_game

    res     = StoreAPI.get_payment_info(params["invoice_id"])
    results = {"resultcode"     => res["RETCODE"],
               "resultmsg"      => res["ERRMSG"],
               "userno"         => res["USERNO"],
               "gameuserno"     => res["GAMEUSERNO"],
               "gamecode"       => res["GAMECODE"],
               "pgcode"         => res["PGCODE"],
               "cashno"         => res["CASHNO"],
               "tid"            => res["TID"],
               "payamt"         => res["PAYAMT"],
               "taxamt"         => res["TAXAMT"],
               "cashidentifier" => res["CASHIDENTIFIER"],
               "realcashamt"    => res["REALCASHAMT"],
               "bonuscashamt"   => res["BONUSCASHAMT"]
    }
    @billing.purchase_info = results
    session['billing']     = @billing

    redirect "/#{@game}/payment-confirmation"
  end

  get "/:game/payment-confirmation/?" do
    do_not_cache
    @game = (@billing && @billing.game) || get_game
    @page_name = "#{@game}_packs"
    @billing = session["billing"]
    if @billing.nil? || session["account_id"].nil?
      redirect "/#{@game}/", :error => "Unable to confirm order."
      return
    end

    # reload wallet
    @wallet = StoreAPI.reload_wallet(session["account_id"], "EMP", :username => @username,
      :email => session["account_info"]["email"], :game_accounts => session["account_info"]["game_accounts"])

    if @billing.auth_flag? && @billing.subscription? && session['existing_sub_id']
      EME::Subscription.revive(session['existing_sub_id'])
    end

    # dump subscription cache
    EME::Subscription.clear_cache_for_account(session["account_id"])

    
    @breadcrumbs = [{text: "Store Home", href: "/#{@game}"},
                    {text: "Buy EMP"}]
    @breadcrumbs[-1] = {text: "Elite Status"} if @billing.subscription?
    @title = "En Masse Points (EMP) | #{game_title}"
    @title = "Elite Status | #{game_title}" if @billing.subscription?

    if @game.downcase =='closers'
      @page_name = "closers_packs"
    end
    #DEBUG
    #PayLetterIssuesLogger.log(@billing.purchase_info.inspect)
    if @billing.purchase_info["resultcode"].to_i == 301  # cancel happened
      if @game.downcase == 'breach'
        if @billing.qcpoints?
          redirect "/#{@game}/qcpoints", :error => "Order canceled."
        else
          redirect "/#{@game}/early-access-pass", :error => "Order canceled."
        end
      elsif @game.downcase == 'st3'
        redirect "/strangerthings3thegame", :error => "Order canceled."
      elsif @game.downcase == 'closers'
        redirect "/closers/packs", :error => "Order canceled."
      else
        redirect "/#{@game}/", :error => "Order canceled."
      end
    elsif @billing.purchase_info["resultcode"].to_i != 0  # error happened
      redirect "/#{@game}/payment-failure"
    else
   #   if @game.downcase == 'breach'
   #     if @billing.qcpoints?
   #       erb :"purchase-flow/breach/qcpoints/receipt", :layout => "layouts/breach_layout".to_sym
   #     else
   #       erb :"purchase-flow/breach/early-access-pass/receipt", :layout => "layouts/breach_layout".to_sym
   #     end
   #   elsif @game.downcase == 'st3'
   #       erb :"purchase-flow/strangerthings/purchase/receipt", :layout => "layouts/strangerthings3thegame_layout".to_sym
   #   elsif @game.downcase == 'closers'
   #       erb :"purchase-flow/closers/packs/receipt", :layout => "layouts/closers_layout".to_sym
   #   else
        if @billing.subscription?
          erb :"purchase-flow/receipt", :layout => "layouts/#{@game}_layout".to_sym
        elsif @billing.emp?
          erb :"purchase-flow/emp/receipt", :layout => "layouts/emp_layout".to_sym
        else 
          if @game.downcase == 'st3'
            erb :"purchase-flow/strangerthings/purchase/receipt", :layout => "layouts/strangerthings3thegame_layout".to_sym
          elsif @game.downcase == 'closers'
            erb :"purchase-flow/closers/packs/receipt", :layout => "layouts/closers_layout".to_sym
          else
            erb :"purchase-flow/packs/receipt", :layout => "layouts/eme_layout".to_sym
          end
        end
        #erb :"purchase-flow/receipt", :layout => "#{@game}_layout".to_sym
      #end
    end
  end

  get "/:game/payment-failure/?" do
    @billing = session["billing"]
    @game = (@billing && @billing.game) || get_game
    redirect ("/#{@game}/") if session[:account_id].nil?

    @breadcrumbs = [{text: "Store Home", href: "/#{@game}"},
                    {text: "Buy EMP"}]

    if @game.downcase == 'breach'
      @title = "QC Points | #{game_title}"
    else
      @title = "En Masse Points (EMP) | #{game_title}"
    end
    

    @error_code = @billing.purchase_info["resultcode"]
    @error_msg = @billing.purchase_info["resultmsg"]

    if @billing.payment_method == "BOACOMPRA"
      res = nil
      if @error_code.to_i == -100
        # payment is pending now, recheck payment status and update error code
        res         = StoreAPI.get_boacompra_payment_info_by_order_no(@billing.purchase_info["cashno"])
        @error_code = res["RETCODE"]
        @error_msg  = res["ERRMSG"]
      end

      if @error_code.to_i == 0
        # pending is now changed to delivered, update payment information and show success page
        if res.nil? && @billing.purchase_info["cashno"]
          res = StoreAPI.get_boacompra_payment_info_by_order_no(@billing.purchase_info["cashno"])
        end
        if res
          results = {"resultcode"     => res["RETCODE"],
                     "resultmsg"      => res["ERRMSG"],
                     "userno"         => res["RESPONSE"]["USERNO"],
                     "gameuserno"     => res["RESPONSE"]["GAMEUSERNO"],
                     "gamecode"       => res["RESPONSE"]["GAMECODE"],
                     "pgcode"         => res["RESPONSE"]["PGCODE"],
                     "cashno"         => res["RESPONSE"]["CASHNO"],
                     "tid"            => res["RESPONSE"]["TID"],
                     "payamt"         => res["RESPONSE"]["PAYAMT"],
                     "taxamt"         => res["RESPONSE"]["TAXAMT"],
                     "cashidentifier" => res["RESPONSE"]["CASHIDENTIFIER"],
                     "realcashamt"    => res["RESPONSE"]["REALCASHAMT"],
                     "bonuscashamt"   => res["RESPONSE"]["BONUSCASHAMT"]
          }
          @billing.purchase_info = results
          session['billing']     = @billing
        end

        # redirect to success page
        redirect "/#{@game}/payment-confirmation"
        return
      end
    end

    if @game.downcase == 'breach'
      erb :"purchase-flow/failure", :layout => "layouts/breach_layout".to_sym
    elsif @billing.subscription?
      erb :"purchase-flow/failure", :layout => "layouts/#{@game}_layout".to_sym
    else
      erb :"purchase-flow/emp/failure", :layout => "layouts/emp_layout".to_sym
    end
  end

  get "/:game/payment/?" do
    get_game
    do_not_cache
    #@breadcrumbs = [{text: "Store Home", href: "/#{@game}"},
    #                {text: "Buy EMP"}]
    #@title = "En Masse Points (EMP) | #{game_title}"
    @user = TeraSSO.refresh_data(session["account_id"])
    @billing = session["billing"]

    if @billing && (@billing.payment_method.upcase == 'XSOLLA' || @billing.payment_method.upcase == 'XSOLLA_CREDIT')
      ams_client = AMS::API::Client.new
      user_id = @user['id']
      @xsolla = OpenStruct.new(
        userlevel: ams_client.users.get_max_character_level(user_id, true).result,
        lastactivedate: ams_client.users.get_last_active_date(user_id).result,
        totalhours: ams_client.users.get_total_days_of_login(user_id).result
      )
    else
      @xsolla = nil
    end

    if @billing.nil?
      flash[:error] = "Billing information timed out.  Please try again."
      redirect "/#{@game}/"
      return
    end

    settings.logger.info("@user:::" + @user.inspect)
    settings.logger.info(@user['id'].to_s + "::::::" +  @billing.display_game_account_id.to_s)
    @key = StoreAPI.secret_hash(@user['id'], @billing.display_game_account_id)
    erb :"purchase-flow/hidden-form", :layout => false
  end

  get "/tera/potion-shack" do
    redirect "/tera" unless Gifting.settings[:potion_shack]["enabled"]

    @game = "tera"
    @show_errors = session.delete(:show_errors)
    # @virtual_currencies = StoreAPI.currencies(gamecode(params[:game]), ["STEAM"])
    @breadcrumbs = [{text: "Store Home", href: "/#{@game}"},
                    {text: "Buy EMP"}]
    @title = "Potion Shack | #{game_title}"

    @ip_addr = request.env['HTTP_X_FORWARDED_FOR'] || request.env['REMOTE_ADDR']

    # @steam_id = nil
    # @steam_name = nil
    # if session[:account_info] && session[:account_info]["optional"]
    #   @steam_id = session[:account_info]["optional"]["steam_user_id"]
    #   @steam_name = session[:account_info]["optional"]["steam_user_persona_name"]
    # end

    session["path"] = "potion-shack"
    @app_styles = "potions"
    @app_scripts = "potions"

    # @user = TeraSSO.refresh_data(session["account_id"])

    @hide_footer_nav = true

    if session[:account_id] && session["account_info"]["game_accounts"].empty? # logged in and no active accounts
      flash[:warn] = NO_GAME_ACCOUNT_MESSAGE
    end

    # load basic information from AMS
    @user = TeraSSO.refresh_data(session["account_id"])
    @game_id = 24
    if @user['id']
      @emp = AMS::API::Client.new.users.get_emp(@user['id']).result
      @catalyst = AMS::API::Client.new.users.get_event_credit(@user['id']).result
    else
      # return to not logged in page???
    end
    @purchase_infos = {}
    @purchase_infos[:catalyst_1]  = Gifting.cache.read_or_write("catalyst_1_cost", :ttl => 300) {
      EasyHash.new.replace AMS::API::Client.new.event_credits.get_purchase_info('catalyst_1').to_hash
    }
    @purchase_infos[:catalyst_5]  = Gifting.cache.read_or_write("catalyst_5_cost", :ttl => 300) {
      EasyHash.new.replace AMS::API::Client.new.event_credits.get_purchase_info('catalyst_5').to_hash
    }
    @purchase_infos[:catalyst_10] = Gifting.cache.read_or_write("catalyst_10_cost", :ttl => 300) {
      EasyHash.new.replace AMS::API::Client.new.event_credits.get_purchase_info('catalyst_10').to_hash
    }
    @purchase_infos[:catalyst_25] = Gifting.cache.read_or_write("catalyst_25_cost", :ttl => 300) {
      EasyHash.new.replace AMS::API::Client.new.event_credits.get_purchase_info('catalyst_25').to_hash
    }
    erb :"potions", :layout => "layouts/#{@game}_min_layout".to_sym
  end

  post "/tera/potion-shack/purchase_catalyst" do
    redirect "/tera" unless Gifting.settings[:potion_shack]["enabled"]
    @user = TeraSSO.refresh_data(session["account_id"])

    @game = "tera"
    user_id = @user['id']
    catalyst = params[:catalyst]

    # read game_account_id from the in-game window
    # this comment seems wrong this is reading from session variable....
    game_account_id = @user['optional']['game_account_id'] rescue nil

    # if failed, determine game_account_id as user's first game_account
    unless game_account_id
      game_account_id = get_game_accounts(@game)[0]['id'] rescue nil
    end

    #if @user.nil? OR game accounts nil...  we got to get out.
    if @user.nil? || game_account_id.nil?
      settings.logger.error("------------------ERROR------------------")
      settings.logger.error("ERROR FINDING USER IN CATALYST PURCHASE")
      settings.logger.error("@user: #{@user.inspect}")
      settings.logger.error("game_accounts (get_game_accounts(@game): #{get_game_accounts(@game)}")
      return {:error => true, :message => "User and or account not found."}.to_json
    end

    case catalyst.to_i
      when 1
        external_offer_id = 'catalyst_1'
        credit = 1
      when 5
        external_offer_id = 'catalyst_5'
        credit = 5
      when 10
        external_offer_id = 'catalyst_10'
        credit = 10
      when 25
        external_offer_id = 'catalyst_25'
        credit = 25
      when 50
        external_offer_id = 'catalyst_50'
        credit = 50
      when 100
        external_offer_id = 'catalyst_100'
        credit = 100
      else
        return {:error => true, :message => "Invalid catalyst, it should be one of 1, 5, 10, 25, 50, 100"}.to_json
    end

    begin
      result = AMS::API::Client.new.event_credits.purchase_credit(user_id, game_account_id, external_offer_id, credit)
    rescue AMS::API::Error => e
      return {:error => true, :message => e.error_message}.to_json
    end
    return {transaction_id: result.transaction_id, emp: result.remain_amount, catalyst: result.after_credit}.to_json
  end

  post "/tera/potion-shack/open_gift" do
    redirect "/tera" unless Gifting.settings[:potion_shack]["enabled"]
    @user = TeraSSO.refresh_data(session["account_id"])
    @game = "tera"
    user_id = @user['id']

    # read game_account_id from the in-game window
    game_account_id = @user['optional']['game_account_id'] rescue nil

    # if failed, determine game_account_id as user's first game_account
    game_account_id = get_game_accounts(@game)[0]['id'] unless game_account_id

    if Gifting.settings[:potion_shack]["red_group_promo_code"] && params[:open_index].to_i == 1
      group_promo_code = Gifting.settings[:potion_shack]["red_group_promo_code"]
    else
      group_promo_code = Gifting.settings[:potion_shack]["group_promo_code"]
    end
    credit_used = ((Gifting.settings[:potion_shack]['catalysts_per_try']).to_i rescue nil) || 5
    open_index = params[:open_index]
    begin
      result = AMS::API::Client.new.event_credits.open_gift(user_id, game_account_id, group_promo_code, credit_used, open_index)
    rescue AMS::API::Error => e
      return {:error => true, :message => e.error_message}.to_json
    end
    return {gift: result.gift, selected_game_item: result.selected_game_item, messages: result.messages, catalyst: result.after_credit}.to_json
  end

  get "/tera/potion-shack/get_emp_and_catalyst" do
    redirect "/tera" unless Gifting.settings[:potion_shack]["enabled"]
    @user = TeraSSO.refresh_data(session["account_id"])
    user_id = @user['id']
    emp = AMS::API::Client.new.users.get_emp(user_id).result
    catalyst = AMS::API::Client.new.users.get_event_credit(user_id).result
    return { emp: emp, catalyst: catalyst }.to_json
  end

  get "/extralife" do
    redirect "/"
    #@title = "En Masse Store | Extra Life"
    #erb :"extralife", :layout => true
  end

  get "/black-friday/sales" do
    redirect "/"
    #@title = "Black Friday | Sales"
    #erb :"blackfridaysales_layout", :layout => false
  end

  get "/black-friday/emp-deals" do
    redirect "/"
    #@title = "Black Friday | EMP Deals"
    #erb :"blackfridayemp_layout", :layout => false
  end



  get "/closers" do
    @title = "Closers Gifting Center"
    erb :"closersgifting_layout", :layout => false 
  end

  GAMECODES = {"tera" => "TERA", "enmasse" => "Enmasse", "closers" => "Closers", "breach" => "Breach", "st3" => "ST3"}.freeze

  def gamecode(game)
    GAMECODES[game.downcase]
  end

  def get_game
    @game = params[:game].downcase
  end

  def do_not_cache
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate' # HTTP 1.1.
    response.headers['Pragma'] = 'no-cache' # HTTP 1.0.
    response.headers['Expires'] = '0' # Proxies.
  end

  def convert_pennies_to_pl_dollars(amount)
    amount = amount.to_f / 100.0
    amount_int = amount.to_i
    return amount_int if amount_int == amount
    return amount
  end

  TITLES = {"tera" => "TERA", "enmasse" => "Enmasse", "closers" => "Closers", "breach" => "Breach", "st3" => "ST3"}.freeze
  def game_title
    title = TITLES[@game]
    return "" if title.nil?
    return title
  end

  def get_game_accounts(game)
    @game_accounts = session["account_info"]["game_accounts"].select{|x| x["name"] && x["name"].downcase.include?(game.downcase) }
  end

  def user_iovation_denied?
    return false if session['account_info'].nil?
    return session['account_info']['io_result'] == "D"
  end

end