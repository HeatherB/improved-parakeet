<?php

namespace Roots\Clans;

use WP_Query;

class ClansBackgroundImages  {
  public function __construct()
  {
    add_action( 'wp_ajax_background_images', [$this, 'get_background_images'] );
    add_action( 'wp_ajax_nopriv_background_images', [$this, 'get_background_images'] );
  }
  public function get_background_images() {
    $args = array(
      'post_type' => 'background_images',
      "posts_per_page" => -1,
    );
    $query = new WP_Query($args);
//      var_dump($lbg_query);
//      die();
    $temp = [];
    $data = [];
    while ($query->have_posts()) : $query->the_post();
      $obj = get_field('background_image');
      $href_arr = wp_get_attachment_image_src($obj['ID'], false);
      $arr = [];
      $arr['postID'] = get_the_ID();
      $arr['href'] = $href_arr[0];
      array_push($temp, $arr);
    endwhile;
    //$data['backgroundImages'] = $temp;
    $data = $temp;
    header('Content-Type: application/json');
    echo json_encode($data);
    die();
  }
}