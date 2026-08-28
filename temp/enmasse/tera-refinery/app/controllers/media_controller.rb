class MediaController < ApplicationController
  layout 'media'

  def videos
    video_data = YoutubeAPI.fetch_videos
    @videos = video_data["items"].sort{ | a,b | Time.parse(a["snippet"]["publishedAt"]) <=> Time.parse(b["snippet"]["publishedAt"]) }

    @videos.each do |v|
      if v["snippet"]["title"].include? ":"
        v["snippet"]["title"] = v["snippet"]["title"].split(":")[-1]
      end
      if v["snippet"]["title"].include? " - "
        v["snippet"]["title"] = v["snippet"]["title"].split(" - ")[-1]
      end
    end

    render "#{params[:page]}.html.erb"
  end
  
end