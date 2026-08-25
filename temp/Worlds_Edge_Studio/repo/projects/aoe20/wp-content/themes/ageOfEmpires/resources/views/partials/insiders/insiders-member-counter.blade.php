<?php
$user_log_state = '0';
if(is_user_logged_in()) {
	$user_log_state = '1';
} 
$insider_community_block = $options['insider_community_block'][$user_log_state];
$insider_community_block_title = $options['insider_community_block'][$user_log_state]['title'];
$insider_community_block_content_body = $options['insider_community_block'][$user_log_state]['content_body'];
$insider_community_block_has_counter = $options['insider_community_block'][$user_log_state]['has_counter'];
?>
<section>
	<div class="page-container">
		<div class="insiders__block">
			@if($insider_community_block_title)
			<h3 class="insiders__block-heading">{{$insider_community_block_title}}</h3>
			@endif

			@if($insider_community_block_has_counter)
                <?php
                	//$pre_count = \Roots\Insiders\Insider::get_insiders_count();
                	//$count = ($pre_count < 1000 ) ? $pre_count : number_format(round($pre_count,-3,PHP_ROUND_HALF_DOWN));
                	$count = "122,000";
                ?>
				<h4 class="insiders__block-subtitle">
					<span class="insiders__block-subtitle-copy">Over {{$count}} Insiders and Counting</span>
				</h4>
			@endif

			@if($insider_community_block_content_body)
			<div class="insiders__block-copy">
				{!!$insider_community_block_content_body!!}
			</div>
			@endif

			<div class="insiders__block-buttons">
				<a href="{{$survey_signin}}" class="insiders__subscribe-cta js-cta-button">Insider Sign-Up</a>
				<a href="{{$insider_forum}}" class="insiders__button">Insider Forum</a>
			</div>
		</div>
	</div>
</section>