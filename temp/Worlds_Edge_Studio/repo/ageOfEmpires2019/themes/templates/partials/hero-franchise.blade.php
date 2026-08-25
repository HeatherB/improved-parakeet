{{-- @include('partials/hero-header-beam')
 --}}
<?php $home =  get_page_by_title( 'Home' ); ?>
<div id="hero">
    {{-- <div id="fan-preview-countdown-timer-wrapper">
        <div id="fan-preview-countdown-timer">
            <h2>Event Starts In</h2>
            <div class="countdown-timer-future-date">
                <span class="countdown-timer-days"></span><span class="countdown-timer-hrs"></span><span class="countdown-timer-minutes"></span>
            </div>
        </div>    
    </div>     --}}
    <svg version="1.1" id="heroselectors-m" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
     width="640px" height="1356px" viewBox="0 0 640 1356" style="enable-background:new 0 0 640 1356;" xml:space="preserve">

        <rect class="fan-preview" width="640" height="640"/>

        <a xlink:href="<?php echo site_url('/games/aoeiiide'); ?>">
            <rect class="age3" y="640" width="320" height="321"/>
        </a>
        <a xlink:href="<?php echo site_url('/games/aoeiide/'); ?>">
            <rect class="age2" x="320" y="640" width="320" height="321"/>
        </a>
        <a xlink:href="<?php echo site_url('/games/aoe/'); ?>">
            <rect class="age1" y="961" width="320" height="324"/>
        </a>
        <a xlink:href="<?php echo site_url('/games/aom/'); ?>">
            <rect class="myth" x="320" y="961" width="320" height="324"/>
        </a>
    </svg>

    <svg version="1.1" id="heroselectors" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
 width="3840px" height="1508px" viewBox="0 0 3840 1508" style="enable-background:new 0 0 3840 1508;" xml:space="preserve">
        <polygon class="age1" points="568.103333,1124.398071 519.893066,1124.398071 519.893127,1148.378174 357.650024,1218.572021 
        289.976685,1206.168091 222.30336,1218.572021 60.060295,1148.378174 60.060299,1124.398071 12,1124.398071 12,12 568.103333,12     
        "/>
        <polygon class="age2" points="1267.647461,1124.398071 1219.799927,1124.398071 1219.682983,1148.271851 997.366943,1265.575806 
        929.803528,1253.0802 862.137024,1265.575806 639.792725,1148.428345 639.75592,1124.398071 591.959534,1124.545288 591.793884,12 
        1267.647461,12"/>
        <polygon class="fan-preview" points="2547.844971,1124.398071 2499.880127,1124.398071 2499.859863,1148.352173 1987.474243,1340.726685 
        1919.906372,1328.329224 1852.268799,1340.726685 1339.93335,1148.428345 1339.896606,1124.398071 1292.100098,1124.545288 
        1291.934448,12 2547.844971,12"/>
        <polygon class="age3" points="3247.75293,1124.398071 3199.905273,1124.398071 3199.78833,1148.271851 2977.472168,1265.575806 
        2909.908936,1253.0802 2842.242432,1265.575806 2619.897949,1148.428345 2619.861328,1124.398071 2572.064941,1124.545288 
        2571.89917,12 3247.75293,12"/>
        <polygon class="myth" points="3828,1124.398071 3779.789795,1124.398071 3779.789795,1148.378174 3617.546631,1218.572021 
        3549.873291,1206.168091 3482.199951,1218.572021 3319.957031,1148.378174 3319.957031,1124.398071 3271.896729,1124.398071 
        3271.896729,12 3828,12"/>
    </svg>

    <div id="fan-preview-countdown-timer-wrapper">
        <div id="fan-preview-countdown-timer">
            <h2>Event Starts In</h2>
            {{-- 
            Final time will be grabbed in 
            /assets/scripts/component/CountdownTimerFutureDate.js  
            and will used like new Date('2021-04-10T09:00'); in JS.
            
            data-future-date-time must have a value of something like 
            "2021-04-10-0900" wich stands for 
            the year, month, day of the month, and hours and minutes

            data-end-time-zone value is grabbed from the link below,
            like "America/Los_Angeles" for Pacific Time:
            https://en.m.wikipedia.org/wiki/List_of_tz_database_time_zones

            The data-future-timeup-element will add a class
            of .timeup, like to the .sandbutton element,
            to stay it when the times up. This element is
            optional
            --}}
            <div id="countdown-timer-future-date" data-future-date-time="2021-04-10-0900" data-future-date-time-zone="America/Los_Angeles" data-future-timeup-element=".fan-preview .sandbutton">
                <span id="countdown-timer-days"></span><span id="countdown-timer-hrs"></span><span id="countdown-timer-mins"></span><span id="countdown-timer-secs"></span>
            </div>
        </div> 
    </div>    
    <nav class="heronav-m">
        <ul class="fan-preview open">
            {{--
            @php
            wp_nav_menu(array('items_wrap'=> '%3$s', 'walker' => new Hero_Nav_Walker(), 'container'=>false, 'menu_class' => '', 'theme_location'=>'age3', 'fallback_cb'=>false ));
            @endphp
            
             @if(get_field("youtube_id", $home->ID))
                <li class="always-visible">
                    <a class="btn-aoe--cta" data-open="hero-video-modal" data-video-src="{{ get_field('youtube_id', $home->ID) }}" data-video-type="youtube" data-video-muted="0">{{ get_field("label", $home->ID) }}</a>
                </li>
            @endif
            --}}
            <li class="always-visible"><a href="<?php echo site_url('/news/announcing-age-fan-preview-2021/'); ?>" class="sandbutton">Learn More</a></li>     
        </ul>
    </nav>
    <nav class="heronav">
        <ul class="myth">
            @php
            wp_nav_menu(array('items_wrap'=> '%3$s', 'walker' => new Hero_Nav_Walker(), 'container'=>false, 'menu_class' => '', 'theme_location'=>'myth', 'fallback_cb'=>false ));
            @endphp
        </ul>
        <ul class="age1">
            @php
            wp_nav_menu(array('items_wrap'=> '%3$s', 'walker' => new Hero_Nav_Walker(), 'container'=>false, 'menu_class' => '', 'theme_location'=>'age1', 'fallback_cb'=>false ));
            @endphp
        </ul>
        <ul class="age2">
            @php
            wp_nav_menu(array('items_wrap'=> '%3$s', 'walker' => new Hero_Nav_Walker(), 'container'=>false, 'menu_class' => '', 'theme_location'=>'age2', 'fallback_cb'=>false ));
            @endphp
        </ul>
        <ul class="fan-preview">
            {{-- @php
            wp_nav_menu(array('items_wrap'=> '%3$s', 'walker' => new Hero_Nav_Walker(), 'container'=>false, 'menu_class' => '', 'theme_location'=>'age3', 'fallback_cb'=>false ));
            @endphp --}}

           {{--
            @if(get_field("youtube_id", $home->ID))
                <li class="always-visible"><a class="btn-aoe--cta" data-open="hero-video-modal" data-video-src="{{ get_field('youtube_id', $home->ID) }}" data-video-type="youtube" data-video-muted="0">{{ get_field("label", $home->ID) }}</a></li>
            @endif

            <li class="always-visible"><a href="/buy-now#Age_of_Empires_III_Definitive_Edition" class="btn-aoe--cta">Buy Now!</a></li>
           --}}
            <li class="always-visible"><a href="<?php echo site_url('/news/announcing-age-fan-preview-2021/'); ?>" class="sandbutton">Learn More</a></li>   
        </ul>
        <ul class="age3">
            @php
            wp_nav_menu(array('items_wrap'=> '%3$s', 'walker' => new Hero_Nav_Walker(), 'container'=>false, 'menu_class' => '', 'theme_location'=>'age3', 'fallback_cb'=>false ));
            @endphp
        </ul>
    </nav>
    <div class="logo myth"></div>
    <div class="logo age1"></div>
    <div class="logo age2"></div>
    <div class="logo fan-preview no-open"></div>
    <div class="logo age3"></div>
</div>
<div class="marble"></div>
<div class="coverup"></div>
<div class="divider-frank"></div>
<div class="modal-frank" id="hero-video-modal" data-reveal data-close-on-click="true">
    <div class="frame"></div>
    <div class="responsive-embed widescreen"></div>
    <button class="close-button" data-close aria-label="Close modal" type="button">
        <span aria-hidden="true">&times;</span>
    </button>
</div>
