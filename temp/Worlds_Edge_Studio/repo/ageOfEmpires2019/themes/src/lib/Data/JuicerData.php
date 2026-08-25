<?php
namespace Roots\Data;
use \Datetime;

class JuicerData {

  public function __construct() {
    add_action('wp_ajax_get_aoe_social', array( $this, 'get_social' ));
    add_action('wp_ajax_nopriv_get_aoe_social', array( $this, 'get_social') );
  }

  function get_social() {



    $responseHtml = '';

    // Juicer Feed Account Name
    $juicer_feed_name = 'ageofempires';

    // List of Juicer social media accounts to Loop Through
    $juicer_feed_social_accounts = array('Twitter', 'Facebook');

    // Number of feed items to return per social media account
    $juicer_filter_per_page = 8;

    // The page number of the feed results to return
    $juicer_filter_page_number = 1;

    // create array to hold social posts info
    $arrJuicerSocialPosts = []; // holds objects
    $arrJuicerSocialPostsIDs = []; // holds custom IDs for objects which can be chronilogically sorted
    // --------------------------------------------------------------------------------------------------

    foreach ($juicer_feed_social_accounts as $juicer_feed_social_account) {

      $juicer_feeds_api_url = 'https://www.juicer.io/api/feeds/'; // Juicer feeds api to gather json data
      $juicer_feeds_api_filters = '?filter='.$juicer_feed_social_account.'&per='.$juicer_filter_per_page.'&page='.$juicer_filter_page_number;
      $juicer_json_url = $juicer_feeds_api_url . $juicer_feed_name . $juicer_feeds_api_filters;
      $juicer_json = file_get_contents($juicer_json_url);
      $juicer_jsondecode = json_decode($juicer_json, true);
      $juicer_items_count = count($juicer_jsondecode['posts']['items']);

      // example feed:  https://www.juicer.io/api/feeds/channel_name?filter=Twitter&per=4&page=1


      // loop through number of items and output
      for ($i = 0; $i < $juicer_items_count; $i++) {
        $juicer_source = $juicer_jsondecode['posts']['items'][$i]['source']['source']; // Source
        $juicer_source_term = $juicer_jsondecode['posts']['items'][$i]['source']['term']; // username
        $juicer_image = $juicer_jsondecode['posts']['items'][$i]['image']; // Image
        $juicer_message = $juicer_jsondecode['posts']['items'][$i]['message']; // Message
        $juicer_unformatted_message = $juicer_jsondecode['posts']['items'][$i]['unformatted_message']; // Message Unformatted
        $juicer_poster_image = $juicer_jsondecode['posts']['items'][$i]['poster_image']; // Avatar Image
        $juicer_external_created_at = new DateTime($juicer_jsondecode['posts']['items'][$i]['external_created_at']); // Post Date converted to real time
        $juicer_external_created_at_formatted = $juicer_external_created_at->format('d M Y'); // Post Date formatted
        $juicer_poster_url = $juicer_jsondecode['posts']['items'][$i]['poster_url']; // Link to Account
        $juicer_full_url = $juicer_jsondecode['posts']['items'][$i]['full_url']; // Link to post
        $juicer_id = $juicer_jsondecode['posts']['items'][$i]['id']; // post id
        $socialPostID = $juicer_external_created_at->format('Y-m-d-H-i-s') . '-' . $juicer_id; // post date + id

        // check to see if we have an image, else use default
        if(!$juicer_image){
          $juicer_image = 'https://msgpwebcdn.azureedge.net/ageofempires/wp-content/uploads/2015/06/AOE2_boxdesktop.jpg';
        }

        // create a new social post record with source, id, poster name, and post date time YYYYMMDDHHMMSS, account name
        $arrJuicerSocialPosts[$socialPostID] = new JuicerSocialPost($juicer_source,$juicer_source_term,$juicer_image,$juicer_message,$juicer_unformatted_message,$juicer_poster_image,$juicer_external_created_at_formatted,$juicer_poster_url,$juicer_full_url);

        // record the custom post id so we can sort it out later
        array_push($arrJuicerSocialPostsIDs,$socialPostID);

      }


    } // end foreach $juicer_feed_social_accounts

    // Sort the array
    //sort($theArray);

    // Reverse the array so larger items first in list
    rsort($arrJuicerSocialPostsIDs);
    foreach ($arrJuicerSocialPostsIDs as $key => $val) {
      $responseHtml .= $arrJuicerSocialPosts[$val]->juicerSocialPostDisplay();
      //die(var_dump($arrJuicerSocialPosts));
    }    
    die($responseHtml);
  }
}

