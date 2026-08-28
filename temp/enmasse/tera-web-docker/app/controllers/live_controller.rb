class LiveController < ApplicationController
    skip_before_action :verify_authenticity_token
    def livestreamers
        streams = Rails.cache.fetch('live-streamers', expires_in: 5.minutes) do
             twitchStreams = params["twitchStreams"]
             returnedStreams = []
             client = Twitch::Client.new client_id: "n5fiw72peubfahk3qkn569gvgb3p92"

             $i = 0
             while $i < twitchStreams.length do # Max number of users for Twitch API is 100, so have to do another call for every 100 users
                sentStreams = []
                $j = 0
                while $j < 100 do
                    if twitchStreams[$j + $i]
                        sentStreams[$j] = twitchStreams[$j + $i]
                    end 
                    $j += 1
                end
                returnedStreams += client.get_streams({user_login: sentStreams, first: 100}).data
                $i += 100
             end
           returnedStreams
        end
        render json: streams
    end
end