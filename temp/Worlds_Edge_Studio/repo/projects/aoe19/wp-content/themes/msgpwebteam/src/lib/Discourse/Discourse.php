<?php

namespace Roots\Discourse;

define("DISCOURSE_ENV_URL", "https://forums-dev.ageofempires.com");

use Roots\AzureResource\AzureResource;

class Discourse
{

    public function __construct()
    {
        $this->includes();

        add_filter('publish_post',[$this,'create_discussion'],10,2);
    }

    private function includes() {
        require_once('Methods');
    }

    public static function create_discussion($post_ID,$post){

        if ( 'post' !== $post->post_type || isset($post->discourse_topic_url)){
            return;
        }

        $headers = [
            "Api-Key: " . AzureResource::get_key('Discourse--ApiKey--Dev'),
            "Api-Username: " . AzureResource::get_key('Discourse--ApiUsername--Dev'),
            "Content-Type: application/json"
        ];

        $data = [
            "title"     => $post->post_title,
            "raw"       => $post->post_content,
            "category"  => 6
        ];

        $response = Methods::postAPI(DISCOURSE_ENV_URL . "/posts.json",json_encode($data),[],$headers);

        if($response['code'] == 200){
            $decoded = json_decode($response['response']);
            update_post_meta($post_ID,'discourse_topic_url',DISCOURSE_ENV_URL . '/t/' . $decoded->topic_id);
        } else {
            error_log(json_encode($response));
        }

    }
}