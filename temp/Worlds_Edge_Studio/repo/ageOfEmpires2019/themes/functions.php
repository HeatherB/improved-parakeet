<?php

/**
 * Do not edit anything in this file unless you know what you're doing
 */

/**
 * Helper function for prettying up errors
 * @param string $message
 * @param string $subtitle
 * @param string $title
 */
$sage_error = function ($message, $subtitle = '', $title = '') {
    $title = $title ?: __('Sage &rsaquo; Error', 'sage');
    $footer = '<a href="https://roots.io/sage/docs/">roots.io/sage/docs/</a>';
    $message = "<h1>{$title}<br><small>{$subtitle}</small></h1><p>{$message}</p><p>{$footer}</p>";
    wp_die($message, $title);
};

/**
 * Ensure dependencies are loaded
 */
if (!class_exists('Roots\\Sage\\Container')) {
    if (!file_exists($composer = __DIR__.'/vendor/autoload.php')) {
        $sage_error(
            __('You must run <code>composer install</code> from the Sage directory.', 'sage'),
            __('Autoloader not found.', 'sage')
        );
    }
    require_once $composer;
}

/**
 * show admin bar only for admins and editors
 */
if (!current_user_can('edit_posts')) {
    add_filter('show_admin_bar', '__return_false');
}

/**
 * Clear Cache on Update
 */
function clear_site_cache($post)
{

    $post_type = get_post_type($post) ?? "undefined";

    $trigger_type = [
        'post',
        'page'
    ];


    // Ignore if Autosave, not on production, or is not worthy of cache clearing
    if((defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) || (!in_array($post_type, $trigger_type))) {
        return;
    }

    error_log('CACHE CLEAR TRIGGERED: Post Type = ' . $post_type);

    // Only trigger with Production
    $prod_domains = array('www.ageofempires.com');

    if(in_array(strtolower($_SERVER['HTTP_HOST']), $prod_domains) || in_array(strtolower($_SERVER['SERVER_NAME']), $prod_domains)){
        $sites = [
            'http://age-nginx-sc1.southcentralus.cloudapp.azure.com:8082/clearcache.php',
            'http://age-nginx-sc2.southcentralus.cloudapp.azure.com:8082/clearcache.php'
        ];

        foreach($sites as $site) {
            $ch = curl_init($site);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HEADER, 0);
            $data = curl_exec($ch);
            curl_close($ch);
        }
    }
}
add_action('save_post','clear_site_cache');

/* test thing */
/*$debug_tags = array();
add_action( 'all', function ( $tag ) {
    global $debug_tags;
    if ( in_array( $tag, $debug_tags ) ) {
        return;
    }
    echo "<pre>" . $tag . "</pre>";
    $debug_tags[] = $tag;
} );*/
/* end test thing */


/**
 * Get Browser Language
 */
define('DEFAULT_LANGUAGE', 'en-US');

function get_language_match($lang_code, $languages) {
    $matches = preg_grep('/^' . $lang_code . '-[A-Z]{2}/', $languages);

    if (count($matches) > 0) {
        // get first value. Array should only have 1 element
        return array_values($matches)[0];
    } else {
        return null;
    }
}

function get_browser_language($languages, $default) {
    $lang_header = $_SERVER['HTTP_ACCEPT_LANGUAGE'];
    $lang_code = explode(',',$lang_header)[0];

    if (preg_match('/[a-z]{2}-[A-Z]{2}/', $lang_code)) {
        // has lang and region code, i.e. en-US
        if (in_array($lang_code, $languages)) {
            return $lang_code;
        } else {
            // if full code is not a match, match language only
            $match = get_language_match(substr($lang_code,0,2), $languages);
            return $match ? $match : $default;
        }
    } elseif (preg_match('/[a-z]/', $lang_code)) {
        // has lang code only, i.e. en
        $match = get_language_match($lang_code, $languages);
        return $match ? $match : $default;
    } else {
        // code is not in a format we recognize
        return $default;
    }
}


/**
 * Primary Nav walker
 */

class My_Walker_Nav_Menu extends Walker_Nav_Menu {

