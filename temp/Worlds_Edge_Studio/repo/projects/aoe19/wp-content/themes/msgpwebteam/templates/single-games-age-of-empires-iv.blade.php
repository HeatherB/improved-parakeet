@extends('layouts.base-alt')

@section('content')

    @php
        $hero_header_carousel_video_background_mp4_url = 'https://msgpwebcdn.azureedge.net/aoe/wp-content/uploads/2017/08/MarbleBG_SmokeLoop-small.mp4';

        // special video class for Edge
        $edge_class = '';

        if (strpos($_SERVER['HTTP_USER_AGENT'], 'Edge') !== false) {
            $edge_class = ' --ms_edge';                
        } else {
            $edge_class = ' --object_fit';
        }

        $customize_boolean = $age4_game_style['customize_boolean'];
        $hero_bg_imgs = $age4_game_style['hero_bg_imgs'];
        $select_background_images = $hero_bg_imgs['select_background_images'];
        $youtube_embed = $age4_game_style['youtube_embed'];
        $extra_videos = $age4_game_style['extra_videos'];
        $preorder_option = $age4_game_style['preorder_option'];
        $preorder_button = $age4_game_style['preorder_button'];
        $preorder_video = $age4_game_style['preorder_video'];

        $civs_sub_nav_content_areas = $age4_game_style['civs_sub_nav_content_areas'];

        $display_content_area = $civs_sub_nav_content_areas['display_content_area'];
        $civs_sub_nav_from_url = $civs_sub_nav_content_areas['civilizations_sub_nav_built_from_url'];
        $content_areas_campaigns = $civs_sub_nav_content_areas['content_area_campaigns'];
        $content_areas = $civs_sub_nav_content_areas['content_area'];
        $content_area_system_requirements = $civs_sub_nav_content_areas['content_area_system_requirements'];
    @endphp
        
    <div class="@if(!$customize_boolean) {{"background--smoke" . $edge_class}} @elseif(!empty($hero_bg_imgs)) {{"age4__banner-custom-wrapper " . $select_background_images}} @endif">

        @if(!$customize_boolean)
            <video class="cover hero-background-video"  width="100%" height="100%" loop muted autoplay="true">
                <source src="{{$hero_header_carousel_video_background_mp4_url}}" type="video/mp4">
                    Your browser does not support the video tag.
            </video>
        @endif
        
        @include('partials.banner-wide')

        <!-- pre order button -->
        @if ($preorder_button)
        <div class="preorder_wrapper_buttons column">
            <div class="preorder_hero_banner_buttons buttons">
                @foreach ($preorder_button as $button)
                    <?php 
                      $buttonHref = "";

                      switch($button['type']) {
                          case 'blog_article':
                              $buttonHref = get_permalink($button['blog_article']->ID);
                              break;
                          case 'page_internal':
                              $buttonHref = $button['web_page_internal'];
                              break;
                          case 'page_external':
                              $buttonHref = $button['web_page_external'];
                              break;
                      }
                    ?>

                    <a class="sandbutton" href="{{$buttonHref}}">{{$button['button_text']}}</a>
                @endforeach
            </div>

            <div class="preorder_vendors">
                <ul>
                    <li class="vendor_gamepass">
                        <img src="@asset('images/ui/icons/gamepassforpc.png')" alt="gamepass for pc" />
                    </li>
                    <li class="vendor_windows">
                        <img src="@asset('images/ui/icons/windows10.png')" alt="windows 10" />
                    </li>
                    <li class="vendor_steam">
                        <img src="@asset('images/ui/icons/steam.svg')" alt="steam" />
                    </li>
                </ul>
            </div>
        </div>
        @endif <!-- end pre order button -->

        <section class="{{!$customize_boolean ? 'video-full' : 'age4__banner-custom-youtube-embed'}}">
            @if(!$customize_boolean)
                <div class="row">
                    <div class="column small-centered small-12 medium-8">
                        <div class="video-wrapper">
                            <iframe src="https://www.youtube.com/embed/wRTmEmTMJdw" frameborder="0" allowfullscreen title="{{getAriaPhrase('aoeiv')}} Featured Video"></iframe>
                        </div>
                    </div>
                    <div class="age4-cta column small-centered small-12 medium-8">
                        <div class="age4-cta__inner">
                            <div class="age4-cta__block age4-cta--img">
                                <a href="https://www.xbox.com/en-US/xbox-game-studios"><img src="@asset('images/Xbox_GameStudios_Stacked.svg')" alt="XBOX Game Studios" /></a>
                            </div>
                            <div class="age4-cta__block">
                                <div class="frame-box age4-cta--frame-va">
                                    <div class="frame-box__inner frame-box__inner--light">
                                        <div class="age4-cta__content">
                                            <h1>Stay In Touch</h1>
                                            <p>Become an Age Insider! Insiders get an exclusive look at the developments in the Age of Empires franchise.</p>
                                            <a class="btn-aoe btn-aoe--large" href="{{ get_home_url() }}/age-insider-information/">Sign Up Now</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="age4-cta__block age4-cta--img">
                                <a href="http://www.relic.com/#news"><img src="@asset('images/relic-standard.svg')" alt="Relic Entertainment" /></a>
                            </div>

                        </div>
                    </div>
                </div>
            @else

                @if($preorder_option)
                    <div class="row">
                        <div class="column small-centered small-12 medium-8 age4__yt-wrapper">
                            <div class="video-wrapper">
                                <iframe class="video_iframe" width="560" height="315" src="https://www.youtube-nocookie.com/embed/{{$preorder_video}}" title="Age of Empires IV" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                <a class="btn-novis" data-open="hero-video-modal" data-video-src="{{$preorder_video}}" data-video-type="youtube" data-video-muted="0"></a>
                            </div>
                        </div>
                    </div> 
                @elseif(!empty($youtube_embed))
                    <div class="row">
                        <div class="column small-centered small-12 medium-8 age4__yt-wrapper">
                            <div class="video-wrapper">
                                @php
                                $youtube_embed_title_attr = preg_replace('/title=(\'|")(\w|-|\s)*(\'|")/i', 'title="' . getAriaPhrase('aoeiv') . '"', $youtube_embed);
                                @endphp
                                {!!$youtube_embed_title_attr!!}
                            </div>
                        </div>
                    </div> 
                @endif

            @endif

        </section>

    </div>

    <!-- video thumbnails here -->
    @if(!empty($extra_videos))
    <div class="block-content section--divider background--rock content more_videos_bar civs-template__wrapper">
        <div class="row video_collection">
            @foreach($extra_videos['video'] as $extra_video)
            <div class="column small-centered small-12 medium-9 large-4 age4__yt-wrapper">
                <div class="video-wrapper">
                    <iframe class="video_iframe" width="560" height="315" src="https://www.youtube-nocookie.com/embed/{{$extra_video['youtube_embed_code']}}" title="Age of Empires IV" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    <button type="button" class="btn-novis" data-open="hero-video-modal" data-video-src="{{$extra_video['youtube_embed_code']}}" data-video-type="youtube" data-video-muted="0"></button>
                </div>
            </div>
            @endforeach
        </div> 
    </div>
    @endif
    <!-- end thumbnails area -->

    @if($news_posts)
        <div class="news section--divider-egypt-mid section--padding">
            @include('partials.extra-advert')
            <div class="row">
                <div class="columns">
                    <h1>Recent News</h1>
                    <div class="news-container">
                    @include('partials.content-news')
                    </div>
                    <div class="row column small-12 news__button">
                    <a href="/news" class="btn btn--small">SEE ALL NEWS
                    </a>
                    </div>
                </div>
            </div>
        </div>
    @endif 

    

    @if(!empty($display_content_area))
        @include('partials.civilizations-sub-nav', [
            'age4_display_civ_sub_nav_content_area' => $display_content_area,
            'age4_civs_sub_nav_from_url'            => $civs_sub_nav_from_url,
            'age4_content_areas'                    => $content_areas,
        ])

        <!-- campaigns -->
        @include('partials.age-iv-custom-content-areas-campaigns', [
            'age4_display_civ_sub_nav_content_area' => $display_content_area,
            'age4_content_areas'                    => $content_areas_campaigns,
        ])



        @include('partials.age-iv-custom-content-areas', [
            'age4_display_civ_sub_nav_content_area' => $display_content_area,
            'age4_content_areas'                    => $content_areas,
        ])

        <!-- system requirements -->
        @include('partials.age-iv-custom-content-areas', [
            'age4_display_civ_sub_nav_content_area' => $display_content_area,
            'age4_content_areas'                    => $content_area_system_requirements,
        ])
    @endif

@endsection

<div class="modal-frank" id="hero-video-modal" data-reveal data-close-on-click="true">
    <div class="frame"></div>
    <div class="responsive-embed widescreen"></div>
    <button class="close-button" data-close aria-label="Close modal" type="button">
        <span aria-hidden="true">&times;</span>
    </button>
</div>
