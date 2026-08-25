<?php

namespace Roots\Clans;


class ClansRewrites {
  public function __construct()
  {
    add_filter( 'query_vars', [$this, 'prefix_register_query_var'] );
    add_action('init', [$this, 'clans_details_rewrite_tag'], 10, 0);
    // add_action('init', [$this, 'clans_details_rewrite'], 10, 0);
    add_action('init', [$this, 'clans_create_rewrite'], 10, 0);
    add_action('init', [$this, 'clans_edit_rewrite'], 10, 0);
    add_action('init', [$this, 'clans_single_rewrite_rules'], 10, 0);
    add_filter('post_type_link', [$this, 'translate_tags'], 10, 2);
  }

  public function prefix_register_query_var($vars) {
    $vars[] = 'clan_id';
    return $vars;
  }

  public function clans_details_rewrite_tag() {
    add_rewrite_tag('%clan_id%', '([^&]+)');
  }

  public function clans_details_rewrite() {
    // single page
    $page_id = get_page_id_by_title('Clans Single');
    add_rewrite_rule('^clans/details/([^\/]*)\/?$', 'index.php?page_id='. $page_id . '&clan_id=$matches[1]', 'top');
//    flush_rewrite_rules();
  }

  public function clans_create_rewrite() {
    // create page
    $page_id = get_page_id_by_title('Clans Create');
    add_rewrite_rule('^clans/create$', 'index.php?page_id='. $page_id, 'top');
//    flush_rewrite_rules();
  }

  public function clans_single_rewrite_rules() {
    // Define the custom permalink structure
    $structure = '/clans/details/%clan_id%';
    // Add the custom permalink structure to wordpess
    add_permastruct('clans', $structure, false);
    // Define the original query url that should be executed to grab the post
    $query = 'index.php?post_type=clans&p=$matches[1]';
    // Apply the query to be called when user bumps into this url pattern
    add_rewrite_rule('^clans/details/([^/]+)', $query, 'top');
  }

  public static function translate_tags($url, $post) {
    // Apply only for clans post type
    if ( $post->post_type == 'clans') {
      // If %clan_id% exists, then insert the original value
      if ( strpos($url, '%clan_id%') ) {
        return str_replace('%clan_id%', $post->ID, $url);
      }
    }
    return $url;
  }


  public function clans_edit_rewrite() {
    // edit page
    $page_id = get_page_id_by_title('Clans Edit');
    add_rewrite_rule('^clans/details/([^\/]*)\/edit/?', 'index.php?page_id='. $page_id . '&clan_id=$matches[1]', 'top');
//    flush_rewrite_rules();
  }
}
