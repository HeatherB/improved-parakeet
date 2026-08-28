class CacheController < ApplicationController
    def clear
        Rails.cache.clear
       render text: "Cache Cleared!"
    end

end