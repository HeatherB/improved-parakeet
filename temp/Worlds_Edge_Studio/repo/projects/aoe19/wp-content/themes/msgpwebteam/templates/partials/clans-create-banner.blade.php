<?php if(is_user_logged_in()){ \Roots\Clans\ClansRefreshToken::checkExpired( get_bloginfo('url') . '/clans/create/'); } ?>
<div class="banner clans-banner clans-create-banner">
  <div class="row column text-center">
    <?php if(get_user_meta(get_current_user_id(),'owns_clan',true) == ''){ ?>
    <h1 class="light">Create a Clan</h1>
    <p class="lead">Customize the information about and look of your clan here!</p>
    <?php  } else  { ?>
    <h1 class="light">Edit a Clan</h1>
    <p class="lead">Customize the information about and look of your clan here!</p>
    <?php  } ?>
  </div>
</div>
