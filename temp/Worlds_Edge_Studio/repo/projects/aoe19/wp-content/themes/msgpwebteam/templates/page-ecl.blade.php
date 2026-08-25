@extends('layouts.tournaments')

@section('content')
    @while(have_posts()) @php(the_post())
    @include('partials.tournaments-banner-ecl')
    <div class="content section--gold-divider section--padding-bottom background--rock section-divider">

        <div class="row">
            <div class="section--padding-top">
                @include('partials.tournaments-nav-ecl')
            </div>
        </div>


        <?php // Tournament Settings


        // set args for tournament settings
        $args = array(
            'post_type'       => 'tournament-settings',
            'post_status'     => 'publish',
            'posts_per_page'  => '1',
            'order'           => 'DESC'
        );

        // query tournament settings
        $query = new \WP_Query($args);

        $tournaments_banner_inline_styles = '';

        // do we have posts for tournament settings?
        if( $query->have_posts() ):

            while ($query->have_posts()) : $query->the_post();

                $acf_tournament_settings_featured_youtube_video = get_field('acf_tournament_settings_featured_youtube_video');
                $acf_tournament_settings_overview_text = get_field('acf_tournament_settings_overview_text');
                $acf_tournament_settings_registration_url = get_field('acf_tournament_settings_registration_url');
                $acf_tournament_settings_default_stage_image = get_field('acf_tournament_settings_default_stage_image');
                $acf_tournament_settings_default_stage_image_url = $acf_tournament_settings_default_stage_image['url'];

            endwhile;

        endif;

        ?>


        <?php // Tournament Stages Active

        // LONDON Timezone
        //date_default_timezone_set("Europe/London");

        // Get date time now
        $date_now = date('Y-m-d H:i:s');

        // set args for tournament stages
        $args = array(
            'post_type'       => 'tournament-stage',
            'post_status'     => 'publish',
            'posts_per_page'  => '-1',
            'order'           => 'ASC',
            'orderby'			    => 'meta_value',
            'meta_key'        => 'acf_tournament_stage_start_date',
            'meta_type'			  => 'DATETIME'
        );

        // query tournament stages
        $query = new \WP_Query($args);

        // do we have posts for tournament stages?
        if( $query->have_posts() ):


            // LONDON Timezone
            //date_default_timezone_set("Europe/London");
            //$london = new DateTime();

            // Epoch Date Time London
            //$current_date_london_epoch = strtotime($london->format('Y-m-d H:i:s'));

            // UTC Date Time
            $datTimeUTC = new DateTime();
            $current_date_london_epoch = strtotime($datTimeUTC->format('Y-m-d H:i:s'));

            $stream_status = 'inactive';

            $stage_youtube_video = '';
            $stage_default_image = '';
            $next_live_stream = null;

            // start loop for ALL tournament stages
            while ($query->have_posts()) : $query->the_post();


                // check if the repeater field has rows of data for first event
                if( have_rows('acf_tournament_stage_event_1_stream_dates') ):

                    // loop through the rows of data
                    while ( have_rows('acf_tournament_stage_event_1_stream_dates') ) : the_row();

                        // Create Start and End Date Times
                        $acf_tournament_stage_event_1_stream_date = get_sub_field('acf_tournament_stage_event_1_stream_date');
                        $stream_date_start = date_create($acf_tournament_stage_event_1_stream_date);
                        $stream_date_end = date_create(date_format($stream_date_start,"Y-m-d 23:59:59"));


                        // Epoch Date Times
                        $stream_date_start_epoch = strtotime($stream_date_start->format('Y-m-d H:i:s'));
                        $stream_date_end_epoch = strtotime($stream_date_end->format('Y-m-d H:i:s'));

                        // Is a Stream Active?
                        if($stream_date_start_epoch <= $current_date_london_epoch && $stream_date_end_epoch >= $current_date_london_epoch){
                            $stream_status = 'active';
                            $acf_tournament_stage_twitch_account_name = get_field('acf_tournament_stage_twitch_account_name');
                            $twitch_live_stream_url = 'https://player.twitch.tv/?channel=' . $acf_tournament_stage_twitch_account_name . '&autoplay=true';
                            //$twitch_live_stream_url = 'https://www.twitch.tv/' . $acf_tournament_stage_twitch_account_name . '/embed';
                        }

                        // Last YouTube Video
                        if($stream_date_end_epoch < $current_date_london_epoch ) {
                            $stage_youtube_video = get_field('acf_tournament_stage_event_1_youtube_video');
                            $stage_default_image = get_field('acf_tournament_stage_event_1_default_image');
                        }

                        // Next Live Stream

                        if($stream_date_end_epoch > $current_date_london_epoch && $next_live_stream === null) {
                            // date format is F j, Y H:i:s
                            $next_live_stream = $acf_tournament_stage_event_1_stream_date;
                        }

                    endwhile;

                endif;

                // check if the repeater field has rows of data for second event
                if( have_rows('acf_tournament_stage_event_2_stream_dates') ):

                    // loop through the rows of data
                    while ( have_rows('acf_tournament_stage_event_2_stream_dates') ) : the_row();

                        // Create Start and End Date Times
                        $acf_tournament_stage_event_2_stream_date = get_sub_field('acf_tournament_stage_event_2_stream_date');
                        $stream_date_start = date_create($acf_tournament_stage_event_2_stream_date);
                        $stream_date_end = date_create(date_format($stream_date_start,"Y-m-d 23:59:59"));

                        // Epoch Date Times
                        $stream_date_start_epoch = strtotime($stream_date_start->format('Y-m-d H:i:s'));
                        $stream_date_end_epoch = strtotime($stream_date_end->format('Y-m-d H:i:s'));

                        // Is a Stream Active?
                        if($stream_date_start_epoch <= $current_date_london_epoch && $stream_date_end_epoch >= $current_date_london_epoch){
                            $stream_status = 'active';
                            $acf_tournament_stage_twitch_account_name = get_field('acf_tournament_stage_twitch_account_name');
                            $twitch_live_stream_url = 'https://player.twitch.tv/?channel=' . $acf_tournament_stage_twitch_account_name . '&autoplay=true';

                        }

                        // Last YouTube Video
                        if($stream_date_end_epoch < $current_date_london_epoch ) {
                            $stage_youtube_video = get_field('acf_tournament_stage_event_2_youtube_video');
                            $stage_default_image = get_field('acf_tournament_stage_event_2_default_image');
                        }

                        // Next Live Stream
                        if($stream_date_end_epoch > $current_date_london_epoch && $next_live_stream === null) {
                            // date format is F j, Y H:i:s
                            $next_live_stream = $acf_tournament_stage_event_2_stream_date;
                        }

                    endwhile;

                endif;


            endwhile;

        endif;

        ?>


        <div class="row">
            <main class="main section--padding">

                <section id="tournaments-home" class="tournaments">
                    <?php if($stream_status == 'active' || $acf_tournament_settings_featured_youtube_video){echo('<h1 class="light">Featured</h1>');} ?>
                    <div class="row">
                        <div class="columns small-12 large-8">
                            <div class="media-wrapper">

                                <?php if($stream_status == 'active'): ?>
                                <div class="responsive-embed widescreen">
                                    <iframe width="560" height="315" src="<?php echo($twitch_live_stream_url); ?>" frameborder="0" allowfullscreen></iframe>
                                </div>
                                <?php elseif($acf_tournament_settings_featured_youtube_video): ?>
                                <div class="responsive-embed widescreen featured-tournement-video">
                                    <?php echo($acf_tournament_settings_featured_youtube_video); ?>
                                </div>
                                <?php elseif($stage_youtube_video): ?>
                                <div class="responsive-embed widescreen">
                                    <?php echo($stage_youtube_video); ?>
                                </div>
                                <?php elseif($stage_default_image): ?>
                                <div class="stage-thumbnail-image" style="background-image: url(<?php echo($stage_default_image['url']); ?>);" data-aspect-ratio="16x9"></div>_url
                                <?php elseif($acf_tournament_settings_default_stage_image): ?>
                                <div class="stage-thumbnail-image this-one" style="background-image: url(<?php echo($acf_tournament_settings_default_stage_image_url); ?>);" data-aspect-ratio="16x9"></div>
                                <?php else: ?>
                                <div class="stage-thumbnail-image" data-aspect-ratio="16x9"></div>
                                <?php endif; ?>



                            </div>
                        </div>
                        <div class="columns small-12 large-4">

                            <?php if($stream_status != 'active'): ?>
                            <div id="next-live-stream" class="frame-box">
                                <div class="frame-box__inner frame-box__inner--dark text-center">
                                    <span class="light">Next Live Stream</span>
                                    <div class="countdown" data-tournament-start-time="<?php echo($next_live_stream); ?>" data-test-start-time="July 21,2018 14:00:00">00:00:00:00</div>
                                </div>
                            </div>
                            <?php endif; ?>



                            <div id="tournament-headlines" class="frame-box">
                                <div class="frame-box__inner frame-box__inner--dark">
                                    <ul>
                                        <li class="prizepool"><h4>Prizepool: $60,000</h4></li>
                                        <li class="teams"><h4>Teams: 8</h4>
                                        <li class="players"><h4>Players: 40</h4></li>
                                        <li class="stages"><h4>Stages: 7 Online + Final</h4></li>
                                    </ul>
                                </div>
                            </div>

                            <?php if($acf_tournament_settings_registration_url): ?>
                            <div id="registration">
                                <a target="_blank" href="<?php echo($acf_tournament_settings_registration_url); ?>" class="btn-aoe btn-aoe--red btn-aoe--block">Register a Team</a>
                            </div>
                            <?php endif; ?>

                            <div id="watch-stream">
                                <a target="_blank" href="https://twitch.tv/EscapeAoE" class="btn-aoe btn-aoe--red btn-aoe--block">Watch Stream</a>
                            </div>

                        </div>

                    </div>
                    <div class="row">
                        <div class="columns small-12 large-8">

                            <div id="tournament-overview">

                            </div>

                            <h2 class="light">Tournament Overview</h2>

                            <?php echo($acf_tournament_settings_overview_text); ?>

                        </div>
                    </div>
                </section>

            </main>
        </div>
    </div>
    @endwhile
@endsection
