<div class="border--gold mapVideo js-mapVideo">
	@if(!empty($section['video_group']['video_url']))
	<div class="mapVideoWrapper js-mapVideoWrapper">
		<canvas class="js-blurVidPre"></canvas>
		<video class="js-ltpVideo" disableRemotePlayback controls width="250">
      		<source src="{{$section['video_group']['video_url']}}" type="video/mp4">
      		Sorry, your browser doesn't support embedded videos.
    	</video>
    	<canvas class="js-blurVidPo"></canvas>
	</div>
	@endif

	<div class="videoProgress">
		<progress class="js-progressBar" max="100" value="0"></progress>
		<ol class="alpha-video-stamps js-timeStamps"></ol>	
	</div>	

	<div class="bg">
		<div class="active_video_quicknav js-activeQuicknav"></div>
		<ol class="alpha-video-list js-pointsWrapper">
			@if(!empty($section['video_group']['video_points']))
				@foreach($section['video_group']['video_points'] as $video_point)
					@if(!empty($video_point['video_point_timestamp']))
					<li data-timestamp="{{$video_point['video_point_timestamp']}}">
						<h5 class="ltp-heading">
							{!! $video_point['video_point_label'] !!}
						</h5>
						<div class="ltp-content">
							{!! $video_point['video_point_copy'] !!}
						</div>
					</li>
					@endif	
				@endforeach
			@endif	
		</ol>
		<ol class="alpha_video_quicknav js-alphaQuicknav"></ol>
		<div class="section_footer">
			<a href="#learn-to-play">Top</a>
		</div>
	</div><!-- end of info and controls -->
</div>