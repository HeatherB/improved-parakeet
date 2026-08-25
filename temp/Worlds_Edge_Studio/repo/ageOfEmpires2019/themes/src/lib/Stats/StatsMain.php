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
//        // single page
        $page = get_page_by_title('Stats');
        add_rewrite_rule('^stats/multiplayer/(.*)\/?$', 'index.php?page_id='. $page->ID . '&gamertag=$matches[1]&gameType=mp', 'top');
//        // single edit page
//        $pageEdit = get_page_by_title('Mods Edit');
//        add_rewrite_rule('^mods/details/([^\/]*)\/edit/?', 'index.php?page_id='. $pageEdit->ID . '&mod_id=$matches[1]', 'top');
//
////    flush_rewrite_rules();
    }
//    public function user_data() {
//        $user_id = $_REQUEST['user_id'] ?? null;
//        $gamertag = $_REQUEST['gamertag'] ?? null;
//
//        if($gamertag) {
//            $args = array(
//                'meta_key' => 'msa_gt',
//                'meta_value' => $gamertag,
//            );
//            $user = get_users($args);
//        }
//    }

}