    function item_class(Array $item_class) {
        $cls = array_filter($item_class, function($value) {
            // keep the child and games indicator classes
            if ( $value === 'menu-item-has-children' || $value === 'menu-item-object-games') {
                return true;
            } 
            // strip all other wp default classes
            else {
                return (str_replace(['menu-', 'page_', 'page-'], '', $value) != $value)  ? false : true;
            }
        });

        // change indicator classnames to fit with css semantics
        foreach($cls as &$value) {
            if ( $value === 'menu-item-has-children') {
                $value = "has-children";
            } elseif ( $value === 'menu-item-object-games') {
                $value = "--game";
            }
        }

        // clear null values from array
        $cls = array_filter($cls);

        return implode(' ', $cls);
    }

    function start_el(&$output, $item, $depth = 0, $args = array(), $id = 0){
        global $wp_query;

        $class_names = $item_output = $value = '';
        $style_classes = 'menu__item';
        $class_names = ' class="'. $style_classes .' '. $this->item_class($item->classes) .'"';

        $output .= '<li id="'. $item->ID . '"' . $value . $class_names .'>';

        if (!empty($item->url) && $item->url != "#") {
            $attributes  = ! empty( $item->attr_title ) ? ' title="'  . esc_attr( $item->attr_title ) .'"' : '';
            $attributes .= ! empty( $item->target )     ? ' target="' . esc_attr( $item->target     ) .'"' : '';
            $attributes .= ! empty( $item->xfn )        ? ' rel="'    . esc_attr( $item->xfn        ) .'"' : '';
            $attributes .= ! empty( $item->url )        ? ' href="'   . esc_attr( $item->url        ) .'"' : '';

            $item_output .= '<a class="menu__item__label" '. $attributes .'>'. $item->title .'</a>';

        } else {
            $item_output .= '<span class="menu__item__label" tabindex="0">'. $item->title .'</span>';
        }

        $output .= apply_filters( 'walker_nav_menu_start_el', $item_output, $item, $depth, $args );
    }

    function start_lvl( &$output, $depth = 0, $args = array(), $id = 0 ) {
        $output .= '<ul class="dropdown lvl-'. ($depth + 1) .'">';
        $output .= '<li class="menu__item --back js-back-menu-item"><span class="menu__item__label">Back</span></li>';
    }
}



/**
 * Front Page Hero Nav walker
 */

class Hero_Nav_Walker extends Walker_Nav_Menu {
    function start_lvl( &$output, $depth = 0, $args = array() ) {
        $indent = str_repeat("\t", $depth);
        $output .= "\n$indent\n";
    }
    function end_lvl( &$output, $depth = 0, $args = array() ) {
        $indent = str_repeat("\t", $depth);
        $output .= "$indent\n";
    }
    function start_el( &$output, $item, $depth = 0, $args = array(), $id = 0 ) {
        $indent = ( $depth ) ? str_repeat( "\t", $depth ) : '';
        $class_names = $value = '';
        $classes = empty( $item->classes ) ? array() : (array) $item->classes;
        $classes[] = 'menu-item-' . $item->ID;
        $class_names = join( ' ', apply_filters( 'nav_menu_css_class', array_filter( $classes ), $item, $args ) );
        $class_names = $class_names ? ' class="' . esc_attr( $class_names ) . '"' : '';
        $id = apply_filters( 'nav_menu_item_id', 'menu-item-'. $item->ID, $item, $args );
        $id = $id ? ' id="' . esc_attr( $id ) . '"' : '';
        $output .= $indent . '';
        $attributes  = ! empty( $item->attr_title ) ? ' title="'  . esc_attr( $item->attr_title ) .'"' : '';
        $attributes .= ! empty( $item->target )     ? ' target="' . esc_attr( $item->target     ) .'"' : '';
        $attributes .= ! empty( $item->xfn )        ? ' rel="'    . esc_attr( $item->xfn        ) .'"' : '';
        $attributes .= ! empty( $item->url )        ? ' href="'   . esc_attr( $item->url        ) .'"' : '';
        $attributes .= ' class="btn-aoe--cta"';
        $item_output = $args->before;
        $item_output .= '<li '. $class_names . '"><a'. $attributes .'>';
        $item_output .= $args->link_before . apply_filters( 'the_title', $item->title, $item->ID ) . $args->link_after;
        $item_output .= '</a></li>';
        $item_output .= $args->after;
        $output .= apply_filters( 'walker_nav_menu_start_el', $item_output, $item, $depth, $args );
    }
    function end_el( &$output, $item, $depth = 0, $args = array() ) {
        $output .= "\n";
    }
}

