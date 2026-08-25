

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