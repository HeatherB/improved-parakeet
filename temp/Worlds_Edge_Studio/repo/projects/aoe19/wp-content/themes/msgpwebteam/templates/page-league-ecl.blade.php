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

  </div>



  <?php // Tournament League


  // set args for tournament league
  $args = array(
    'post_type'       => 'tournament-league',
    'post_status'     => 'publish',
    'posts_per_page'  => '1',
    'order'           => 'DESC'
  );

  // query tournament leagues
  $query = new \WP_Query($args);


  // do we have posts for tournament leagues?
  if( $query->have_posts() ):

    while ($query->have_posts()) : $query->the_post();

      // check if tournament_league_teams has rows of data
      if( have_rows('tournament_league_teams') ):


        ?>


  <section id="tournaments-league-table" class="tournaments league league-table section--padding-bottom background--rock">
    <div class="row">
      <div class="columns small-12">
        <h1 class="light">League Table</h1>
      </div>
    </div>
    <div class="row">
      <div class="columns small-12">
        <div class="table-wrapper">
          <div class="table-frame frame-box">
            <table>
              <thead>
              <tr>
                <th>Position</th>
                <th>Team</th>
                <th>1st Place</th>
                <th>2nd Place</th>
                <th>3rd Place</th>
                <th>5th Place</th>
                <th>Points</th>
              </tr>
              </thead>
              <tbody>
        <?php while ( have_rows('tournament_league_teams') ) : the_row(); // loop through the rows of data ?>
        <?php
        $postobject = get_sub_field('tournament_league_team_name');
        $tournament_league_team_name = $postobject->post_title;
        ?>
        <tr>
          <td><?php echo(the_sub_field('tournament_league_position')); ?></td>
          <td><?php echo($tournament_league_team_name); ?></td>
          <td><?php echo(the_sub_field('tournament_league_1st_place')); ?></td>
          <td><?php echo(the_sub_field('tournament_league_2nd_place')); ?></td>
          <td><?php echo(the_sub_field('tournament_league_3rd_place')); ?></td>
          <td><?php echo(the_sub_field('tournament_league_5th_place')); ?></td>
          <td><?php echo(the_sub_field('tournament_league_points')); ?></td>
        </tr>
          <?php endwhile; ?>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </section>


        <?php

      endif;

    endwhile;

  endif;

  ?>

        <?php // Tournament Teams


        // set args for tournament team
        $args = array(
          'post_type'       => 'tournament-team',
          'post_status'     => 'publish',
          'posts_per_page'  => '-1',
          'order'           => 'DESC'
        );

        // query tournament team
        $query = new \WP_Query($args);

        ?>



        <?php if( $query->have_posts() ): // do we have posts for tournament team? ?>

  <section id="tournaments-teams" class="tournaments teams section--padding-bottom background--rock" data-equalizer>
    <div class="row">
      <div class="columns small-12">
        <h1 class="light">teams</h1>
      </div>
    </div>
    <div class="row">
      <div class="columns small-12 medium-12 large-12">
        <div class="teams">

        <?php while ($query->have_posts()) : $query->the_post(); // loop for tournament team ?>

          <div class="team" data-equalizer-watch>

            <div class="flip-container" ontouchstart="this.classList.toggle('hover');">
              <div class="flipper">
                <div class="front" data-equalizer-watch>

                  <div class="frame-box">
                    <div class="content">
                      <div class="team-logo" data-aspect-ratio="1x1" style="background-image: url(<?php echo(get_field('acf_tournament_team_logo')); ?>);"></div>
                      <div class="team-name"><?php echo(get_the_title()); ?></div>
                    </div>
                  </div>
                </div>
                <div class="back">
                  <div class="frame-box">
                    <div class="content">
                      <div class="team-members" data-aspect-ratio="1x1">
                        <?php
                        if( have_rows('acf_tournament_team_members') ):
                          echo('<ul>');
                          while ( have_rows('acf_tournament_team_members') ) : the_row();
                            echo('<li>');
                            echo('<span class="flag" style="background-image: url(' . get_sub_field('acf_tournament_team_member_country_flag') . ');"></span>');
                            echo(get_sub_field('acf_tournament_team_member_screen_name'));
                            echo('<li>');
                          endwhile;
                          echo('</ul>');
                        endif;
                        ?>
                      </div>
                      <div class="team-name"><?php echo(get_the_title()); ?></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        <?php endwhile; ?>

        </div>
      </div>
    </div>
  </section>

        <?php endif; ?>


  @endwhile
@endsection







