<?php   

    function getStreamData() {        
        $streamData = apcu_fetch('age_twitch_stream');
        if (isset($streamData) && !empty($streamData)) {
            return $streamData;
        } 
        $args = array(
            'post_type' => 'live_stream',
            'post_status' => 'publish',
            'posts_per_page' => '-1',
            'orderby' => array(
                'meta_value_num' => 'ASC',  // priority number ASC 1,2,3... etc.
                'date' => 'DESC'            // Today, yesterday, day before that, etc.
            ),
            'meta_key' => 'live_stream_channel_priority',
            'order' => 'ASC',
            'meta_query' => array(
                "relation" => "AND",
                array(
                    'key' => 'live_stream_frontpage',
                    'value' => '1',
                    'compare' => '=',
                ),
                array(
                    'key' => 'live_stream_channel_priority',
                    'value' => 0,
                    'type' => 'NUMERIC',
                    'compare' => '>'
                )
            )
        );
        // query live streams
        $query = new \WP_Query($args);
        $isOnline = false;
        $now = current_time('timestamp');
        $highestPriority = 100;

        while ($query->have_posts() && $isOnline != true) : $query->the_post();
            $liveFields = get_fields();                    
            $streamPriority = $liveFields['live_stream_channel_priority'];            
            $streamType = $liveFields['live_stream_channel_type'];

            $startTime = strtotime($liveFields['live_stream_start_time']);
            $endTime = strtotime($liveFields['live_stream_end_time']);

            // only consider streams that are expected to be live now
            if( $now >= $startTime && $now < $endTime ) {

                $isOnline = true;

                // only process data for highest priority stream
                if ( $streamPriority < $highestPriority ) {

                    // set this stream as new highest priorty for others to check against
                    $highestPriority = $streamPriority;

                    //get info from post
                    $channel = $liveFields['live_stream_channel_name'];
                    $channelUrl = 'https://twitch.tv/' . $channel;
                    $game = $liveFields['live_stream_game_association'];
                    
                    $thumbDefault = get_stylesheet_directory_uri() . '/assets/images/default/default-hero-beam-vod-bkg.png';
                    $thumb = $liveFields['live_stream_channel_vod_thumbnail_default'];

                    // check if thumb was uploaded
                    // else set to default image
                    if( $thumb ) {
                        $thumbUrl = $thumb['url'];
                    } else {
                        $thumbUrl = $thumbDefault;
                    }

                    //dump data into an array
                    $streamData = array(
                        'channel' => $channel,
                        'channelUrl' => $channelUrl,
                        'online' => $isOnline,
                        'channelType' => $liveFields['live_stream_channel_type'],
                        'hasUploadedThumb' => $thumb,
                        'thumbUrl' => $thumbUrl,
                        'startTime' => $startTime,
                        'endTime' => $endTime,
                        'now' => $now,
                        'game' => $game->post_title,
                        // 'currentGame' => $channelContent_decode['type']['name']
                    );
                    apcu_add('age_twitch_stream', $streamData, 60);
                    // return array for use outside loop
                    return $streamData;
                }
            }
               
        endwhile;
    }

?>