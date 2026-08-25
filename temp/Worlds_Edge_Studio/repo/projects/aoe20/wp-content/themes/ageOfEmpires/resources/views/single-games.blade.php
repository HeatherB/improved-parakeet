@extends('layouts.app')

@section('content')
{{-- !!temp!! almost all the content on this page is temp --}}

<?php  
	if(have_posts()): while(have_posts()): the_post(); 

	$game_id = get_the_id();

	// these functions should be moved to a controller
	function short_title($string) {

		$string = str_replace('Age of Empires', 'AOE', $string);
		$string = str_replace('Age of Mythology', 'AOM', $string);
		$string = str_replace('Definitive Edition', 'DE', $string);

		return $string;
	}

	$compressed_title = str_replace(' ', '', short_title(get_the_title()));

	function image_name($string) {
		$string = strtolower($string);

		$string = str_replace(':', '', $string);

		return $string;
	}

	$image_name = image_name($compressed_title);

	$game_features = get_field('game_features');

?>
	<section class="game-page__hero">
		<picture class="section-background">
			<source  srcset="@asset('images/heros/'. $image_name .'-desk.jpg') , @asset('images/heros/'. $image_name .'-4k.jpg 2x')">
			<img src="@asset('images/heros/'. $image_name .'-desk.jpg')" alt="{{get_aria_phrase($compressed_title)}}"/>
			<!--<source srcset="@asset('images/heros/'. $hero_img)">
			<img src="@asset('images/heros/'. $hero_img)" alt=""/>-->
		</picture>
		<div class="page-container">
			<h2 class="game-page__title">
				<img src="@asset('images/logos/'. $image_name . '-logo.png')" alt="{{get_aria_phrase($compressed_title)}}"/>
			</h2>

			<div class="game-page__featured-content js-slides-wrapper mobile-hero-slider">
				{{-- !!temp!! --}}
				@include ('partials.content-post', ['post_content' => $news_posts[0], 'is_featured' => false])
				@include ('partials.content-post', ['post_content' => $news_posts[1], 'is_featured' => false])
				@include ('partials.content-post', ['post_content' => $news_posts[2], 'is_featured' => false])
			</div>
		</div>
	</section>

	<section class="game-page__links">
		{{-- !!temp!! --}}
		<?php
			$temp_links = array(
				array(
					'text' => 'Learn to Play',
					'icon' => 'knowledgebase',
					'image_path' => 'images/glp-temp-desk-reverse.png',
					'url' => '#' . $compressed_title . 'LearnToPlay'
				),
				array(
					'text' => 'Statistics',
					'icon' => 'stats',
					'image_path' => 'images/glp-temp-desk-reverse.png',
					'url' => '#' . $compressed_title . 'Stats'
				), 
				array(
					'text' => 'Forums',
					'icon' => 'forum',
					'image_path' => 'images/glp-temp-desk-reverse.png',
					'url' => '#' . $compressed_title . 'Forum'
				),
				array(
					'text' => 'Mods',
					'icon' => 'mod',
					'image_path' => 'images/glp-temp-desk-reverse.png',
					'url' => '#' . $compressed_title . 'Mods'
				), 
				array(
					'text' => 'Support',
					'icon' => 'support',
					'image_path' => 'images/glp-temp-desk-reverse.png',
					'url' => '#' . $compressed_title . 'Support'
				)
			);
		?>
		<div class="page-container">
			<ul class="game-page__links__list">
			@foreach($temp_links as $link)
				<li>
					<a class="game-page__link" href="{{$link['url']}}">
						<span>{{$link['text']}}</span>

						{{icon($link['icon'], '')}}

						<img src="@asset($link['image_path'])" role="presentation" alt=""/>
					</a>
				</li>
			@endforeach
			</ul>
		</div>
	</section>

	<section class="game-page__widgets">
		<div class="page-container">
			<div class="widget-container">
				@include ('partials.widget-leaderboard')

				@include ('partials.widget-mod')

				@include ('partials.widget-live-stream')
			</div>
		</div>
	</section>

	@include ('partials.section-news', ['game_name' => short_title(get_the_title()), 'limit' => 4])

	@include('partials.section-learn-to-play')

	<section class="game-page__media">
		<div class="page-container">
			<h2 class="section__title">Media</h2>
			@include ('partials.media-carousel')
		</div>
	</section>

	<section class="game-page__about">
		<div class="page-container">
			<h2 class="section__title">{{the_title()}}</h2>
			<div class="about-container">
				<div class="game-page__about__main">
					{{the_content()}}
				</div>

				@foreach($game_features as $game_feature)
					<div class="game-page__about__features">
						{!! $game_feature['feature'] !!}
					</div>
				@endforeach
			</div>
		</div>
	</section>
@endsection

<?php endwhile; endif; ?>