function register_hero_menus() {
  register_nav_menus(
    array(
      'myth' => __( 'Age of Mythology' ),
      'age1' => __( 'Age of Empires' ),
      'age2' => __( 'Age of Empires II' ),
      'age3' => __( 'Age of Empires III' ),
      'age4' => __('Age of Empires IV'),
    )
  );
}
add_action( 'init', 'register_hero_menus' );

function playerCount(){
    return "
        <div class='player_count'>
            <div class='playerCount_icon'></div>
            <div class='playerCounter'>AGE:DE <span id='number'></span><span class='counting'> Players Online</span></div>
        </div>
    ";
}

function mobMenuIcons(){
    return "
        <ul class='mob_social-links'>
            <li><a href='https://www.facebook.com/ageofempires/' title='Facebook'><i class='soc_icon icon_facebook'></i></a></li>
            <li><a class='second' href='https://www.instagram.com/ageofempiresgame/' title='Instagram'><i class='soc_icon icon_instagram'></i></a></li>
            <li><a href='https://twitter.com/ageofempires' title='Twitter'><i class='soc_icon icon_twitter'></i></a></li>
            <li><a href='https://mixer.com/ageofempires' title='Mixer'><i class='soc_icon icon_mixer'></i></a>
            </li><li><a href='https://discord.gg/ageofempires' title='Discord'><i class='soc_icon icon_discord'></i></a></li>
        </ul>
    ";
}

function user_menu(){
    $output = '<ul class="sub_nav menu vertical" data-sub="user_menu">';
    $output .= "<li class='menu-item menu-item-type-post_type back'><span class='shift_left'></span><a href='#'><span>BACK</span></a></li>";
    if(!is_user_logged_in()){
        $output .= '<li class="menu-item js-sign-in"><a href="javascript:void(0);"><span>Log In</span></a></li>';
    } else {
        $output .= '<li class="menu-item"><a href="/profile"><span>My Profile</span></a></li>';
        $output .= '<li class="menu-item"><a href="/stats"><span>My Stats</span></a></li>';
        $output .= '<li class="menu-item"><a href="'.wp_logout_url() .'"><span>Log Out</span></a></li>';
    }
    $output .= '</ul>';

    return $output;
}

// Banned Users
add_action( 'set_user_role', function( $user_id, $role, $old_roles ) {
    if('banned_user' === $role){
        global $wpdb;

        // Delete Users Session Cookies
        delete_user_meta($user_id,'session_tokens');

        // Move the users comments to spam
        $wpdb->update( 'wp_comments', ['comment_approved' => 'spam'],['user_id'=>$user_id]);

    }
}, 10, 3 );


/**
 * Sage required files
 *
 * The mapped array determines the code library included in your theme.
 * Add or remove files to the array as needed. Supports child theme overrides.
 */
array_map(function ($file) use ($sage_error) {
    $file = "src/{$file}.php";
    if (!locate_template($file, true, true)) {
        $sage_error(sprintf(__('Error locating <code>%s</code> for inclusion.', 'sage'), $file), 'File not found');
    }
}, ['helpers', 'setup', 'filters', 'admin']);

/**
 * Here's what's happening with these hooks:
 * 1. WordPress initially detects theme in themes/sage
 * 2. Upon activation, we tell WordPress that the theme is actually in themes/sage/templates
 * 3. When we call get_template_directory() or get_template_directory_uri(), we point it back to themes/sage
 *
 * We do this so that the Template Hierarchy will look in themes/sage/templates for core WordPress themes
 * But functions.php, style.css, and index.php are all still located in themes/sage
 *
 * This is not compatible with the WordPress Customizer theme preview prior to theme activation
 *
 * get_template_directory()   -> /srv/www/example.com/current/web/app/themes/sage
 * get_stylesheet_directory() -> /srv/www/example.com/current/web/app/themes/sage
 * locate_template()
 * ├── STYLESHEETPATH         -> /srv/www/example.com/current/web/app/themes/sage
 * └── TEMPLATEPATH           -> /srv/www/example.com/current/web/app/themes/sage/templates

if (is_customize_preview() && isset($_GET['theme'])) {
    $sage_error(__('Theme must be activated prior to using the customizer.', 'sage'));
}
*/
add_filter('template', function ($stylesheet) {
    return dirname($stylesheet);
});
if (basename($stylesheet = get_option('template')) !== 'templates') {
    update_option('template', "{$stylesheet}/templates");
    wp_redirect($_SERVER['REQUEST_URI']);
    exit();
}

