<?php
  // Get Alert Posts
$args = [
    'posts_per_page'   => 1,
    'post_type'        => 'alerts',
    'post_status'      => 'publish',
];
$alerts = get_posts( $args );
$alerts = isset($alerts[0]) ? $alerts[0] : '';

if( !empty($alerts) ){


?>

<div class="alert-page <?php echo get_field('alert_splash_color',$alerts->ID);?>">
  <div class="alert-splash <?php echo get_field('alert_splash_class',$alerts->ID);?>"></div>
  <div class="alert-content">
    <div class="alert-icon">
      <img class="<?php echo get_field('alert_icon_class',$alerts->ID); ?> notification image" src="@asset('images/blank-square.gif')" alt="alert notification image" />
    </div>
    <div class="alert-body" id="aria-alert-body">
      <?php echo get_field('alert_content',$alerts->ID); ?>
    </div>
  </div>
  <?php if(get_field('use_entire_banner_as_link',$alerts->ID)) { ?>
  <a href="<?php echo get_field('banner_link_url',$alerts->ID); ?>" aria-label="Link to Further Info" aria-labelledby="aria-alert-body" target="_blank" class="alert-full-link"></a>
  <?php } ?>
</div>

<?php

}

?>
