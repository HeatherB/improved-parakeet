require 'api_consumer'
require 'billing_adapter_interface'

# config settings for FatFooGoo
module FatFooGoo #:nodoc:
  API_URL = "client2.uat.pok.fatfoogoo.com".freeze
  SSO_URL = "client2.uat.pok.fatfoogoo.com".freeze
  SSO_PATH = "/game/tera/store/".freeze
  SECRET_KEY = "86n10i73528h0640730m220ox018768h".freeze
  
  API_USER = "client2.com".freeze
  API_PASSWORD = "twTA31b9389a60ef4801b120903d6724".freeze
  
  USE_MEMCACHE = false
  MEMCACHE_HOSTS = ["localhost:11211"].freeze
  CACHE_PREFIX = "FFG-qa".freeze
end

# config settings for SimpleSSO
class SimpleSSO
  ACCOUNT_SERVER = "account.enmasse.com".freeze
  ACCOUNT_SERVER_SECURE_URL = "https://account.enmasse.com"
  AUTH_SERVER = "edge.auth.service.enmasse.com"
  AUTH_SERVER_PORT = 4567
end

module AssetConfig
  STATIC_ASSET_HOSTS = [
    '//store-0.qa.enmasse-game.com',
    '//store-1.qa.enmasse-game.com',
    '//store-2.qa.enmasse-game.com',
    '//store-3.qa.enmasse-game.com'
  ].freeze
end

module Login
  SERVER_URL = "https://account-edge.enmasse.com/remote_logins"
end
StoreAPI = BillingAdapterInterface
