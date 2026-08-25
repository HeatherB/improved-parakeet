<?php
// If on /games/age-of-empires-iv/civilizations/ archive page or similar (see CivilizationsController.php)
// make $post_id = $civs_archive_page['civ_sub_menu_id']
// else make $post_id = get_the_ID()
if(!empty($civs_archive_page['civ_sub_menu_id'])) {
    $post_id = $civs_archive_page['civ_sub_menu_id'];
} else {
    $post_id = get_the_ID();
}

// Default $bg_image_selected
$bg_image_selected = false;

// get ACF group field
if( get_field('custom_background_hero_options', $post_id) ) {
    $options = get_field('custom_background_hero_options', $post_id);
    $add_custom_hero_background_image = $options['add_custom_hero_background_image'];
    $bg_image_selected = false;
}

// Assign $bg_image_selected to true only if $options ACF field exists with
// $add_custom_hero_background_image ACF field checkbox checked (true/false field)
if(
    (!empty($options) && !empty($add_custom_hero_background_image) )
) {
    $bg_image_selected = true; 
}   
?>

<div class="banner mods-banner mods-all-banner @if(!empty($class)) {{$class}} @endif @if( !empty($header_block['addon_expansion_hero_banner_title']) || !empty($header_block['addon_expansion_hero_banner_copy'])) copy-block @endif {{!empty($tall_game_name_logo) ? 'tall-game-logo' : ''}} {{!empty($bg_image_selected) ? 'banner__no-bg-image': ''}}">
    @if ( $bg_image_selected )
        @include('partials.hero-picture', ['options' => $options])
    @endif
    
    <div class="row column text-center">
        {{--
        If on /games/age-of-empires-iv/civilizations/ archive page or similar (see CivilizationsController.php) 
        return H1 tag with page title that has ID of $civs_archive_page['civ_sub_menu_id']    
        --}}
        @if(!empty($civs_archive_page['civ_sub_menu_id']))
            <h1 class="light">{!! get_the_title($civs_archive_page['civ_sub_menu_id']) !!}</h1>
        @else 
            <h1 class="light">{!! App\title() !!}</h1>
        @endif
    
  @if((isset($header_block) && $header_block['addon_expansion_hero_banner_title']) || (isset($header_block) && $header_block['addon_expansion_hero_banner_copy']))
    <div class="banner-block border--gold--thin">
      <div class="inner">
        @if($header_block['addon_expansion_hero_banner_title'])
        <h2>{{$header_block['addon_expansion_hero_banner_title']}}</h2>
        @endif
        @if($header_block['addon_expansion_hero_banner_copy'])
        {!! $header_block['addon_expansion_hero_banner_copy'] !!}
        @endif

        @if (isset($heroButtons) && !empty($heroButtons))
        <div class="addon_expansion_hero_banner_buttons buttons hero-header__content text--light">
            @foreach ($heroButtons as $button)
                <?php 
                  $buttonHref = "";

                  switch($button['addon_expansion_hero_banner_button_type']) {
                      case 'blog_article':
                          $buttonHref = get_permalink($button['addon_expansion_hero_banner_button_blog_article']->ID);
                          break;
                      case 'page_internal':
                          $buttonHref = $button['addon_expansion_hero_banner_button_web_page_internal'];
                          break;
                      case 'page_external':
                          $buttonHref = $button['addon_expansion_hero_banner_button_web_page_external'];
                          break;
                  }
                ?>
            
                @if ($button['addon_expansion_hero_banner_button_type'] == 'video_modal_youtube') 
                    <button type="button" class="btn-aoe--cta btn-aoe--cta--large hero-video-modal"
                        data-btn-open="hero-video-modal" data-video-src="{{$button['video_id']}}" data-video-type="youtube" data-video-muted="1">{{$button['addon_expansion_hero_banner_button_text']}}</button>
                @else
                      <a class="btn-aoe--cta btn-aoe--cta--large" href="{{$buttonHref}}" {{ $button['web_page_external_open_in_new_tab'] ? 'target="_blank"' : '' }} >{{$button['addon_expansion_hero_banner_button_text']}}</a>
                @endif        

            @endforeach
        </div>
        @endif

      </div><!-- end of inner -->
    </div><!-- end of banner block -->
  @else


      @if (isset($heroButtons)  && !empty($heroButtons))
      <div class="addon_expansion_hero_banner_buttons buttons hero-header__content text--light">
          @foreach ($heroButtons as $button)
              <?php 
                $buttonHref = "";

                switch($button['addon_expansion_hero_banner_button_type']) {
                    case 'blog_article':
                        $buttonHref = get_permalink($button['addon_expansion_hero_banner_button_blog_article']->ID);
                        break;
                    case 'page_internal':
                        $buttonHref = $button['addon_expansion_hero_banner_button_web_page_internal'];
                        break;
                    case 'page_external':
                        $buttonHref = $button['addon_expansion_hero_banner_button_web_page_external'];
                        break;
                }
              ?>
          
              @if ($button['addon_expansion_hero_banner_button_type'] == 'video_modal_youtube') 
                  <button type="button" class="btn-aoe--cta btn-aoe--cta--large hero-video-modal"
                      data-btn-open="hero-video-modal" data-video-src="{{$button['video_id']}}" data-video-type="youtube" data-video-muted="1">{{$button['addon_expansion_hero_banner_button_text']}}</button>
              @else
                    <a class="btn-aoe--cta btn-aoe--cta--large" href="{{$buttonHref}}" {{ $button['web_page_external_open_in_new_tab'] ? 'target="_blank"' : '' }} >{{$button['addon_expansion_hero_banner_button_text']}}</a>
              @endif        

          @endforeach
      </div>
      @endif

  @endif
  </div><!-- end row column text-center -->
</div><!-- end banner mods-banner mods-all-banner -->

{{-- Modal for YouTube video (like {$button['video_id'] code above) --}}
<div class="modal-frank" id="hero-video-modal" data-reveal data-close-on-click="true">
  <div class="frame"></div>
  <div class="responsive-embed widescreen"></div>
  <button class="close-button" data-close aria-label="Close modal" type="button">
      <span aria-hidden="true">&times;</span>
  </button>
</div>