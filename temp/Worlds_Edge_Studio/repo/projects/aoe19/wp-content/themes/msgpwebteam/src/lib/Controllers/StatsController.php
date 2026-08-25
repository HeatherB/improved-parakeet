<?php

namespace Roots\Controllers;
use WP_Query;

class StatsController
{
  public $wp_fields = [
    'gamertag',
  ];
  public function __construct() {
    add_filter( 'sage/template/page-template-templatespage-stats-campaign-blade-php/data', [$this, 'stats_data'] );
  }

  public function stats_data() {
    $data['gamertag'] = get_avatar( get_current_user_id() );
  }
}