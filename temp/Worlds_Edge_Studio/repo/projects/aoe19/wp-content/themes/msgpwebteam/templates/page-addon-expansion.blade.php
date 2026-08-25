<?php

/**
 * Template Name: Addon Expansion
 * Template Post Type: game_modes, post, page
 *
 */

// Get content sections From ACF
$page_class = get_field('addon_expansion_page_class');
$hasVideo = get_field('has_video');
$useTimer = get_field('change_content_on_timer');
$header_block = get_field('addon_expansion_hero_banner_copy');
$heroButtons = get_field('addon_expansion_hero_banner_button');
$page_sections = get_field('page_sections');
$tall_game_name_logo = get_field('tall_game_name_logo');

if($useTimer) {
    //$date = '2020-07-20 9:00:00 PM GMT-07:00';
    $date = $useTimer['change_content_on_date_time'];

    //Create a new DateTime objects.
    $futureDateTime = new DateTime($date);
    $currentDateTime = new DateTime();
 
    //Format them into a Unix timestamp.
    $futureTimestamp = $futureDateTime->format('U');
    $currentTimestamp = $currentDateTime->format('U');
    if ($currentTimestamp > $futureTimestamp) {
        $header_block = get_field('addon_expansion_hero_banner_timed_change');
        $heroButtons = get_field('addon_expansion_hero_banner_button_timed_change');
        $page_sections = get_field('page_sections_timed_change');
    }

} 


?>

@extends('layouts.base')

@section('content')
    @include('partials.banner', ['class' => "addon_expansion $page_class"])
    
    @if ($hasVideo)
    <section class="block-content section--divider-frank-mid background--rock content">
        
            <?php $videoId = get_field('youtube_id'); ?>
            
            <div class="substance teasers">
                <div class="game-mode__video">
                    <div class="video-embed">
                        <iframe src="https://www.youtube.com/embed/{{$videoId}}" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                    <div class="frame-gold"></div>
                </div>
            </div>
    
    </section>
    @endif

    @if($page_sections)

        @foreach ($page_sections as $page_section) 
            @if ($page_section['acf_fc_layout'] == "section_block")
            <section class="block-content section--divider-frank-mid content">
                <div class="substance teasers">
                    @if($page_section['page_section_title'])
                    <h2>{{$page_section['page_section_title']}}</h2>
                    @endif
                    
                    @if($page_section['acf_teaser_content'])
                        @foreach ($page_section['acf_teaser_content'] as $content_section) 
                            @include('partials.teasers-content-block', ['styleClass' => "addon_expansion $page_class"])
                        @endforeach
                    @endif
                </div>
            </section>
            @endif
        @endforeach
    
   @endif

@endsection