function mamaduka_remove_metabox() {
    remove_meta_box( 'wpseo_meta', 'banner_posters', 'normal' );
    remove_meta_box( 'wpseo_meta', 'logo_icons', 'normal' );
    remove_meta_box( 'wpseo_meta', 'background_images', 'normal' );
    remove_meta_box( 'wpseo_meta', 'clans', 'normal' );
    remove_meta_box( 'wpseo_meta', 'logo_shields', 'normal' );
}
add_action( 'add_meta_boxes', 'mamaduka_remove_metabox', 11 );

//register_nav_menu('beta_signup', 'Beta Signup Menu');

add_filter( 'posts_join', 'custom_posts_join', 10, 2 );
/**
 * Callback for WordPress 'posts_join' filter.'
 *
 * @global $wpdb
 * @see https://codex.wordpress.org/Class_Reference/wpdb
 *
 * @link https://codex.wordpress.org/Plugin_API/Filter_Reference/posts_join
 *
 * @param  string   $join     The sql JOIN clause.
 * @param  WP_Query $wp_query The current WP_Query instance.
 * @return string   $join     The sql JOIN clause.
 */
function custom_posts_join( $join, $query ) {

  global $wpdb;
  //* if main query and search...
  if ( is_main_query() && is_search() ) {

    //* join term_relationships, term_taxonomy, and terms into the current SQL where clause
    $join .= "
        LEFT JOIN 
        ( 
            {$wpdb->term_relationships}
            INNER JOIN 
                {$wpdb->term_taxonomy} ON {$wpdb->term_taxonomy}.term_taxonomy_id = {$wpdb->term_relationships}.term_taxonomy_id 
            INNER JOIN 
                {$wpdb->terms} ON {$wpdb->terms}.term_id = {$wpdb->term_taxonomy}.term_id 
        ) 
        ON {$wpdb->posts}.ID = {$wpdb->term_relationships}.object_id ";

  }
  return $join;

}

/**
 * Get a where clause dependent on the current user's status.
 *
 * @global $wpdb
 * @see https://codex.wordpress.org/Class_Reference/wpdb
 *
 * @uses get_current_user_id()
 * @see http://codex.wordpress.org/Function_Reference/get_current_user_id
 *
 * @return string The user where clause.
 */
function get_user_posts_where() {

  global $wpdb;
  $user_id = get_current_user_id();
  $sql     = '';
  $status  = array( "'publish'" );
  if ( 0 !== $user_id ) {

    $status[] = "'private'";

    $sql .= " AND {$wpdb->posts}.post_author = " . absint( $user_id );

  }
  $sql .= " AND {$wpdb->posts}.post_status IN( " . implode( ',', $status ) . " ) ";

  return $sql;

}

add_filter( 'posts_groupby', 'custom_posts_groupby', 10, 2 );
/**
 * Callback for WordPress 'posts_groupby' filter.
 *
 * Set the GROUP BY clause to post IDs.
 *
 * @global $wpdb
 * @see https://codex.wordpress.org/Class_Reference/wpdb
 *
 * @param  string   $groupby The GROUPBY caluse.
 * @param  WP_Query $query   The current WP_Query object.
 * @return string            The GROUPBY clause.
 */
function custom_posts_groupby( $groupby, $query ) {

  global $wpdb;
  //* if is main query and a search...
  if ( is_main_query() && is_search() ) {
    $groupby = "{$wpdb->posts}.ID";
  }
  return $groupby;

}
//$user = get_current_user_id();
//$user_login = $user->login;
function user_last_login( $user_login, $user ){
  if (!empty(get_user_meta($user->ID, '_current_login'))) :
    update_user_meta( $user->ID, '_last_login', get_user_meta($user->ID, '_current_login') );
  else :
    update_user_meta( $user->ID, '_last_login', 'Never' );
  endif;
  update_user_meta( $user->ID, '_current_login', date("Y-m-d H:i:s") );
}
add_action( 'wp_login', 'user_last_login', 10, 2 );

