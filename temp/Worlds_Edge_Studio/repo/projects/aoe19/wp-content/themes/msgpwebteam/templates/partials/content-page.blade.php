<?php 
  $slug = get_post_field( 'post_name', get_post());
  if ($slug=="insider-faq") {
  	$content = "section--divider-frank-mid";
  } else {
  	$content = "section-divider";
  }
  ?>

<div class="{{ $content }} section--padding background--paper">
    <div class="row">
        <div class="column small-12 medium-12">
            {{the_content()}}
        </div>
    </div>
</div>