set :stage, :webedge
set :rails_test_env, "test"
set :rails_env, "edge"
set :rack_env, "development"
set :deploy_user, "deploy"

set :unicorn_rack_env, fetch(:rack_env)

server '10.63.18.245', user: "#{fetch(:deploy_user)}", roles: %w{db}
server '10.63.18.246', user: "#{fetch(:deploy_user)}", roles: %w{app}

set :deploy_to, "/var/www/rails/eme/#{fetch(:application)}"
set :shared_root,   "#{fetch(:deploy_to)}/shared"
set :shared_config, "#{fetch(:shared_root)}/config"
set :shared_public, "#{fetch(:deploy_to)}/current/public" # Setting this to current public since we are not using shared

set :log_level, :info

set :ask_on_old_values, false
set :ask_on_blank, true

current_branch = `git branch`.match(/\* (\S+)\s/m)[1]
set :branch, ENV['BRANCH'] || current_branch || "master"
inform "Using branch: #{fetch(:branch)}"

# Default value for :linked_files is []
set :linked_files, %w{config/database.yml config/gifting.yml config/tera_game.yml config/steam_api.yml config/pay_letter.yml config/eme_subscription.yml config/ams_api.yml config/billing_adapter_interface.yml config/eme_global_assets.yml} #TODO: Remove any config files you don't need

# Environment specific settings to be placed into database.yml when deployed
set :db_adapter, "mysql2"
set :db_encoding, "utf8"
set :db_reconnect, "false"
set :db_pool, "5"
set :db_hostname, "10.63.18.245"
set :appdb, "eme_store"	# TODO: Fill in - will have env appended (e.g. web_ams_development)
set :logdb, "eme_logdb"	# TODO: Change if app - will have env appended (e.g. eme_logdb_development)

# Environment specific settings to be placed into memcached.yml when deployed
set :memcached_name, "eme_store" # will have env appended (e.g. eme_ams_platform_development)
set :memcached_servers, %w{"10.63.18.246:11211"} #NO COMMAS and MUST have quotes otherwise the colon messes up YAML

# Environment specific settings for billing_adapter_interface.yml when deployed
set :billing_adapter_name, "BillingAdapterInterface"
set :billing_adapter_service_url, "http://billing.service.edge.enmasse.com"
set :billing_adapter_service_port, "5000"
set :billing_adapter_use_ssl, false
set :billing_adapter_use_memcache, true
set :billing_adapter_memcached_servers, %w{"10.63.18.246:11211" "127.0.0.1:11211"}
set :billing_adapter_cache_prefix, "bai-dev"
set :billing_adapter_type, "json"
set :billing_adapter_root_url, "http://edge.billing.enmasse.com"
set :billing_adapter_purchase_url, "payment.aspx"
set :billing_adapter_purchase_item_url,	"payment_direct.aspx"

# Environment specific settings for gifting.yml when deployed
set :gifting_enabled, false
set :gifting_url, "https://account-edge.enmasse.com"
set :gifting_use_ssl, true
set :gifting_name, "Gifting"
set :gifting_auth_key, "Token token=ef29bf65f9096bf682ddadff868ca14b"
set :gifting_use_memcache, false
set :gifting_memcached_hosts, %w{"10.63.18.246:11211"}
set :gifting_cache_prefix, "gifting-dev"
set :gifting_promo_id, 286
set :gifting_gift_kind_id, 4
set :gifting_type, "json"
set :gifting_potion_shack_group_promo_code, "4664MQF82Z4GMQ4B5VDY"
set :gifting_potion_shack_catalysts_per_try, 5
set :gifting_potion_enabled, true

# Environment specific settings for tera_game.yml
set :tera_name, "TeraGame"
set :tera_url, "http://10.63.19.132:8000"
set :tera_use_ssl, false
set :tera_use_memcache, false
set :tera_memcached_hosts, %w{"10.63.18.246:11211"} #NO COMMAS and MUST have quotes otherwise the colon messes up YAML
set :tera_cache_prefix, "TERAGame-dev"
set :tera_game_id, 1
set :tera_type, "json"

# Environment specific settings for pay_letter.yml
set :payletter_url, "http://api.billing.enmasse.com"
set :payletter_purchase_url, "https://billing.enmasse.com/payment.aspx"
set :payletter_ssl, false
set :payletter_name, "PayLetter"
set :payletter_use_memcache, true
set	:payletter_cache_prefix, "payletter-prod"
set :payletter_memcached_hosts, %w{"10.63.18.246:11211"}
set :payletter_type, "json"
	
# Environment specific settings for eme_bt.yml
set :eme_bt_url, "http://bt.edge.enmasse.com"
set :eme_bt_ssl, false
set :eme_bt_name, "EME::BT"
set :eme_bt_use_memcache, false
set :eme_bt_type, "json"
set :eme_bt_log_level, "debug"
set :eme_bt_resource, "test"
set :eme_bt_game, "testgame"

## Environment specific settings for eme_subscription.yml
set :subscription_url, "http://subscription.service.edge.enmasse.com"
set :subscription_use_ssl, false
set :subscription_name, "EME::Subscription"
set :subscription_use_memcache, true
set :subscription_api_key, "4wmWPC52LGCb521UTSeU17T1gVP3wB94"
set :subscription_memcached_hosts, %w{"10.63.18.246:11211"}
set :subscription_cache_prefix, "subs-dev"
set :subscription_type, "json"
set :subscription_log_level, "debug"
set :subscription_item_id, 2622

