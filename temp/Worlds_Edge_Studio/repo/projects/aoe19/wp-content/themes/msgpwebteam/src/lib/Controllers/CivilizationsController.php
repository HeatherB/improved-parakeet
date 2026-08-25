<?php

namespace Roots\Controllers;
use WP_Query;

class CivilizationsController
{
  public function __construct() {
    add_filter( 'sage/template/single-civilizations/data', [$this, 'civs_page'] );
  }

  public function civs_page() {
    global $post;

    $civs_page_arr = get_fields($post->ID);

    $data['civs_page'] = array(
      'post_id'                    => $post->ID,
      'display_content_area'       => $civs_page_arr['display_content_area'],
      'civs_sub_nav_post_type_url' => $civs_page_arr['civilizations_sub_nav_built_from_url'],
      'content_area'               => $civs_page_arr['content_area'],
      'display_carousels'          => $civs_page_arr['display_carousels'],
      'carousel'                   => $civs_page_arr['carousel'],
      'display_dynasties'          => $civs_page_arr['display_dynasties'],
      'dynasty_section'            => $civs_page_arr['dynasty_section'],
    );

    return $data;
  }

}