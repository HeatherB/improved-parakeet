<?php

/**
 *  Media Carousel for Wallpapers
 */

wp_reset_query();
// Get the custom post type single post ID to be used in queries
$game_info_radio_button_value = get_field('game_info_radio_button_value');


// set args for media wallpapers related to GAME only
$args = array(
        'post_type' => 'media_wallpaper',
        'post_status' => 'publish',
        'posts_per_page' => '-1',
        'orderby' => array(
                'date' => 'DESC' // Today, yesterday, day before that, etc.
        ),
        'meta_query' => array(
                "relation" => "AND",
                array(
                        'key' => 'media_wallpaper_game',
                        'value' => $game_info_radio_button_value,
                        'compare' => '=',
                )
        )
);

// query media wallpaper
$query = new \WP_Query($args);

?>


<div id="wallpapers" class="media section--divider-egypt-mid section--padding background--rock">
    <div class="row">
        <main class="main">

            <div id="media-wallpapers__container">

                <div class="media-display__container">
                    <div class="media-display-frame__container background--rock">
                        <div class="media-display-content_container">
                            <div class="media-display-header__container">
                                <div class="row align-justify media-display-header__container">
                                    <div class="column small-12 medium-6">
                                        <h1>Wallpapers</h1>
                                    </div>
                                </div>

                            </div>
                            <div id="media-carousel-wallpapers-display">

                                <?php
                                // start loop for media wallpapers display area
                                while ($query->have_posts()) : $query->the_post();
                                    // get media wallpaper data
                                    $media_wallpaper_game = get_field('media_wallpaper_game');
                                    $media_wallpaper_game_value = $media_wallpaper_game['value'];
                                    $media_wallpaper_game_label = $media_wallpaper_game['label'];
                                    $media_wallpaper_desktop_1920x1080 = get_field('media_wallpaper_desktop_1920x1080');
                                    $media_wallpaper_desktop_1600x900 = get_field('media_wallpaper_desktop_1600x900');
                                    $media_wallpaper_desktop_1366x768 = get_field('media_wallpaper_desktop_1366x768');
                                    $media_wallpaper_mobile_640x1136 = get_field('media_wallpaper_mobile_640x1136');
                                    $media_wallpaper_mobile_750x1334 = get_field('media_wallpaper_mobile_750x1334');
                                    $media_wallpaper_mobile_1242x2208 = get_field('media_wallpaper_mobile_1242x2208');
                                    $media_wallpaper_mobile_1536x2048 = get_field('media_wallpaper_mobile_1536x2048');
                                    $media_wallpaper_mobile_2048x2732 = get_field('media_wallpaper_mobile_2048x2732');

                                    echo('<div>');
                                    echo('    <div class="relative__container">');
                                    echo('        <span class="download-btn"></span>');
                                    echo('        <div class="download__container">');
                                    echo('            <div class="download-frame__container">');
                                    echo('                <div class="download-content_container">');
                                    echo('                    <div class="row align-justify">');
                                    echo('                        <div class="column small-12">');
                                    echo('                            <h1>Download</h1>');
                                    echo('                        </div>');
                                    echo('                        <div class="column small-6 medium-12">');
                                    echo('                            <h2>Desktop</h2>');
                                    echo('                            <ul>');
                                    if( $media_wallpaper_desktop_1920x1080 ){
                                        $media_wallpaper_desktop_1920x1080_url = $media_wallpaper_desktop_1920x1080['url'];
                                        echo('                                <li><a download href="'.$media_wallpaper_desktop_1920x1080_url.'" title="Desktop Wallpaper 1920x1080">1920x1080</a></li>');
                                    }
                                    if( $media_wallpaper_desktop_1600x900 ){
                                        $media_wallpaper_desktop_1600x900_url = $media_wallpaper_desktop_1600x900['url'];
                                        echo('                                <li><a download href="'.$media_wallpaper_desktop_1600x900_url.'" title="Desktop Wallpaper 1600x900">1600x900</a></li>');
                                    }
                                    if( $media_wallpaper_desktop_1366x768 ){
                                        $media_wallpaper_desktop_1366x768_url = $media_wallpaper_desktop_1366x768['url'];
                                        echo('                                <li><a download href="'.$media_wallpaper_desktop_1366x768_url.'" title="Desktop Wallpaper 1366x768">1366x768</a></li>');
                                    }
                                    echo('                            </ul>');
                                    echo('                        </div>');
                                    // check for mobile wallpapers
                                    if( $media_wallpaper_mobile_640x1136 || $media_wallpaper_mobile_750x1334 || $media_wallpaper_mobile_1242x2208 || $media_wallpaper_mobile_1536x2048 || $media_wallpaper_mobile_2048x2732 ){
                                        echo('                        <div class="column small-6 medium-12">');
                                        echo('                            <h2>Mobile</h2>');
                                        echo('                            <ul>');
                                        if( $media_wallpaper_mobile_640x1136 ){
                                            $media_wallpaper_mobile_640x1136_url = $media_wallpaper_mobile_640x1136['url'];
                                            echo('                                <li><a download href="'.$media_wallpaper_mobile_640x1136_url.'" title="Mobile Wallpaper 640x1136">640x1136</a></li>');
                                        }
                                        if( $media_wallpaper_mobile_750x1334 ){
                                            $media_wallpaper_mobile_750x1334_url = $media_wallpaper_mobile_750x1334['url'];
                                            echo('                                <li><a download href="'.$media_wallpaper_mobile_750x1334_url.'" title="Mobile Wallpaper 750x1334">750x1334</a></li>');
                                        }
                                        if( $media_wallpaper_mobile_1242x2208 ){
                                            $media_wallpaper_mobile_1242x2208_url = $media_wallpaper_mobile_1242x2208['url'];
                                            echo('                                <li><a download href="'.$media_wallpaper_mobile_1242x2208_url.'" title="Mobile Wallpaper 1242x2208">1242x2208</a></li>');
                                        }
                                        if( $media_wallpaper_mobile_1536x2048 ){
                                            $media_wallpaper_mobile_1536x2048_url = $media_wallpaper_mobile_1536x2048['url'];
                                            echo('                                <li><a download href="'.$media_wallpaper_mobile_1536x2048_url.'" title="Mobile Wallpaper 1536x2048">1536x2048</a></li>');
                                        }
                                        if( $media_wallpaper_mobile_2048x2732 ){
                                            $media_wallpaper_mobile_2048x2732_url = $media_wallpaper_mobile_2048x2732['url'];
                                            echo('                                <li><a download href="'.$media_wallpaper_mobile_2048x2732_url.'" title="Mobile Wallpaper 2048x2732">2048x2732</a></li>');
                                        }

                                        echo('                            </ul>');
                                        echo('                        </div>');
                                    } // end check for mobile wallpapers

                                    echo('                    </div>');
                                    echo('                </div>');
                                    echo('            </div>');
                                    echo('        </div>');
                                    echo('    </div>');
                                    echo('    <div class="wallpaper"><img data-lazy="'.$media_wallpaper_desktop_1920x1080_url.'"/></div>');
                                    echo('</div>'); // end item

                                endwhile; // end media wallpapers loop for display area
                                ?>



                            </div><!-- // end #media-carousel-wallpapers-display -->
                        </div><!-- // end .media-display-content_container -->

                    </div>
                </div>


                <div class="media-nav__container">

                    <div id="media-carousel-wallpapers-nav">

                        <?php
                        // start loop for media wallpapers nav area
                        while ($query->have_posts()) : $query->the_post();
                            // get media wallpaper data
                            $media_wallpaper_game = get_field('media_wallpaper_game');
                            $media_wallpaper_game_value = $media_wallpaper_game['value'];
                            $media_wallpaper_game_label = $media_wallpaper_game['label'];
                            $media_wallpaper_desktop_1920x1080 = get_field('media_wallpaper_desktop_1920x1080');
                            $media_wallpaper_desktop_1920x1080_url = $media_wallpaper_desktop_1920x1080['url'];

                            echo('<div class="'.$media_wallpaper_game_value.'">');
                            echo('  <div class="media-nav-frame__container">');
                            echo('    <div class="media-nav-content_container">');
                            echo('      <img class="wallpaper" data-lazy="'.$media_wallpaper_desktop_1920x1080_url.'"/>');
                            echo('    </div>');
                            echo('  </div>');
                            echo('</div>');
                        endwhile; // end media wallpapers loop for nav area
                        ?>

                    </div>

                </div>

            </div>

        </main>
    </div>
</div>

<?php wp_reset_query(); ?>
