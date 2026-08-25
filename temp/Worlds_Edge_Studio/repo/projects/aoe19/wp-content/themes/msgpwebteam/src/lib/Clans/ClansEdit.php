<?php

namespace Roots\Clans;

use WP_Query;

class ClansEdit  {
  
  public function __construct()
  {
    add_action( 'wp_ajax_clans_edit', [$this, 'clans_edit'] );
    add_action( 'wp_ajax_nopriv_clans_edit', [$this, 'clans_edit'] );
  }
  
  public $errors = array(
    'User is not logged in.'
  );

  public function render_error($error) {
    header('Content-Type: application/json');
    echo json_encode($error);
    die();
  }

  public function clans_edit(){
      
    //Get Logo Shield Attachement URL
    $logoBackgroundURL = wp_get_attachment_url(get_post_meta($_REQUEST['ClanLogoBackground'],'logo_background',true));
    $logoBackgroundName = get_the_title($_REQUEST['ClanLogoBackground']);

    //Get Logo Shield Attachement URL
    $logoShieldURL = wp_get_attachment_url(get_post_meta($_REQUEST['ClanLogoShield'],'logo_shield',true));
    $logoShieldName = get_the_title($_REQUEST['ClanLogoShield']);
    //Get Icon Attachement URL
    $logoIconURL = wp_get_attachment_url(get_post_meta($_REQUEST['ClanLogoIcon'],'logo_icon',true));
    $logoIconName = get_the_title($_REQUEST['ClanLogoIcon']);
    
    $logoImage = \Roots\Clans\ClansImages::logoImgs($logoBackgroundName,$logoShieldName,$logoIconName);

    //Get Background URL
    $backgroundURL = wp_get_attachment_url(get_post_meta($_REQUEST['ClanBackgroundImage'],'background_image_cropped',true));

		$backgroundName = get_the_title($_REQUEST['ClanBackgroundImage']);
		
		$clanBGImage = \Roots\Clans\ClansImages::clanBG($backgroundName);
		
    $club_id = get_post_meta($_REQUEST['ClanId'],'club_id',true);
    
    //Create Args
    $args = array(
      "clanMotto" => sanitize_text_field(stripslashes($_REQUEST['ClanMotto'])),
      "clanTag" => sanitize_text_field($_REQUEST['ClanTag']),
      "language" => sanitize_text_field($_REQUEST['ClanLanguage']),
      "visibility" => sanitize_text_field($_REQUEST['ClanVisibility']),
      "activityLevel" => sanitize_text_field($_REQUEST['ClanActivityLevel']),
      "averageSkill" => sanitize_text_field($_REQUEST['ClanAvgSkillLevel']),
      "manifesto" => sanitize_text_field(stripslashes($_REQUEST['ClanManifesto'])),
      "dailyMessage" => sanitize_text_field(stripslashes($_REQUEST['ClanDailyMessage'])),
      "ClanBackgroundImage" => $backgroundURL,
      "ClanBackgroundImageID" => $_REQUEST['ClanBackgroundImage'],
      "ClanLogoBackground" => $logoBackgroundURL,
      "ClanLogoBackgroundID" => $_REQUEST['ClanLogoBackground'],
      "ClanLogoShield" => $logoShieldURL,
      "ClanLogoShieldID" => $_REQUEST['ClanLogoShield'],
      "ClanLogoIcon" => $logoIconURL,
      "ClanLogoIconID" => $_REQUEST['ClanLogoIcon'],
      "edit_id" => $_REQUEST['ClanId'],
      "clubId" => $club_id,
      "ClubLogo" => $logoImage,
			"ClubBG" => $clanBGImage,
    );

    
    $wp_club = 0;
      
    //Edit Club Profile, and Activity Feed
    
    //Retry Count
    $retry = 5;

    //Create Club Profile
    $i = 0;
    do {
      $result_profile = \Clubs\services\Club::update_profile_club($args);
      sleep(2);
      
      if($result_profile['code'] === 200){
        break;
      }
      
      $i++;
    } while ( $i < $retry );

    //Activity Feed
    $i = 0;
    do {
      $result_feed = \Clubs\services\Club::post_activity_feed($args);
      sleep(2);
      
      if($result_feed['code'] === 200){
        break;
      }
      
      $i++;
    } while ( $i < $retry );
      
    if($result_feed['code'] == 200 || $result_profile['code'] == 200){
      $wp_club = $this->edit_wp_club($args);        
    } else {
			error_log(json_encode('CLUBS EDIT FAILED:' . ' Profile was: ' . $result_profile['code'] . ' Activity Feed was: ' .$result_feed['code'] ));
    }
    
    if($wp_club !== 0 || $wp_club !== -1 || $wp_club !== '' || $wp_club !== null){
      $result['resultKey'] = 'ClanId';
      $result['resultValue'] = $wp_club;    
    } else {
			error_log('Error: Editing club.');
			$error = json_decode($result['response']);
			$result['error'] = $error->description;
    }
    
    echo json_encode($result);
    die();  
      
  } 
    
  function edit_wp_club($args) {

    $post_id = $args['edit_id'];
  
    update_post_meta($post_id,'clan_motto', $args['clanMotto']);
    update_post_meta($post_id,'clan_tag', $args['clanTag']);
    update_post_meta($post_id,'club_owner', get_user_meta(get_current_user_id(),'msa_xuid',true));
    update_post_meta($post_id,'language', $args['language']);
    update_post_meta($post_id,'activity_level', $args['activityLevel']);
    update_post_meta($post_id,'average_skill_level', $args['averageSkill']);
    update_post_meta($post_id,'visibility', $args['visibility']);
    update_post_meta($post_id,'daily_message', $args['dailyMessage']);
    update_post_meta($post_id,'daily_message_date', date('F j, Y'));
    update_post_meta($post_id,'manifesto',$args['manifesto']);
    update_post_meta($post_id,'logo_background_url', $args['ClanLogoBackground']);
    update_post_meta($post_id,'logo_background_clan', $args['ClanLogoBackgroundID']);
    update_post_meta($post_id,'logo_shield_url', $args['ClanLogoShield']);
    update_post_meta($post_id,'logo_shield_clan', $args['ClanLogoShieldID']);
    update_post_meta($post_id,'logo_icon_url', $args['ClanLogoIcon']);
    update_post_meta($post_id,'logo_icon_clan', $args['ClanLogoIconID']);
    update_post_meta($post_id,'background_image_url', $args['ClanBackgroundImage']);
    update_post_meta($post_id,'background_image_clan', $args['ClanBackgroundImageID']);
    update_post_meta($post_id,'cdn_logo', $args['ClubLogo']);
    update_post_meta($post_id,'cdn_BG', $args['ClubBG']);


    return $post_id;

  }
    
}
