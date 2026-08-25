<div class="border--gold">
	<div class="slideWrapper js-slideWrapper">
		<div class="mobile_wrapper js-mobileWrapper">
			<!--@ if(!empty($section['slides_group']['slide_group'][0]['slide_img']))
				@ foreach($section['slides_group']['slide_group'] as $slide_point)
					<img src="{{$slide_point['slide_img']['url']}}" alt="{{$slide_point['slide_img']['alt']}} "/>
				@ endforeach
			<img class="active" src="{{$section['slides_group']['slide_group'][0]['slide_img']['url']}}" alt="{{$section['slides_group']['slide_group'][0]['slide_img']['alt']}} "/>
			@ endif-->
		</div>
		<div class="zoom-controls">
			<button class="btn_prev js-btnPrev"></button>
			<!--<button class="js-btnZoom">
				<span class="zoom_in"></span>
				<span class="zoom_out"></span>
			</button>-->
			<button class="btn_next js-btnNext"></button>
		</div>
	</div>
	<div class="js-infoAndControls bg">
		<div class="active_trigger_quicknav js-activeQuicknav"></div>
		<ol class="alpha-trigger-list js-pointsWrapper">
			@if(!empty($section['slides_group']['slide_group'][0]))
				@foreach($section['slides_group']['slide_group'] as $slide_point)
				<li class="pointsWrapperItem" data-img="{{$slide_point['slide_img']['url']}}"
				<?php
					if(!empty($page_points)) {
				    	foreach($page_points as $page_points_key => $page_points_value) {
				    		if($page_points_key == $slide_point['slide_label']) { ?>
				    			data-completed="{{$page_points_value}}"
				    		<?php }
				    	}
				    }
				?>
				><!-- end of li -->
					<h5 class="ltp-heading">
						{!! $slide_point['slide_label'] !!}
					</h5>
					<div class="ltp-content">
						{!! $slide_point['slide_copy'] !!}
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
