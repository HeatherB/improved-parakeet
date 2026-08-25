{{--
  Template Name: Stats Single Player
--}}

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
        $gamertag = get_user_meta($user[0]->ID, 'msa_modern_gamertag')[0] ?? $gamertag
    @endphp
@elseif(get_user_meta($user_ID, 'msa_modern_gamertag')[0])
    @php
        $gamertag = get_user_meta($user_ID, 'msa_modern_gamertag')[0];
        $args = array(
            'meta_key' => 'msa_modern_gamertag',
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
    <div class="content section--divider-egypt-mid section--padding-bottom background--rock stats-content stats-single-player-content">
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
                            <div class="stats-overview">
                                <div class="dark-content-box stats-overview__equal js-wins-loader">
                                    <div class="stats-overview__height-placeholder">
                                        <ul class="progress-stats">
                                            <li>
                                                <span id="" class="winsnumber">N/A</span>
                                                Total Wins
                                            </li>
                                            <li>
                                                <span id="" class="matchesnumber">N/A</span>
                                                MP Matches
                                            </li>
                                        </ul>
                                        <div class="progress-circle progress-circle--wAuto-m">
                                            <div class="progress-circle__box">
                                                <div id="chart-wins"></div>
                                                <div class="progress-circle__inset chart-inset chart-inset--wins">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="dark-content-box stats-overview__equal js-victories-loader">
                                    <div class="stats-overview__height-placeholder">
                                        <ul class="progress-stats">
                                            <li>
                                                <span>Victories</span>
                                            </li>
                                        </ul>
                                        <div class="progress-circle progress-circle--donut">
                                            <!-- TODO: refactor this -->
                                            <div class="progress-circle__box progress-circle__box--victorytype">
                                                <div class="chart-circle" id="chart-victorytype"></div>
                                                <div class="progress-circle__inset chart-inset chart-inset--victorytype">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="dark-content-box stats-listings js-civLoader" id="chart-civs">
                                <div class="" style="position: relative">
                                    <table class="bargraph-table">
                                        <thead>
                                        <tr>
                                            <th>Faction</th>
                                            <th colspan="2" class="align-right">Number of Times Played</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr class="progress-bar highlighted Assyrian" data-progress="">
                                            <td class="bargraph-table__label-cell e-label ">Assyrian</td>
                                            <td class="bargraph-table__bargraph-cell">
                                                <span class="graph-line graph-line--25"></span>
                                                <span class="graph-line graph-line--50"></span>
                                                <span class="graph-line graph-line--75"></span>
                                                <progress class="progress-bar__bar bargraph bargraph--high-val" max="" value="0"></progress>
                                            </td>
                                            <td class="bargraph-table__stat-cell align-right progress-bar__number"></td>
                                        </tr>
                                        <tr class="progress-bar highlighted Babylonian" data-progress="">
                                            <td class="bargraph-table__label-cell e-label">Babylonian</td>
                                            <td class="bargraph-table__bargraph-cell">
                                                <span class="graph-line graph-line--25"></span>
                                                <span class="graph-line graph-line--50"></span>
                                                <span class="graph-line graph-line--75"></span>
                                                <progress class="progress-bar__bar bargraph bargraph--high-val" max="" value="0"></progress>
                                            </td>
                                            <td class="bargraph-table__stat-cell align-right progress-bar__number"></td>
                                        </tr>
                                        <tr class="progress-bar highlighted Carthaginian" data-progress="">
                                            <td class="bargraph-table__label-cell e-label">Carthaginian</td>
                                            <td class="bargraph-table__bargraph-cell">
                                                <span class="graph-line graph-line--25"></span>
                                                <span class="graph-line graph-line--50"></span>
                                                <span class="graph-line graph-line--75"></span>
                                                <progress class="progress-bar__bar bargraph bargraph--high-val" max="" value="0"></progress>
                                            </td>
                                            <td class="bargraph-table__stat-cell align-right progress-bar__number"></td>
                                        </tr>
                                        <tr class="progress-bar Egyptian" data-progress="">
                                            <td class="bargraph-table__label-cell e-label">Egyptian</td>
                                            <td class="bargraph-table__bargraph-cell">
                                                <span class="graph-line graph-line--25"></span>
                                                <span class="graph-line graph-line--50"></span>
                                                <span class="graph-line graph-line--75"></span>
                                                <progress class="progress-bar__bar bargraph bargraph--med-val" max="" value="0"></progress>
                                            </td>
                                            <td class="bargraph-table__stat-cell align-right progress-bar__number"></td>
                                        </tr>
                                        <tr class="progress-bar Greek" data-progress="">
                                            <td class="bargraph-table__label-cell e-label">Greek</td>
                                            <td class="bargraph-table__bargraph-cell">
                                                <span class="graph-line graph-line--25"></span>
                                                <span class="graph-line graph-line--50"></span>
                                                <span class="graph-line graph-line--75"></span>
                                                <progress class="progress-bar__bar bargraph bargraph--med-val" max="" value="0"></progress>
                                            </td>
                                            <td class="bargraph-table__stat-cell align-right progress-bar__number"></td>
                                        </tr>
                                        <tr class="progress-bar Hittite" data-progress="">
                                            <td class="bargraph-table__label-cell e-label ">Hittite</td>
                                            <td class="bargraph-table__bargraph-cell">
                                                <span class="graph-line graph-line--25"></span>
                                                <span class="graph-line graph-line--50"></span>
                                                <span class="graph-line graph-line--75"></span>
                                                <progress class="progress-bar__bar bargraph bargraph--low-val" max="" value="0"></progress>
                                            </td>
                                            <td class="bargraph-table__stat-cell align-right progress-bar__number"></td>
                                        </tr>
                                        <tr class="progress-bar Macedonian" data-progress="">
                                            <td class="bargraph-table__label-cell e-label ">Macedonian</td>
                                            <td class="bargraph-table__bargraph-cell">
                                                <span class="graph-line graph-line--25"></span>
                                                <span class="graph-line graph-line--50"></span>
                                                <span class="graph-line graph-line--75"></span>
                                                <progress class="progress-bar__bar bargraph bargraph--low-val" max="" value="0"></progress>
                                            </td>
                                            <td class="bargraph-table__stat-cell align-right progress-bar__number"></td>
                                        </tr>
                                        <tr class="progress-bar Minoan" data-progress="">
                                            <td class="bargraph-table__label-cell e-label ">Minoan</td>
                                            <td class="bargraph-table__bargraph-cell">
                                                <span class="graph-line graph-line--25"></span>
                                                <span class="graph-line graph-line--50"></span>
                                                <span class="graph-line graph-line--75"></span>
                                                <progress class="progress-bar__bar bargraph bargraph--low-val" max="" value="0"></progress>
                                            </td>
                                            <td class="bargraph-table__stat-cell align-right progress-bar__number"></td>
                                        </tr>
                                        <tr class="progress-bar Palmyran" data-progress="">
                                            <td class="bargraph-table__label-cell e-label Palmyran">Palmyran</td>
                                            <td class="bargraph-table__bargraph-cell">
                                                <span class="graph-line graph-line--25"></span>
                                                <span class="graph-line graph-line--50"></span>
                                                <span class="graph-line graph-line--75"></span>
                                                <progress class="progress-bar__bar bargraph bargraph--low-val" max="" value="0"></progress>
                                            </td>
                                            <td class="bargraph-table__stat-cell align-right progress-bar__number"></td>
                                        </tr>
                                        <tr class="progress-bar Persian" data-progress="">
                                            <td class="bargraph-table__label-cell e-label">Persian</td>
                                            <td class="bargraph-table__bargraph-cell">
                                                <span class="graph-line graph-line--25"></span>
                                                <span class="graph-line graph-line--50"></span>
                                                <span class="graph-line graph-line--75"></span>
                                                <progress class="progress-bar__bar bargraph bargraph--low-val" max="" value="0"></progress>
                                            </td>
                                            <td class="bargraph-table__stat-cell align-right progress-bar__number"></td>
                                        </tr>
                                        <tr class="progress-bar Phoenician" data-progress="">
                                            <td class="bargraph-table__label-cell e-label">Phoenician</td>
                                            <td class="bargraph-table__bargraph-cell">
                                                <span class="graph-line graph-line--25"></span>
                                                <span class="graph-line graph-line--50"></span>
                                                <span class="graph-line graph-line--75"></span>
                                                <progress class="progress-bar__bar bargraph bargraph--low-val" max="" value="0"></progress>
                                            </td>
                                            <td class="bargraph-table__stat-cell align-right progress-bar__number"></td>
                                        </tr>
                                        <tr class="progress-bar Roman" data-progress="">
                                            <td class="bargraph-table__label-cell e-label ">Roman</td>
                                            <td class="bargraph-table__bargraph-cell">
                                                <span class="graph-line graph-line--25"></span>
                                                <span class="graph-line graph-line--50"></span>
                                                <span class="graph-line graph-line--75"></span>
                                                <progress class="progress-bar__bar bargraph bargraph--low-val" max="" value="0"></progress>
                                            </td>
                                            <td class="bargraph-table__stat-cell align-right progress-bar__number"></td>
                                        </tr>
                                        <tr class="progress-bar Shang" data-progress="">
                                            <td class="bargraph-table__label-cell e-label">Shang</td>
                                            <td class="bargraph-table__bargraph-cell">
                                                <span class="graph-line graph-line--25"></span>
                                                <span class="graph-line graph-line--50"></span>
                                                <span class="graph-line graph-line--75"></span>
                                                <progress class="progress-bar__bar bargraph bargraph--low-val" max="" value="0"></progress>
                                            </td>
                                            <td class="bargraph-table__stat-cell align-right progress-bar__number"></td>
                                        </tr>
                                        <tr class="progress-bar Sumerian" data-progress="">
                                            <td class="bargraph-table__label-cell e-label ">Sumerian</td>
                                            <td class="bargraph-table__bargraph-cell">
                                                <span class="graph-line graph-line--25"></span>
                                                <span class="graph-line graph-line--50"></span>
                                                <span class="graph-line graph-line--75"></span>
                                                <progress class="progress-bar__bar bargraph bargraph--low-val" max="" value="0"></progress>
                                            </td>
                                            <td class="bargraph-table__stat-cell align-right progress-bar__number"></td>
                                        </tr>
                                        <tr class="progress-bar Yamato" data-progress="">
                                            <td class="bargraph-table__label-cell e-label">Yamato</td>
                                            <td class="bargraph-table__bargraph-cell">
                                                <span class="graph-line graph-line--25"></span>
                                                <span class="graph-line graph-line--50"></span>
                                                <span class="graph-line graph-line--75"></span>
                                                <progress class="progress-bar__bar bargraph bargraph--low-val" max="" value="0"></progress>
                                            </td>
                                            <td class="bargraph-table__stat-cell align-right progress-bar__number"></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div class="dark-content-box stats-listings js-timeLoader js-stat-listings">
                                <div class="chart chart--area" id="chart-area">
                                </div>
                                <div class="chart-legend">
                                    <div class="chart-legend--timeTo">
                                        <i class="fa fa-stop"></i>
                                        <span>Time To Age</span>
                                    </div>
                                    <div class="chart-legend--timeIn">
                                        <i class="fa fa-stop"></i>
                                        <span>Time In Age</span>
                                    </div>
                                </div>
                            </div>

                            <div class="dark-content-box stats-listings js-staticStatsLoader">
                                <div class="arrow-badge-hr arrow-badge-hr--gameplay">
                                    <hr />
                                </div>
                                <div class="row">
                                    <div class="columns medium-6">
                                        <dl class="stats-list">
                                            <dt>Total Time Playing MP</dt>
                                            <dd><span class="stat timePlayingMP"><span class="js-hours-timePlayingMP"></span><sub>hr</sub> <span class="js-minutes-timePlayingMP"></span><sub>min</sub></span></dd>
                                            <dt>Avg. Match Length</dt>
                                            <dd><span class="stat averageMatchLength"><span class="js-hours-averageMatchLength"></span><sub>hr</sub> <span class="js-minutes-averageMatchLength"></span><sub>min</sub></span></dd>
                                            <dt>Total Units Killed</dt>
                                            <dd><span class="stat js-unitsKilled">N/A</span></dd>
                                        </dl>
                                    </div>
                                    <div class="columns medium-6">
                                        <dl class="stats-list">
                                            <dt>Players Defeated</dt>
                                            <dd><span class="stat js-playersDefeated">N/A</span></dd>
                                            <dt>Avg. Number of Villagers</dt>
                                            <dd><span class="stat js-villagersCreated">N/A</span></dd>
                                            <dt>Wonders Built</dt>
                                            <dd><span class="stat js-wondersBuilt">N/A</span></dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>


                            <div class="game-stats">
                                <div class="game-stats__equal">
                                    <h2 class="h3 light">Game Stats</h2>
                                </div>
                                <div class="game-stats__equal">
                                    <div class="pagination-container mpmatches-pagination js-pageNav"></div>
                                </div>
                            </div>


                            <div class="results-container">




                            </div>

                            <div class="js-total"></div>



                        </div>
                    @endif
                </div>
            </main>
        </div>
    </div>
    @endwhile
@endsection
<div class="section-divider"></div>