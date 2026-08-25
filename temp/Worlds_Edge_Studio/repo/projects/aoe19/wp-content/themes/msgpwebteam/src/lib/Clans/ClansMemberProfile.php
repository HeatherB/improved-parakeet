<?php

namespace Roots\Clans;


class ClansMemberProfile
{
 
  public function __construct()
  {
    add_action( 'wp_ajax_clansMemberProfile', [$this, 'clansMemberProfile'] );
  }
  
  public static function clansMemberProfile(){
    
    $action = $_POST['profileAction'];
    $userObj = wp_get_current_user();

    
    switch($action){
      case 'updateMemberProfile':
        
        $activityLevel = update_user_meta($userObj->ID,'member_activity_clan_',$_POST['activityLevel']);
        $skillLevel = update_user_meta($userObj->ID,'member_skill_clan_',$_POST['skillLevel']);
        
        if(($activityLevel && $skillLevel) || (!empty($activityLevel) && !empty($skillLevel))){
          $response = [
            "success" => true,
          ];
        } else {
          $response = [
            "success" => false,
            "reason" => 'could not submit values '  . $activityLevel . ' : ' . $skillLevel,
          ];
        }
        
      case 'getMemberProfile':
        $activityLevel = $userObj->member_activity_clan_;
        $skillLevel = $userObj->member_skill_clan_;

        if(!empty($activityLevel) && !empty($skillLevel)){
          $response = [
            "success" => true,
            "skillLevel" => $skillLevel,
            "activityLevel" => $activityLevel
          ];
        } else {
          $response = [
            "success" => false,
            "reason" => 'could not retrieve values',
          ];
        }
    }

    echo json_encode($response);

    wp_die();
  }

}

