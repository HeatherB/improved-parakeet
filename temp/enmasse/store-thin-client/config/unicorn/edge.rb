# This configuration file documents many features of Unicorn
# that may not be needed for some applications. See
# http://unicorn.bogomips.org/examples/unicorn.conf.minimal.rb
# for a much simpler configuration file.
#
# See http://unicorn.bogomips.org/Unicorn/Configurator.html for complete
# documentation.

worker_processes 8

################################################################################
# Adjust your APP_PATH here!!!
################################################################################
APP_PATH = File.expand_path(File.join(File.dirname(__FILE__), "../..")) # NO trailing slash

working_directory APP_PATH
listen "/tmp/store-thin-client.sock", :backlog => 64
#listen 8081, :tcp_nopush => true
timeout 60
pid APP_PATH + "/tmp/pids/unicorn.pid"
stderr_path APP_PATH + "/log/unicorn.stderr.log"
stdout_path APP_PATH + "/log/unicorn.stdout.log"
preload_app true
GC.respond_to?(:copy_on_write_friendly=) and
  GC.copy_on_write_friendly = true
 
before_fork do |server, worker|
  defined?(ActiveRecord::Base) and
    ActiveRecord::Base.connection.disconnect!
  # Before forking, kill the master process that belongs to the .oldbin PID.
  # This enables 0 downtime deploys.
  old_pid = "#{server.config[:pid]}.oldbin"
  if File.exists?(old_pid) && server.pid != old_pid
    begin
      Process.kill("QUIT", File.read(old_pid).to_i)
    rescue Errno::ENOENT, Errno::ESRCH
      # someone else did our job for us
    end
  end
end

after_fork do |server, worker|
  @dbconfig = YAML.load(File.read('config/database.yml'))
  defined?(ActiveRecord::Base) and
    ActiveRecord::Base.establish_connection @dbconfig[ENV["RACK_ENV"]]
end

before_exec do |_|
  ENV["BUNDLE_GEMFILE"] = "#{APP_PATH}/Gemfile"
end
