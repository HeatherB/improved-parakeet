<?php

namespace Roots\Controllers;

class FlightVideos
{

    public function __construct()
    {
        add_action('wp_ajax_getFlightVideos', [$this, 'get_flight_videos']);
        add_action('wp_ajax_getVideoByID', [$this, 'get_video_by_id']);
    }

    static public function get_video_by_id(){

        $video_id       = $_POST['video_id'];
        $video_nonce    = $_POST['nonce'];

       if(empty($video_id) || !wp_verify_nonce($video_nonce, 'video_nonce')){
            return;
       }

        $video = get_post($video_id);

        $response = [
            "video_name" => $video->post_title,
            "stream_src" => $video->stream_path,
            "video_poster" => wp_get_attachment_image_src($video->_thumbnail_id, 'full' )[0],
            "video_id" => $video->ID,
            "caption_src" => $video->caption_src,
        ];

        echo json_encode($response);

        wp_die();

    }

    static public function get_flight_videos()
    {

        $response = [];

        $termID     = $_POST['termID'] ?? '';
        $categoryID   = $_POST['category'] ?? '';

        $args = [
            'post_type' => 'flight_videos',
            'post_status' => 'publish',
            'posts_per_page' => -1,
            'tax_query' => [
                'relation' => 'and',
                [
                    'taxonomy' => 'flights',
                    'field' => 'term_id',
                    'terms' => [$termID],
                    'operator' => 'IN',
                ],
                [
                    'taxonomy' => 'flight_categories',
                    'field' => 'term_id',
                    'terms' => [$categoryID],
                    'operator' => 'IN',
                ]
            ]
        ];

        $flight_videos = new \WP_Query($args);

        foreach ($flight_videos->posts as $flight_video) {

            $video = [
                "video_name" => $flight_video->post_title,
                //"video_src" => $flight_video->cdn_path,
                "stream_src" => $flight_video->stream_path,
                "video_poster" => wp_get_attachment_image_src($flight_video->_thumbnail_id, 'full' )[0],
                "video_id" => $flight_video->ID
            ];

            array_push($response, $video);
        }

        echo json_encode($response);

        wp_die();

    }


}