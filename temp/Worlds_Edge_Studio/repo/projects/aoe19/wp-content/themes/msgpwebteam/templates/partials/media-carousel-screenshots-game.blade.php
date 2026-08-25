<?php

/**
 *  Media Carousel for Screenshots
 */


wp_reset_query();
// Get the custom post type single post ID to be used in queries
$game_info_radio_button_value = get_field('game_info_radio_button_value');

// set args for media screenshots related to GAME only
$args = array(
        'post_type' => 'media_screenshot',
        'post_status' => 'publish',
        'posts_per_page' => '-1',
        'orderby' => array(
                'date' => 'DESC' // Today, yesterday, day before that, etc.
        ),
        'meta_query' => array(
                "relation" => "AND",
                array(
                        'key' => 'media_screenshot_game',
                        'value' => $game_info_radio_button_value,
                        'compare' => '=',
                )
        )
);


// query media screenshots
$query = new \WP_Query($args);

?>

<div id="screenshots" class="media section--divider-egypt-mid section--padding background--rock">
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
                                    echo('  <div class="screenshot">');
                                    echo('    <img data-lazy="'.$media_screenshot_image_url.'"/>');
                                    echo('  </div>');
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
                            $media_screenshot_image_url = $media_screenshot_image['url'];

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

<?php wp_reset_query(); ?>