add_action( 'template_redirect', 'wpse_45164_redirect_press' );

function wpse_45164_redirect_press()
{
  if ( ! is_singular( 'buy_now' ) )
    return;

  wp_redirect( get_post_type_archive_link( 'buy_now' ), 301 );
  exit;
}

function history_image( $atts, $content = null ) {
    extract(shortcode_atts(array(
        "align" => "alignright",
        "caption" => "",
        "caption_long" => "",
    ), $atts));
    $paddingBottom = (!empty($caption_long)) ? '40px !important' : '20px !important';
    $paddingBottom = (!empty($caption)) ? $paddingBottom : '0';
    $padding = ($paddingBottom == '0') ? 'padding: 0 !important;' : '';
    $read_more_text = 'Read more...';
    $align_style = ($align == 'alignleft') ? 'left' : 'right';
    $caption_trimmed = (!empty($caption_long)) ? wp_trim_words($caption_long, 20) : "";
    $caption_trimmed_html = (!empty($caption_trimmed)) ? "<div class='history__img-caption-trim js-caption-trim'>$caption_trimmed<span>$read_more_text</span></div>" : "";
    $caption_long_html = (!empty($caption_long)) ? "<div class='history__img-caption-long js-caption-long'>$caption_long</div>" : "";
    $html = "<div class='history__image history__image--float-$align_style' style='float: $align_style;'>
                <div class='history__image-inner section-image' >
                    <div class='history__img frame-box frame-box--history'>
                        $content
                    </div>
                    <div class='history__img-caption-outer'>
                        <div class='post-image-hover'>
                            <div class='post-image-hover-inner'>
                                <i class='fa fa-search-plus' aria-hidden='true'></i>
                            </div>
                        </div>
                        <div class='history__img-caption' style='padding-bottom: $paddingBottom;$padding'>
                            <div class='history__img-caption-wrapper'>
                                <div class='history__img-caption-title section-image__caption js-caption'>$caption</div>
                                    $caption_trimmed_html 
                                    $caption_long_html
                            </div>
                        </div>
                    </div> 
                </div>
        </div>";
    return $html;
}
add_shortcode("history_image", "history_image");

//Check post type of admin page
add_filter("wp_editor_settings", function ($settings, $editor_id) {

    if ( ! function_exists( 'get_current_screen' ) ) {
 	    return;
     }
    if (session_status() == 1) {
        session_start();
    }
	$current_screen = get_current_screen();

	if ("history" === $current_screen->post_type) {
		session_start();
		$_SESSION['admin_history'] = true;
	} else {
		unset ($_SESSION['admin_history']);
	}

	return $settings;

}, 10, 2);


function history_image_media( $html, $send_id = null, $attachment = null){

	if($_SESSION['admin_history']){
		preg_match( '#((?:<a [^>]+>\s*)?<img [^>]+>(?:\s*</a>)?)(.*)#is', $html, $historyMedia );
		preg_match('/wp-image-([\d]+)/',$html,$imgID);
		$img = $historyMedia[1];
		$caption = ltrim(str_replace('[/caption]','',$historyMedia[2]));
		$caption_long = get_post($imgID[1])->post_content;

		$return_html = "[history_image align='alignleft' caption='".esc_attr($caption)."' caption_long='".esc_attr($caption_long)."'] $img [/history_image]";

		return $return_html;
	} else {
		return $html;
	}
}
add_filter('media_send_to_editor','history_image_media');


/**
 * Gets the request parameter.
 *
 * @param      string  $key      The query parameter
 * @param      string  $default  The default value to return if not found
 *
 * @return     string  The request parameter.
 *
 *
 * Here three things are happening.
 *    1. First we check if the request key is present or not. If not, then just return a default value.
 *    2. If it is set, then we first remove slashes by doing wp_unslash. Read here why it is better than
 *       stripslashes_deep.
 *    3. Then we sanitize the value by doing a simple strip_tags. If you expect rich text from parameter, then run it
 *       through wp_kses or similar functions.
 *
 */

function get_request_parameter( $key, $default = '' ) {
    // If not request set
    if ( ! isset( $_REQUEST[ $key ] ) || empty( $_REQUEST[ $key ] ) ) {
        return $default;
    }

    // Set so process it
    return strip_tags( (string) wp_unslash( $_REQUEST[ $key ] ) );
}


