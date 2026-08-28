class YoutubeAPI < APIConsumer

  def self.fetch_playlist()
    do_request("/youtube/v3/playlistItems?part=id,snippet&maxResults=50&playlistId=#{settings[:list_id]}&fields=items%2Fsnippet&key=#{settings[:api_key]}", self.connection(:normal))
  end

  def self.fetch_videos()
    playlist = self.fetch_playlist
    video_ids = playlist["items"].collect { |x| x["snippet"]["resourceId"]["videoId"] }

    videos = do_request("/youtube/v3/videos?id=#{video_ids.join(',')}&part=contentDetails&key=#{settings[:api_key]}", self.connection(:normal))

    durations = {}
    videos["items"].each { |vd| durations[vd["id"]] = vd["contentDetails"]["duration"] }
    playlist["items"].each { |x| x["snippet"]["duration"] = in_seconds(durations[x["snippet"]["resourceId"]["videoId"]]) }

    return playlist
  end

  def self.in_seconds(raw_duration)
    match = raw_duration.match(/PT(?:([0-9]*)H)*(?:([0-9]*)M)*(?:([0-9.]*)S)*/)
    hours   = match[1].to_i
    minutes = match[2].to_i
    seconds = match[3].to_i

    if hours && hours > 0
      return "#{hours}:#{minutes.to_s.rjust(2, '0')}:#{seconds.to_s.rjust(2, '0')}"
    else
      return "#{minutes || 0}:#{seconds.to_s.rjust(2, '0')}"
    end
  end

end
