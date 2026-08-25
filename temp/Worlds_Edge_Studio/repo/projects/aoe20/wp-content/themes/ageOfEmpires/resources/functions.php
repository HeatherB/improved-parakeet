<?php

/**
 * Do not edit anything in this file unless you know what you're doing
 */

use Roots\Sage\Config;
use Roots\Sage\Container;

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
 * Ensure compatible version of PHP is used
 */
if (version_compare('7.1', phpversion(), '>=')) {
    $sage_error(__('You must be using PHP 7.1 or greater.', 'sage'), __('Invalid PHP version', 'sage'));
}

/**
 * Ensure compatible version of WordPress is used
 */
if (version_compare('4.7.0', get_bloginfo('version'), '>=')) {
    $sage_error(__('You must be using WordPress 4.7.0 or greater.', 'sage'), __('Invalid WordPress version', 'sage'));
}

/**
 * Ensure dependencies are loaded
 */
if (!class_exists('Roots\\Sage\\Container')) {
    if (!file_exists($composer = __DIR__.'/../vendor/autoload.php')) {
        $sage_error(
            __('You must run <code>composer install</code> from the Sage directory.', 'sage'),
            __('Autoloader not found.', 'sage')
        );
    }
    require_once $composer;
}

/**
 * Sage required files
 *
 * The mapped array determines the code library included in your theme.
 * Add or remove files to the array as needed. Supports child theme overrides.
 */
array_map(function ($file) use ($sage_error) {
    $file = "../app/{$file}.php";
    if (!locate_template($file, true, true)) {
        $sage_error(sprintf(__('Error locating <code>%s</code> for inclusion.', 'sage'), $file), 'File not found');
    }
}, ['helpers', 'setup', 'filters', 'admin']);

/**
 * Here's what's happening with these hooks:
 * 1. WordPress initially detects theme in themes/sage/resources
 * 2. Upon activation, we tell WordPress that the theme is actually in themes/sage/resources/views
 * 3. When we call get_template_directory() or get_template_directory_uri(), we point it back to themes/sage/resources
 *
 * We do this so that the Template Hierarchy will look in themes/sage/resources/views for core WordPress themes
 * But functions.php, style.css, and index.php are all still located in themes/sage/resources
 *
 * This is not compatible with the WordPress Customizer theme preview prior to theme activation
 *
 * get_template_directory()   -> /srv/www/example.com/current/web/app/themes/sage/resources
 * get_stylesheet_directory() -> /srv/www/example.com/current/web/app/themes/sage/resources
 * locate_template()
 * ├── STYLESHEETPATH         -> /srv/www/example.com/current/web/app/themes/sage/resources/views
 * └── TEMPLATEPATH           -> /srv/www/example.com/current/web/app/themes/sage/resources
 */
array_map(
    'add_filter',
    ['theme_file_path', 'theme_file_uri', 'parent_theme_file_path', 'parent_theme_file_uri'],
    array_fill(0, 4, 'dirname')
);
Container::getInstance()
    ->bindIf('config', function () {
        return new Config([
            'assets' => require dirname(__DIR__).'/config/assets.php',
            'theme' => require dirname(__DIR__).'/config/theme.php',
            'view' => require dirname(__DIR__).'/config/view.php',
        ]);
    }, true);


/** BEGIN CUSTOMIZATION */

/**
 * Primary Nav walker
 */

class Walker_Primary_Nav extends Walker_Nav_Menu {

