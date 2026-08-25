<?php

/**
 * Template Name: Learn To Play
 * Template Post Type: game_modes, post, page
 *
 */
// subnav
//$ltp_subnavs = get_field('map_point_subnav');
// get learn to play map data
//$ltp_map_points = get_field('map_points');
//$ltp_map_img = get_field('map_img');

?>

@extends('layouts.base')

@section('content')
	@include('partials.banner', ['class' => "learn_to_play"])

	@include('partials.internal-navigation', ['class' => "learn_to_play"])

	<section id="learn-to-play" class="block-content section--divider-frank-mid background--rock content">
		<div class="section--padding">
			<div class="row column">
				@include('partials.learn-to-play-map')
			</div>
		</div>

		@if(!empty($map_videos))
		<div class="section--padding">
			<div class="row column">
				@include('partials.learn-to-play-video')
			</div>
		</div>
		@endif
	</section>

@endsection