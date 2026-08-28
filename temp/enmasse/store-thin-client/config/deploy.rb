# config valid only for Capistrano 3.1
lock '3.4.0'

set :application, 'store-thin-client'  # TODO: Set me!
#set :repo_url, '' # TODO: Set me, if different from application name for some reason

set :overall_result, true
set :shell, '/bin/bash'
set :log_file, "#{fetch(:application)}-deploy.log"
set :scm, :git

if fetch(:repo_url).nil? || fetch(:repo_url).empty?
set :repo_url, "git@github.com:enmasse-entertainment/#{fetch(:application)}.git"
end

# Default value for :format is :pretty and it ain't
set :format, :EMEFormatter

# Default value for :pty is false
set :pty, true

if File.exist?('.ruby-version') # This will only work if we are integrated into the branch we want to deploy
  File.open('.ruby-version', 'r') do |f1|  
    while line = f1.gets 
      set :rvm_ruby_version, line.strip
    end  
  end
end

# Default value for :linked_files is []
#set :linked_files, %w{config/database.yml config/gifting.yml config/tera_game.yml config/steam_api.yml config/secure_config.yml config/eme_subscription.yml config/ams_api.yml config/billing_adapter_interface.yml config/eme_global_assets.yml config/compass.rb} unless fetch(:rails_env).eql? "production"

# Default value for linked_dirs is []
set :linked_dirs, %w{bin log tmp/pids tmp/cache tmp/sockets vendor/bundle }

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for keep_releases is 5
set :keep_releases, 2

# delayed_jobs options - https://github.com/collectiveidea/delayed_job/wiki/Delayed-Job-tasks-for-Capistrano-3
set :delayed_job_server_role, :app
set :delayed_job_args, "-n 2"

# capistrano-rails options - https://github.com/capistrano/rails
#set :rails_env, 'staging'                  # If the environment differs from the stage name
#set :migration_role, 'migrator'            # Defaults to 'db'
set :assets_roles, [:web, :app]            # Defaults to [:web]
#set :assets_prefix, 'prepackaged-assets'   # Defaults to 'assets' this should match config.assets.prefix in your rails config/application.rb

# capistrano-bundler options - https://github.com/capistrano/bundler
#set :bundle_roles, :all                                  # this is default
#set :bundle_servers, -> { release_roles(fetch(:bundle_roles)) } # this is default
#set :bundle_binstubs, -> { shared_path.join('bin') }     # this is default
#set :bundle_gemfile, -> { release_path.join('MyGemfile') } # default: nil
#set :bundle_path, -> { shared_path.join('bundle') }      # this is default
#set :bundle_without, %w{development test}.join(' ')      # this is default
#set :bundle_flags, '--deployment --quiet'                # this is default
#set :bundle_env_variables, {}                    # this is default

# capistrano-rvm options - https://github.com/capistrano/rvm
#set :rvm_type, :user                     # Defaults to: :auto
#set :rvm_ruby_version, "."      		  # Defaults to: 'default'
#set :rvm_custom_path, '~/.myveryownrvm'  # only needed if not detected

#before 'deploy:setup', 'rvm:install_rvm'  # install/update RVM
#before 'deploy:setup', 'rvm:install_ruby' # install Ruby and create gemset, OR:
#before 'deploy:setup', 'rvm:create_gemset' # only create gemset

# capistrano-nginx options - https://github.com/koenpunt/capistrano-nginx
#set :nginx_path, '/etc/nginx' # directory containing sites-available and sites-enabled
#set :nginx_template, 'config/deploy/nginx_conf.erb' # configuration template
#set :nginx_server_name, 'example.com' # optional, defaults to :application
#set :nginx_upstream, 'example-app' # optional, defaults to :application
#set :nginx_listen, 80 # optional, default is not set
set :nginx_roles, :app

namespace :deploy do

  before :updated, "deploy:build_config"
  before :updated, "deploy:setup_config"
  
  after  :finished,   "deploy:wrapup"
  after  :publishing, "deploy:restart"
  after  :failed, 	  "deploy:process_error"

  #Delayed job tasks - uncomment as necessary
  #after  "deploy:restart", "delayed_job:restart"
  #after  "deploy:stop", "delayed_job:stop"
  #after  "deploy:start", "delayed_job:start"
	
end
