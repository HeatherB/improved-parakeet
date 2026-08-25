<?php

if(is_user_logged_in() && wp_get_current_user()->is_insider) { ?>
    @include('partials.newsletter-subscriber')
<?php } else { ?>
    @include('partials.newsletter-subscribe')
<?php } ?>