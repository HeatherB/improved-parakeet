@extends('layouts.base-alt')

@section('content')
<?php //Get Current User ID if there is one
  $currentUser = (is_user_logged_in()?get_current_user_id():'-1');
	define('DONOTCACHEPAGE', true);
	define('DONOTCACHEDB', true);
	define('DONOTCACHEOBJECT', true);
?>
<div class="banner clans-banner clans-detail-banner" style="background-image: url('<?php echo get_post_meta(get_the_id(),'background_image_url',true);  ?>')">
  <?php if(get_user_meta(get_current_user_id(),'clan_assoc',true) == get_the_id() && get_user_meta(get_current_user_id(),'member_role_clan_',true) == 'founder'){ ?>
  <div class="clans-banner__edit">
    <a href="./edit/" class="button button--icon-left">
      <i class="fa fa-pencil" aria-hidden="true"></i>
      Edit this Clan
    </a>
  </div>
  <?php } ?>
  <div class="row column text-center">
    <div class="clans-banner__logo-tag">
      <div class="clan-logo-container">
        <img src="<?php echo get_post_meta(get_the_id(),'cdn_logo',true);  ?>" onerror="<?php echo get_site_url(); ?>/wp-content/plugins/MSAauth/img/default-avatar.jpg" />
      </div>
      <span>[<?php echo get_post_meta(get_the_ID(), 'clan_tag', true); ?>]</span>
    </div>
    <div class="clans-banner__name-motto">
      <h1 class="light"><?php echo get_the_title(get_the_ID()); ?></h1>
      <p class="lead"><?php echo get_post_meta(get_the_ID(), 'clan_motto', true); ?></p>
    </div>
  </div>
</div>