/**
 * Disable the emoji's
 */
function disable_emojis() {
 remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
 remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
 remove_action( 'wp_print_styles', 'print_emoji_styles' );
 remove_action( 'admin_print_styles', 'print_emoji_styles' );
 remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
 remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );
 remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
 add_filter( 'tiny_mce_plugins', 'disable_emojis_tinymce' );
 add_filter( 'wp_resource_hints', 'disable_emojis_remove_dns_prefetch', 10, 2 );
}
add_action( 'init', 'disable_emojis' );

/**
 * Filter function used to remove the tinymce emoji plugin.
 *
 * @param array $plugins
 * @return array Difference betwen the two arrays
 */
function disable_emojis_tinymce( $plugins ) {
 if ( is_array( $plugins ) ) {
 return array_diff( $plugins, array( 'wpemoji' ) );
 } else {
 return array();
 }
}

/**
 * Remove emoji CDN hostname from DNS prefetching hints.
 *
 * @param array $urls URLs to print for resource hints.
 * @param string $relation_type The relation type the URLs are printed for.
 * @return array Difference betwen the two arrays.
 */
function disable_emojis_remove_dns_prefetch( $urls, $relation_type ) {
 if ( 'dns-prefetch' == $relation_type ) {
 /** This filter is documented in wp-includes/formatting.php */
 $emoji_svg_url = apply_filters( 'emoji_svg_url', 'https://s.w.org/images/core/emoji/2/svg/' );

$urls = array_diff( $urls, array( $emoji_svg_url ) );
 }

return $urls;
}

/*
 * Clean up Wordpress Head
 */

add_action('init', function() {

    // Display the RSS links to the extra feeds such as category feeds
    // remove_action( 'wp_head', 'feed_links_extra', 3 );

    // Display the RSS links to the general feeds: Post and Comment Feed
    // remove_action( 'wp_head', 'feed_links', 2 );

    // Display the link to the Really Simple Discovery service endpoint, EditURI link
    remove_action( 'wp_head', 'rsd_link' );

    // Display the link to the Windows Live Writer manifest file.
    remove_action( 'wp_head', 'wlwmanifest_link' );

    remove_action( 'wp_head', 'index_rel_link' ); // index link
    remove_action( 'wp_head', 'parent_post_rel_link', 10, 0 ); // prev link
    remove_action( 'wp_head', 'start_post_rel_link', 10, 0 ); // start link
    // Display relational links for the posts adjacent to the current post.
    remove_action( 'wp_head', 'adjacent_posts_rel_link', 10, 0 );

    // Display the XHTML generator that is generated on the wp_head hook, WP version
    remove_action( 'wp_head', 'wp_generator' );

    add_action('wp_head', 'ob_start', 1, 0);
    add_action('wp_head', function () {
        $pattern = '/.*' . preg_quote(esc_url(get_feed_link('comments_' . get_default_feed())), '/') . '.*[\r\n]+/';
        echo preg_replace($pattern, '', ob_get_clean());
    }, 3, 0);

    // Remove shortlink in header
    remove_action('wp_head', 'wp_shortlink_wp_head', 10);

    // oEmbed Discovery Links
    // https://developer.wordpress.org/reference/functions/wp_oembed_add_discovery_links/
    remove_action('wp_head', 'wp_oembed_add_discovery_links');
    // Turn off oEmbed auto discovery.
    add_filter( 'embed_oembed_discover', '__return_false' );
    //Don't filter oEmbed results.
    remove_filter('oembed_dataparse', 'wp_filter_oembed_result', 10);
    //Remove oEmbed JavaScript from the front-end and back-end.
    remove_action('wp_head', 'wp_oembed_add_host_js');
    //Remove the REST API endpoint.
    remove_action('rest_api_init', 'wp_oembed_register_route');

    //Outputs the REST API link tag into page header.
    remove_action('wp_head', 'rest_output_link_wp_head', 10);

    //Disables default Wordpress gallery styles
    add_filter('use_default_gallery_style', '__return_false');

});

/*
* Remove Gutenberg styles
*/

function deregister_styles() {
    wp_dequeue_style( 'wp-block-library' );
}
add_action( 'wp_print_styles', 'deregister_styles', 100 );

