<?php

/**
 * Text Moderation
 */

namespace Roots\TextModeration;

class TextModeration
{

    static private $userObj;
    static private $header;

    function __construct()
    {
        // Setup
        $this->getIncluded();

        // WP Filters
        add_filter( 'wp_insert_comment', [$this, 'comment_filter'] );

        // Ajax Functions
        add_action('wp_ajax_profanityFilter',[$this, 'profanity_filter']);

    }

    private function getIncluded()
    {
        require_once('Config.php');
        require_once('Methods');
    }


    static public function comment_filter($comment_ID) {

        $userObj    = wp_get_current_user();
        $comment    = get_comment($comment_ID);

        $header   = [            
            "Cookie: " . $_SERVER['cookie'],
            "Content-Type: application/json",
            "Accept: application/json"
        ];

        $data = [
            "conversationId"    => $comment->comment_ID,
            "textContent"       => wp_strip_all_tags( $comment->comment_content,false),
            "textType"          => 'comment',
            "includeResponse"   => true
        ];

        $response = Methods::postAPI(Config::APIURL,json_encode($data),[],$header);
        if($response['code'] == 200) {
            $decoded = json_decode($response['response']);
            $comment_text = $decoded->moderatedText;
            if(!empty($comment_text)) {

                wp_update_comment([
                    "comment_ID" => $comment->comment_ID,
                    "comment_content" => wpautop($comment_text, true)
                ]);
            } else {
                wp_delete_comment($comment_ID, false);
            }
        } else {
            error_log('TextModeration ERROR:(comment_fi8lter) Response:' . json_encode($response['response']));
            wp_delete_comment($comment_ID, false);
        }

    }


    static public function profanity_filter()
    {

        $userObj  = wp_get_current_user();
        $header   = [            
            "Cookie: " . $_SERVER['cookie'],
            "Content-Type: application/json",
            "Accept: application/json"
        ];

        $data = [
            "conversationId"    => $_REQUEST['conversationId'],
            "textContent"       => $_REQUEST['textContent'],
            "textType"          => $_REQUEST['textType'],
            "includeResponse"   => true
        ];

        $response = Methods::postAPI(Config::APIURL,json_encode($data),[],$header);
        if($response['code'] == 200) {
            $return_value = json_decode($response['response']);
            $return_value->validationPass = false;
            foreach($return_value as $key => $value){
                if($key === Config::ALLOW && $value === "Allow"){
                    $return_value->validationPass = true;
                }
            }

        } else {
            error_log('TextModeration ERROR:(profanity_filter) Response: ' . json_encode($response['response']));
            echo json_encode($return_value["message"] = $response['response']);
        }

        echo json_encode($return_value);

        wp_die();
    }

}
