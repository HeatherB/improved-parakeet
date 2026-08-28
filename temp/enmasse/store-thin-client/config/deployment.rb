require 'api_consumer'
require 'billing_adapter_interface'

# config settings for SimpleSSO
class SimpleSSO
  ACCOUNT_SERVER = "account.enmasse.com".freeze
  ACCOUNT_SERVER_SECURE_URL = "https://account.enmasse.com".freeze
  AUTH_SERVER = "auth.service.enmasse.com".freeze
  AUTH_SERVER_PORT = 4567
end

module AssetConfig
  STATIC_ASSET_HOSTS = ["//store-cdn0.enmasse-game.com", "//store-cdn1.enmasse-game.com", "//store-cdn2.enmasse-game.com", "//store-cdn3.enmasse-game.com"].freeze
end

module AppSettings
  SECRET_KEY = "Remember that one time when Mistar Pickels decided he wanted 2 go 2 C TEH WIZZARD~?!?".freeze
  SESSION_SECRET_KEY = "May be when teh singularity hits, we'll find out that being a toaster isn't as derogatory as it sounds!".freeze
end

module Login
  SERVER_URL = "https://account.enmasse.com/remote_logins"
end

class TeraItem
  MEMCACHE_HOSTS = BillingAdapterInterface.settings[:memcache_hosts]
end
StoreAPI = BillingAdapterInterface
