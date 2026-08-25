<?php

namespace Roots\Clans;

use WP_Query;

class ClansLogoIcons  {
  public function __construct()
  {
    add_action( 'wp_ajax_logo_icons', [$this, 'get_logo_icons'] );
    add_action( 'wp_ajax_nopriv_logo_icons', [$this, 'get_logo_icons'] );
  }
  public function get_logo_icons() {
    $args = array(
      'post_type' => 'logo_icons',
      "posts_per_page" => -1,
    );
    $query = new WP_Query($args);
//      var_dump($lbg_query);
//      die();
    $temp = [];
    $data = [];
    while ($query->have_posts()) : $query->the_post();
      $obj = get_field('logo_icon');

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