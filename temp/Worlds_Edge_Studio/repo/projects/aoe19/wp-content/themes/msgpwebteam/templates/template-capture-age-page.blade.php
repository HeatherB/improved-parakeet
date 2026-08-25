{{--
  Template Name: Capture Age Template
--}}

@extends('layouts.hero')

<?php
  /**  HERO SECTION  **/ 
  if(have_rows('capture_hero_section')):
    while(have_rows('capture_hero_section')): the_row();
      if(get_row_layout() == 'capture_hero_items'):
        $hero_image = get_sub_field('capture_hero_image');
        $hero_image_mobile = get_sub_field('hero_image_mobile');
        $capture_logo = get_sub_field('capture_logo');
        $page_description = get_sub_field('capture_age_description');
        $capture_button = get_sub_field('capture_button');
      endif;
    endwhile;
  endif;

  $hero_image_href = $hero_image['url'];
  $hero_image_mobile_href = $hero_image_mobile['url'];
  $capture_logo_href = $capture_logo['url'];
  $capture_button_href =  $capture_button['url'];
  $capture_button_title = $capture_button['title'];
?>

@section('content')
  <div class="ca-hero-section">
    <picture class="">
      <source media="(max-width: 576px)" srcset="{{$hero_image_mobile_href}}">
      <img srcset="{{ $hero_image_href }}" alt="">
    </picture>
    <div class="header-content-wrap">
      <div class="ca-hero-section__logo">
        <img src="{{ $capture_logo_href}}" href="" alt="{{ $capture_logo_title['title']}}" >
      </div>
      <div class="ca-hero-section__content">
        <div class="description">{!! $page_description !!}</div>
        <div class="capture-button">
          <a type="button" class="button cta" href="{{$capture_button_href}}" target="blank">
            {{ $capture_button_title }}
          </a>
        </div>
      </div>
    </div>
  </div>
  <div class="section--divider-frank-mid"></div>
  <div class="captureAge-content">
    <?php
    $counter = 0; 
    if(have_rows('ca_page_content_section')):
      while(have_rows('ca_page_content_section')): the_row();
        $content_bg_image = get_sub_field('background_image');
        $content_bg_image_mobile = get_sub_field('background_image_mobile');
        $content_description = get_sub_field('content_description');
        $content_desc_button = get_sub_field('content_button');

        $content_bg_image_href    = $content_bg_image['url'];
        $content_bg_image_mobile_href = $content_bg_image_mobile['url'];
        $content_desc_button_href   = $content_desc_button['url'];
        $content_desc_button_title  = $content_desc_button['title'];

        $oddRow   = ($counter % 2 !== 0) ? "capture-oddRow" : "";
        $statsRow = ($counter == 2) ? "capture-stats-row" : "";
    ?>
    <div class="captureAge-content__row">
      <picture class="">
        <source media="(max-width: 576px)" srcset="{{$content_bg_image_mobile_href}}">
        <img srcset="{{ $content_bg_image_href }}" alt="">
      </picture>
      <div class="description <?= $oddRow. " ". $statsRow  ?> ">
        {!! $content_description !!}
        @if($content_desc_button)
          <div class="content-btn-wrap">
            <a type="button" class="button cta" href="{{$content_desc_button_href}}" target="blank">
              {{ $content_desc_button_title }}
            </a>
          </div>
        @endif
      </div>
    </div>
    <?php $counter++; endwhile; endif; ?>
    <div class="capture-team frame-box">
      <div class="frame-box__inner frame-box__inner--light frame-box__inner--no-pad frame-box__inner--loading">
        <?php $capture_age_team = get_field("capture_age_team"); ?>
        <div class="description">{!! $capture_age_team !!}</div>
        <div class="team-buttons">
          <?php
            if(have_rows('capture_teams_buttons')):
              while(have_rows('capture_teams_buttons')): the_row();
                $capture_team_button = get_sub_field('team_button');
                $capture_team_button_href   = $capture_team_button['url'];
                $capture_team_button_title  = $capture_team_button['title'];
          ?>
            <a type="button" class="button cta" href="{{$capture_team_button_href}}" target="blank">
              {{ $capture_team_button_title }}
            </a>
          <?php endwhile;  endif; ?>
        </div>
      </div>
    </div>
  </div>

@endsection
