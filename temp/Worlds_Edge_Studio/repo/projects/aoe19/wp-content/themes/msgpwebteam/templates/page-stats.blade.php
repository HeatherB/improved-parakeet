{{-- 
    Template Name: Player Stats 
--}}

@php
    $user_ID = get_current_user_id();
    $user_info = get_userdata($user_ID);
    $page_template_slug = get_page_template_slug();
    $avatar = get_avatar($user_ID);
    $game = get_query_var('game');
    $gameType = $_GET['gameType'] ?? 'mp';
@endphp
@if(get_query_var('gamertag'))
    @php
        $gamertag = get_query_var('gamertag');
        $args = array(
            'meta_key' => 'msa_gt',
            'meta_value' => $gamertag,
        );
        $user = get_users($args);
        $avatar = get_avatar($user[0]->ID)
    @endphp
@elseif(get_user_meta($user_ID, 'msa_gt')[0])
    @php
        $gamertag = get_user_meta($user_ID, 'msa_gt')[0];
        $args = array(
            'meta_key' => 'msa_gt',
            'meta_value' => $gamertag,
        );
        $user = get_users($args);
        $avatar = get_avatar($user[0]->ID)
    @endphp
@else
    @php $gamertag = $user_info->user_nicename; @endphp
@endif

@extends('layouts.base-alt')

@section('content')
    @while(have_posts()) @php(the_post())
    @include('partials.stats-banner', ['game'=>$game,'buttons'=> ['Leaderboard','View Stats']])
    <div class="content section--divider-egypt-mid section--padding-bottom background--rock stats-content stats-multiplayer-content">
        <div class="">
            <main class="main">
                <div class="row">

                    @if(!is_user_logged_in())
                        @include('partials.header-stats-sign-in')
                    @else
                        <div class="header-stats">
                            @include('partials.stats-mystats-header')
                        </div>
                        <div class="stats-main">
                            <div class="stats-showNoResults"></div>
                            <div class="stats-toggle-visibility hide">
                                <div class="campaign-results-container"></div>
                                <div class="stats-msp">
                                    @if($game == 'age2' && $gameType == 'mp')
                                        @include('stats.stats-game-mode-age2')
                                    @else
                                        @include('stats.stats-overview')
                                    @endif                                    

                                    <?php // Age 2 DE specific templates
                                    if(get_query_var('game') == "age2") { ?>
                                        <div class="stats-career-age2">
                                            <h3>Career Stats</h3>
                                            <div class="col">
                                                @include('stats.stats-meta-age2')
                                            </div>
                                            <div class="col civs-figs">
                                                @include('stats.stats-civsAge2')
                                            </div>
                                        </div><!-- end of stats career age 2 -->
                                        @include('stats.stats-matches')
                                    <?php } else { ?>
                                        @include('stats.stats-civsAge')
                                        @include('stats.stats-ageTime')
                                        @include('stats.stats-meta')
                                        @include('stats.stats-matches')
                                    <?php  } ?>

                                    <div class="results-container results-container--mobile-padding">
                                    </div>

                                    <div class="js-total"></div>
                                </div>
                            </div>
                        </div>
                    @endif
                </div>
            </main>
        </div>
    </div>
    @endwhile
    <div class="reveal match-details-modal" id="match-details-modal" data-reveal>
        <div class="match-details-modal__inner background--paper js-match-summary-mount">
        </div>
        <button class="close-button" data-close aria-label="Close modal" type="button">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
    <div class="section-divider"></div>
@endsection