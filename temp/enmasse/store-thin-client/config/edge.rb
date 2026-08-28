require 'api_consumer'
require 'billing_adapter_interface'

class FatFooGoo < APIConsumer #:nodoc:
  # config settings for FatFooGooi
  SECRET_KEY = "86n10i73528h0640730m220ox018768h".freeze
  SSO_URL = "client2.uat.pok.fatfoogoo.com".freeze
  SSO_PATH = "/store/client2.com/tera/v1/default/".freeze
end

class SimpleSSO
  # config settings for SimpleSSO
  ACCOUNT_SERVER = "account-edge.enmasse.com".freeze
  ACCOUNT_SERVER_SECURE_URL = "https://account-edge.enmasse.com".freeze
  AUTH_SERVER = "auth.service.edge.enmasse.com".freeze
  AUTH_SERVER_PORT = 4567
end

module AssetConfig
  STATIC_ASSET_HOSTS = [
    '//store-0.edge.enmasse-game.com',
    '//store-1.edge.enmasse-game.com',
    '//store-2.edge.enmasse-game.com',
    '//store-3.edge.enmasse-game.com'
  ].freeze
end

module AppSettings
  SECRET_KEY = 'top secret key here that WILL NEED TO BE changed.'
  SESSION_SECRET_KEY = 'TERA is a super awesome game - monkeys are cool, but they are not games.'
end

module Login
  SERVER_URL = "https://account-edge.enmasse.com/remote_logins"
end

class TeraItem
  MEMCACHE_HOSTS = ["localhost:11211"].freeze
end
StoreAPI = BillingAdapterInterface
