@extends('layouts.tournaments')

@section('content')
  @while(have_posts()) @php(the_post())
    @include('partials.tournaments-banner-kod2')
    <div class="content section--gold-divider section--padding-bottom background--rock section-divider">

      <div class="row">
        <div class="section--padding-top">
          @include('partials.tournaments-nav-kod2')
        </div>
      </div>


      <?php // Tournament Settings


      // set args for tournament settings
      $args = array(
        'post_type'       => 'tourney-settings',
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

          $acf_tourney_settings_rules_and_settings_pdf = get_field('acf_tourney_settings_rules_and_settings_pdf');
          $acf_tourney_settings_rules_and_settings_text = get_field('acf_tourney_settings_rules_and_settings_text');


        endwhile;

      endif;

      ?>

      <section class="tournaments rules section--padding">

        <div class="row">
          <div class="columns small-12">

            <h1 class="light">Tournament Rules &amp; Settings</h1>

            <?php echo($acf_tourney_settings_rules_and_settings_text); ?>


          </div>
        </div>

        <div class="row  section--padding-top">
          <div class="columns small-12">

            <object id="rules-and-settings-pdf" data="<?php echo($acf_tourney_settings_rules_and_settings_pdf); ?>" type="application/pdf" width="100%" height="100%">
              <a href="<?php echo($acf_tourney_settings_rules_and_settings_pdf); ?>">Rules and Settings</a>
            </object>

            <div class="pdf-download">
              <a target="_blank" href="<?php echo($acf_tourney_settings_rules_and_settings_pdf); ?>" class="btn-aoe btn-aoe--red btn-aoe--block">Download Rules &amp; Settings</a>
            </div>

          </div>
        </div>

      </section>

    </div>
  @endwhile
@endsection