// Items needed
// -----------------------------------
// Source = [source][source] ($juicer_source)
// Username = [source][term] ($juicer_source_term)
// Image = [image] ($juicer_image)
// Message = [message] ($juicer_message)
// Avatar Image = [poster_image] ($juicer_poster_image)
// Post Date = [external_created_at] ($juicer_external_created_at_formatted)
// Link to Account = [poster_url] ($juicer_poster_url)
// Link to post = [full_url] ($juicer_full_url)
// CSS Class for post = ($juicer_social_account)
// -----------------------------------

// create class
class JuicerSocialPost {
  public $j_source;
  public $j_source_term;
  public $j_image;
  public $j_message;
  public $j_unformatted_message;
  public $j_poster_image;
  public $j_external_created_at_formatted;
  public $j_poster_url;
  public $j_full_url;


  // assign values
  public function __construct($j_source,$j_source_term,$j_image,$j_message,$j_unformatted_message,$j_poster_image,$j_external_created_at_formatted,$j_poster_url,$j_full_url) {
    $this->jsource = $j_source;
    $this->jsourceterm = $j_source_term;
    $this->jimage = $j_image;
    $this->jmessage = $j_message;
    $this->junformattedmessage = $j_unformatted_message;
    $this->jposterimage = $j_poster_image;
    $this->jexternalcreatedatformatted = $j_external_created_at_formatted;
    $this->jposterurl = $j_poster_url;
    $this->jfullurl = $j_full_url;

  }

  // method to output formatted social item
  public function juicerSocialPostDisplay(){
    //die($this->jmessage);
    $social_source = strtolower($this->jsource);
    $message_text = $this->jmessage;
    // strip tags
    $message_text = strip_tags($message_text,"<a>");
    // replace links with predefined fake link text
    $message_text = preg_replace('/<a .*?>(.*?)<\/a>/','',$message_text);
    // check length for anything beyond 140 charcters
    $message_text_length = strlen($message_text);
    if($message_text_length > 140){
      $message_text = mb_strimwidth($message_text, 0, 143, "...");
    }
    $message_text = '<p>'.$message_text.'</p>';
    // UNFORMATTED Message if needed later
    //$unformatted_message_text = $this->junformattedmessage;
    //$message_text = $unformatted_message_text;

    // construct the social post
    $jsocialpost =  '<div class="community-connections__content" data-social-account="'.$social_source.'">'
            . '  <div class="social__container background--rock">'
            . '    <div class="social__content-wrapper">'
            . '      <span class="social-icon-background"></span>'
            . '      <span class="social-icon fa fa-' .$social_source. '" aria-hidden="true"></span>'
            . '      <a class="social__content-link" href="' .$this->jfullurl. '">'
            . '        <div class="image__container" style="background-image: url(' .$this->jimage. ');"></div>'
            . '        <div class="message__container">' . $message_text . '</div>'
            . '      </a>'
            . '      <div class="info__container">'
            . '        <a href="' . $this->jposterurl . '" class="avatar__container">'
            . '          <img src="' . $this->jposterimage . '" />'
            . '        </a>'
            . '        <a href="' . $this->jposterurl . '" class="social-username">' . $this->jsourceterm . '</a>'
            . '      </div>'
            . '      <span class="social-post-date">' . $this->jexternalcreatedatformatted . '</span>'
            . '    </div>'
            . '  </div>'
            . '</div>';

    return $jsocialpost;
  }
}
  
?>