<?php
/**
 * Insider Options Page !Requires ACF
 */
namespace Roots\Insiders\Settings;

class Admin {

  public function __construct()
  {
    $this->setupACFOptions();
  }

  private function setupACFOptions(){

    if( function_exists('acf_add_options_page') ) {

      // add parent
      $parent = acf_add_options_page(array(
        'page_title' 	=> 'Insider Settings',
        'menu_title' 	=> 'Insiders',
        'menu_slug' 	=> 'insider-settings',
        'capability'	=> 'edit_posts',
        'redirect' 		=> false
      ));

      // add sub pages
      acf_add_options_sub_page(array(
        'page_title' 	=> 'Insider Survey Questions',
        'menu_title' 	=> 'Insider Survey Questions',
        'parent_slug' 	=> $parent['menu_slug'],
      ));

      acf_add_options_sub_page(array(
        'page_title'  => 'Insider NDA',
        'menu_title'  => 'Insider NDA',
        'parent_slug'   => $parent['menu_slug'],
      ));

    }

  }

}
