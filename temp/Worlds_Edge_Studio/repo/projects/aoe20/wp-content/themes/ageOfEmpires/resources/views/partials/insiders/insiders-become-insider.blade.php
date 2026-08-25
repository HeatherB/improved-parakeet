<?php
// Get content From ACF
$options = get_fields();

/* logged out sign up block */
$sign_up_block_title = $options['sign_up_block']['title'];
$sign_up_block_content_body = $options['sign_up_block']['content_body'];
/* login check - is_user_logged_in() */

/*
!!todo!!
sign in links lines 30 - 35
currently entered as "/"
may want variable replacement to account for environment
*/
?>

<section>
	<div class="page-container">
		<div class="insiders__block">
			@if($sign_up_block_title)
			<h3 class="insiders__block-heading">{{$sign_up_block_title}}</h3>
			@endif

			@if($sign_up_block_content_body)
			<div class="insiders__block-copy">
				{!!$sign_up_block_content_body!!}
			</div>
			@endif

			<div class="insiders__block-buttons">
				<a href="/" class="insiders__subscribe-cta js-cta-button">Insider Sign-Up</a>
				@if(!is_user_logged_in())
					<a href="/" class="insiders__button">Sign In</a>
				@endif
			</div>
		</div>
	</div>
</section>