# Environment specific settings for steam_api.yml
set :steam_api_url, "https://partner.steam-api.com"
set :steam_api_ssl, true
set :steam_api_name, "SteamAPI"
set :steam_api_use_memcache, false
set :steam_api_type, "json"
set :steam_api_url_prefix, "/ISteamMicroTxn"

# Environment specific settings to be placed into project .conf for nginx
set :server_url_prefix, "store"
set :server_url_suffix, "enmasse.com"
set :server_url, "#{fetch(:server_url_prefix)}.#{fetch(:stage)}.#{fetch(:server_url_suffix)}" 	#TODO: FILL ME IN
#set :server_admin_url, "admin.#{fetch(:server_url)}"
set :server_port, "80" # TODO: Change me if not HTTP e.g. service
set :server_ssl_port, "443"
set :server_keepalive, "5"
set :server_fail_timeout, "0"
set :server_max_body_size, "4G"
set :server_ssl_cert, "#{fetch(:shared_root)}/#{fetch(:server_url)}.crt"
set :server_ssl_key,  "#{fetch(:shared_root)}/#{fetch(:server_url)}.key"
set :server_url_access_log, "/var/log/nginx/#{fetch(:application)}.access.log"
set :server_url_error_log, "/var/log/nginx/#{fetch(:application)}.error.log"
#set :server_admin_url_access_log, "/var/log/nginx/admin.#{fetch(:application)}.access.log"
#set :server_admin_url_error_log, "/var/log/nginx/admin.#{fetch(:application)}.error.log"

set :server_cdn_use, true
set :server_cdn_port, "80"
set :server_cdn_names, "store-cdn0.enmasse-dev.com store-cdn1.enmasse-dev.com store-cdn2.enmasse-dev.com store-cdn3.enmasse-dev.com"
set :server_cdn_access_log, "/var/log/nginx/#{fetch(:application)}-cdn.access.log"
set :server_cdn_error_log, "/var/log/nginx/#{fetch(:application)}-cdn.error.log"

# General config variables for this environment, control deploy process
set :bundle_without, %w{} # Comment out in production
set :bundle_flags, '--quiet' # Comment out in production

# Environment specific settings to be placed into eme_global_assets.yml when deployed
set :js_dir, "assets/javascripts/global"
set :css_dir, "assets/css/global"
set :img_dir, "assets/images/global"

# Settings for compass compilation
set :compass_preferred_syntax, :sass
set :compass_http_path, '/'
set :compass_css_dir, 'assets/css'
set :compass_sass_dir, 'assets/css'
set :compass_images_dir, 'assets/images'
set :compass_javascripts_dir, 'assets/javascripts'
set :compass_relative_assets, true
set :compass_line_comments, true
set :compass_output_style, ":compressed"

# Environment specific settings for log rotation (logrotate)
set :logrotate_path, "#{fetch(:deploy_to)}/current/log/*.log"
set :logrotate_frequency, "daily"
set :logrotate_missingok, "missingok"
set :logrotate_rotate, "rotate"
set :logrotate_rotate_lifespan, 14
set :logrotate_compress, "compress"
set :logrotate_compress_mode, "delaycompress"
set :logrotate_notifempty, "notifempty"
set :logrotate_mode, "copytruncate"

# files to be templated and copied by deploy:setup_config - root app_home
set(:setup_files, [
  {
    source: "config/nginx.conf.erb",
    target: "/etc/nginx/conf.d/#{fetch(:application)}.conf"
  },
  {
    source: "config/unicorn.conf.erb",
    target: "/etc/unicorn/#{fetch(:application)}.conf"
  },
  {
    source: "config/eme_store_common.erb",
    target: "/etc/nginx/eme_store_common"
  },
  {
    source: "config/eme_store_rewrites",
    target: "/etc/nginx/eme_store_rewrites"
  },
  {
    source: "config/compass.rb.erb",
    target: "#{fetch(:shared_config)}/compass.rb"
  },
  {
    source: "config/logrotate.erb",
    target: "/etc/logrotate.d/#{fetch(:application)}"
  },
  {
    source: "config/nginx_ssl.conf.erb",
    target: "/etc/nginx/conf.d/#{fetch(:application)}_ssl.conf"
  } # TODO: Uncomment this block if you want the site to respond to ssl traffic, make sure you provide settings in the environment files!
])

# files to be made executable
set(:executable_setup_files, %w())

namespace :deploy do
 
	before :updated, "deploy:merge_global_assets"

	before "deploy:restart", "web:get_cert"
  #before :wrapup,	"web:rebuild_cache" # TODO: If this is a cached Rails project, uncomment this line
	after  :published, "memcached:flush_all"  # TODO: Enable if you are using memcached and CDN links
  after  :wrapup,  "deploy:gather_logs"   # TODO: Enable this if you want all logs generated to be pulled onto the master server
  #before :started, "deploy:purge_logs"    # TODO: Enable this if you want to purge all logs before a deployment starts

	#before "deploy:updated", "deploy:db:load" # TODO: Enable this to create a new db on this environment EVERY TIME you deploy
	
	# Overriding standard compile for assets as it fails to load the rails environment!?!?
	desc 'Assetpack compile'
	task :compile_assetpack do
    on roles(:app) do |host|
      within fetch(:release_path) do
			  with rack_env: fetch(:unicorn_rack_env), rails_env: fetch(:rails_env) do
	        execute :rake, "assetpack:build"
				end
	    end
    end
	end
	
	after "deploy:merge_global_assets", "deploy:compile_assetpack"
end
