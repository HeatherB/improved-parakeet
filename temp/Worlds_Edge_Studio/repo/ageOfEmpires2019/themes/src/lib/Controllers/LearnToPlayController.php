<?php

namespace Roots\Controllers;

class LearnToPlayController
{

    public function __construct(){
        //add_filter('sage/template/single-learn_to_play/data', [$this, 'buildProgress']);
       // add_filter('sage/template/learn_to_play-template-default/data', [$this, 'buildProgress']);
         //add_filter( 'wp', [$this, 'build_lang_verions_of_nav'],  10, 0);
       // add_action('init', [$this, 'register_poly_strings'],  10, 0);
    }

    /* learn to play */
    /* progress tracking for logged-in users */
    public function find_loggedin_user() {
       // if (strpos($_SERVER['REQUEST_URI'], '/learn-to-play')) {
           // if(is_user_logged_in()){
                $user = wp_get_current_user();
                $data['ltpuser'] = $user;
                //$this_user_id = get_current_user_id();
                //return $this_user_id;
                return $data;
            //}
       // }

            /*

            $resultArgs = array(
                "creationDate" => $apiResponse->created,
                "clubOwner" => $apiResponse->owner,
                "clubId" => $apiResponse->id
            );
      
           // $args = array_merge($originalArgs,$resultArgs);

            update_user_meta($userId,'club_id',$args['clubId']);

            */
    }

    public function buildProgress() {
        /* get the existing user data */
        if(!is_user_logged_in()){
          return;
      }

        $user_id = get_current_user_id();
        $ltp_progress = get_user_meta($user->ID, 'ltp_progress');

        /* create new empty */
       /* if(!$ltp_progress) {
            $initial_false = array_fill(0, count($ progress steps), false);
            $empty_progress = array_combine($ progress steps,$initial_false);
            update_user_meta( $user->ID, 'ltp_progress', $empty_progress);
            $ltp_progress = get_user_meta($user->ID, 'ltp_progress');
        }*/

        $data['ltp_progress'] = $ltp_progress;
        return $data;

 
    }

    
}