{{--
  Template Name: Game Stats
--}}
{{-- @include('partials.stats-game-id') --}}
<?php
$page_template_slug = get_page_template_slug();

// Get post slug, like ageiide for/stats/ageiide/ page
$post_slug = get_post_field( 'post_name', get_post() );
?>

@extends('layouts.base-alt')

@section('content')

    @include('partials.stats-banner', ['game'=> 'age2', 'buttons'=> ['View Stats']])

    <?php
    $leardboardLabelStartingValue = null;
    ?>

    <section id="glob-leads" class="content section--divider-frank-mid section--padding-bottom background--rock stats-content">
        <div class="row">
            <div class="columns small-12 large-align-left leaderboard_control">

                {{--
                Get starting span.leaderboard-label element text value,
                like "1v1 RandomMap" for /stats/ageiiide/ page
                --}}
                <h3 class="light"><span class="leaderboard-label">@if($post_slug === 'ageiide'){{$leardboardLabelStartingValue = '1v1 RandomMap'}}@elseif($post_slug === 'ageiiide'){{$leardboardLabelStartingValue = '1v1 Supremacy'}}@endif</span> <span class="update_detail">Updated Daily</span></h3>

                <select class="standard" id="game_mode_select">
                    @if($post_slug === 'ageiide')
                        <option value="3" selected >1v1 RandomMap</option>
                        <option value="1">1v1 Deathmatch</option>
                        <option value="4">Team RandomMap</option>
                        <option value="2">Team Deathmatch</option>
                    @elseif($post_slug === 'ageiiide')
                        <option value="1">1v1 Supremacy</option>
                        <option value="2">Team Supremacy</option>
                        <option value="3">Treaty</option>
                        <option value="4">Deathmatch</option>
                    @endif
                </select>
            </div>
        </div>
        <div class="row">
            <div class="columns small-12 large-align-left">
                <div class="js-leaderboardLoader" id="global-leaderboard"></div>
                <div class="pagination-container leaderboard-pagination js-pageNav-lb"></div>
            </div>
        </div>
    </section>

    {{-- Display only if on /stats/ageiide/ page --}}
    @if($post_slug === 'ageiide')
        <section id="civs-and-maps" class="content section--divider-frank-mid section--padding-bottom background--paper stats-content">
            <div class="row">
                <div class="columns small-6">
                    <div class="frame-box">
                        <div class="frame-box__inner--button">
                            <a id="stats_ranked" class="stat_modes section-nav__link is-current">ranked play</a>
                        </div>
                    </div>
                </div>
                <div class="columns small-6">
                    <div class="frame-box">
                        <div class="frame-box__inner--button">
                            <a id="stats_mp" class="stat_modes section-nav__link">multiplayer</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="columns small-12 large-align-left">
                    <h3 class="dark">CIVILIZATIONS</h3>
                </div>
            </div>
            <div class="row">
                <div class="columns small-12 medium-12 large-8 large-align-left civ-game-map-selectors">
                    <!-- for ranked play -->
                    <select class="standard" data-stat-mode="ranked" id="game_mode_ranked_select_civilizations">
                        <!--<option value="All" selected>All Game Modes</option>-->
                        <option value="Death Match" selected>Death Match</option>
                        <option value="Random Map">Random Map</option>
                    </select>

                    <!-- for multiplayer -->
                    <select class="standard" data-stat-mode="mp" id="game_mode_mp_select_civilizations">
                        <!--<option value="All" selected >All Game Modes</option>-->
                        <option value="Capture the Relic" selected>Capture the Relic</option>
                        <option value="Custom Scenario">Custom Scenario</option>
                        <option value="Death Match">Death Match</option>
                        <option value="Defend the Wonder">Defend the Wonder</option>
                        <option value="Empire Wars">Empire Wars</option>
                        <option value="King of the Hill">King of the Hill</option>
                        <option value="Random Map">Random Map</option>
                        <option value="Regicide">Regicide</option>
                        <option value="Sudden Death">Sudden Death</option>
                        <option value="Turbo Random Map">Turbo Random Map</option>
                        <option value="Wonder Race">Wonder Race</option>
                    </select>

                    <div class="game-map-selectors">
                        <!-- for ranked play -->
                        <select class="standard" data-stat-mode="ranked" id="game_size_select_civilizations">
                            <!--<option value="All" selected>All Game Sizes</option>-->
                            <option value="1v1" selected>1v1</option>
                            <option value="2v2">2v2</option>
                            <option value="3v3">3v3</option>
                            <option value="4v4">4v4</option>
                        </select>

                        <!-- for ranked play -->
                        <select class="standard" data-stat-mode="ranked" id="game_map_select_civilizations">
                            <!--<option value="All" selected>All Map Sizes</option>-->
                            <!--<option value="Campaigns">Campaigns</option>
                            <option value="Giant">Giant</option>
                            <option value="Ludicrous">Ludicrous</option>-->
                            <option value="Large" selected>Large</option>
                            <option value="Medium">Medium</option>
                            <option value="Normal">Normal</option>
                            <option value="Small">Small</option>
                            <option value="Tiny">Tiny</option>
                        </select>

                        <!-- for multiplayer play -->
                        <select class="standard" data-stat-mode="mp" id="game_map_mp_select_civilizations">
                            <!--<option value="All" selected>All Map Sizes</option>-->
                            <option value="Campaigns">Campaigns</option>
                            <option value="Giant">Giant</option>
                            <option value="Ludicrous">Ludicrous</option>
                            <option value="Large" selected>Large</option>
                            <option value="Medium">Medium</option>
                            <option value="Normal">Normal</option>
                            <option value="Small">Small</option>
                            <option value="Tiny">Tiny</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="columns small-12 medium-8 large-8 large-align-left">
                    @include('stats.stats-globalCivsPlayed')
                </div>
                <div class="columns small-12 medium-4 large-4 large-align-center global-stats-sidebar">
                    <div class="frame-box">
                        <div class="frame-box__inner frame-box__inner--dark">
                            @include('stats.stats-mapsTopPlay')
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section class="content section--divider-frank-mid section--padding-bottom background--rock stats-content">
            <div class="row">
                <div class="columns small-12">

                <!-- <div class="frame-box">
                        <div class="frame-box__inner frame-box__inner--dark">-->
                            @include('stats.stats-global-matches')
                        <!--</div>
                    </div>-->

                </div>
            </div>
        </section>
        <div class="reveal match-details-modal" id="match-details-modal" data-reveal>
            <div class="match-details-modal__inner background--paper js-match-summary-mount">
            </div>
            <button class="close-button" data-close aria-label="Close modal" type="button">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="section-divider"></div>
    @endif
@endsection
