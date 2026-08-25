{{--
  Template Name: Stats Match Details
--}}
@if(!get_query_var('gameId') && !isset($_GET['gameId']))
    @php
        // MARK -- remove prepended url
        $url = esc_url( home_url() ) . '/ageofempires/stats';
        echo 'Game: ' . get_query_var('gameId');
        echo 'Game: ' . $_GET['gameId'];
        header("Location: $url"); /* Redirect browser */
        exit();
    @endphp
@endif
@php
    $user_ID = get_current_user_id();
    $user_info = get_userdata($user_ID);
    $page_template_slug = get_page_template_slug();
    $avatar = get_avatar($user_ID)
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
    @include('partials.stats-banner')
    <div class="content section--divider-egypt-mid section--padding-bottom background--rock stats-content stats-multiplayer-content">
            <main class="main">
                <div class="row">
                    @if(!is_user_logged_in())
                        @include('partials.header-stats-sign-in')
                    @else
                        <div class="header-stats">
                            @include('partials.stats-match-details-header')
                        </div>
                    <div class="player-list-wrapper results-container--mobile-padding">
                        <div class="frame-box">
                            <div class="frame-box__inner frame-box__inner--light">
                                <div class="js-player-list-mount">
                                    <table class="player-list">
                                        <thead class="player-list__header">
                                            <tr>
                                                <th class="player-list__header-item"></th>
                                                <th class="player-list__header-item">Player</th>
                                                <th class="player-list__header-item">Civilization</th>
                                                <th class="player-list__header-item">Team</th>
                                                <th class="player-list__header-item">Total Score</th>
                                                <th class="player-list__header-item">Result</th>
                                            </tr>
                                        </thead>
                                        <tbody class="player-list__content">
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row js-errorMessage hide">
                    </div>

                    @endif
                </div>
            </main>
        </div>
    </div>
    @endwhile
    <div class="section-divider"></div>
@endsection

