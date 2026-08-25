<?php

namespace Roots\Clans;
use WP_Query;

class ClansExistingCheck  {

    public function __construct()
    {
        add_action( 'wp_ajax_clans_check_exists', [$this, 'check_exists'] );
        add_action( 'wp_ajax_nopriv_clans_check_exists', [$this, 'check_exists'] );

        add_action( 'wp_ajax_clans_clan_exists', [$this, 'clan_exists'] );
        add_action( 'wp_ajax_nopriv_clans_clan_exists', [$this, 'clan_exists'] );
    }
  
    function check_exists() {
        $metaKey = $_POST['metakey'];
        $metaValue = $_POST['metavalue'];
        $clanId = $_POST['clanId'];

        $args = [
            'post_type' => 'clans',
            'post_status' => 'publish',
            'post__not_in' => [$clanId],
            'meta_key' => $metaKey,
            'meta_value' => $metaValue,
        ];

        $the_query = new \WP_Query($args);

        if ($the_query->have_posts()) {
            $response['success'] = true;
        } else {
            $response['success'] = false;
        }

        echo json_encode($response);

        die();
    }

    function clan_exists()
    {
        $title = $_REQUEST['ClanName'];

        if (post_exists($title)) {
            $response['success'] = true;
        } else {
            $response['success'] = false;
        }

        echo json_encode($response);

        die();
    }
  
 
}