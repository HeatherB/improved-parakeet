<?php  

if(have_posts()): while(have_posts()): the_post(); 

?>
<div class="newsletter section--padding-top background--paper  @if(get_post_field( 'post_name', get_post() ) == "aoeiide") section--divider-frank-mid @else section--divider-egypt-mid  @endif">
  <div class="newsletter__container">
    <div class="row">
      <div class="small-12 columns">
      <h3><?php the_title(); ?></h3>
      	<?php the_content(); ?>
      </div>
    </div>
  </div>

  @include('partials.comparison-game')

</div>

<?php endwhile; endif; ?>