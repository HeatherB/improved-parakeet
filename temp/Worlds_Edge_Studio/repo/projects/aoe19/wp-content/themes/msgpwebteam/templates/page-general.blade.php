<?php

/**
 * Template Name: General
 * Template Post Type: game_modes, post, page
 *
 */

// Get content From ACF
$options = get_fields();

$page_class = $options['page_class'];
$hasVideo = $options['has_video'];
$hero_section = $options['hero_section'];
$page_sections = $options['page_sections'];

$form_pages = get_pages(array(
    'meta_key' => '_wp_page_template',
    'meta_value' => 'templates/page-moderator-application.blade.php'
));
foreach($form_pages as $form_page){
    $form_page_id = $form_page->ID;
    $accepting_applications = get_field('currently_accepting_applications_to_the_age_moderator_program', $form_page_id);
    $applications_closed_messaging = get_field('applications_closed_messaging', $form_page_id);
    if($accepting_applications == false) {
        $form_closed = true;
    } else {
        $form_closed = false;
    }
}



?>

@extends('layouts.base')

@section('content')
    @include('partials.banner-general', ['class' => "general $page_class"])

    
    @if ($hasVideo)
    <section class="block-content section--divider-mali-mid background--rock content">
        
            <?php $videoId = $options['youtube_id']; ?>
            
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

    @foreach ($page_sections as $page_section) 
        @if ($page_section['acf_fc_layout'] == "section_block")
        <section class="block-content section--divider-mali-mid general">
            <div class="substance teasers">
                @if($page_section['page_section_title'])
                <h2>{{$page_section['page_section_title']}}</h2>
                @endif
                
                @foreach ($page_section['acf_teaser_content'] as $content_section) 
                    @include('partials.general-content-block', ['styleClass' => "general $page_class"])
                @endforeach
            </div>
        </section>
        @endif
    @endforeach

@endsection