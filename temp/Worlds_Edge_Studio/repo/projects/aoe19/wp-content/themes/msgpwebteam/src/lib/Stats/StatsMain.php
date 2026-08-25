<?php
namespace Roots\Stats;

class StatsMain
{
    public function __construct()
    {
        add_filter( 'query_vars', [$this, 'prefix_register_query_var'] );
        add_action('init', [$this, 'gamertag_rewrite_tag'], 10, 0);
//        add_action( 'wp_ajax_user_data', [$this, 'user_data'] );
//        add_action( 'wp_ajax_nopriv_user_data', [$this, 'user_data'] );
        add_action('init', [$this, 'gamertag_rewrite'], 10, 0);
    }
    public function prefix_register_query_var($vars) {
        $vars[] = 'gamertag';
        $vars[] = 'gameType';
        $vars[] = 'gameId';
        return $vars;
    }
    public function gamertag_rewrite_tag() {
        add_rewrite_tag('%gamertag%', '([^&]+)');
        add_rewrite_tag('%gameType%', '([^&]+)');
        add_rewrite_tag('%gameId%', '([^&]+)');
    }
    public function gamertag_rewrite() {
        // single page
        $page_id = get_page_id_by_title('Stats');
        add_rewrite_rule('^stats/multiplayer/(.*)\/?$', 'index.php?page_id='. $page_id . '&gamertag=$matches[1]&gameType=mp', 'top');

    }

}
