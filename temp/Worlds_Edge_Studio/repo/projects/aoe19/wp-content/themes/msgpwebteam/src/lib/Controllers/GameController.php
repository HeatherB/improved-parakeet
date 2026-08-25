<?php

namespace Roots\Controllers;

use WP_Query;

class GameController
{

    public function __construct()
    {
        add_filter( 'sage/template/single-games/data', [$this, 'games_page'], 12);
        add_filter( 'acf/input/admin_footer', [$this, 'wp_admin_js'] );

        // WP REWRITE HOOKS
        add_action('add_meta_boxes', [$this, 'add_game_meta_boxes']);
        add_action('init', [$this, 'game_rewrite_rules']);
        add_filter('post_type_link', [$this,'game_permalinks'], 10, 3);
    }

    public function games_page()
    {
        global $post;
        global $newsController;

        $age4_game_style = get_fields($post->ID);

        $data = $newsController->game_data();

        $data['age4_game_style'] = array(
            'customize_boolean'             => $age4_game_style['customize_in_style_of_age_iv_true_false'],
            'hero_bg_imgs'                  => $age4_game_style['custom_hero_background_images'],
            'hero_logos'                    => $age4_game_style['custom_logo_hero_options'],
            'preorder_option'               => $age4_game_style['pre-order_option_in_hero'],
            'preorder_button'               => $age4_game_style['pre_order_button'],
            'preorder_video'                => $age4_game_style['preorder_video_embed_code'],
            'youtube_embed'                 => $age4_game_style['youtube_embed_code'],
            'extra_videos'                  => $age4_game_style['extra_videos'],
            'civs_sub_nav_content_areas'    => $age4_game_style['content_areas_and_sub_nav'],
        );

        return $data;
    }

    public function add_game_meta_boxes()
    {
        add_meta_box('game-parent', 'Games', [$this, 'game_attributes_meta_box'], ['game_modes','civilizations', 'civ_sub_menus','gameplays','campaigns'], 'side', 'high');
    }

    public function game_attributes_meta_box( $post ) {
        $post_type_object = get_post_type_object( $post->post_type );
        $pages = wp_dropdown_pages( array( 'post_type' => 'games', 'selected' => $post->post_parent, 'name' => 'parent_id', 'show_option_none' => __( '(no parent)' ), 'sort_column'=> 'menu_order, post_title', 'echo' => 0 ) );

        if ( ! empty( $pages ) ) {
            echo $pages;
        }
    }


    public function game_rewrite_rules() {

        // Civilization -  Single
        add_rewrite_tag('%civilizations%', '([^/]+)', 'civilizations=');
        add_permastruct('civilizations', 'games/%game%/civilizations/%civilizations%', false);
        add_rewrite_rule('^games/([^/]+)/civilizations/([^/]+)/?','index.php?civilizations=$matches[2]',' top');
        // Civilization - Archive
        add_rewrite_rule('^games/([^/]+)/civilizations','index.php?post_type=civilizations', 'top');

        // Civ Sub Menu - Single
        add_rewrite_tag('%civ_sub_menus%', '([^/]+)', 'civ_sub_menus=');
        add_permastruct('civ_sub_menus', 'civ_sub_menus/%game%/%civ_sub_menus%', false);
        add_rewrite_rule('^civ_sub_menus/([^/]+)/([^/]+)/?','index.php?civ_sub_menus=$matches[2]',' top');

        // Game Mode
        add_rewrite_tag('%game_modes%', '([^/]+)', 'game_modes=');
        add_permastruct('game_modes', 'games/%game%/%game_modes%', false);
        add_rewrite_rule('^games/([^/]+)/([^/]+)/?','index.php?game_modes=$matches[2]','top');

    }

    public function game_permalinks($permalink, $post, $leavename) {
        $post_id = $post->ID;

        $parent = $post->post_parent;
        $parent_post = get_post( $parent );

        if(empty($permalink) || in_array($post->post_status, array('draft', 'pending', 'auto-draft'))){
            return;
        }

        switch($post->post_type) {
            case  'game_modes':
                $permalink = str_replace('%game%', $parent_post->post_name, $permalink);
                break;
            case 'civilizations':
                    $permalink = str_replace('%game%', $parent_post->post_name, $permalink);
                    $permalink = str_replace('%civilizations%', $post->post_name, $permalink);
                 break;
            case 'civ_sub_menus':
                    $permalink = str_replace('%game%', $parent_post->post_name, $permalink);
                    $permalink = str_replace('%civ_sub_menus%', $post->post_name, $permalink);
                 break;
            case 'gameplays':
                $permalink = str_replace('%game%', $parent_post->post_name, $permalink);
                $permalink = str_replace('%gameplays%', $post->post_name, $permalink);
                break;
            case 'campaigns':
                $permalink = str_replace('%game%', $parent_post->post_name, $permalink);
                $permalink = str_replace('%campaigns%', $post->post_name, $permalink);
                break;
        }

        return $permalink;
    }

    // Method called in ArchiveCivilizationsController.php controller
    // which returns chosen game name,
    // like "age-of-empires-iv" which is in turn created via the add_game_meta_boxes() function above.
    public static function get_game_name() {
        global $post;
        $id = $post->id;
        $parent = $post->post_parent;
        $parent_post = get_post( $parent );

        return $parent_post->post_name;
    }

    // If a civs sub-nav is built from a civ_sub_menus custom post type
    // from an ACF field field selection dropdown,
    // then show a link to the civ_sub_menus post type where the civs sub-nav was built, like:
    // https://www.ageofempires.com/civ_sub_menus/age-of-empires-iv/age-of-empires-iv/
    public function wp_admin_js() {
        global $post;
        $civs_sub_nav_post_type_url = null;

        if(!empty(get_field('civilizations_sub_nav_built_from_url', $post->ID))):
            $civs_sub_nav_post_type_url = get_field('civilizations_sub_nav_built_from_url', $post->ID);
        elseif(!empty(get_field('content_areas_and_sub_nav', $post->ID))):
            $content_areas_and_sub_nav = get_field('content_areas_and_sub_nav', $post->ID);
            if(!empty($content_areas_and_sub_nav['civilizations_sub_nav_built_from_url'])):
                $civs_sub_nav_post_type_url = $content_areas_and_sub_nav['civilizations_sub_nav_built_from_url'];
            endif;
        endif;

        if(empty($civs_sub_nav_post_type_url)):
            return;
        endif;
        ?>

            <script type="text/javascript">
            (function($) {

                var civs_sub_nav_from_url = <?php echo "'" . $civs_sub_nav_post_type_url . "'"; ?> || null;
                var civs_sub_nav_acf_container = $('.acf-field[data-name="civilizations_sub_nav_built_from_url"]');

                if(civs_sub_nav_acf_container.length && civs_sub_nav_from_url) {
                civs_sub_nav_acf_container.append('<p><a href="' + civs_sub_nav_from_url + '" target="_blank">' + civs_sub_nav_from_url + '</a></p>');
                }

            })(jQuery);
            </script>
        <?php

    }

}
