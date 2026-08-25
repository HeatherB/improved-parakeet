<?php

namespace Roots\Controllers;
use WP_Query;

class ArchiveCivilizationsController
{
  public function __construct() {
    add_filter( 'sage/template/post-type-archive-civilizations/data', [$this, 'civs_archive_page'] );
    add_filter( 'pre_get_document_title', [$this, 'new_cpt_archive_title'], 20 );
  }

  private function civ_sub_menu_id($wp) {
    $get_game_name = GameController::get_game_name();
    
    $civ_sub_menus_cpt_url = get_post_type_archive_link('civ_sub_menus') . $get_game_name . '/' . $get_game_name . '/';
    
    $civ_sub_menu_id = url_to_postid($civ_sub_menus_cpt_url);

    return $civ_sub_menu_id;
  }

  public function civs_archive_page() {
    global $wp;

    $civ_sub_menu_id = $this->civ_sub_menu_id($wp);
    $civs_archive_page_arr = get_fields($civ_sub_menu_id);

    $data['civs_archive_page'] = array(
        'civ_sub_menu_id'       => $civ_sub_menu_id,
        'build_civs_sub_nav'    => $civs_archive_page_arr['build_civilizations_sub_nav'],
        'civs_sub_nav_lg_img'   => $civs_archive_page_arr['civs_sub_nav_lg_img'],       
        'civs_sub_nav_heading'  => $civs_archive_page_arr['civilizations_sub_nav_heading'],
        'civs_sub_nav'          => $civs_archive_page_arr['civilizations_sub_nav'],
    );

    return $data;
  }

  public function new_cpt_archive_title($title){

    if ( is_archive() ){
      global $wp;

      $civ_sub_menu_id = $this->civ_sub_menu_id($wp);
      $civ_sub_menus_post_type_title = get_the_title($civ_sub_menu_id);
   
      $title = $civ_sub_menus_post_type_title;
      $title = esc_attr($title . ' &#8211; ' . get_bloginfo('name'));

      return $title;
    }
  }
 
}
