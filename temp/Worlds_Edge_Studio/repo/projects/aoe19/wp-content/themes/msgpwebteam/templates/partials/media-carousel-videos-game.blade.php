<?php

/**
 *  Media Carousel for Videos
 */

wp_reset_query();
// Get the custom post type single post ID to be used in queries
$game_info_radio_button_value = get_field('game_info_radio_button_value');

// set args for media video related to GAME only
$args = array(
        'post_type' => 'media_video',
        'post_status' => 'publish',
        'posts_per_page' => '-1',
        'orderby' => array(
                'date' => 'DESC' // Today, yesterday, day before that, etc.
        ),
        'meta_query' => array(
                "relation" => "AND",
                array(
                        'key' => 'media_video_game',
                        'value' => $game_info_radio_button_value,
                        'compare' => '=',
                )
        )
);

// query media video
$query = new \WP_Query($args);

?>

<div id="videos" class="media section--divider-egypt-mid section--padding background--rock">
    <div class="row">
        <main class="main">

            <div id="media-videos__container">

                <div class="media-display__container">
                    <div class="media-display-frame__container background--rock">
                        <div class="media-display-content_container">
                            <div class="media-display-header__container">
                                <div class="row align-justify media-display-header__container">
                                    <div class="column small-12 medium-6">
                                        <h1>Videos</h1>
                                    </div>
                                </div>



                            </div>
                            <div id="media-carousel-videos-display">
                                <?php
                                // start loop for media video display area
                                while ($query->have_posts()) : $query->the_post();
                                    // get media video data
                                    $media_video_game = get_field('media_video_game');
                                    $media_video_game_value = $media_video_game['value'];
                                    $media_video_game_label = $media_video_game['label'];
                                    $media_video_youtube_id = get_field('media_video_youtube_id');
                                    echo('<div>');
                                    echo('  <div class="video" style="background-image: url(https://img.youtube.com/vi/'.$media_video_youtube_id.'/maxresdefault.jpg);">');
                                    echo('      <div class="responsive-embed widescreen">');
                                    echo('          <iframe class="media-carousel-video-youtube" allowfullscreen="1" title="'.$media_video_game_label.'" src="https://www.youtube.com/embed/'.$media_video_youtube_id.'?rel=0&autoplay=0&loop=0&mute=0&controls=1&fs=0&showinfo=0&modestbranding=1&autohide=1&wmode=opaque" frameborder="0" height="9" width="16"></iframe>');
                                    echo('      </div>');
                                    echo('  </div>');
                                    echo('</div>');
                                endwhile; // end media video loop for display area
                                ?>
                            </div>
                        </div>

                    </div>
                </div>


                <div class="media-nav__container">

                    <div id="media-carousel-videos-nav">
                        <?php
                        // start loop for media video nav area
                        while ($query->have_posts()) : $query->the_post();
                            // get media video data
                            $media_video_game = get_field('media_video_game');
                            $media_video_game_value = $media_video_game['value'];
                            $media_video_game_label = $media_video_game['label'];
                            $media_video_youtube_id = get_field('media_video_youtube_id');
                            echo('<div class="'.$media_video_game_value.'">');
                            echo('  <div class="media-nav-frame__container">');
                            echo('    <div class="media-nav-content_container">');
                            echo('        <img class="video" src="https://img.youtube.com/vi/'.$media_video_youtube_id.'/maxresdefault.jpg"/>');
                            echo('    </div>');
                            echo('  </div>');
                            echo('</div>');
                        endwhile; // end media video loop for nav area
                        ?>
                    </div>

                </div>

            </div>

        </main>
    </div>
</div>

<?php wp_reset_query(); ?>


