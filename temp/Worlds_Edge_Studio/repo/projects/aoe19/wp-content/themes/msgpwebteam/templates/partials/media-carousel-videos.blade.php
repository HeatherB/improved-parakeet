<?php

/**
 *  Media Carousel for Videos
 */

// set args for media video
$args = array(
        'post_type' => 'media_video',
        'post_status' => 'publish',
        'posts_per_page' => '-1',
        'meta_key' => 'media_video_game',
        'order' => 'DESC'
);

// query media video
$query = new \WP_Query($args);

?>

<div id="videos" class="media section--divider-frank-mid section--padding background--rock">
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
                                    <div class="column small-12 medium-6 select__container">
                                        <select id="video-options">
                                            @include('partials.media-select')
                                            <option value="aup">Age Up!</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div id="media-carousel-videos-display">
                                <?php
                                // start loop for media video display area
                                $count=0;
                                while ($query->have_posts()) : $query->the_post(); 
                                    // get media video data
                                    $media_video_game = get_field('media_video_game');
                                    $media_video_game_value = $media_video_game['value'];
                                    $media_video_game_label = $media_video_game['label'];
                                    $media_video_youtube_id = get_field('media_video_youtube_id');

                                    if ($count<1) {
                                    echo('<div class="'.$media_video_game_value.'">');
                                    echo('  <div class="video" style="background-image: url(https://img.youtube.com/vi/'.$media_video_youtube_id.'/mqdefault.jpg);">');
                                    echo('      <div class="responsive-embed widescreen">');
                                    echo('          <iframe class="media-carousel-video-youtube" allowfullscreen="1" title="'.$media_video_game_label.'" src="https://www.youtube.com/embed/'.$media_video_youtube_id.'?rel=0&autoplay=0&loop=0&mute=0&controls=1&fs=0&showinfo=0&modestbranding=1&autohide=1&wmode=opaque" frameborder="0" height="9" width="16"></iframe>');
                                    echo('      </div>');
                                    echo('  </div>');
                                    echo('</div>');
                                    } else {
                                    ?>    
                                    <div class="wrapper {{ $media_video_game_value }}">
                                        <div class="video youtube responsive-embed widescreen" data-embed="{{ $media_video_youtube_id }}" style="background-image: url(https://img.youtube.com/vi/{{$media_video_youtube_id}}/maxresdefault.jpg);">
                                            <div class="play-button"></div>
                                        </div>
                                    </div>
                                    <?php
                                    }
                                    $count++;
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
                            echo('        <img class="video" src="https://img.youtube.com/vi/'.$media_video_youtube_id.'/mqdefault.jpg"/>');
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


