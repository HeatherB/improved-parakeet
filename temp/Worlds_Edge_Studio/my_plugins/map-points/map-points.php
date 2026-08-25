<?php /**
 * Plugin Name: Add Points to Map
 * Plugin URI: na
 * Description: Open map image and select map points on it.
 * Version: 1.0
 * Author: Heather Sullivan
 */

add_action('admin_enqueue_scripts', 'add_points_to_map_add_js_file');
add_action('admin_footer', 'add_map_popup');
add_action('acf/render_field/name=map_point_copy', 'add_points_to_map_contents');

/* select a a map point */
function add_points_to_map_add_js_file() {
    wp_enqueue_script( 
        'map-points-plugin',
        plugins_url( '/js/mapPointsAdmin.js', __FILE__ ),
        array(), '1.2', true
    );

    wp_register_style('mappointsstylesheet', '/wp-content/plugins/map-points/styles/style.css');
    wp_enqueue_style('mappointsstylesheet');
}

function add_map_popup() {
    $ltp_sections = get_field('sections');
    if($ltp_sections) {
        $map_groups = array_column($ltp_sections, "map_group");
        $map_imgs = array_column($map_groups, "map_img");
        $img_urls = array_column($map_imgs, "url");
    }

    $thispost = get_the_ID();
    $ptype = get_post_type( $thispost );

    if($ptype == 'learn_to_play') {
        echo '<div id="map_point_selection_wrapper" data-thispost="'. $thispost .'">
            <button type="button" id="close_map_point_selection">X</button>
            <p>Click the map to drop your point. Close this window when you are done.</p>
            <div class="scaled_map_image">
                <img src="'. $img_urls[0] .'" alt="scaled map image" id="scaled_map_image" />
            </div>
        </div>
        <div id="map_sheer"></div>';
    }
}

function add_points_to_map_contents() {
	echo '<button type="button" class="mappoint_btn">Select Map Points</button>';
}


?>