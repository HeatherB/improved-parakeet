{{-- @include('partials/hero-header-beam')
 --}}
<?php $home_id =  get_page_id_by_title( 'Home' ); ?>
<div id="hero">

    <svg version="1.1" id="heroselectors-m" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
     width="640px" height="1356px" viewBox="0 0 640 1356" style="enable-background:new 0 0 640 1356;" xml:space="preserve">

        <a xlink:href="<?php echo site_url('/games/age-of-empires-iv/'); ?>">
            <rect class="age4" width="640" height="640"/>
        </a>        
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
        <polygon class="age4" points="2547.844971,1124.398071 2499.880127,1124.398071 2499.859863,1148.352173 1987.474243,1340.726685 
        1919.906372,1328.329224 1852.268799,1340.726685 1339.93335,1148.428345 1339.896606,1124.398071 1292.100098,1124.545288 
        1291.934448,12 2547.844971,12"/>
        <polygon class="age3" points="3247.75293,1124.398071 3199.905273,1124.398071 3199.78833,1148.271851 2977.472168,1265.575806 
        2909.908936,1253.0802 2842.242432,1265.575806 2619.897949,1148.428345 2619.861328,1124.398071 2572.064941,1124.545288 
        2571.89917,12 3247.75293,12"/>
        <polygon class="myth" points="3828,1124.398071 3779.789795,1124.398071 3779.789795,1148.378174 3617.546631,1218.572021 
        3549.873291,1206.168091 3482.199951,1218.572021 3319.957031,1148.378174 3319.957031,1124.398071 3271.896729,1124.398071 
        3271.896729,12 3828,12"/>
    </svg>

    <nav class="heronav-m">
        <ul class="age4 open">
            <li class="always-visible"><a href="/buy-now" class="sandbutton">Pre-Order Now</a></li>
            
            @if(get_field("youtube_id", $home_id))
                <li class="always-visible">
                    <a class="sandbutton" data-open="hero-video-modal" data-video-src="{{ get_field('youtube_id', $home_id) }}" data-video-type="youtube" data-video-muted="0">{{ get_field("label", $home_id) }}</a>
                </li>
            @endif

            @php
            // true passed in as a argument to the Hero_Nav_Walker() is optional and means the background of the anchor tags in the menu is a sand button.
            // See functions.php for more details. 
            wp_nav_menu(array('items_wrap'=> '%3$s', 'walker' => new Hero_Nav_Walker(true), 'container'=>false, 'menu_class' => '', 'theme_location'=>'age4', 'fallback_cb'=>false ));
            @endphp
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
        <ul class="age4">
            <li class="always-visible"><a href="/buy-now" class="sandbutton">Pre-Order Now</a></li>

            @if(get_field("youtube_id", $home_id))
                <li><a class="sandbutton" data-open="hero-video-modal" data-video-src="{{ get_field('youtube_id', $home_id) }}" data-video-type="youtube" data-video-muted="0">{{ get_field("label", $home_id) }}</a></li>
            @endif

            @php
            // true passed in as a argument to the Hero_Nav_Walker() is optional and means the background of the anchor tags in the menu is a sand button.
            // The 2 means that the first 2 items are always visible on a desktop viewport and is NOT zero index based.
            // See functions.php for more details. 
            wp_nav_menu(array('items_wrap'=> '%3$s', 'walker' => new Hero_Nav_Walker(true), 'container'=>false, 'menu_class' => '', 'theme_location'=>'age4', 'fallback_cb'=>false ));
            @endphp
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
    <div class="logo age4"></div>
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
