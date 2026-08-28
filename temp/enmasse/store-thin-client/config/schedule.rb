# Use this file to easily define all of your cron jobs.
#
# It's helpful, but not entirely necessary to understand cron before proceeding.
# http://en.wikipedia.org/wiki/Cron

# Example:
#
# set :output, "/path/to/my/cron_log.log"
#
# every 2.hours do
#   command "/usr/bin/some_great_command"
#   runner "MyModel.some_method"
#   rake "some:great:rake:task"
# end
#
# every 4.days do
#   runner "AnotherModel.prune_old_records"
# end



# Learn more: http://github.com/javan/whenever
set :environment, ENV['RACK_ENV'] || 'development'
set :PATH, ENV['PATH']

test_dir = File.expand_path( File.join( Dir.pwd, "..", "..", "current" ) )
if File.directory?(test_dir)
  set :path, test_dir
  set :output, File.join(test_dir, "log", "cron.log")
else
  set :path, Dir.pwd
  set :output, File.join(Dir.pwd, "log", "cron.log")
end

job_type :rake, "cd :path && PATH=:PATH RACK_ENV=:environment bundle exec rake :task :output"

every 5.minutes do
  rake "cache:reload:items"
end
