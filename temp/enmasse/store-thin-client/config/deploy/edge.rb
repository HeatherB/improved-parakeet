set :stage, :edge
set :rails_env, "edge"
set :rails_test_env, "test"

# capistrano3-unicorn options - http://unicorn.bogomips.org/unicorn_1.html#TOC & http://www.rubydoc.info/gems/capistrano3-unicorn/frames
set :unicorn_rack_env, :development

#server '10.63.18.245', user: 'deploy', roles: %w{db}
#server '10.63.18.246', user: 'deploy', roles: %w{app}

set :deploy_to, "/var/www/rails/eme/#{fetch(:application)}"
set :shared_root,   "#{fetch(:deploy_to)}/shared"
set :shared_config, "#{fetch(:shared_root)}/config"
set :shared_public, "#{fetch(:deploy_to)}/current/public" # Setting this to current public since we are not using shared

set :log_level, :info

set :ask_on_old_values, false
set :ask_on_blank, true

if ENV["BRANCH"].nil?
  ask :branch, proc { 
	  if File.exist?('revisions.log')
	  	`grep deployed revisions.log | tail -n 1 | cut -f2 -d' '`.chomp
	  end
  }
else
  set :branch, ENV["BRANCH"]
end

# Environment specific settings to be placed into database.yml when deployed
set :db_adapter, "mysql2"
set :db_encoding, "utf8"
set :db_reconnect, "false"
set :db_pool, "5"
set :db_hostname, "10.63.18.245"
set :db_tera_portal, "10.63.18.136"
set :appdb, "web_store"	# TODO: Fill in - will have env appended (e.g. web_ams_development)
set :appadmindb, "" # TODO: Fill in - will have env appended (e.g. web_ams_development)
set :logdb, "eme_logdb"	# TODO: Change if app - will have env appended (e.g. eme_logdb_development)

# Environment specific settings to be placed into memcached.yml when deployed
set :memcached_name, "eme_ams_platform" # will have env appended (e.g. eme_ams_platform_development)
set :memcached_server, "10.63.18.246:11211"
set :memcached_servers, %w{"10.63.18.246:11211" "127.0.0.1:11211"} #NO COMMAS and MUST have quotes otherwise the colon messes up YAML

# Environment specific settings for billing_adapter_interface.yml when deployed
set :billing_adapter_name, "BillingAdapterInterface"
set :billing_adapter_service_url, "http://billing.service.edge.enmasse.com"
set :billing_adapter_service_port, "5000"
set :billing_adapter_use_ssl, false
set :billing_adapter_use_memcache, true
set :billing_adapter_type, "json"
set :billing_adapter_cache_prefix, "bai-dev"
set :billing_adapter_root_url, "http://edge.billing.enmasse.com"
set :billing_adapter_purchase_url, "payment.aspx"
set :billing_adapter_purchase_item_url,	"payment_direct.aspx"
set :billing_adapter_mystery_key, "5FADCAFDFAA36452E7068705DA2A73E7F3979FE3A941AACC28D0591315B4C6AF"
set :billing_adapter_api_key, "C568B7FE4040FEAC125BB51DC8C4A7CEB971B7AE1841C91CE287B2215D798F41"

# Environment specific settings for gifting.yml when deployed
set :gifting_enabled, false
set :gifting_url, "https://account-edge.enmasse.com"
set :gifting_use_ssl, true
set :gifting_name, "Gifting"
set :gifting_auth_key, "Token token=ef29bf65f9096bf682ddadff868ca14b"
set :gifting_use_memcache, false
set :gifting_cache_prefix, "gifting-dev"
set :gifting_promo_id, 286
set :gifting_gift_kind_id, 4
set :gifting_type, "json"
set :gifting_potion_shack_group_promo_code, "2017KyrasHalloween01"
set :gifting_potion_shack_red_group_promo_code, "2017KyrasHalloween01"
set :gifting_potion_shack_catalysts_per_try, 5
set :gifting_potion_enabled, true

# Environment specific settings for tera_game.yml
set :tera_name, "TeraGame"
set :tera_url, "http://10.63.19.132:8000"
set :tera_use_ssl, false
set :tera_use_memcache, false
set :tera_memcache_hosts, '- "10.63.18.246:11211"'
set :tera_cache_prefix, "TERAGame-dev"
set :tera_game_id, 1
set :tera_type, "json"

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
set :subscription_cache_prefix, "subs-dev"
set :subscription_type, "json"
set :subscription_log_level, "debug"
set :subscription_item_id, 2622

# Environment specific settings to be placed into secure_config.yml when deployed
# None yet

# Environment specific settings to be placed into project .conf for nginx
set :server_url_prefix, "store"
set :server_url_suffix, "enmasse.com"
set :server_url, "#{fetch(:server_url_prefix)}-#{fetch(:stage)}.#{fetch(:server_url_suffix)}" 	#TODO: FILL ME IN
set :server_admin_url, "admin.#{fetch(:server_url)}"
set :server_port, "80" # TODO: Change me if not HTTP e.g. service
set :server_ssl_port, "443"
set :server_keepalive, "5"
set :server_fail_timeout, "0"
set :server_max_body_size, "4G"
set :server_ssl_cert, "#{fetch(:shared_root)}/#{fetch(:server_url)}.crt"
set :server_ssl_key,  "#{fetch(:shared_root)}/#{fetch(:server_url)}.key"
set :server_url_access_log, "/var/log/nginx/#{fetch(:application)}.access.log"
set :server_url_error_log, "/var/log/nginx/#{fetch(:application)}.error.log"
set :server_admin_url_access_log, "/var/log/nginx/admin.#{fetch(:application)}.access.log"
set :server_admin_url_error_log, "/var/log/nginx/admin.#{fetch(:application)}.error.log"

set :server_cdn_num, 4
set :server_cdn_url_prefix, "store"
set :server_cdn_url_suffix, "#{fetch(:stage)}.enmasse-dev.com"

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
    source: "config/compass.rb.erb",
    target: "#{fetch(:shared_config)}/compass.rb"
  },
  {
    source: "config/nginx_ssl.conf.erb",
    target: "/etc/nginx/conf.d/#{fetch(:application)}_ssl.conf"
  } # TODO: Uncomment this block if you want the site to respond to ssl traffic, make sure you provide settings in the environment files!
])
# files to be made executable
set(:executable_setup_files, %w())

namespace :deploy do
 
  # Run any deployment specific tests
  task :run_tests do
    puts "Running post-deploy tests..."
  end

  #after :deploy, "deploy:run_tests"
	before "deploy:restart", "web:get_cert"
  #before :wrapup,	"web:rebuild_cache" # TODO: If this is a cached Rails project, uncomment this line
  after  :wrapup,  "deploy:gather_logs"   # TODO: Enable this if you want all logs generated to be pulled onto the master server
  #before :started, "deploy:purge_logs"    # TODO: Enable this if you want to purge all logs before a deployment starts

end
