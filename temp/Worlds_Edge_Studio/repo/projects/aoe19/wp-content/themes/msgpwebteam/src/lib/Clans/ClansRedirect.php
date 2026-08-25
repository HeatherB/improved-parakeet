<?php

namespace Roots\Clans;
use \WP_Query;

class ClansRedirect {

  public static function redirectTag(){
    $incoming = get_bloginfo('url') . $_SERVER['REQUEST_URI'];
    $tag = basename($incoming);
    
    $args = [
      'post_type' => 'clans',
      'post_status' => 'publish',
      'meta_key' => "clan_tag",
      'meta_value' => $tag,
    ];
    
    $the_query = new \WP_Query($args);
    
    if ($the_query->have_posts()) {
      header('Location: '. $the_query->posts[0]->guid);
    } 
    
    
  }

}