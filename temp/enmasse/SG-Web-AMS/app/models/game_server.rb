class GameServer
  attr_accessor :name, :ip, :id, :port, :category

  def self.all_with_characters game_account, strip_empty = false
    characters = game_account.characters

    characters = characters.inject({}) do |memo, character|
      memo[character['server_id'].to_s] ||= []
      memo[character['server_id'].to_s] << character
      memo
    end

    servers= Hash.from_xml RestClient.get(game_account.game.settings(:sls_url) + "/list.en")
    servers = servers['serverlist']['server']
    servers = [servers] if servers.is_a? Hash
    servers.each {|server| server['characters'] = characters[server['id']] || [] }
    servers.each {|server| server['name'] = server['name'].strip }

    if strip_empty
      servers.delete_if{ |server| server['characters'].blank? }
    end
    servers
  end

  def self.all(game_account)
    hash = Hash.from_xml(RestClient.get(game_account.game.settings(:sls_url) + "/list.en"))
    servers = hash['serverlist']['server']
    servers = [servers] if servers.is_a? Hash
    servers.map{ |server| GameServer.new(server) }
  end

  def self.all_in_hash(game_account)
    hash = {}
    arr = self.all(game_account)
    arr.each do |server|
      hash[server.id.to_i] = server
    end
    hash
  end

  def initialize hash
    @hash_data = hash
    sanitize_hash!

    %w( name ip id port category ).each do |attribute|
      instance_variable_set("@#{attribute}", hash[attribute])
    end
  end

  def sanitize_hash!
    @hash_data.each do |k,v|
      @hash_data[k] = v.strip
    end
  end
end