@ini_set( 'upload_max_size' , '64M' );
@ini_set( 'post_max_size', '64M');
@ini_set( 'max_execution_time', '300' );
remove_filter('template_redirect','redirect_canonical');

// Set Redirect for post-login
function set_msa_redirect() {
  global $wp;
  if (session_status() == 1) {
      session_start();
  }
  
  $_SESSION['MSA_PAGE_REDIRECT'] = home_url( $wp->request );
}
add_action( 'template_redirect', 'set_msa_redirect');

add_filter( 'w3tc_can_print_comment', function( $w3tc_setting ) { return false; }, 10, 1 );

// ------------------------------------------------
// Allow games to be parents of game modes
// ------------------------------------------------

function add_game_modes_meta_boxes() {
    add_meta_box('game-modes-parent', 'Games', 'game_modes_attributes_meta_box', 'game_modes', 'side', 'high');
}
add_action('add_meta_boxes', 'add_game_modes_meta_boxes');


function game_modes_attributes_meta_box( $post ) {
    $post_type_object = get_post_type_object( $post->post_type );
    $pages = wp_dropdown_pages( array( 'post_type' => 'games', 'selected' => $post->post_parent, 'name' => 'parent_id', 'show_option_none' => __( '(no parent)' ), 'sort_column'=> 'menu_order, post_title', 'echo' => 0 ) );
      
    if ( ! empty( $pages ) ) {
        echo $pages;
    }
}

function game_modes_rewrite_rules() {
    add_rewrite_tag('%game_modes%', '([^/]+)', 'game_modes=');
    add_permastruct('game_modes', 'games/%game%/%game_modes%', false);
    add_rewrite_rule('^games/([^/]+)/([^/]+)/?','index.php?game_modes=$matches[2]','top');
}
add_action('init', 'game_modes_rewrite_rules');

function game_modes_permalinks($permalink, $post, $leavename) {
    $post_id = $post->ID;
    if($post->post_type != 'game_modes' || empty($permalink) || in_array($post->post_status, array('draft', 'pending', 'auto-draft')))
        return $permalink;

    $parent = $post->post_parent;
    $parent_post = get_post( $parent );

    $permalink = str_replace('%game%', $parent_post->post_name, $permalink);
    return $permalink;
}
add_filter('post_type_link', 'game_modes_permalinks', 10, 3);

function getAriaPhrase($input) {
    $key = array (
        'aoe' => 'Age of Empires One',
        'aoede' => 'Age of Empires One Definitive Edition',
        'aoeii' => 'Age of Empires Two',
        'aoeiihd' => 'Age of Empires Two HD',
        'aoeiide' => 'Age of Empires Two Definitive Edition',
        'aoeiii' => 'Age of Empires Three',
        'aoeiiide' => 'Age of Empires Three Definitive Edition',
        'aoeiv' => "Age of Empires Four",
        'aoem' => "Age of Mythology",
        'myth' => "Age of Mythology",
        'aom' => "Age of Mythology"
    );

    if ( array_key_exists($input,$key) ) {
        return $key[$input];
    } else {
        return $input;
    }   
}

/* polylang string translations */
/* update url of in-page anchor tags with language specific slug */
function get_link_by_slug($slug, $lang_slug = null, $type = 'post'){
    $post = get_page_by_path($slug);
    if(function_exists('pll_current_language')) {
        $lang_slug = pll_current_language();
    } else {
        $lang_slug = 'en';
    }
  
    if(function_exists('pll_get_post')) {
        $id = ($lang_slug) ? pll_get_post($post->ID, $lang_slug) : $post->ID;
    } else {
        $id = $post->ID;
    }
    return get_permalink($id);
}

function clear_menu_cache($menu_term) {
    $cached_versions = redisConn( 'menu-cache-menuid-' . $menu_term, 'get' );
    echo ' the cached version is '. $cached_versions;
    if ( false !== $cached_versions ) {
        echo ' clear the cache ' . $menu_term;
        $cached_versions = json_decode( $cached_versions );
        foreach ( $cached_versions as $menu_signature ) {   
            echo ' the menu signature is ' . $menu_signature;            
            redisConn('AgePrimaryNavCache' . $menu_signature, 'del');
        }
        redisConn( 'menu-cache-menuid-' . $menu_term, 'set', wp_json_encode( [] ));
    }
}
