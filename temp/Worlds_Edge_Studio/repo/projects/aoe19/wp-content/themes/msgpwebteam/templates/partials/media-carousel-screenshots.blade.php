<?php

/**
 *  Media Carousel for Screenshots
 */

// set args for media screenshots
$args = array(
        'post_type' => 'media_screenshot',
        'post_status' => 'publish',
        'posts_per_page' => '-1',
        'meta_key' => 'media_screenshot_game',
        'order' => 'DESC'
);

// query media screenshots
$query = new \WP_Query($args);

?>

<div id="screenshots" class="media section--divider-frank-mid section--padding background--rock">
    <div class="row">
        <main class="main">

            <div id="media-screenshots__container">

                <div class="media-display__container">
                    <div class="media-display-frame__container background--rock">
                        <div class="media-display-content_container">
                            <div class="media-display-header__container">
                                <div class="row align-justify media-display-header__container">
                                    <div class="column small-12 medium-6">
                                        <h1>Screenshots</h1>
                                    </div>
                                    <div class="column small-12 medium-6 select__container">
                                        <select id="screenshot-options">
                                          @include('partials.media-select')
                                        </select>
                                    </div>
                                </div>




                            </div>
                            <div id="media-carousel-screenshots-display">

                                <?php
                                // start loop for media screenshots display area
                                while ($query->have_posts()) : $query->the_post();
                                    // get media video data
                                    $media_screenshot_game = get_field('media_screenshot_game');
                                    $media_screenshot_game_value = $media_screenshot_game['value'];
                                    $media_screenshot_game_label = $media_screenshot_game['label'];
                                    $media_screenshot_image = get_field('media_screenshot_image');
                                    $media_screenshot_image_url = $media_screenshot_image['url'];

                                    echo('<div class="'.$media_screenshot_game_value.'">');
                                    echo('    <div class="screenshot">');
                                    echo('        <a data-open="media-carousel-screenshots-modal" data-img-src="' . $media_screenshot_image_url . '">');
                                    echo('            <img data-lazy="'.$media_screenshot_image_url.'"/>');
                                    echo('        </a>');
                                    echo('    </div>');
                                    echo('</div>');
                                endwhile; // end media screenshots loop for display area
                                ?>


                            </div>
                        </div>

                    </div>
                </div>


                <div class="media-nav__container">

                    <div id="media-carousel-screenshots-nav">

                        <?php
                        // start loop for media screenshots nav area
                        while ($query->have_posts()) : $query->the_post();
                            // get media screenshots data
                            $media_screenshot_game = get_field('media_screenshot_game');
                            $media_screenshot_game_value = $media_screenshot_game['value'];
                            $media_screenshot_game_label = $media_screenshot_game['label'];
                            $media_screenshot_image = get_field('media_screenshot_image');
                            //$media_screenshot_image_url = $media_screenshot_image['url'];
                            $media_screenshot_image_size = 'medium'; // (thumbnail, medium, large, full or custom size)
                            $media_screenshot_image_url = $media_screenshot_image['sizes'][$media_screenshot_image_size];
                            echo('<div class="'.$media_screenshot_game_value.'">');
                            echo('  <div class="media-nav-frame__container">');
                            echo('    <div class="media-nav-content_container">');
                            echo('    <img class="screenshot" data-lazy="'.$media_screenshot_image_url.'"/>');
                            echo('    </div>');
                            echo('  </div>');
                            echo('</div>');
                        endwhile; // end media screenshots loop for nav area
                        ?>

                    </div>

                </div>

            </div>

        </main>
    </div>
</div>



<div id="media-carousel-screenshots-modal" class="reveal full borderless" data-reveal data-close-on-click="true">
    <div id="modal-content__container" data-close >
        <img id="modal-screenshot" data-close src="" />
    </div>
</div>

<?php
/* Reset Post Data */
wp_reset_postdata();
?>




