<?php

namespace Roots\Clans;

use WP_Query;

class ClansSave  {
  public function __construct()
  {
    add_action( 'wp_ajax_clans_details', [$this, 'clans_save'] );
    add_action( 'wp_ajax_nopriv_clans_details', [$this, 'clans_save'] );
    add_action( 'wp_ajax_clans_save', [$this, 'clans_save'] );
    add_action( 'wp_ajax_nopriv_clans_save', [$this, 'clans_save'] );
  }
  
  public $errors = array(
    'User is not logged in.'
  );

  public function render_error($error) {
    header('Content-Type: application/json');
    echo json_encode($error);
    die();
  }

  public function clans_save(){

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
		

    //Create Args
    $args = array(
      "clanName" => sanitize_text_field($_REQUEST['ClanName']),
      "clanMotto" => sanitize_text_field(stripslashes($_REQUEST['ClanMotto'])),
      "clanTag" => sanitize_text_field($_REQUEST['ClanTag']),
      "language" => sanitize_text_field($_REQUEST['ClanLanguage']),
      "visibility" => sanitize_text_field($_REQUEST['ClanVisibility']),
      "activityLevel" => sanitize_text_field($_REQUEST['ClanActivityLevel']),
      "averageSkill" => sanitize_text_field($_REQUEST['ClanAvgSkillLevel']),
      "applications" => sanitize_text_field($_REQUEST['ClanApplications']),
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
      "ClubLogo" => $logoImage,
      "ClubBG" => $clanBGImage,
    );
  
    //Create XBOX Club
    $result = \Clubs\services\Club::create_club($args);
    
    //WP Clan 
    $wp_club = 0;
    
    if($result['code'] == 200 || $result['code'] == 201){
      
      $apiResponse = json_decode($result['response']);

      $resultArgs = array(
        "creationDate" => $apiResponse->created,
        "clubOwner" => $apiResponse->owner,
        "clubId" => $apiResponse->id
      );
      
      $wpArgs = array_merge($args,$resultArgs);
			
      //Retry Count
      $retry = 5;
      
      //Create Club Profile
      $i = 0;
      do {
        $result_profile = \Clubs\services\Club::update_profile_club($wpArgs);
        sleep(2);
        $i++;
        
        if($result_profile['code'] === 200){
          break;
        }
        
      } while ($i < $retry );
      
      //Activity Feed
      $i = 0;
      do {
        $result_feed = \Clubs\services\Club::post_activity_feed($wpArgs);
        sleep(2);
        $i++;
        
        if($result_feed['code'] === 200){
          break;
        }
        
      } while ( $i < $retry );
      
      //Create Wordpress Club
      if(($result['code'] == 200 || $result['code'] == 201) && $result_profile['code'] == 200 && $result_feed['code'] == 200){
        $wp_club = $this->create_wp_club($wpArgs);        
      } else {
				sleep(5);
        $result = \Clubs\services\Club::delete_club($wpArgs['clubId']);
      }
    }
    
    if($wp_club != 0){
      $result['resultKey'] = 'ClanId';
      $result['resultValue'] = $wp_club;    

      echo json_encode($result);
      
    } else {
      error_log(json_encode('CLUBS CREATION FAILED: Creation was: ' . $result['code'] . ' Profile was: ' . $result_profile['code'] . ' Activity Feed was: ' .$result_feed['code'] ));
			$error = json_decode($result['response']);
			$result['error'] = $error->description;
			echo json_encode($result);
    } 
    

    die();  
  } 
    
  
  function create_wp_club($args) {

    $post_id = wp_insert_post(array(
      'post_type' => 'clans',
      'post_title' => $args['clanName'],
      'post_status' => 'publish',
    ));
    
    $userId = get_current_user_id();

    update_post_meta($post_id,'clan_motto', $args['clanMotto']);
    update_post_meta($post_id,'clan_tag', $args['clanTag']);
    update_post_meta($post_id,'club_owner', get_user_meta($userId,'msa_xuid',true));
    update_post_meta($post_id,'club_id', $args['clubId']);
    update_post_meta($post_id,'clan_creator', $args['clubOwner']);
    update_post_meta($post_id,'creationDate', $args['creationDate']);
    update_post_meta($post_id,'language', $args['language']);
    update_post_meta($post_id,'activity_level', $args['activityLevel']);
    update_post_meta($post_id,'average_skill_level', $args['averageSkill']);
    update_post_meta($post_id,'visibility', $args['visibility']);
    update_post_meta($post_id,'daily_message', $args['dailyMessage']);
    update_post_meta($post_id,'daily_message_date', date('F j, Y'));
    update_post_meta($post_id,'manifesto',$args['manifesto']);
    update_post_meta($post_id,'applications', $args['applications']);
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

    update_user_meta($userId,'club_id',$args['clubId']);
    update_user_meta($userId,'clan_assoc',$post_id);
    update_user_meta($userId,'member_role_clan_','founder');
    update_user_meta($userId,'owns_clan',$post_id);
    
    if(empty(get_user_meta($userId,'member_skill_clan_',true))){
      update_user_meta($userId,'member_skill_clan_','Beginner');
    }
    if(empty(get_user_meta($userId,'member_activity_clan_',true))){
      update_user_meta($userId,'member_activity_clan_','Weekly');
    }


    return $post_id;

  }
    
}
