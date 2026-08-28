#Refinery::Blog::Post.class_eval do
#
#  def self.cache_key_for(prams)
#    return "blogposts/#{prams[:action]}/#{prams[:id]}"
#  end
#
#  def self.cache_key_for_paged(prams)
#    puts "PRAMS - #{prams[:action].inspect}"
#    puts "PRAMS - #{prams[:id].inspect || 0}"
#    #raise RuntimeError, "PRAMS - #{prams[:page].inspect}"
#    return "blogposts/#{prams[:action]}/#{prams[:id] || 0}/page#{prams[:page] || 1}"
#  end
#
#end
#