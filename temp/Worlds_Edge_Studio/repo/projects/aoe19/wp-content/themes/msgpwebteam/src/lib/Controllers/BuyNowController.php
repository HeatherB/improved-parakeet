<?php

namespace Roots\Controllers;
use WP_Query;

class BuyNowController
{

  public $default_args = array(
    "post_type" => 'buy_now_pages',
    "post_status" => 'publish',
    "posts_per_page" => -1,
  );

  public $wp_fields = [
    'post_ID',
    'headline',
    'alternate_headline',
    'description',
    'featured_image_url',
    'is_featured',
    'featured_img_size',
    'lg_featured_img_gear_shop_btn',
    'minimum_system_requirements',
    'insider_signup',
    'pre_order',
    'steam',
    'windows',
    'windows_product_id',
    'include_xbox_game_pass_btn',
    'amazon',
    'gamestop',
    'expansions',
    'change_content_on_date_buy_now',
  ];

  public $exp_fields = [
    'headline',
    'description',
    'featured_image_url',
  ];

  public function __construct() {
    add_filter( 'sage/template/post-type-archive-buy_now_pages/data', [$this, 'buy_now_page'] );
  }

  public function featured() {
    // Featured game
    $args = array(
      "post_type" => 'buy_now_pages',
      "post_status" => 'publish',
      "posts_per_page" => -1,
      "order" => "ASC",
      "orderby" => 'title',
      'meta_query' => array(
        array(
          'key' => 'featured_game_product',
          'compare' => '==',
          'value' => 'featured',
        )
      )
    );
    $data = $this->game_products($args);
    return $data;
  }

  public function default_fn() {
    // Not the featured game (everything else)
    $args = array(
      "post_type" => 'buy_now_pages',
      "post_status" => 'publish',
      "posts_per_page" => -1,
      "meta_key"  => 'order',
      "orderby" => 'meta_value',
      "order" => 'ASC',
      'meta_query' => array(
        array(
          'key' => 'featured_game_product',
          'compare' => '==',
          'value' => 'default',
        )
      )
    );
    $data = $this->game_products($args);;
    return $data;
  }

  public function buy_now_page() {
    // Execute assets.xbox.com JS only on the /buy-now page
    wp_enqueue_script('purchaseHost.js', 'https://assets.xbox.com/xbox-store-web-sdk/latest/purchaseHost.js', null, null, true);

    $data['defaults'][] = $this->default_fn();
    $data['featured'][] = $this->featured();
    return $data;
  }

  public function game_products($args) {
    wp_reset_query();
    $loop = new WP_Query($args);
    $data = [];
    $temp = [];    
    while ($loop->have_posts()) : $loop->the_post();
      global $post;         
      foreach ($this->wp_fields as $field) {        
        $temp[$field] = call_user_func_array(array($this, $field), array($post->ID));
      };
      $data['posts'][] = $temp;
    endwhile;
    return $data;
  }

  public function post_ID($post_id) {
      return $post_id;
  }

  public function headline($post_id) {
    $title = get_the_title($post_id);
    return $title;
  }

  public function description($post_id) {    
    $content_post = get_post($post_id);
    $content = $content_post->post_content;
    return $content;
  }

  public function featured_image_url($post_id) {
    $url = wp_get_attachment_image_src(get_post_thumbnail_id($post_id), false);
    return $url[0];
  }

  public function is_featured($post_id) {
    $f = get_field('featured_game_product', $post_id);    
    return $f;
 
  }
  public function featured_img_size($post_id) {
    $f = get_field('featured_img_size', $post_id);
    return $f;
  }

  public function lg_featured_img_gear_shop_btn($post_id) {
    $f = get_field('lg_featured_img_gear_shop_btn', $post_id);
    return $f;    
  }
  
  public function insider_signup($post_id) {
    $url = get_field('insider_signup', $post_id);
    return $url;
  }

  public function pre_order($post_id) {
    $url = get_field('pre_order', $post_id);
    return $url;
  }

  public function steam($post_id) {
    $url = get_field('steam', $post_id);
    return $url;
  }

   public function windows_product_id($post_id) {
    $url = get_field('windows_product_id', $post_id);
    return $url;
  }

  public function windows($post_id) {
    $url = get_field('windows', $post_id);
    return $url;
  }

  /*
  If windows_product_id and windows ACF fields are 
  filled out on a Buy Now product page, 
  then show single include_xbox_game_pass_btn checkbox.
  If this button is checked return true if it is NOT
  checked return false, AND
  show the Xbox "Game Pass" button that opens up
  the same popup window as the "Get it from Microsoft" button.
  */
  public function include_xbox_game_pass_btn($post_id) {
    $url = get_field('include_xbox_game_pass_btn', $post_id);
    if($url && in_array('include_xbox_game_pass_btn_yes', $url)) {
      return true;
    }

    return false;
  }


  public function amazon($post_id) {
    $url = get_field( 'amazon', $post_id );
    return $url;
  }

  public function gamestop($post_id) {
    $url = get_field('gamestop', $post_id);
    return $url;
  }

  public function minimum_system_requirements($post_id) {
    $f = get_field('minimum_system_requirements', $post_id);
    return $f;
  }

  public function change_content_on_date_buy_now($post_id) {
    $f = get_field('change_content_on_date_buy_now', $post_id);
    return $f;
  }

  public function alternate_headline($post_id) {
    $f = get_field('alternate_headline', $post_id);
    return $f;
  }

  public function expansions($post_id) {
    if (get_field('has_expansions', $post_id)) {
      $game_id = get_field('game_buy_now', $post_id);
      if (!isset($game_id) || empty($game_id)) {
        return [];
      }
      $args = [
        'post_type' => 'expansions',
        "post_status" => 'publish',
        "posts_per_page" => -1,
        'meta_query' => array(
          array(
            'key' => 'game_exp',
            'value' => $game_id->ID,
          )
        )
      ];
      $loop = new WP_Query($args);
      $data = [];
      $temp = [];
      while ($loop->have_posts()) : $loop->the_post();
        global $post;
        foreach ($this->exp_fields as $field) {        
          $temp[$field] = call_user_func_array(array($this, $field), array($post->ID));
        };
        $data['posts'][] = $temp;
      endwhile;
      return $data;
    }
  }

}