<div class="content section--gold-divider background--rock">
  <div class="alert alert--clans-detail">
    <div class="alert__container">
      <div id="alert_flagged" class="alert__content hide">
        <i class="icon icon--alert alert__icon"><span class="sr-only">Alert!</span></i>
        <div class="alert__message">
          <p class="alert__desc">This clan has been flagged for inappropriate content, and will be evaluated by a community team member. Please make sure your clan's content is in line with our <a href="https://www.xbox.com/en-US/Legal/CodeOfConduct" target="_blank">community guidelines</a> to avoid action being taken.</p>
        </div>
      </div>
    </div>
  </div>
  <div class="row">
    <main class="clans-detail-content main section--padding-top section--padding-bottom section--padding-lr-med-only">
      <div class="row">
        <div class="columns medium-8">
          <div class="frame-box clans-manifesto">
            <div class="frame-box__inner frame-box__inner--light">
              <h2 class="h3">Manifesto</h2>
              <?php echo get_post_meta(get_the_ID(), 'manifesto', true); ?>
            </div>
          </div>
          <!-- Removed Per Design

          <div class="dark-content-box primary-stats">
            <div class="arrow-badge-hr arrow-badge-hr--custom-badge">
              <div class="progress-circle" data-progress="87">
                <div class="progress-circle__box">
                  <div class="progress-circle__circle">
                    <div class="progress-circle__mask full">
                      <div class="progress-circle__fill"></div>
                    </div>
                    <div class="progress-circle__mask half">
                      <div class="progress-circle__fill"></div>
                      <div class="progress-circle__fill fix"></div>
                    </div>
                  </div>
                  <div class="progress-circle__inset">
                    <div class="progress-circle__stat">
                      <span class="progress-circle__number"></span>%
                    </div>
                    <div class="progress-circle__label">Wins</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="primary-stats__stats-columns four-stats-columns">
              <div class="primary-stats__stat-column">
                <div class="stat">31</div>
                <div class="stat-label">Total Games Won</div>
              </div>
              <div class="primary-stats__stat-column">
                <div class="stat">12</div>
                <div class="stat-label">Total Games Lost</div>
              </div>
              <div class="primary-stats__stat-column">
                <div class="stat">9999</div>
                <div class="stat-label">Units Killed</div>
              </div>
              <div class="primary-stats__stat-column">
                <div class="stat">9999</div>
                <div class="stat-label">Buildings Raised</div>
              </div>
            </div>
          </div>

          -->
          <?php 
          $dailyMessage = get_post_meta(get_the_ID(), 'daily_message', true) ?? false;
			
          if($dailyMessage && !empty($dailyMessage) && $dailyMessage != 'null'){ ?>
          <div class="clans-daily-msg frame-box__inner frame-box__inner--dark frame-box__inner--double-pad frame-box__inner--no-border">
            <p class="clans-daily-msg__date"><?php echo get_post_meta(get_the_ID(), 'daily_message_date', true); 
              if((get_user_meta($currentUser,'clan_assoc',true) == get_the_id()) && (get_user_meta($currentUser,'member_role_clan_',true) === 'officer' || get_user_meta($currentUser,'member_role_clan_',true) === 'founder')){ ?><span class="new_motd">Add New</span><?php } ?>
            </p>
            <p class="daily_message_description">
            <?php echo $dailyMessage; ?>
						</p>
          </div>
          <?php } ?>
           <div id="clans-members-list" class="clans-players-list">
            <div class="clans-players-list__filters"></div>
            <h2 class="clans-players-list__count light"><span></span> Members</h2>
            <div class="clans-players-list__pagination"></div>
            <div class="results-container"></div>

            <div class="no-results hide">
              <p>Sorry, there are no members matching this criteria. Please try again.</p>
            </div>

            <div class="error-results hide">
              <p>Oops, something went wrong.</p>
            </div>

            <div class="reveal reveal--warning" id="warning-promote-officer" data-reveal>
              <i class="icon icon--alert alert__icon"><span class="sr-only">Alert!</span></i>
              <button class="close-button" data-close aria-label="Close modal" type="button">
                <span aria-hidden="true">&times;</span>
              </button>

              <p>Are you sure you want to promote this officer to founder? By doing so, you will demote yourself to officer.</p>
              <button class="button button--bg-white button--text-brown" data-close aria-label="Cancel" type="button">
                Cancel
              </button>
              <button class="button" id="confirm-promote-officer" data-close aria-label="Promote" type="button">
                Promote
              </button>
            </div>
          </div>
          <?php if(
            (get_user_meta($currentUser,'clan_assoc',true) == get_the_id()) && 
            (get_user_meta($currentUser,'member_role_clan_',true) === 'officer' || 
            get_user_meta($currentUser,'member_role_clan_',true) === 'founder')){ ?>
          
          <div id="clans-applicants-list" class="clans-players-list">
            <div class="clans-players-list__filters"></div>
            <h2 class="clans-players-list__count light"><span></span> Applicants</h2>
            <div class="clans-players-list__pagination"></div>
            <div class="results-container"></div>

            <div class="no-results hide">
              <p>Sorry, there are no applicants matching this criteria. Please try again.</p>
            </div>

            <div class="error-results hide">
              <p>Oops, something went wrong.</p>
            </div>
          </div>
          
          <div id="clans-blocked-list" class="clans-players-list">
            <div class="clans-players-list__filters"></div>
            <h2 class="clans-players-list__count light"><span></span> Blocked</h2>
            <div class="clans-players-list__pagination"></div>
            <div class="results-container"></div>

            <div class="no-results hide">
              <p>Sorry, there are no blocked players matching this criteria. Please try again.</p>
            </div>

            <div class="error-results hide">
              <p>Oops, something went wrong.</p>
            </div>
          </div>
          <?php } ?>
          <div class="reveal reveal--error" id="error-player-list" data-reveal>
            <i class="icon icon--alert alert__icon"><span class="sr-only">Alert!</span></i>
            <button class="close-button" data-close aria-label="Close modal" type="button">
              <span aria-hidden="true">&times;</span>
            </button>

            <p id="error-player-list__msg">Oops, something went wrong.</p>
          </div>

          <!-- Create new message of the day -->
          <div class="reveal modal small frame-box" id="new_motd" data-reveal>
            <div class="frame-box__inner frame-box__inner--dark">
              <button class="close-button" data-close aria-label="Close modal" type="button">
                <span aria-hidden="true">&times;</span>
              </button>
              <p>
                
                <form id="owner_motd" action="" method="post">
                  <div class="form__item">
                    <h4>New Message Of The Day</h4>
                    <textarea class="new_motd_text counted" name="motd" id="motd_text" maxlength="500"></textarea>
                    <!-- <span id="motd_save" class="button" data-clan-action="save_motd">Save</span> -->
                    <button class="button" id="save_motd" data-close data-clan-action="save_motd" aria-label="Save New Message" type="button">Save</button>
                  </div>
                </form>
              </p>
            </div>
          </div>
        
          <div class="reveal reveal--error" id="save-motd-error" data-reveal>
            <i class="icon icon--alert alert__icon"><span class="sr-only">Alert!</span></i>
            <button class="close-button" data-close aria-label="Close modal" type="button">
              <span aria-hidden="true">&times;</span>
            </button>
            <p id="save-motd-error__msg">Oops, something went wrong.</p>
          </div>

        </div>
        <div class="columns medium-4">
          <div class="frame-box clans-stats">
            <div class="frame-box__inner frame-box__inner--dark">
              <ul class="clan_stats_list not_a_list">
                <li>
                  <span>Number of members</span>
                  <?php //echo get_post_meta(get_the_ID(), 'member_count', true); ?>
                  <span id='memberCount'></span>
                  Members
                </li>
                <li>
                  <span>Creation Date</span>
                  <?php 
                    //echo date('F j, Y',strtotime(get_post_meta(get_the_ID(),'creationDate',true))); 
                    echo get_the_date('F j, Y', get_the_ID());
                  ?>
                </li>
                <!--<li>
                  <span>Language</span>
                  <?php //echo get_post_meta(get_the_ID(), 'language', true); ?>
                </li>-->
                <li>
                  <span>Activity Level</span>
                  <?php echo get_post_meta(get_the_ID(), 'activity_level', true); ?>
                </li>
                <li>
                  <span>Average Skill Level</span>
                  <?php echo get_post_meta(get_the_ID(), 'average_skill_level', true); ?>
                </li>
              </ul>
            </div>
          </div>
          <div class="text-center">
            <?php if(
              get_user_meta($currentUser,'clan_assoc',true) == '' && 
              get_post_meta(get_the_id(),'applications',true) == 'Open' &&
              !in_array(get_the_id(),get_user_meta($currentUser,'clan_blocked'))){ ?>
            <!------------------------------------------------------------------------->
            <!-- START Join Clan button (Non-Member - Open) -->
            <p>
              <button class="button <?php echo (is_user_logged_in() ? "" : "js-sign-in"); ?>" id="join-clan-confirm" data-clan-action="join">
                Join this Clan
              </button>
            </p>
            <div class="reveal reveal--error" id="join-clan-error" data-reveal>
              <i class="icon icon--alert alert__icon"><span class="sr-only">Alert!</span></i>
              <button class="close-button" data-close aria-label="Close modal" type="button">
                <span aria-hidden="true">&times;</span>
              </button>
              <p id="join-clan-error__msg">Oops, something went wrong.</p>
            </div>
            <?php } ?>
            <!-- END Join Clan button (Non-Member - Open) -->
            <!------------------------------------------------------------------------->
              

            <!------------------------------------------------------------------------->
            <!-- START Apply to Join Clan button (Non-Member - Restricted) -->
            <?php if(
              get_post_meta(get_the_id(),'applications',true) == 'Restricted' &&
              empty(get_user_meta($currentUser,'clan_assoc',true)) &&
              !in_array(get_the_id(),get_user_meta($currentUser,'clan_blocked')) &&
              !in_array(get_the_id(),get_user_meta($currentUser,'clan_applications'))){ ?>
            <p>
              <button class="button <?php echo (is_user_logged_in() ? "" : "js-sign-in"); ?>" id="apply-clan-confirm" data-clan-action="apply">
                Apply to Clan
              </button>
            </p>

            <div class="reveal reveal--error" id="apply-clan-error" data-reveal>
              <i class="icon icon--alert alert__icon"><span class="sr-only">Alert!</span></i>
              <button class="close-button" data-close aria-label="Close modal" type="button">
                <span aria-hidden="true">&times;</span>
              </button>
              <p id="apply-clan-error__msg">Oops, something went wrong.</p>
            </div>
            <?php } ?>
            <!-- END Apply to Join Clan button (Non-Member - Restricted) -->
            <!------------------------------------------------------------------------->

            <!------------------------------------------------------------------------->
            <!-- START Cancel Application button (Non-Member - Application pending) -->
            <?php if(in_array(get_the_id(),get_user_meta($currentUser,'clan_applications'))){ ?>
            <p>
              <button class="button" data-open="cancel-apply-warning">
                Cancel Request to Join
              </button>
            </p>

            <div class="reveal reveal--warning" id="cancel-apply-warning" data-reveal>
              <i class="icon icon--alert alert__icon"><span class="sr-only">Alert!</span></i>
              <button class="close-button" data-close aria-label="Close modal" type="button">
                <span aria-hidden="true">&times;</span>
              </button>
              <p>Are you sure you want to cancel your request to join this clan?</p>
              <button class="button button--bg-white button--text-brown" data-close aria-label="Cancel" type="button">Cancel</button>
              <button class="button" id="cancel-apply-confirm" data-close data-clan-action="cancel-apply" aria-label="Cancel Request" type="button">Cancel Request</button>
            </div>

            <div class="reveal reveal--error" id="cancel-apply-error" data-reveal>
              <i class="icon icon--alert alert__icon"><span class="sr-only">Alert!</span></i>
              <button class="close-button" data-close aria-label="Close modal" type="button">
                <span aria-hidden="true">&times;</span>
              </button>
              <p id="cancel-apply-error__msg">Oops, something went wrong.</p>
            </div>
            <?php } ?>
            <!-- END Cancel Application button (Non-Member - Application pending) -->
            <!------------------------------------------------------------------------->

            <!------------------------------------------------------------------------->
            <!-- START Leave Clan button (Member, Officer) -->
            <?php if(
              is_user_logged_in() &&
              get_user_meta($currentUser,'clan_assoc',true) == get_the_id() &&
              get_user_meta($currentUser,'member_role_clan_',true) != 'founder'){ ?>
            <p>
              <button class="button button--icon-left" data-open="leave-clan-warning">
                <i class="fa fa-reply" aria-hidden="true"></i>
                Leave this Clan
              </button>
            </p>

            <div class="reveal reveal--warning" id="leave-clan-warning" data-reveal>
              <i class="icon icon--alert alert__icon"><span class="sr-only">Alert!</span></i>
              <button class="close-button" data-close aria-label="Close modal" type="button">
                <span aria-hidden="true">&times;</span>
              </button>
              <p>Are you sure you want to leave this clan?</p>
              <button class="button button--bg-white button--text-brown" data-close aria-label="Cancel" type="button">Cancel</button>
              <button class="button" id="leave-clan-confirm" data-close data-clan-action="leave-member-officer" aria-label="Leave this Clan" type="button">Leave this Clan</button>
            </div>

            <div class="reveal reveal--error" id="leave-clan-error" data-reveal>
              <i class="icon icon--alert alert__icon"><span class="sr-only">Alert!</span></i>
              <button class="close-button" data-close aria-label="Close modal" type="button">
                <span aria-hidden="true">&times;</span>
              </button>
              <p id="leave-clan-error__msg">Oops, something went wrong.</p>
            </div>
            <?php } ?>
            <!-- END Leave Clan button (Member, Officer) -->
            <!------------------------------------------------------------------------->


            <!------------------------------------------------------------------------->
            <!-- START Leave Clan button (Founder) -->
            <?php if(
              is_user_logged_in() &&
              get_user_meta($currentUser,'clan_assoc',true) == get_the_id() &&
              get_user_meta($currentUser,'member_role_clan_',true) == 'founder'){ ?>
            <p>
              <button class="button button--icon-left" data-open="leave-clan-warning-founder">
                <i class="fa fa-reply" aria-hidden="true"></i>
                Leave this Clan
              </button>
            </p>

            <div class="reveal reveal--warning" id="leave-clan-warning-founder" data-reveal>
              <i class="icon icon--alert alert__icon"><span class="sr-only">Alert!</span></i>
              <button class="close-button" data-close aria-label="Close modal" type="button">
                <span aria-hidden="true">&times;</span>
              </button>
              <p>First, you must promote an officer to take your place. Then you can leave the clan.</p>
              <button class="button button--bg-white button--text-brown" data-close aria-label="Ok" type="button">Ok</button>
            </div>
            <?php } ?> 
            <!-- END Leave Clan button (Founder) -->
            <!------------------------------------------------------------------------->


            <!------------------------------------------------------------------------->
            <!-- START Delete Clan button (Founder) -->
            <?php if(
              is_user_logged_in() &&
              get_user_meta($currentUser,'clan_assoc',true) == get_the_id() &&
              get_user_meta($currentUser,'member_role_clan_',true) == 'founder'){ ?>
            <p>
              <button class="button" data-open="delete-clan-warning">
                Delete this Clan
              </button>
            </p>

            <div class="reveal reveal--warning" id="delete-clan-warning" data-reveal>
              <i class="icon icon--alert alert__icon"><span class="sr-only">Alert!</span></i>
              <button class="close-button" data-close aria-label="Close modal" type="button">
                <span aria-hidden="true">&times;</span>
              </button>
              <p>Are you sure you want to delete this clan?</p>
              <button class="button button--bg-white button--text-brown" data-close aria-label="Cancel" type="button">Cancel</button>
              <button class="button" id="delete-clan-confirm" data-close data-clan-action="delete-clan" aria-label="Delete this Clan" type="button">Delete this Clan</button>
            </div>

            <div class="reveal reveal--error" id="delete-clan-error" data-reveal>
              <i class="icon icon--alert alert__icon"><span class="sr-only">Alert!</span></i>
              <button class="close-button" data-close aria-label="Close modal" type="button">
                <span aria-hidden="true">&times;</span>
              </button>
              <p id="delete-clan-error__msg">Oops, something went wrong.</p>
            </div>
            <?php } ?>
            <!-- END Delete Clan button (Founder) -->
            <!------------------------------------------------------------------------->


            <!------------------------------------------------------------------------->
            <!-- START Flag as Inappropriate button (Non-Member) -->
            
            <?php if(!in_array(get_the_id(),get_user_meta($currentUser,'clan_blocked'))){ ?>
            <p>
              <button class="button <?php echo (is_user_logged_in() ? "" : "js-sign-in"); ?>" id="flag-clan-confirm">
                <span <?php echo "class='" . (is_user_logged_in() ? "flag-clan-set'" : "js-sign-in'"); ?>>Flag as Inappropriate</span>
                <span class="flag-clan-cancel hide">Cancel Inappropriate Flag</span>
              </button>
            </p>

            <div class="reveal reveal--error" id="flag-clan-error" data-reveal>
              <i class="icon icon--alert alert__icon"><span class="sr-only">Alert!</span></i>
              <button class="close-button" data-close aria-label="Close modal" type="button"> .
                <span aria-hidden="true">&times;</span>
              </button>
              <p id="flag-clan-error__msg">Oops, something went wrong.</p>
            </div>
            <?php } ?>
            <!-- END Flag as Inappropriate button (Non-Member) -->
            <!------------------------------------------------------------------------->
          </div>
					
					<div class="ad_applications">
						<b>Connect with your clan on the go!</b>
						<p>Install the Xbox app, and find your clan in the club section to chat, post and more!</p>
						<div class='application_links'>
							<a class='app_link' href='https://itunes.apple.com/us/app/xbox-one-smartglass/id736179781?mt=8'><img src="@asset('images/Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.png')" target='_blank'></a>
							<a class='app_link' href='https://play.google.com/store/apps/details?id=com.microsoft.xboxone.smartglass&hl=en'><img src="@asset('images/google-play-badge-small.png')" target='_blank'></a>
							<a class='app_link' href='https://www.microsoft.com/store/apps/xbox/9wzdncrfjbd8'><img src="@asset('images/button-microsoft-store-small.png')" /></a>
						</div>
					</div>
					
        </div>
      </div>

      @yield('content')
    </main>
  </div>
</div>
@endsection
