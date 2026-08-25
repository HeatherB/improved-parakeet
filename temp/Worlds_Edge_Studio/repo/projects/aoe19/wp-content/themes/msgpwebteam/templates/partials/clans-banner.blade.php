<div class="banner clans-banner clans-all-banner">
  <div class="clans-banner__edit">
    <?php if(get_user_meta(get_current_user_id(),'clan_assoc',true) == '') { ?>
    <a href="<?php echo get_bloginfo('url'); ?>/clans/create/" class="button button--icon-left">
      <i class="fa fa-plus" aria-hidden="true"></i>
      Create a Clan
    </a>
    <?php } ?>
  </div>
  <div class="row column text-center">
    <div class="clans-banner__name-motto">
      <h1 class="light">CLANS</h1>
      <p class="lead">Find a clan to join, or create your own!</p>
    </div>
  </div>
</div>
