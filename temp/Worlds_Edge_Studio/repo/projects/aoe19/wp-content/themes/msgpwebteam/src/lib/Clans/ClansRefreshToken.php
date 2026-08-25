<?php

namespace Roots\Clans;
use WP_Query;

class ClansRefreshToken  {
  public function __construct()
  {
   //Not using 
  }
  
  static public function checkExpired($url){
    $user_id = get_current_user_id();
    $lastLogin = strtotime(get_user_meta($user_id,'_last_login',true)[0]);
    $tokenExpired = strtotime("-4 hours");

    if(!($lastLogin >= $tokenExpired)){
      //Disabled until SESSIONS working
			self::refreshExpired($url,$user_id);
    } 
  }
  
  static private function refreshExpired($url,$user_id){
		session_start();
		$_SESSION['MSA_PAGE_REDIRECT'] = $url;
    $client_id = \MSAauth\Utilities\Helpers::get_option('msa_clientId');
        
    update_user_meta($user_id, '_last_login', [date("Y-m-d H:i:s")]);
		update_user_meta($user_id, '_current_login', date("Y-m-d H:i:s"));

    wp_redirect('https://auth.ageofempires.com/?env=dev');

    exit();
  }
  
 
}
