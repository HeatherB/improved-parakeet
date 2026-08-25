<?php
/* Template Name: Moderator Application */

// Get content From ACF
$options = get_fields();

$page_class = $options['page_class'];
$hasVideo = $options['has_video'];
$hero_section = $options['hero_section'];
$page_sections = $options['page_sections'];
$accepting_applications = $options['currently_accepting_applications_to_the_age_moderator_program'];

?>

@extends('layouts.base')

@section('content')
    @include('partials.banner-general', ['class' => "general $page_class"])

    @if($accepting_applications)

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
            <section class="block-content section--divider-mali-mid general moderator-application">
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

        <section class="block-content section--divider-mali-mid general section-moderator-application">
            <div class="substance teasers">
                @include('partials.content-moderator-application')
            </div>
        </section>

    @else
    <section class="block-content section--divider-mali-mid general moderator-application closed">
        <div class="substance teasers">
            <div class="tease">
                <div class="bg">

                    @include('partials.hero-picture', ['options' => $page_sections[0]['acf_teaser_content'][0]])
 
                    <div class="text">
                        <div class="words">
                            {!!$options['applications_closed_messaging']!!}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>


    @endif

@endsection

