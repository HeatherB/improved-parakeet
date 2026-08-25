@extends('layouts.tournaments')

@section('content')
  @while(have_posts()) @php(the_post())
    @include('partials.tournaments-banner')
    <div class="content section--gold-divider section--padding-bottom background--rock section-divider">

      <div class="row">
        <div class="section--padding-top">
          @include('partials.tournaments-nav-ecl')
        </div>
      </div>

      <div class="row">
        <div class="section--padding-top">
          <h1 class="light stage-heading">All Stages</h1>
        </div>
      </div>

      <?php // Tournament Stages Active

      // LONDON Timezone
      date_default_timezone_set("Europe/London");

      // Get date time now
      $date_now = date('Y-m-d H:i:s');

      // set args for tournament stages
      $args = array(
        'post_type'       => 'tournament-stage',
        'post_status'     => 'publish',
        'posts_per_page'  => '1',
        'meta_query' 		=> array(
          'relation' 			=> 'AND',
          array(
            'key'			=> 'acf_tournament_stage_start_date',
            'compare'		=> '<=',
            'value'			=> $date_now,
            'type'			=> 'DATETIME'
          ),
          array(
            'key'			=> 'acf_tournament_stage_end_date',
            'compare'		=> '>=',
            'value'			=> $date_now,
            'type'			=> 'DATETIME'
          )
        ),
        'order'           => 'ASC',
        'orderby'			    => 'meta_value',
        'meta_key'        => 'acf_tournament_stage_start_date',
        'meta_type'			  => 'DATETIME'
      );

      // query tournament stages
      $query = new \WP_Query($args);

      // do we have posts for tournament stages?
      if( $query->have_posts() ):

      echo('<section class="tournaments tournament-stages active">');
      echo('<div id="current-stage-label">Current Stage</div>');


      // start loop for tournament stages
      while ($query->have_posts()) : $query->the_post();

      // date format for countdown is August 1, 2019 23:59:59 or F j, Y H:i:s
      // $acf_tournament_stage_start_date = get_field('acf_tournament_stage_start_date');
      // $acf_tournament_stage_end_date = get_field('acf_tournament_stage_end_date');
      $acf_tournament_stage_start_date = date_create(get_field('acf_tournament_stage_start_date'));
      $acf_tournament_stage_end_date = date_create(get_field('acf_tournament_stage_end_date'));
      $acf_tournament_stage_description = get_field('acf_tournament_stage_description');
      $acf_tournament_stage_logo = get_field('acf_tournament_stage_logo');
      $acf_tournament_stage_logo_url = $acf_tournament_stage_logo['url'];
      $acf_tournament_stage_event_1_name = get_field('acf_tournament_stage_event_1_name');
      $acf_tournament_stage_event_2_name = get_field('acf_tournament_stage_event_2_name');

      ?>

      <div class="row stage-event">
        <div class="columns small-12 medium-4">
          <a href="<?php echo(get_the_permalink()); ?>" class="stage-logo" data-aspect-ratio="4x3" style="background-image: url(<?php echo($acf_tournament_stage_logo_url); ?>);"></a>
        </div>
        <div class="columns small-12 medium-8">
          <h1 class="tournament-title"><?php echo(get_the_title()); ?></h1>
          <time class="stage-dates"><?php echo(date_format($acf_tournament_stage_start_date,"F j, Y")); ?> &mdash; <?php echo(date_format($acf_tournament_stage_end_date,"F j, Y")); ?></time>
          <?php echo($acf_tournament_stage_description); ?>
          <div class="btn-event-wrapper">
            <a href="<?php echo(get_the_permalink()); ?>#stage-event-1" class="btn-aoe btn-aoe--red btn-aoe--small btn-aoe--small">
              <?php
              if($acf_tournament_stage_event_1_name) {
                echo($acf_tournament_stage_event_1_name);
              } else {
                echo('Event 1');
              }
              ?>
            </a>
            <a href="<?php echo(get_the_permalink()); ?>#stage-event-2" class="btn-aoe btn-aoe--red btn-aoe--small btn-aoe--small">
              <?php
              if($acf_tournament_stage_event_2_name) {
                echo($acf_tournament_stage_event_2_name);
              } else {
                echo('Event 2');
              }
              ?>
            </a>
          </div>
        </div>

      </div>


      <?php

      endwhile;

      echo('</section>'); // end section.tournaments.tournament-stages.active

      endif;


      ?>


      <?php // Tournament Stages Scheduled

      // find date time now
      $date_now = date('Y-m-d H:i:s');

      // set args for tournament stages
      $args = array(
        'post_type'       => 'tournament-stage',
        'post_status'     => 'publish',
        'posts_per_page'  => '-1',
        'meta_query' 		=> array(
          'relation' 			=> 'AND',
          array(
            'key'			=> 'acf_tournament_stage_start_date',
            'compare'		=> '>',
            'value'			=> $date_now,
            'type'			=> 'DATETIME'
          )
        ),
        'order'           => 'ASC',
        'orderby'			    => 'meta_value',
        'meta_key'        => 'acf_tournament_stage_start_date',
        'meta_type'			  => 'DATETIME'
      );

      // query tournament stages
      $query = new \WP_Query($args);

      // do we have posts for tournament stages?
      if( $query->have_posts() ):

        echo('<section class="tournaments tournament-stages scheduled">');

        // start loop for tournament stages
        while ($query->have_posts()) : $query->the_post();

        // date format for countdown is August 1, 2019 23:59:59 or F j, Y H:i:s

          // $acf_tournament_stage_start_date = get_field('acf_tournament_stage_start_date');
          // $acf_tournament_stage_end_date = get_field('acf_tournament_stage_end_date');

          $acf_tournament_stage_start_date = date_create(get_field('acf_tournament_stage_start_date'));
          $acf_tournament_stage_end_date = date_create(get_field('acf_tournament_stage_end_date'));

          $acf_tournament_stage_description = get_field('acf_tournament_stage_description');
          $acf_tournament_stage_logo = get_field('acf_tournament_stage_logo');
          $acf_tournament_stage_logo_url = $acf_tournament_stage_logo['url'];
          $acf_tournament_stage_event_1_name = get_field('acf_tournament_stage_event_1_name');
          $acf_tournament_stage_event_2_name = get_field('acf_tournament_stage_event_2_name');

        ?>

      <div class="row stage-event">
        <div class="columns small-12 medium-3 large-4">
          <a href="<?php echo(get_the_permalink()); ?>" class="stage-logo" data-aspect-ratio="4x3" style="background-image: url(<?php echo($acf_tournament_stage_logo_url); ?>);"></a>
        </div>
        <div class="columns small-12 medium-9 large-8">
          <h1 class="tournament-title"><?php echo(get_the_title()); ?></h1>
          <time class="stage-dates"><?php echo(date_format($acf_tournament_stage_start_date,"F j, Y")); ?> &mdash; <?php echo(date_format($acf_tournament_stage_end_date,"F j, Y")); ?></time>
          <?php echo($acf_tournament_stage_description); ?>
          <div class="btn-event-wrapper">
            <a href="<?php echo(get_the_permalink()); ?>#stage-event-1" class="btn-aoe btn-aoe--red btn-aoe--small">
              <?php
              if($acf_tournament_stage_event_1_name) {
                echo($acf_tournament_stage_event_1_name);
              } else {
                echo('Event 1');
              }
              ?>
            </a>
            <a href="<?php echo(get_the_permalink()); ?>#stage-event-2" class="btn-aoe btn-aoe--red btn-aoe--small">
              <?php
              if($acf_tournament_stage_event_2_name) {
                echo($acf_tournament_stage_event_2_name);
              } else {
                echo('Event 2');
              }
              ?>
            </a>
          </div>
        </div>

      </div>


        <?php

        endwhile;

        echo('</section>'); // end section.tournaments.tournament-stages.scheduled

      endif;


      ?>



      <?php // Tournament Stages Completed

      // find date time now
      $date_now = date('Y-m-d H:i:s');

      // set args for tournament stages
      $args = array(
        'post_type'       => 'tournament-stage',
        'post_status'     => 'publish',
        'posts_per_page'  => '-1',
        'meta_query' 		=> array(
          'relation' 			=> 'AND',
          array(
            'key'			=> 'acf_tournament_stage_end_date',
            'compare'		=> '<',
            'value'			=> $date_now,
            'type'			=> 'DATETIME'
          )
        ),
        'order'           => 'ASC',
        'orderby'			    => 'meta_value',
        'meta_key'        => 'acf_tournament_stage_start_date',
        'meta_type'			  => 'DATETIME'
      );

      // query tournament stages
      $query = new \WP_Query($args);

      // do we have posts for tournament stages?
      if( $query->have_posts() ):

        echo('<div class="row">');
        echo('    <div class="section--padding-top">');
        echo('        <h1 class="light stage-heading">Completed Stages</h1>');
        echo('    </div>');
        echo('</div>');

      echo('<section class="tournaments tournament-stages scheduled">');

      // start loop for tournament stages
      while ($query->have_posts()) : $query->the_post();

      // date format for countdown is August 1, 2019 23:59:59 or F j, Y H:i:s

      // $acf_tournament_stage_start_date = get_field('acf_tournament_stage_start_date');
      // $acf_tournament_stage_end_date = get_field('acf_tournament_stage_end_date');

      $acf_tournament_stage_start_date = date_create(get_field('acf_tournament_stage_start_date'));
      $acf_tournament_stage_end_date = date_create(get_field('acf_tournament_stage_end_date'));
      $acf_tournament_stage_description = get_field('acf_tournament_stage_description');
      $acf_tournament_stage_logo = get_field('acf_tournament_stage_logo');
      $acf_tournament_stage_logo_url = $acf_tournament_stage_logo['url'];
      $acf_tournament_stage_event_1_name = get_field('acf_tournament_stage_event_1_name');
      $acf_tournament_stage_event_2_name = get_field('acf_tournament_stage_event_2_name');

      ?>

      <div class="row stage-event">
        <div class="columns small-12 medium-3 large-4">
          <a href="<?php echo(get_the_permalink()); ?>" class="stage-logo" data-aspect-ratio="4x3" style="background-image: url(<?php echo($acf_tournament_stage_logo_url); ?>);"></a>
        </div>
        <div class="columns small-12 medium-9 large-8">
          <h1 class="tournament-title"><?php echo(get_the_title()); ?></h1>
          <time class="stage-dates"><?php echo(date_format($acf_tournament_stage_start_date,"F j, Y")); ?> &mdash; <?php echo(date_format($acf_tournament_stage_end_date,"F j, Y")); ?></time>
          <?php echo($acf_tournament_stage_description); ?>
          <div class="btn-event-wrapper">
            <a href="<?php echo(get_the_permalink()); ?>#stage-event-1" class="btn-aoe btn-aoe--red btn-aoe--small">
              <?php
              if($acf_tournament_stage_event_1_name) {
                echo($acf_tournament_stage_event_1_name);
              } else {
                echo('Event 1');
              }
              ?>
            </a>
            <a href="<?php echo(get_the_permalink()); ?>#stage-event-2" class="btn-aoe btn-aoe--red btn-aoe--small">
              <?php
              if($acf_tournament_stage_event_2_name) {
                echo($acf_tournament_stage_event_2_name);
              } else {
                echo('Event 2');
              }
              ?>
            </a>
          </div>
        </div>

      </div>


      <?php

      endwhile;

      echo('</section>'); // end section.tournaments.tournament-stages.completed

      endif;


      ?>


    </div>
  @endwhile
@endsection
