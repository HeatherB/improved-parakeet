<?php
/**
 * Template Name: Insider Landing
 * Insider Landing Page.
 *
 */

// Need to set variables to empty strings to pass into @include('partials.banner'...) below
// so that when they're called on banner.blade.php they don't create variable undefined errors
$page_class = '';
$header_block = array(
    'addon_expansion_hero_banner_title' => '',
    'addon_expansion_hero_banner_copy'  => '',
);
$tall_game_name_logo = '';

$section_divider_no_top_border_padding = '';
$block_section_bg_img = '';
$community_block_content_body_background_image = '';
$block_user_state = '';

foreach($communityBlock as $block):
    $community_block_content_body_background_image = $block['content_body_background_image'];
    $community_block_match_lotw_string = str_replace('-block-bg-img', '', $community_block_content_body_background_image);
endforeach;

if(
    !empty($community_block_content_body_background_image) &&
    !empty($community_block_content_body_background_image) &&
    $community_block_content_body_background_image !== 'default' &&
    $signUpBlock['content_body_background_image'] !== 'default' &&
    $community_block_match_lotw_string === $signUpBlock['content_body_background_image'] &&
    !( $numCards > 0 || $extraCard || ($insider_status && $insiderEventCards > 0) || ($insider_status && $insiderExtraCard))
) {
    $section_divider_no_top_border_padding = 'section--divider-teaser-no-top-border-padding';
}
?>

@extends('layouts.base')

@section('content')
    @include('partials.banner', ['class' => "$page_class", 'header_block' => $header_block, 'tall_game_name_logo' => $tall_game_name_logo])

    <section class="insider-program block-content section--divider-mali-mid background--rock content">
        <div class="substance teasers">

            @if($insider_status)
                @if($showProfile)
                    @include('partials.insiders-profile-block')
                @endif
            @else
                @include('partials.insiders-content-block', ['content' => $signUpBlock, 'block_section_bg_img' => $signUpBlock['content_body_background_image'], 'align' => $signUpBlock['align'], 'style' => '--sign-up spanish'])
            @endif

            <div class="insider-community insider-community-btn-inherit-font-size">
                @foreach($communityBlock as $block)
                    {{-- Only show insider version in this location --}}
                    @if($block['user_state'] === 'logged_in' && $insider_status || $block['user_state'] === 'all')
                        @include('partials.insiders-content-block', ['content' => $block, 'block_section_bg_img' => $block['content_body_background_image'], 'align' => $block['align'], 'style' => 'city'])
                    @endif
                @endforeach

                @if($insider_status)
                    <div class="insider-actions">
                        @if(sizeof($flights->betaEnrollment) && sizeof($flights->currentBetas))
                            <div class="beta-participation frame-box">
                                <div class="frame-box__inner frame-box__inner--light">
                                    <h5 class="beta-participation__header">Enrolled in Betas:</h5>

                                    <ul class="beta-participation__list not_a_list">
                                        @foreach($flights->currentBetas as $current)
                                            @if(in_array($current['flight_id'], $flights->betaEnrollment))
                                                <li><a href="#{{$current['flight_id']}}">{{$current['flight_name']}}</a></li>
                                            @endif
                                        @endforeach
                                    </ul>

                                </div>
                            </div>
                        @endif

                        <div class="button-group @if(sizeof($flights->betaEnrollment)) is-enrolled @endif">
                            {{-- if there are no events cards, and no extra cards, don't show the beta opp button --}}
                            @if ($numCards > 0 || $extraCard || ($insider_status && $insiderEventCards > 0) || ($insider_status && $insiderExtraCard))
                                <a href="#insiderEvents" class="btn-aoe">Beta Opportunities</a>
                            @endif
                            <a href="https://forums.ageofempires.com/c/insiders" class="btn-aoe">Insider Forum</a>
                            <a href="/profile#insiderSettings" class="btn-aoe">Insider Settings</a>
                            <a href="/support/insider-faq/" class="btn-aoe">Insider FAQ</a>
                        </div>
                    </div>
                @endif
            </div>
        </div>
    </section>
   
    {{-- if there are no events cards, and no extra cards, don't show this section --}}
    @if ( $numCards > 0 || $extraCard || ($insider_status && $insiderEventCards > 0) || ($insider_status && $insiderExtraCard) )
        <section class="insider-program insider-events section--divider-mali-mid content">
            <div class="substance teasers">

                @foreach($eventFields as $event)

                    {{-- Determine If viewable to user --}}
                    @if($event['user_state'] === 'logged_in' && $insider_status || $event['user_state'] === 'logged_out' && !$insider_status || $event['user_state'] === 'all')
                        @include('partials.insiders-events-block', ['content' => $event, 'cards' => $eventCards])
                    @endif
                @endforeach

            </div>
        </section>
    @endif

    @if ((!empty($addlContentSections) && $addlContentSections) || ($communityBlockNonInsider && !$insider_status) )

        <section class="insider-program section--divider-mali-mid background--rock content {{$section_divider_no_top_border_padding}}">
            <div class="substance teasers">
                @if($communityBlockNonInsider && !$insider_status)
                    @foreach($communityBlock as $block)
                        {{-- Only show logged-out version in this location --}}
                        @if($block['user_state'] === 'logged_out' && !$insider_status )
                            @include('partials.insiders-content-block', ['content' => $block, 'block_section_bg_img' => $community_block_content_body_background_image, 'align' => $block['align'], 'style' => 'city'])
                        @endif
                    @endforeach
                @endif

                @if(!empty($addlContentSections) && $addlContentSections)
                    @foreach($addlContentSections as $section)
                        {{-- Determine If viewable to user --}}
                        @if($section['user_state'] === 'logged_in' && $insider_status || $section['user_state'] === 'logged_out' && !$insider_status || $section['user_state'] === 'all')
                            @include('partials.insiders-content-block', ['content' => $section])
                        @endif
                    @endforeach
                @endif
            </div>
        </section>
    @endif

    @if(!$insider_status || ($insider_status && !is_user_logged_in()))
        <section class="insider-program insider-faq section--divider-mali-mid content">
            <div class="substance teasers" id="insiders-landing-faqs">
                @include('partials.insiders-landing-faq')
            </div>
        </section>
    @endif

    @if($show_flight_vids && $insider_status)
        <section class="insider-program section--divider-mali-mid background--rock content">
            <div class="substance teasers">
                @include('partials.insiders-setting-video-portal-blade')
            </div>
        </section>
    @endif
@endsection