<?php

  namespace Roots\Clans;

  use WP_Query;

  class ClansBannerPosters {
    public function __construct()
    {
      add_action( 'wp_ajax_banner_posters', [$this, 'get_banner_posters'] );
      add_action( 'wp_ajax_nopriv_banner_posters', [$this, 'get_banner_posters'] );
    }
    public function get_banner_posters() {
      $lgb_args = array(
        'post_type' => 'banner_posters',
        //'post_type' => 'logo_backgrounds',
        "posts_per_page" => -1,
      );
      $lbg_query = new WP_Query($lgb_args);
//      var_dump($lbg_query);
//      die();
      $temp = [];
      $data = [];
      while ($lbg_query->have_posts()) : $lbg_query->the_post();
          $obj = get_field('background_poster');

          $href_arr = wp_get_attachment_image_src($obj['ID'], false);
          $arr = [];
          $arr['postID'] = get_the_ID();
          $arr['href'] = $href_arr[0];
          array_push($temp, $arr);
      endwhile;
      $data['bannerPosters'] = $temp;
      header('Content-Type: application/json');
      echo json_encode($data);
      die();
    }
  }