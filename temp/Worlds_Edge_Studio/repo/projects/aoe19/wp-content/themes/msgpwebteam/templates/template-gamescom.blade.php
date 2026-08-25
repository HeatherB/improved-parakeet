<?php
/**
 * Template Name: Gamescom Demo Page
 * Gamescom Demo Page.
 *
 */

$content_sections = get_field('acf_teaser_content');
$content_sections2 = get_field('acf_teaser_content_2');
$videoID = get_field('video_id');

?>

@extends('layouts.base')

@section('content')
    <section class="gamescom video-content content">
        <div class="substance teasers">
            <div class="langaugeSelect">
                <select name="Languages" id="LanguageSelect" style="width: 200px;">
                    <option value="">Select Language</option>
                    <option value="EN">English</option>
                    <option value="DE">Deutsch</option>
                </select>
            </div>
            <div class="teaser video">
                <div class="video_container">
                    <iframe id="ytplayer" type="text/html" width="800" height="450" src="https://www.youtube.com/embed/<?php echo $videoID; ?>" frameborder="0" allowfullscreen></iframe>
                </div>
            </div>
        </div>
    </section>

    <section class="gamescom section--divider-mali-mid section--divider-mali-footer background--rock content">
        <div class="substance teasers">
            <?php
                foreach($content_sections as $content_section){
                    // Content Type
                    switch($content_section['acf_fc_layout']){
                        case 'content_block': ?>
                            @include('partials.teasers-content-block')
                            <?php
                            break;
                        case 'content_block_count': ?>
                            @include('partials.insiders-content-block-count')
                            <?php
                            break;
                        case 'content_block_purchase': ?>
                            @include('partials.teasers-content-block-purchase')
                            <?php
                            break;
                    }
                }
            ?>
        </div>
    </section>

    <section class="gamescom section--divider-mali-mid section--divider-mali-footer content">
        <div class="substance teasers">
            <?php
                foreach($content_sections2 as $content_section){
                    // Content Type
                    switch($content_section['acf_fc_layout']){
                        case 'content_block': ?>
                            @include('partials.teasers-content-block')
                            <?php
                            break;
                        case 'content_block_count': ?>
                            @include('partials.insiders-content-block-count')
                            <?php
                            break;
                        case 'content_block_purchase': ?>
                            @include('partials.teasers-content-block-purchase')
                            <?php
                            break;
                    }
                }
            ?>
        </div>
    </section>

@endsection
