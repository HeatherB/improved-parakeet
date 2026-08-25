<?php

  namespace Roots\Controllers;
  use WP_User_Query;
  use Carbon\Carbon as Carbon;
  use HTMLPurifier;

  class UserController {
    public $user_fields = [
      'avatar',
      'gamertag',
      'last_login',
      'user_email',
      'first_name'
    ];
    public function __construct()
    {
      add_filter( 'sage/template/page-template-page-users-blade/data', [$this, 'build_user_data'] );
      add_filter( 'query_vars', [$this, 'prefix_register_user_query_var'] );
      add_action('init', [$this, 'user_id_rewrite_tag'], 10, 0);
      add_action('admin_init', [$this, 'user_id_rewrite'], 10, 0);
    }
    public function prefix_register_user_query_var($vars) {
      $vars[] = 'gamertag';
      return $vars;
    }
    public function user_id_rewrite_tag() {
      add_rewrite_tag('%gamertag%', '([^&]+)');
    }
    public function user_id_rewrite() {
      // single page
      $page_id = get_page_id_by_title('Users');
      if ( isset($page_id) ) {
        add_rewrite_rule('^users/([^\/]*)\?$', 'index.php?page_id='. $page_id . '&gamertag=$matches[1]', 'top');
        flush_rewrite_rules();
      }
    }

    public function build_user_data()
    {

      if(!is_user_logged_in()){
          return [];
      }

      $user_id = get_current_user_id();
      $args = [
        'include' => $user_id,
      ];
      $query = new WP_User_Query($args);
      $data = [];
      $temp = [];
      foreach ($this->user_fields as $field) {
        foreach ($query->results as $user) {
          $temp[$field] = call_user_func_array(array($this, $field), array($user));
        }
      };
      $data['users'][] = $temp;
      return $data;
    }

    public function avatar($user) {
      if(get_user_meta($user->ID, 'msa_pp')) {
        $avatar = get_user_meta($user->ID, 'msa_pp');
        $avatar = "<img src='" . $avatar[0] . "'/>";
      } elseif(get_user_meta($user->ID, 'steam_avatarfull')) {
        $avatar = get_user_meta($user->ID, 'steam_avatarfull');
        $avatar = "<img src='" . $avatar[0] . "'/>";
      } elseif($user){
        $avatar = "<img src='" . get_avatar_url( $user->ID, 170 ) . "'/>";
      } else {
        $avatar = "<img src='" . get_avatar_url("", 150 ) . "'/>";
      }
      return $avatar;
    }

    public function gamertag($user) {
      if(!empty(get_user_meta($user->ID, 'msa_modern_gamertag', true))) {
        $value = get_user_meta($user->ID, 'msa_modern_gamertag', true);
      } elseif(!empty(get_user_meta($user->ID, 'msa_gt', true))){
        $value = get_user_meta($user->ID, 'msa_gt', true);
      } elseif(!empty(get_user_meta($user->ID, 'steam_personaname', true))){
        $value = get_user_meta($user->ID, 'steam_personaname', true);      
      } else {
        $value = $user->user_nicename;
      }
      return $value;
    }

    public function last_login($user) {
      $value = get_user_meta($user->ID, '_last_login', true);
      $value = ($value == 'Never') ? $value : $this->time_elapsed_string($value[0]);
      return $value;
    }

    public function user_email($user) {
      $value = $user->user_email;
      return $value;
    }
    public function first_name($user) {
      $value = $user->first_name;
      return $value;
    }

    public function time_elapsed_string($datetime, $full = false) {
      $now = new \DateTime;
      $ago = new \DateTime($datetime);
      $diff = $now->diff($ago);

      $diff->w = floor($diff->d / 7);
      $diff->d -= $diff->w * 7;

      $string = array(
        'y' => 'year',
        'm' => 'month',
        'w' => 'week',
        'd' => 'day',
        'h' => 'hour',
        'i' => 'minute',
        's' => 'second',
      );
      foreach ($string as $k => &$v) {
        if ($diff->$k) {
          $v = $diff->$k . ' ' . $v . ($diff->$k > 1 ? 's' : '');
        } else {
          unset($string[$k]);
        }
      }

      if (!$full) $string = array_slice($string, 0, 1);
      return $string ? implode(', ', $string) . ' ago' : 'just now';
    }

  }
