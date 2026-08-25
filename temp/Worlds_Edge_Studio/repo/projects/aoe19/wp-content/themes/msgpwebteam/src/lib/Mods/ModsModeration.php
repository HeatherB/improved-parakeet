<?php

namespace Roots\Mods;

use WP_Query;

class ModsModeration
{

  static $base_url = 'https://api-dev.ageofempires.com/api/v1/Mods/';

  	public function __construct()
  	{
	    add_action( 'admin_menu', [$this,'mods_moderation_menu'] );
		add_action( 'wp_ajax_delete_mod', [$this, 'deleteFlaggedMod'] );
		add_action( 'wp_ajax_unflag_mod', [$this, 'unflagMod'] );   
  	}
	
  	function mods_moderation_menu() {
    	add_management_page( 'Mods Moderation', 'Mods Moderation', 'edit_posts', 'mods-moderation', [$this,'mods_moderation_options'] );
  	}
	
	function modsAPI($url,$data){

      	$output = false;
 
		$headers = [ 
	        'Accept: application/json',
	        'Content-Type: application/json',
	        'access-control-allow-credentials: true'
    	];
		
      	$ch = curl_init($url);
      	$a = array_replace([
			CURLOPT_CUSTOMREQUEST => 'POST',
			CURLOPT_POSTFIELDS => json_encode($data),
			CURLOPT_RETURNTRANSFER => 1,
			CURLOPT_TIMEOUT => 30,
			CURLOPT_COOKIE => $_SERVER['HTTP_COOKIE'], 
      	]);

      	if(!empty($headers)){
          	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
      	}

      	curl_setopt_array($ch, $a);
      	$result = curl_exec($ch);
      
      	$output = [
        	"code" => curl_getinfo($ch,CURLINFO_HTTP_CODE),
        	"response" => $result
      	];

      	curl_close($ch);

      	return $output;
		
	}
	
	function getFlaggedMods(){
		$url = self::$base_url . 'GetFlagged';
		$data = [
			"start" => 1,
			"count" => 1000,
			"game" => 1,
			"filter" => 0,
			"status" => "",
			"sort" => "modName",
			"order" => "ASC"
		];
	
		return $this::modsAPI($url,$data);
	}
	
	function unflagMod($modId){
		$url = self::$base_url . 'Moderate';
		$data = [
			"id" => $_POST['modid'],
      "intValue" => 2
		];
		
		$response = $this::modsAPI($url,$data);
		
		if($response['code'] == 200){
			$response['successful'] = true;
		} else {
			$response['successful'] = false;
			$response['error'] = 'The call was not successfull';
			error_log('The call to Mods API was not successful');
		}

		echo json_encode($response);
		
		die();
	}
	
	function deleteFlaggedMod(){
		$url = self::$base_url . 'Moderate';
		$data = [
			"id" => $_POST['modid'],
      "intValue" => 4
		];

		$response = $this::modsAPI($url,$data);
		if($response['code'] == 200){
			$response['successful'] = true;
		} else {
			$response['successful'] = false;
			$response['error'] = 'The call was not successfull';
			error_log('The call to Mods API was not successful');
		}
		
		echo json_encode($response);
		
		die();
	}

  function mods_moderation_options() {
    if ( !current_user_can( 'edit_pages' ) )  {
      wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
    }
		
	$flaggedResults = $this::getFlaggedMods();
	
	$modList = json_decode($flaggedResults['response']);
	$flaggedMods = $modList->modList;

	$currentModDetails = null;
	
		
    echo '<div class="wrap" id="mods-listing">';
		echo '<h1>Flagged Mods</h1>';
		
		echo '<table class="manage_flagged" id="flagged_table">';
		echo '<thead>';
		echo '<tr>';
			echo '<th>Mod Name</th>';
			echo '<th>Mod Type</th>';
			echo '<th>Creator Name</th>';
			echo '<th>Creation Date</th>';
			echo '<th>Last Update</th>';
			echo '<th>Actions</th>';
		echo '</tr>';
		echo '</thead>';

		echo '<tbody class="flagged_mods">';

    	if (is_array($flaggedMods)) {
		  	foreach($flaggedMods as $flaggedMod){
				echo '<tr data-modid="'.$flaggedMod->modId.'">';
					echo '<td>'.$flaggedMod->modName.'</td>';
					echo '<td>'.$flaggedMod->modType.'</td>';
					echo '<td><a href="/stats/?gamertag='.$flaggedMod->creatorName.'" target="_blank">'.$flaggedMod->creatorName.'</a></td>';
					echo '<td>'.$flaggedMod->createDate.'</td>';
					echo '<td>'.$flaggedMod->lastUpdate.'</td>';
					echo '<td><a class="delete_mod" href="">Delete</a> | <a class="unflag_mod" href="">Unflag</a> | <a target="_blank" href="'.get_bloginfo('url').'/mods/details/'.$flaggedMod->modId.'/">View</a> | <a href="" class="get_details" style="white-space: nowrap;" data-mod-name="'. $flaggedMod->modName .'">Flag Details</a></td>';
				echo '</tr>';
		  	}
    	}
		echo '</tbody>';
		echo '</table>';
    echo '</div>';

    //details dialog
    echo '<div class="js-overlay" style="display: none; background: #000; opacity: 0.7; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 100050;"></div>';
    
	echo '<div class="js-details-dialog" style="display: none;width: 30em; max-width: 80%; max-height: 80%; overflow: auto; padding: 1.5em 2em; position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); background: #fcfcfc; box-shadow: 0 2px 6px rgba(0,0,0,0.3); z-index: 100050;">';
		echo '<h2>Flag Details for <span class="js-mod-name">no data available</span></h2>';
		echo '<p class="js-loading-message">Fetching details&hellip;</p>';
		echo '<div class="js-mod-detail-output"></div>';
		echo '<button type="button" class="js-modal-close" style="float: right; cursor: pointer;">Ok</button>';
	echo '</div>';
  }

}
