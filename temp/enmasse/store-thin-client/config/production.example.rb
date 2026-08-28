require 'api_consumer'
require 'billing_adapter_interface'

module FatFooGoo #:nodoc:
  # config settings for FatFooGoo
  API_URL = "client2.uat.pok.fatfoogoo.com".freeze
  SECRET_KEY = "---".freeze
  SSO_URL = "client2-pok.fatfoogoo.com".freeze
  SSO_PATH = "/game/tera/store/".freeze
  
  API_USER = "client2.com".freeze
  API_PASSWORD = "---".freeze
  
  USE_MEMCACHE = true
  MEMCACHE_HOSTS = ["localhost:11211"].freeze
  CACHE_PREFIX = "FFG".freeze
end

class SimpleSSO
  # config settings for SimpleSSO
  ACCOUNT_SERVER = "account-edge.enmasse.com".freeze
  ACCOUNT_SERVER_SECURE_URL = "https://account-edge.enmasse.com"
  AUTH_SERVER = "edge.auth.service.enmasse.com:4567"
  SITE_KEY = "tera-store-dev"
  
  LOGIN_SERVICE = "account.enmasse.com"
  AUTH_SERVICE = "auth.service.enmasse.com"
end

module AssetConfig
  STATIC_ASSET_HOSTS = [
    '//store-cdn0.enmasse-game.com/',
    '//store-cdn1.enmasse-game.com/',
    '//store-cdn2.enmasse-game.com/',
    '//store-cdn3.enmasse-game.com/'
  ].freeze
end

module Login
  SERVER_URL = "https://account.enmasse.com/remote_logins"
end

StoreAPI = BillingAdapterInterface
