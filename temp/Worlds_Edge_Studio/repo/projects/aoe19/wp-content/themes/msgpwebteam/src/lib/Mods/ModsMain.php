<?php

namespace Roots\Mods;

use WP_Query;

class ModsMain
{
    public function __construct()
    {
        add_filter('query_vars', [$this, 'prefix_register_query_var']);        
        add_action('init', [$this, 'mod_rewrite_tag'], 10, 0);
        add_action('init', [$this, 'mod_rewrite'], 10, 0);

        add_action('wp_ajax_mod_object', [$this, 'modObject']);
        add_action('wp_ajax_nopriv_mod_object', [$this, 'modObject']);
    }

    public function prefix_register_query_var($vars)
    {
        $vars[] = 'mod_id';
        return $vars;
    }

    public function mod_rewrite_tag()
    {
        add_rewrite_tag('%mod_id%', '([^&]+)');
    }

    public function mod_rewrite()
    {             
        // single page
        $page_id = get_page_id_by_title('Mods Single');
        add_rewrite_rule('^mods/details/([^\/]*)\/?$', 'index.php?page_id=' . $page_id . '&mod_id=$matches[1]', 'top');
        // single edit page
        $pageEdit_id = get_page_id_by_title('Mods Edit');
        add_rewrite_rule('^mods/details/([^\/]*)\/edit/?', 'index.php?page_id=' . $pageEdit_id . '&mod_id=$matches[1]', 'top');
    
        //flush_rewrite_rules();
    }

    public function modObject()
    {
        $mod_id = $_REQUEST['mod_id'];
        // Check Existing
        $modObjID = $this->check_mod_obj($mod_id);
        // Create if none exists
        if(empty($modObjID)) {
            $args = [
                'post_title' => $_REQUEST['mod_title'],
                'post_type' => 'mods',
                'post_status' => 'publish'
            ];
            $modObjID = wp_insert_post($args);
            update_post_meta($modObjID,'mod_id',$mod_id);
        }
        // Return New or Existing ID
        echo json_encode($modObjID);

        wp_die();
    }

    public static function check_mod_obj($mod) {
        $args = [
            'post_type' => 'mods',
            'post_status' => ['publish'],
            'meta_key' => 'mod_id',
            'meta_value' => $mod
        ];
        $comments = get_posts($args);        
        if (isset($comments) && count($comments) > 0) {
            return $comments[0]->ID;
        }
        return;
    }
}
