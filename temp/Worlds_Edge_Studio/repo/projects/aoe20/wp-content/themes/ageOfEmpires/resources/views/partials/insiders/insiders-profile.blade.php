<?php
// Get content From ACF
$options = get_fields();

$user_log_state = '0';
if(is_user_logged_in()) {
	$user_log_state = '1';
} 
$insider_community_block_content_body = $options['insider_community_block'][$user_log_state]['content_body'];
$insider_community_block_has_forum_latest = $options['insider_community_block'][$user_log_state]['has_forum_latest'];

?>

<section>
	<div class="page-container">
		<div class="insiders__dashboard">

			<div class="column">
				<div class="insiders__profile">
					<?php if(!empty(wp_get_current_user()->msa_pp)){ ?>
			            <img class="avatar" src="<?php echo wp_get_current_user()->msa_pp; ?>"/>
			        <?php } else { ?>
			            <img class="avatar" src="@asset('images/defaults/default-avatar.svg')"/>
			        <?php } ?>

			        <h2 class="insiders__profile-name">{{$insider->gamerName}}</h2>
			        <ul>
			        	<li class="gamertag">{{$insider->gamerName }}</li>
			        	<li class="steam-profile">
			        		@if (isset($insider->gps_steamid))
			        			{{$insider->gps_personaname}}
			        		@else
			        			<a href="/profile#insiderSettingSteam">Connect Steam</a>
			        		@endif
			        	</li>
			        </ul>
				</div><!-- end profile info -->

				@if(!empty($insider_community_block_has_forum_latest))
				<div class="insiders__announce">
					<h5 class="subheading">Insider Announcements</h5>
					<ul class="js-forum-latest"></ul>
					{!! $insider_community_block_content_body !!}
				</div>
				@endif
	        </div><!--end of column -->


			<div class="column">
			@if($insider_status)
	            @if(sizeof($flights->betaEnrollment) && sizeof($flights->currentBetas))
	            <div class="insiders__enroll">
	            	<h5 class="subheading">Enrolled in Betas</h5>
	                <ul>
	               @foreach($flights->currentBetas as $current)
	                   @if(in_array($current['flight_id'], $flights->betaEnrollment))
	                    <li>
	                    	<a href="#{{$current['flight_id']}}">{{$current['flight_name']}}</a>
	                    </li>
	                   @endif
	                @endforeach
	                </ul>

	                @if($need_invite)
	                	<button class="beta-invite">
	                		{{icon('announce', 'icon --trumpet')}}
	                		Resend Invitation
	                	</button>
	                @endif
	            </div>        
	            @endif
	        @endif
	    </div><!--end of column -->



		</div><!-- end dashboard -->
	</div>
</section>
