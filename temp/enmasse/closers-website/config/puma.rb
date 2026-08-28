workers Integer(ENV['WEB_CONCURRENCY'] || 2)
threads_count = Integer(ENV['RAILS_MAX_THREADS'] || 5)
threads threads_count, threads_count

preload_app!

rackup      DefaultRackup
port        ENV['RAILS_PORT'] || 3000
environment ENV['RAILS_ENV']  || 'development'

on_worker_boot do
  ActiveRecord::Base.establish_connection
end
