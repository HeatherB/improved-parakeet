<?php

namespace Roots\Clans;


class Languages {
    
    public function __construct(){
        add_action( 'wp_ajax_nopriv_get_languages', [$this, 'get_languages'] );
        add_action( 'wp_ajax_get_languages', [$this, 'get_languages'] );
    }

    static public function get_languages(){
        $languages = false;

        $url = 'https://service.ageofempires.com/api/Languages?gameId=' . "aoe";        
        
        $ch = curl_init($url);
        $a = array(
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_TIMEOUT => 60,
        );
       
        curl_setopt_array($ch, $a);
        $result = curl_exec($ch);
        if(curl_getinfo($ch,CURLINFO_HTTP_CODE) === 200){
            $languages = $result;
        }
        
        curl_close($ch);
    
        if($languages){
            echo json_encode($languages);
        }
        
        wp_die();
    }

}