    function item_class(Array $item_class) {
        $cls = array_filter($item_class, function($value) {
            // keep the child and games indicator classes
            if ( $value === 'menu-item-has-children' ) {
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
                $value = "has-children js-parent-nav-item";
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
        $output .= '<ul class="dropdown js-dropdown lvl-'. ($depth + 1) .'">';
        $output .= '<li class="menu__item --back js-back-menu-item"><span class="menu__item__label">Back</span></li>';
    }
}

// custom image sizes

add_image_size('site-width', 1600, 1600, false);
add_image_size('full', 2400, 2400, false);


// retcon classes for the_content()

function add_bulleted_list_class($content) {
    global $post;
    $pattern        = "/<ul>/i";
    $replacement    = '<ul class="bulleted">';
    $content        = preg_replace($pattern,$replacement,$content);
    return $content;
}

function add_numbered_list_class($content) {
    global $post;
    $pattern        = "/<ol>/i";
    $replacement    = '<ol class="numbered">';
    $content        = preg_replace($pattern,$replacement,$content);
    return $content;
}

function add_link_class($content) {
    global $post;
    $pattern        = "/<a/i";
    $replacement    = '<a class="link"';
    $content        = preg_replace($pattern,$replacement,$content);
    return $content;
}

add_filter('the_content','add_bulleted_list_class');
add_filter('the_content','add_numbered_list_class');
add_filter('the_content','add_link_class');

add_filter('acf_the_content','add_bulleted_list_class');
add_filter('acf_the_content','add_numbered_list_class');
add_filter('acf_the_content','add_link_class');


function get_aria_phrase($input) {
    $outputs = [
        'age1' => 'Age of Empires',
        'age1de' => 'Age of Empires Definitive Edition',
        'age2' => 'Age of Empires Two',
        'age2hd' => 'Age of Empires Two HD',
        'age2de' => 'Age of Empires Two Definitive Edition',
        'age3' => 'Age of Empires Three',
        'age3de' => 'Age of Empires Three Definitive Edition',
        'age4' => 'Age of Empires Four',
        'myth' => 'Age of Mythology'
    ];

    $key = array (
        'aoe' => $outputs['age1'],
        'age' => $outputs['age1'],
        'age1' => $outputs['age1'],
        'agei' => $outputs['age1'],
        'aoede' => $outputs['age1de'],
        'agede' => $outputs['age1de'],
        'age1de' => $outputs['age1de'],
        'aoeii' => $outputs['age2'],
        'aoeiihd' => $outputs['age2hd'],
        'aoeiide' => $outputs['age2de'],
        'aoeiii' => $outputs['age3'],
        'aoe3' => $outputs['age3'],
        'ageiii' => $outputs['age3'],
        'age3' => $outputs['age3'],
        'aoeiiide' => $outputs['age3de'],
        'aoe3de' => $outputs['age3de'],
        'ageiiide' => $outputs['age3de'],
        'age3de' => $outputs['age3de'],
        'aoeiv' => $outputs['age4'],
        'aoe4' => $outputs['age4'],
        'ageiv' => $outputs['age4'],
        'age4' => $outputs['age4'],
        'aoem' => $outputs['myth'],
        'myth' => $outputs['myth'],
        'aom' => $outputs['myth']
    );

    if ( array_key_exists($input,$key) ) {
        return $key[$input];
    } else {
        return $input;
    }   
}



// svg output
// outputs an inline svg tag
// 
// $path (required) [string]: relative path to the svg file, starting with 'images'
// $class (optional) [string]: sets the classname(s) on the returned svg element
// $role (optional) [string]: Default is presentation
// $alt (optional) [string]: Default is empty
// $width (optional) [number]: Default to 0 - this will insure the SVG will not expand to container and pre-style view is restricted
// $height (optional) [number]: Default to 0 - this will insure the SVG will not expand to container and pre-style view is restricted
// $additional_attributes (optional) [string]: additional html attributes to apply to the svg element. Example: disabled

function svg($path, $class = '', $role = 'presentation', $alt = '', $width = '"0"', $height = '"0"', $additional_attributes = '""') {
    $contents = file_get_contents(App\asset_path($path)); 

    $tag = '<svg';

    // replace opening svg tag with class and aria information
    if (substr($contents, 0, strlen($tag)) == $tag) {
        $contents = '<svg class="'. $class .'" role="'. $role .'" alt="'. $alt .'"  width="'. $width .'" height="'. $height .'"  ' . $additional_attributes. substr($contents, strlen($tag));
    }

    echo $contents;
}

// svg icon output
// similar to svg(), but shortcuts to the icon folder and automatically hides from screen readers
//
// $icon (required) [string]: the name of the icon file, minus ".svg"
// $class (optional) [string]: sets the classname(s) on the returned svg element. Defaults to 'icon', so if no class is wanted, use ''.
// $role (optional) [string]: Default is presentation
// $alt (optional) [string]: Default is empty
// $width (optional) [number]: Default to 0 - this will insure the SVG will not expand to container and pre-style view is restricted
// $height (optional) [number]: Default to 0 - this will insure the SVG will not expand to container and pre-style view is restricted
// $additional_attributes (optional) [string]: additional html attributes to apply to the svg element. Example: disabled

function icon($icon, $class = 'icon', $role = 'presentation', $alt ='', $width = '0', $height = '0', $additional_attributes = '') {
    $contents = file_get_contents(App\asset_path('images/ui/icons/' . $icon . '.svg')); 

    $tag = '<svg';

    // replace opening svg tag with class and aria information
    if (substr($contents, 0, strlen($tag)) == $tag) {
        $contents = '<svg class="'. $class .'" role="'.$role .'" alt="'. $alt .'" width="'.$width.'" height="'.$height.'" '. $additional_attributes. substr($contents, strlen($tag));
    }

    echo $contents;
}


add_filter( 'get_the_archive_title', 'archive_title_output' );
/**
 * Remove archive labels.
 *
 * @param  string $title Current archive title to be displayed.
 * @return string        Modified archive title to be displayed.
 */
function archive_title_output( $title ) {
    if ( is_category() ) {
        $title = single_cat_title( '', false );
    } elseif ( is_tag() ) {
        $title = single_tag_title( '', false );
    } elseif ( is_post_type_archive() ) {
        $title = post_type_archive_title( '', false );
    } elseif ( is_tax() ) {
        $title = single_term_title( '', false );
    } elseif ( is_home() ) {
        $title = single_post_title( '', false );
    }

    return $title;
}
