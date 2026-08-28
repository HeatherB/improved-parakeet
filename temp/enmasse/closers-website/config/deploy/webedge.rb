set :stage, :webedge
set :rails_env, "development"
set :rails_test_env, "test"
set :deploy_user, "deploy"

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

# Environment specific settings to be placed into database.yml when deployed
set :db_adapter, "mysql2"
set :db_encoding, "utf8"
set :db_reconnect, "false"
set :db_pool, "5"
set :db_hostname, "10.63.18.245" # Change back to localhost!
set :appdb, "ava_website"	# will have env appended (e.g. web_ams_development) - see database.yml.sample
set :appadmindb, "ams_admin_platform" # will have env appended
set :logdb, "eme_logdb"	# will have env appended (e.g. eme_logdb_development) - see database.yml.sample

# Environment specific settings to be placed into memcached.yml when deployed
set :memcached_name, "eme_online"
set :memcached_servers, %w{10.63.18.246} #NO COMMAS and MUST have quotes otherwise the colon messes up YAML
set :memcached_port, 11211

# Environment specific settings for eme_sso
set :eme_sso_auth_server, "auth.service.edge.enmasse.com"
set :eme_sso_auth_port, 4567
set :eme_sso_account_server, "account-edge.enmasse.com"
set :eme_sso_account_url, "https://account-edge.enmasse.com"

# Environment specific settings for app_config.yml
set :app_config_admin_hostname, "admin.edge.enmasse.com"
set :app_config_admin_port, 443
set :app_config_admin_protocol, "https"
set :app_config_default_hostname, "www.edge.enmasse.com"
set :app_config_default_port, 80
set :app_config_default_protocol, "http"
set :app_config_realip_header, "HTTP_X_FORWARDED_FOR"

# Environment specific settings for billing_adapter_interface.yml when deployed
set :billing_adapter_name, "BillingAdapterInterface"
set :billing_adapter_service_url, "http://billing.service.edge.enmasse.com"
set :billing_adapter_service_port, "5000"
set :billing_adapter_use_ssl, false
set :billing_adapter_use_memcache, true
set :billing_adapter_memcached_servers, fetch(:memcached_servers)
set :billing_adapter_type, "json"
set :billing_adapter_cache_prefix, "bai-dev"
set :billing_adapter_root_url, "http://edge.billing.enmasse.com"
set :billing_adapter_purchase_url, "payment.aspx"
set :billing_adapter_purchase_item_url,	"payment_direct.aspx"

# Environment specific settings to be placed into <project>.conf for nginx
set :server_url_prefix, "enmasse"
set :server_url_suffix, "enmasse.com"
set :server_url, "#{fetch(:server_url_prefix)}.#{fetch(:stage)}.#{fetch(:server_url_suffix)}" 	#TODO: FILL ME IN
set :server_admin_url, "admin.#{fetch(:server_url)}"
set :server_port, "80"
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
set :server_cdn_url_prefix, "enmasse"
set :server_cdn_url_suffix, "#{fetch(:stage)}.enmasse-dev.com"

# General config variables for this environment, control deploy process
set :bundle_without, %w{}
set :bundle_flags, '--quiet'

# Environment specific settings for mogilefs
set :mogilefs_name, "enmasse_online" # will have env appended (e.g. eme_ams_platform_development)
set :mogilefs_servers, %w{10.63.22.139} #NO COMMAS
set :mogilefs_port, 7001

# Environment specific settings for private pages
set :private_pages_username, "testbed"
set :private_pages_password, "mmotest11"
set :private_pages_block_pages, %w{}

# Environment specific settings to be placed into eme_global_assets.yml when deployed
set :js_dir, "assets/javascripts/global"
set :css_dir, "assets/css/global"
set :img_dir, "assets/images/global"

# Settings for compass compilation
set :compass_preferred_syntax, :sass
set :compass_http_path, '/'
set :compass_css_dir, 'app/assets/stylesheets'
set :compass_sass_dir, 'app/assets/stylesheets'
set :compass_images_dir, 'app/assets/images'
set :compass_javascripts_dir, 'app/assets/javascripts'
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
    source: "config/enmasse_online_common.erb",
    target: "/etc/nginx/enmasse_online_common"
  },
  {
    source: "config/enmasse_online_rewrites",
    target: "/etc/nginx/enmasse_online_rewrites"
  },
  {
    source: "config/compass.rb.erb",
    target: "#{fetch(:shared_config)}/compass.rb"
  },
  {
    source: "config/nginx_ssl.conf.erb",
    target: "/etc/nginx/conf.d/#{fetch(:application)}_ssl.conf"
  },
	{
    source: "config/logrotate.erb",
    target: "/etc/logrotate.d/#{fetch(:application)}"
  }
])

# files to be made executable
set(:executable_setup_files, %w())

namespace :deploy do

	before :updated, "deploy:merge_global_assets"
	before "deploy:restart", "web:get_cert"
  #before :published, "web:rebuild_cache"    # TODO: If this is a cached Rails project, uncomment this line
	after  :published, "memcached:flush_all"  # TODO: Enable if you are using memcached and CDN links
  after  :wrapup,  "deploy:gather_logs"   # TODO: Enable this if you want all logs generated to be pulled onto the master server
  #before :started, "deploy:purge_logs"    # TODO: Enable this if you want to purge all logs before a deployment starts
	
end