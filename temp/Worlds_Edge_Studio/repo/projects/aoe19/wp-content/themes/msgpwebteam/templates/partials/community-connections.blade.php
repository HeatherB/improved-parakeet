<div class="community-connections section--divider-frank-mid section--padding background--rock">
    <div class="community-connections__container">
        <div class="community-connections__content-wrapper">
            <h1>Community Connections</h1>

            <?php
                // set args for media video youtube
                $args = array(
                    'post_type' => 'media_video',
                    'post_status' => 'publish',
                    'posts_per_page' => '2',
                    'orderby' => array(
                        'date' => 'DESC'    // Today, yesterday, day before that, etc.
                    ),
                    'meta_query' => array(
                        "relation" => "AND",
                        array(
                            'key' => 'media_video_featured_in_community_connections',
                            'value' => '1',
                            'compare' => '=',
                        )
                    )
                );

                // query media video youtube
                $query = new \WP_Query($args);

                // start loop
                while ($query->have_posts()) : $query->the_post();

                    // get youtube id
                    $media_video_youtube_id = get_field('media_video_youtube_id');
            ?>

            <div class="community-connections__content-video">
                <div class="video__container background--rock">
                    <div class="video__content-wrapper">
                        <div class="responsive-embed widescreen">
                            <iframe allowfullscreen="1" title="YouTube video player" src="https://www.youtube-nocookie.com/embed/{{$media_video_youtube_id}}?rel=0&autoplay=0&loop=0&mute=0&controls=1&fs=0&showinfo=0&modestbranding=1&autohide=1&wmode=opaque" frameborder="0" width="560" height="315"></iframe>
                        </div>
                    </div>
                </div>
            </div>

            <?php  endwhile; // END MEDIA VIDEO ?>

            <div id="community-connections" class="community-connections__social-feeds--show-all"></div>

        </div>
    </div>
</div>
