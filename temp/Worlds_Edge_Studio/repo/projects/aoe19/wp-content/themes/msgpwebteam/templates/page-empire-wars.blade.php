<?php

/**
 * Template Name: Empire Wars
 * Template Post Type: game_modes
 *
 */

// Get content sections From ACF
$content_sections = get_field('acf_teaser_content');
$hasVideo = get_field('has_video');

?>

@extends('layouts.base')

@section('content')
    @include('partials.banner')

    <section class="block-content section--divider-frank-mid background--rock content">
        @if ($hasVideo)
            <?php $videoId = get_field('youtube_id'); ?>
            
            <div class="substance teasers">
                <div class="game-mode__video">
                    <div class="video-embed">
                        <iframe src="https://www.youtube.com/embed/{{$videoId}}" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                    <div class="frame-gold"></div>
                </div>
            </div>
        @endif

    	<div class="substance teasers">
			@foreach ($content_sections as $content_section) 
				@if ($content_section['acf_fc_layout'] == "content_block_intro")
					@include('partials.teasers-content-block')
				@endif
			@endforeach
    	</div>
    </section>

    <section class="block-content section--divider-frank-mid content">
    	<div class="substance teasers">
    		@foreach ($content_sections as $content_section) 
				@if ($content_section['acf_fc_layout'] == "content_block_start")
					@include('partials.teasers-content-block', ['styleClass' => 'empirewars--start secondary'])
				@endif

                @if ($content_section['acf_fc_layout'] == "content_block_play")
                    @include('partials.teasers-content-block', ['styleClass' => 'empirewars--play secondary'])
                @endif
			@endforeach
    	</div>
    </section>

@endsection