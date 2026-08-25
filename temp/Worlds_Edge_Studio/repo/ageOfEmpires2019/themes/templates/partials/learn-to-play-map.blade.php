<div class="border--gold">
	<div class="mapWrapper js-mapWrapper">
		<div class="mobile_wrapper js-mobileWrapper">
			<img src="{{$section['map_group']['map_img']['url']}}" alt="{{$section['map_group']['map_img']['alt']}} "/>
		</div>
		<div class="zoom-controls">
			<button class="btn_prev js-btnPrev mapTrigger js-mapTrigger"></button>
			<button class="js-btnZoom">
				<span class="zoom_in"></span>
				<span class="zoom_out"></span>
			</button>
			<button class="btn_next js-btnNext mapTrigger js-mapTrigger"></button>
		</div>
	</div>
	<div class="js-infoAndControls bg">
		<div class="active_trigger_quicknav js-activeQuicknav"></div>
		<ol class="alpha-trigger-list js-pointsWrapper">
			@if(!empty($section['map_group']['map_points']))
				@foreach($section['map_group']['map_points'] as $map_point)
				<li data-completed="">
					<h5 class="ltp-heading" data-x="{{$map_point['map_point_x']}}" data-y="{{$map_point['map_point_y']}}">
						{!! $map_point['map_point_label'] !!}
					</h5>
					<div class="ltp-content">
						{!! $map_point['map_point_copy'] !!}
					</div>
				</li>
				@endforeach
			@endif
		</ol>
		<ol class="alpha_trigger_quicknav js-alphaQuicknav"></ol>
		<div class="section_footer">
			<a href="#learn-to-play">Top</a>
		</div>
	</div>
</div>
