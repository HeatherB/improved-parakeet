set :stage, :edge
set :rails_env, "edge"
set :rails_test_env, "test"

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
  ask(:branch, "edge")
else
  set :branch, ENV["BRANCH"]
end

# Environment specific settings to be placed into database.yml when deployed
set :db_adapter, "mysql2"
set :db_encoding, "utf8"
set :db_reconnect, "false"
set :db_pool, "5"
set :db_hostname, "10.63.18.245" # Change back to localhost!
set :appdb, "teradocker_website"	# will have env appended (e.g. web_ams_development) - see database.yml.sample
set :appadmindb, "ams_admin_platform" # will have env appended
set :logdb, "eme_logdb"	# will have env appended (e.g. eme_logdb_development) - see database.yml.sample

# Environment specific settings to be placed into memcached.yml when deployed
set :memcached_name, "teradocker_website" # will have env appended (e.g. eme_ams_platform_development)
set :memcached_servers, ["127.0.0.1:11211"] # array of servers

# Environment specific settings to be placed into secure_config.yml when deployed
# None yet

# Environment specific settings to be placed into <project>.conf for nginx
set :server_url, "enmasse.#{fetch(:stage)}.enmasse.com"
set :server_admin_url, "admin.#{fetch(:server_url)}"
set :server_port, "80"
set :server_ssl_port, "443"
set :server_keepalive, "5"
set :server_fail_timeout, "0"
set :server_max_body_size, "4G"
set :server_ssl_cert, "/etc/nginx/ssl/server.crt"
set :server_ssl_key, "/etc/nginx/ssl/server.key"
set :server_url_access_log, "/var/log/nginx/#{fetch(:application)}.access.log"
set :server_url_error_log, "/var/log/nginx/#{fetch(:application)}.error.log"
set :server_admin_url_access_log, "/var/log/nginx/admin.#{fetch(:application)}.access.log"
set :server_admin_url_error_log, "/var/log/nginx/admin.#{fetch(:application)}.error.log"

# General config variables for this environment, control deploy process
set :bundle_without, %w{} # Comment out in production
set :bundle_flags, '--quiet' # Comment out in production

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

set :log_level, :debug

set :deploy_to, "/var/www/rails/eme/#{fetch(:application)}"
set :shared_config, "#{fetch(:deploy_to)}/shared/config"
set :shared_public, "#{fetch(:deploy_to)}/current/public" # Setting this to current public since we are not using shared

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
  } 
])

namespace :deploy do
 
  # Run any deployment specific tests
  task :run_tests do
    puts "Running post-deploy tests..."
  end

  after :deploy, "deploy:run_tests"

end
