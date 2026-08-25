{{--
  Template Name: Stats Campaign
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
    <div class="content section--divider-egypt-mid section--padding-bottom background--rock stats-content stats-campaign-content">
        <main class="main">
          <div class="row">
          @if(!is_user_logged_in())
              @include('partials.header-stats-sign-in')
          @else
            <div class="header-stats">
              @include('partials.stats-mystats-header')
            </div>
            <div class="stats-campaign">
                <img src="@asset('images/campaign-stats/ascent-of-egypt_opt.jpg')" />
                <img src="@asset('images/campaign-stats/ave-caesar_opt.jpg')" />
                <img src="@asset('images/campaign-stats/custom-campaign_opt.jpg')" />
                <img src="@asset('images/campaign-stats/enemies-of-rome_opt.jpg')" />
                <img src="@asset('images/campaign-stats/glory-of-greece_opt.jpg')" />
                <img src="@asset('images/campaign-stats/imperium-romanum_opt.jpg')" />
                <img src="@asset('images/campaign-stats/reign-of-the-hittites_opt.jpg')" />
                <img src="@asset('images/campaign-stats/rise-of-rome_opt.jpg')" />
                <img src="@asset('images/campaign-stats/the-first-punic-war_opt.jpg')" />
                <img src="@asset('images/campaign-stats/voices-of-babylon_opt.jpg')" />
                <img src="@asset('images/campaign-stats/yamato-empire-of-the-rising-sun_opt.jpg')" />

                <div class="js-match-summary-mount"></div>

                <div class="campaign-results-container">
                </div>
            </div>
            @endif
        </main>
      </div>
  @endwhile
  <div class="section-divider"></div>
@endsection
