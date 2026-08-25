<?php

namespace Roots\Urls;

use WP_Query;

class ShortUrlAdmin
{

  static $base_url = 'https://aoe.ms/';

  	public function __construct()
  	{
	    add_action( 'admin_menu', [$this,'shorturl_admin_menu'] );
		add_action( 'wp_ajax_save_aoe_url', [$this, 'saveUrl'] );
		add_action( 'wp_ajax_delete_url', [$this, 'deleteUrl'] );   
  	}
	
  	function shorturl_admin_menu() {
    	add_management_page( 'Aoe.ms Urls', 'Aoe.ms Urls', 'edit_posts', 'shorturl-admin', [$this,'shorturl_options'] );
  	}
	
	function urlAPI($url,$data,$method){

      	$output = new \stdClass;
 
		$headers = [ 
	        'Accept: application/json',
	        'Content-Type: application/json',
	        'access-control-allow-credentials: true'
    	];
		
      	$ch = curl_init($url);
      	$a = array_replace([
			CURLOPT_CUSTOMREQUEST => $method,
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
      
      	$output->code = curl_getinfo($ch,CURLINFO_HTTP_CODE);
        $output->response = json_decode($result);      	

      	curl_close($ch);

      	return $output;
		
	}	
	
	function getUrlList(){
		$url = self::$base_url . 'list';
	
		return $this::urlAPI($url,'','GET');
	}
	
	function saveUrl(){
		$url = self::$base_url . 'update';
			
		$data = [
			"id" => $_POST['urlId'],
			"ShortUrl" => $_POST['shortUrl'],
			"LongUrl" => $_POST['longUrl'],
			"isEditable" => $_POST['isEditable'] == true
		];			
		error_log(print_r($data,true));
		$response = $this::urlAPI($url,$data,'POST');

		$response->successful = false;
		$response->error = 'The call was not successfull';
		switch ($response->code) {
			case 200:
				$response->successful = true;
				$response->error = '';
				break;
			case 400: 
				$response->error = 'The short url selected is in use. Please try a different option.';
				break;
			case 401:
				$response->error = 'Unauthorized! Please try logging out and back in and try again.';
				break;
			case 404:
				$response->error = 'Url generation failed. Please try saving again or provide a short url value.';
				break;
			default:
				$response->error = "That didn't work. Awkward. Please check your entries and try again.";
				break;		
		}

		echo json_encode($response);
		
		die();
	}
	
	function deleteUrl(){
		$url = self::$base_url . 'remove';
		$data = [
			"ShortUrl" => $_POST['shortUrl']
		];

		$response = $this::urlAPI($url,$data,'DELETE');
		if($response->code == 200){
			$response->successful = true;
		} else {
			$response->successful = false;
			$response->error = 'The call was not successfull';
			error_log('The call to Url API was not successful, code: '.$response->code);
		}
		
		echo json_encode($response);
		
		die();
	}

  function shorturl_options() {
    if ( !current_user_can( 'edit_pages' ) )  {
      wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
    }
		
	$urlResults = $this::getUrlList();
	
	$urlList = $urlResults->response;

	$currentUrlDetails = null;	
		
    echo '<div class="wrap" id="url-listing">';
		echo '<h1>Short Urls - <a class="add_url" href="">Add New</a></h1>';
		
		echo '<table class="manage_urls" id="url_table">';
		echo '<thead>';
		echo '<tr>';
			echo '<th>Short Url</th>';
			echo '<th>Long Url</th>';
			echo '<th>Visit Count</th>';
			echo '<th>Last Visit</th>';
			echo '<th>Last Update</th>';
			echo '<th>Owner</th>';
			echo '<th>Actions</th>';
		echo '</tr>';
		echo '</thead>';

		echo '<tbody class="short_urls">';
		$date_min = '01-01-0001 00:00:00';
    	if (count($urlList) > 0) {
		  	foreach($urlList as $shortUrl){
				$visitdate = date_format(date_create($shortUrl->lastVisit), 'm-d-Y H:i:s');
				$visitdate = ($visitdate == $date_min ? 'Never' : $visitdate);
				$updatedate = date_format(date_create($shortUrl->updated), 'm-d-Y H:i:s');
				$updatedate = ($updatedate == $date_min ? 'Never' : $updatedate);
				$shortFull1Url = 'https://aoe.ms/'.$shortUrl->shortUrl;
				echo '<tr data-urlid="'.$shortUrl->id.'">';
				echo '<td><a href="'.$shortFull1Url.'" target="_blank">'.$shortUrl->shortUrl.'</a></td>';
				echo '<td width="200">'.$shortUrl->longUrl.'</td>';
				echo '<td>'.$shortUrl->visitCount.'</td>';					
				echo '<td>'.$visitdate.'</td>';													
				echo '<td>'.$updatedate.'</td>';
				echo '<td>'. (empty($shortUrl->ownerName) ? 'n/a' : $shortUrl->ownerName) .'</td>';		
				echo '<td>';
				if ($shortUrl->isEditable == true || $shortUrl->isOwner == true) {
					echo '<a class="edit_url" href="">Edit</a> | ';
				}
				if ($shortUrl->isOwner) {
					echo '<a class="delete_url" href="">Delete</a> | ';
				}
				echo '<a href="" class="copy_url">Copy Url</a> <input type="text" class="ShortUrlCopy hidden" value="'.$shortFull1Url.'" /><span class="urlCopyMessage"></span></td>';				
				echo '</tr>';
		  	}
    	}
		echo '</tbody>';
		echo '</table>';
    echo '</div>';

    //details dialog
    echo '<div class="js-overlay" style="display: none; background: #000; opacity: 0.7; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 100050;"></div>';
    
	echo '<div class="js-add-edit-dialog" style="display: none;width: 30em; max-width: 80%; max-height: 80%; overflow: auto; padding: 1.5em 2em; position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); background: #fcfcfc; box-shadow: 0 2px 6px rgba(0,0,0,0.3); z-index: 100050;">';
		echo '<h2>Url Details</h2>';
		echo 'Short Url Path, aoe.ms/ <input type="textbox" id="ShortUrl" /><br />(Leave blank for auto-generated url.)<br /><br />';
		echo 'Long Url: <input type="textbox" id="LongUrl" style="width: 80%" /><br /><br />';
		echo '<input type="checkbox" id="isEditable" /> Allow others to edit<br /><br />';
		echo '<input type="hidden" id="UrlId" value="" />';
		echo '<button type="button" class="js-modal-save" style="float: right; cursor: pointer;">Save</button> <button type="button" data-is-edit="false" class="js-modal-close" style="float: right; cursor: pointer;">Close</button>';
		echo '<div id="UrlResult"></div>';
	echo '</div>';
  }

}
