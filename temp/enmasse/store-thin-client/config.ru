require 'rubygems'
require 'bundler'
Bundler.require
require 'newrelic_rpm'

# one log file to rule them all
logfile = ::File.join(::File.dirname(__FILE__),'log',"#{ENV['RACK_ENV']}.log")
require 'logger'
class ::Logger; alias_method :write, :<<; end
logger  = ::Logger.new(logfile,'weekly')
use Rack::CommonLogger, logger

require './eme_store'
run EMEStore
