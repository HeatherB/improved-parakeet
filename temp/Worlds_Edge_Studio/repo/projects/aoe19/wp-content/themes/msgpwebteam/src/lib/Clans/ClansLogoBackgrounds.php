<?php

namespace Roots\Clans;

use WP_Query;

class ClansLogoBackgrounds  {
  public function __construct()
  {
    add_action( 'wp_ajax_logo_backgrounds', [$this, 'get_logo_backgrounds'] );
    add_action( 'wp_ajax_nopriv_logo_backgrounds', [$this, 'get_logo_backgrounds'] );
  }
  public function get_logo_backgrounds() {
    $args = array(
      'post_type' => 'logo_backgrounds',
      "posts_per_page" => -1,
    );
    $query = new WP_Query($args);
//      var_dump($lbg_query);
//      die();
    $temp = [];
    $data = [];
    while ($query->have_posts()) : $query->the_post();
      $obj = get_field('logo_background');

      $href_arr = wp_get_attachment_image_src($obj['ID'], false);
      $arr = [];
      $arr['postID'] = get_the_ID();
      $arr['href'] = $href_arr[0];
      array_push($temp, $arr);
    endwhile;
    //$data['logoIcons'] = $temp;
    $data = $temp;
    header('Content-Type: application/json');
    echo json_encode($data);
    die();
  }
}