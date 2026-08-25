<?php

namespace Roots\Data;

class DataTypes
{
  public function __construct(){
    add_action('init', [$this, 'register_post_types']);

    add_action('init', [$this, 'register_taxonomies']);
  }

  public function register_post_types()
  {

    $data = array(
      'labels' => array(
        'name' => _x('Alerts', 'post type general name'),
        'singular_name' => _x('Alert', 'post type singular name'),
        'menu_name' => _x('Alerts', 'admin menu'),
        'name_admin_bar' => _x('Alert', 'add new on admin bar'),
        'add_new' => _x('Add New Alert', 'Alert'),
        'add_new_item' => __('Add New Alert'),
        'new_item' => __('New Alert'),
        'edit_item' => __('Edit Alert'),
        'view_item' => __('View Alert'),
        'all_items' => __('Alerts'),
        'search_items' => __('Search Alerts'),
        'parent_item_colon' => __('Parent Alerts'),
        'not_found' => __('No Alerts found.'),
        'not_found_in_trash' => __('No Alerts found in Trash.')
      ),
      'public' => true,
      'has_archive' => true,
      'publicly_queryable' => true,
      'exclude_from_search' => true,
      'show_ui' => true,
      'show_in_menu' => true,
      'rewrite' => array('slug' => 'alerts'),
      'supports' => array('title'),
      'show_in_rest' => true,
      'with_front' => false
    );
    register_post_type('alerts', $data);

    $data = array(
      'labels' => array(
        'name' => _x('Histories', 'post type general name'),
        'singular_name' => _x('History', 'post type singular name'),
        'menu_name' => _x('Histories', 'admin menu'),
        'name_admin_bar' => _x('History', 'add new on admin bar'),
        'add_new' => _x('Add New', 'History'),
        'add_new_item' => __('Add New History'),
        'new_item' => __('New History'),
        'edit_item' => __('Edit History'),
        'view_item' => __('View History'),
        'all_items' => __('All Histories'),
        'search_items' => __('Search Histories'),
        'parent_item_colon' => __('Parent History:'),
        'not_found' => __('No Histories found.'),
        'not_found_in_trash' => __('No Histories found in Trash.')
      ),
      'public' => true,
      'has_archive' => true,
      'publicly_queryable' => true,
      'exclude_from_search' => false,
      'show_ui' => true,
      'show_in_menu' => true,
      'rewrite' => array('slug' => 'history', 'with_front' => false),
      'supports' => array('title', 'thumbnail'),
      'show_in_rest' => true,

    );
    register_post_type('history', $data);

    $data = array(
      'labels' => array(
        'name' => _x('Games', 'post type general name'),
        'singular_name' => _x('Game', 'post type singular name'),
        'menu_name' => _x('Games', 'admin menu'),
        'name_admin_bar' => _x('Game', 'add new on admin bar'),
        'add_new' => _x('Add New', 'Game'),
        'add_new_item' => __('Add New Game'),
        'new_item' => __('New Game'),
        'edit_item' => __('Edit Game'),
        'view_item' => __('View Game'),
        'all_items' => __('All Games'),
        'search_items' => __('Search Games'),
        'parent_item_colon' => __('Parent Games:'),
        'not_found' => __('No Games found.'),
        'not_found_in_trash' => __('No Games found in Trash.')
      ),
      'hierarchical' => true,
      'public' => true,
      'has_archive' => true,
      'publicly_queryable' => true,
      'exclude_from_search' => false,
      'show_ui' => true,
      'show_in_menu' => true,
      'rewrite' => array('slug' => 'games', 'with_front' => false),
      'supports' => array('title', 'author', 'comments', 'editor', 'thumbnail'),
      'show_in_rest' => true,

    );
    register_post_type('games', $data);

    $data = array(
      'labels' => array(
        'name' => __('Tech Trees'),
        'singular_name' => __('Tech Tree'),
        'menu_name' => _x('Tech Trees', 'admin menu'),
        'name_admin_bar' => _x('Tech Tree', 'add new on admin bar'),
        'add_new' => _x('Add New Tech Tree', 'Add New Tech Tree'),
        'add_new_item' => __('Add New Tech Tree'),
        'new_item' => __('New Tech Tree'),
        'edit_item' => __('Edit Tech Tree'),
        'view_item' => __('View Tech Tree'),
        'all_items' => __('All Tech Trees'),
        'search_items' => __('Search Tech Trees'),
        'parent_item_colon' => __('Parent Tech Trees:'),
        'not_found' => __('No Tech Trees found.'),
        'not_found_in_trash' => __('No Tech Trees found in Trash.')
      ),
      'public' => true,
      'has_archive' => true,
      'publicly_queryable' => true,
      'exclude_from_search' => false,
      'show_ui' => true,
      'show_in_menu' => true,
      'rewrite' => array('slug' => 'tech-tree', 'with_front' => false),
      'supports' => array('title', 'author', 'comments', 'editor', 'thumbnail'),
      'show_in_rest' => true,
    );
    register_post_type('tech_tree', $data);

    $data = array(
      'labels' => array(
        'name' => _x('Buy Now', 'post type general name'),
        'singular_name' => _x('Buy Now', 'post type singular name'),
        'menu_name' => _x('Buy Now Info & Links', 'admin menu'),
        'name_admin_bar' => _x('Buy Now Pages', 'add new on admin bar'),
        'add_new' => _x('Add New Buy Now Page', 'Buy Now Page'),
        'add_new_item' => __('Add New Buy Now Page'),
        'new_item' => __('New Buy Now Page'),
        'edit_item' => __('Edit Buy Now Page'),
        'view_item' => __('View Buy Now Page'),
        'all_items' => __('Buy Now Pages'),
        'search_items' => __('Search Buy Now Pages'),
        'parent_item_colon' => __('Parent Buy Now Pages:'),
        'not_found' => __('No Buy Now Pages found.'),
        'not_found_in_trash' => __('No Buy Now Pages found in Trash.')
      ),
      'public' => true,
      'has_archive' => true,
      'publicly_queryable' => true,
      'exclude_from_search' => true,
      'show_ui' => true,
      'show_in_menu' => 'edit.php?post_type=games',
      'rewrite' => array('slug' => 'buy-now', 'with_front' => false),
      'supports' => array('title', 'editor', 'thumbnail'),
      'show_in_rest' => true,
      'with_front' => false
    );
    register_post_type('buy_now_pages', $data);

    $data = array(
      'labels' => array(
        'name' => _x('Expansions', 'post type general name'),
        'singular_name' => _x('Expansion', 'post type singular name'),
        'menu_name' => _x('Expansions', 'admin menu'),
        'name_admin_bar' => _x('Expansions', 'add new on admin bar'),
        'add_new' => _x('Add New Expansion', 'Expansion'),
        'add_new_item' => __('Add New Expansion'),
        'new_item' => __('New Expansion'),
        'edit_item' => __('Edit Expansion'),
        'view_item' => __('View Expansion'),
        'all_items' => __('Expansions'),
        'search_items' => __('Search Expansions'),
        'parent_item_colon' => __('Parent Expansions:'),
        'not_found' => __('No Expansions found.'),
        'not_found_in_trash' => __('No Expansions found in Trash.')
      ),
      'public' => true,
      'has_archive' => true,
      'publicly_queryable' => false,
      'exclude_from_search' => true,
      'show_ui' => true,
      'show_in_menu' => 'edit.php?post_type=games',
      'rewrite' => array('slug' => 'expansions', 'with_front' => false),
      'supports' => array('title', 'editor', 'thumbnail'),
      'show_in_rest' => true,
    );
    register_post_type('expansions', $data);

    $data = array(
      'labels' => array(
        'name' => _x('Game Modes', 'post type general name'),
        'singular_name' => _x('Game Mode', 'post type singular name'),
        'menu_name' => _x('Game Modes', 'admin menu'),
        'name_admin_bar' => _x('Game Modes', 'add new on admin bar'),
        'add_new' => _x('Add New Game Mode', 'Game Mode'),
        'add_new_item' => __('Add New Game Mode'),
        'new_item' => __('New Game Mode'),
        'edit_item' => __('Edit Game Mode'),
        'view_item' => __('View Game Mode'),
        'all_items' => __('Game Modes'),
        'search_items' => __('Search Game Modes'),
        'parent_item_colon' => __('Parent Game Modes:'),
        'not_found' => __('No Game Modes found.'),
        'not_found_in_trash' => __('No Game Modes found in Trash.')
      ),
      'public' => true,
      'has_archive' => true,
      'publicly_queryable' => true,
      'exclude_from_search' => false,
      'show_ui' => true,
      'show_in_menu' => 'edit.php?post_type=games',
      'rewrite' => array('slug' => 'game-modes', 'with_front' => false),
      'supports' => array('title', 'author', 'comments', 'editor', 'thumbnail'),
      'show_in_rest' => true,
    );
    register_post_type('game_modes', $data);

    /* test civilizations */
    $data = array(
      'labels' => array(
        'name' => _x('Game Civilizations', 'post type general name'),
        'singular_name' => _x('Civilization', 'post type singular name'),
        'menu_name' => _x('Civilizations', 'admin menu'),
        'name_admin_bar' => _x('Civilizations', 'add new on admin bar'),
        'add_new' => _x('Add New Game Civilization', 'Game Civilization'),
        'add_new_item' => __('Add New Game Civilization'),
        'new_item' => __('New Game Civilization'),
        'edit_item' => __('Edit Game Civilization'),
        'view_item' => __('View Game Civilization'),
        'all_items' => __('Game Civilizations'),
        'search_items' => __('Search Game Civilizations'),
        'parent_item_colon' => __('Parent Game Civilizations:'),
        'not_found' => __('No Game Civilizations found.'),
        'not_found_in_trash' => __('No Game Civilizations found in Trash.')
      ),
      'public' => true,
      'has_archive' => true,
      'publicly_queryable' => true,
      'exclude_from_search' => false,
      'show_ui' => true,
      'show_in_menu' => 'edit.php?post_type=games',
      'rewrite' => array('slug' => 'game-civilizations', 'with_front' => false),
      'supports' => array('title', 'author', 'comments', 'editor', 'thumbnail'),
      'show_in_rest' => true,
    );
    register_post_type('game_civilizations', $data);
    /* end test civilizations */

    $data = array(
      'labels' => array(
          'name' => _x('Learn To Play', 'post type general name'),
          'singular_name' => _x('Learn To Play', 'post type singular name'),
          'menu_name' => _x('Learn To Play', 'admin menu'),
          'name_admin_bar' => _x('Learn To Plays', 'add new on admin bar'),
          'add_new' => _x('Add New Learn To Play', 'Learn To Play'),
          'add_new_item' => __('Add New Learn To Play'),
          'new_item' => __('New Learn To Play'),
          'edit_item' => __('Edit Learn To Play'),
          'view_item' => __('View Learn To Play'),
          'all_items' => __('Learn To Plays'),
          'search_items' => __('Search Learn To Play'),
          'parent_item_colon' => __('Parent Learn To Plays:'),
          'not_found' => __('No Learn To Play found.'),
          'not_found_in_trash' => __('No Learn To Play found in Trash.')
      ),
        'public' => true,
        'has_archive' => true,
        'publicly_queryable' => true,
        'exclude_from_search' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'rewrite' => array('slug' => 'learn-to-play', 'with_front' => false),
        'supports' => array('title', 'editor', 'thumbnail'),
        'show_in_rest' => true,
        'with_front' => false
    );
    register_post_type('learn_to_play', $data);


    $data = array(
      'labels' => array(
        'name' => _x('Clans', 'post type general name'),
        'singular_name' => _x('Clan', 'post type singular name'),
        'menu_name' => _x('Clans', 'admin menu'),
        'name_admin_bar' => _x('Clan', 'add new on admin bar'),
        'add_new' => _x('Add New Clan', 'Clan'),
        'add_new_item' => __('Add New Clan'),
        'new_item' => __('New Clan'),
        'edit_item' => __('Edit Clan'),
        'view_item' => __('View Clan'),
        'all_items' => __('All Clans'),
        'search_items' => __('Search Clans'),
        'parent_item_colon' => __('Parent Clans:'),
        'not_found' => __('No Clans found.'),
        'not_found_in_trash' => __('No Clans found in Trash.')
      ),
      'public' => true,
      'has_archive' => true,
      'publicly_queryable' => true,
      'exclude_from_search' => false,
      'show_ui' => true,
      'show_in_menu' => true,
      'rewrite' => array('slug' => 'clans', 'with_front' => false),
      'supports' => array('title'),
      'show_in_rest' => true,
      'with_front' => false
    );
    register_post_type('clans', $data);

    $data = array(
      'labels' => array(
          'name' => _x('Mods', 'post type general name'),
          'singular_name' => _x('Mod', 'post type singular name'),
          'menu_name' => _x('Mods', 'admin menu'),
          'name_admin_bar' => _x('Mod', 'add new on admin bar'),
          'add_new' => _x('Add New Mod', 'Mod'),
          'add_new_item' => __('Add New Mod'),
          'new_item' => __('New Mod'),
          'edit_item' => __('Edit Mod'),
          'view_item' => __('View Mod'),
          'all_items' => __('All Mods'),
          'search_items' => __('Search Mods'),
          'parent_item_colon' => __('Parent Mods:'),
          'not_found' => __('No Mods found.'),
          'not_found_in_trash' => __('No Mods found in Trash.')
      ),
      'public' => false,
      'has_archive' => false,
      'publicly_queryable' => false,
      'exclude_from_search' => true,
      'show_ui' => true,
      'show_in_menu' => true,
      'rewrite' => array('slug' => 'mods_obj', 'with_front' => false),
      'supports' => array('title','comments'),
      'show_in_rest' => false,
      'with_front' => false
    );
    register_post_type('mods', $data);

    $data = array(
      'labels' => array(
        'name' => _x('Members', 'post type general name'),
        'singular_name' => _x('Member', 'post type singular name'),
        'menu_name' => _x('Members', 'admin menu'),
        'name_admin_bar' => _x('Member', 'add new on admin bar'),
        'add_new' => _x('Add New Member', 'Member'),
        'add_new_item' => __('Add New Member'),
        'new_item' => __('New Member'),
        'edit_item' => __('Edit Member'),
        'view_item' => __('View Member'),
        'all_items' => __('Members'),
        'search_items' => __('Search Members'),
        'parent_item_colon' => __('Parent Members:'),
        'not_found' => __('No Members found.'),
        'not_found_in_trash' => __('No Members found in Trash.')
      ),
      'public' => true,
      'has_archive' => true,
      'publicly_queryable' => true,
      'exclude_from_search' => false,
      'show_ui' => true,
      'show_in_menu' => 'edit.php?post_type=clans',
      'rewrite' => array('slug' => 'members'),
      'supports' => array('title'),
      'show_in_rest' => true,
      'with_front' => false
    );
    register_post_type('members', $data);

    $data = array(
      'labels' => array(
        'name' => _x('Logo Shields', 'post type general name'),
        'singular_name' => _x('Logo Shield', 'post type singular name'),
        'menu_name' => _x('Logo Shields', 'admin menu'),
        'name_admin_bar' => _x('Logo Shield', 'add new on admin bar'),
        'add_new' => _x('Add New Logo Shield', 'Logo Shield'),
        'add_new_item' => __('Add New Logo Shield'),
        'new_item' => __('New Logo Shield'),
        'edit_item' => __('Edit Logo Shield'),
        'view_item' => __('View Logo Shield'),
        'all_items' => __('Logo Shields'),
        'search_items' => __('Search Logo Shields'),
        'parent_item_colon' => __('Parent Logo Shields:'),
        'not_found' => __('No Logo Shields found.'),
        'not_found_in_trash' => __('No Logo Shields found in Trash.')
      ),
      'public' => true,
      'has_archive' => true,
      'publicly_queryable' => true,
      'exclude_from_search' => true,
      'show_ui' => true,
      'show_in_menu' => 'edit.php?post_type=clans',
      'rewrite' => array('slug' => 'logo-shields'),
      'supports' => array('title'),
      'show_in_rest' => true,
      'with_front' => false
    );
    register_post_type('logo_shields', $data);

    $data = array(
      'labels' => array(
        'name' => _x('Logo Backgrounds', 'post type general name'),
        'singular_name' => _x('Logo Background', 'post type singular name'),
        'menu_name' => _x('Logo Backgrounds', 'admin menu'),
        'name_admin_bar' => _x('Logo Background', 'add new on admin bar'),
        'add_new' => _x('Add New Logo Background', 'Logo Shield'),
        'add_new_item' => __('Add New Logo Background'),
        'new_item' => __('New Logo Background'),
        'edit_item' => __('Edit Logo Background'),
        'view_item' => __('View Logo Background'),
        'all_items' => __('Logo Backgrounds'),
        'search_items' => __('Search Logo Backgrounds'),
        'parent_item_colon' => __('Parent Logo Backgrounds:'),
        'not_found' => __('No Logo Backgrounds found.'),
        'not_found_in_trash' => __('No Logo Backgrounds found in Trash.')
      ),
      'public' => true,
      'has_archive' => true,
      'publicly_queryable' => true,
      'exclude_from_search' => true,
      'show_ui' => true,
      'show_in_menu' => 'edit.php?post_type=clans',
      'rewrite' => array('slug' => 'logo-backgrounds'),
      'supports' => array('title'),
      'show_in_rest' => true,
      'with_front' => false
    );
    register_post_type('logo_backgrounds', $data);

    $data = array(
      'labels' => array(
        'name' => _x('Logo Icons', 'post type general name'),
        'singular_name' => _x('Logo Icon', 'post type singular name'),
        'menu_name' => _x('Logo Icons', 'admin menu'),
        'name_admin_bar' => _x('Logo Icon', 'add new on admin bar'),
        'add_new' => _x('Add New Logo Icon', 'Logo Icon'),
        'add_new_item' => __('Add New Logo Icon'),
        'new_item' => __('New Logo Icon'),
        'edit_item' => __('Edit Logo Icon'),
        'view_item' => __('View Logo Icon'),
        'all_items' => __('Logo Icons'),
        'search_items' => __('Search Logo Icons'),
        'parent_item_colon' => __('Parent Logo Icons:'),
        'not_found' => __('No Logo Icons found.'),
        'not_found_in_trash' => __('No Logo Icons found in Trash.')
      ),
      'public' => true,
      'has_archive' => true,
      'publicly_queryable' => true,
      'exclude_from_search' => true,
      'show_ui' => true,
      'show_in_menu' => 'edit.php?post_type=clans',
      'rewrite' => array('slug' => 'logo-icons'),
      'supports' => array('title'),
      'show_in_rest' => true,
      'with_front' => false
    );
    register_post_type('logo_icons', $data);

    $data = array(
      'labels' => array(
        'name' => _x('Background Images', 'post type general name'),
        'singular_name' => _x('Background Image', 'post type singular name'),
        'menu_name' => _x('Background Images', 'admin menu'),
        'name_admin_bar' => _x('Background Image', 'add new on admin bar'),
        'add_new' => _x('Add New Background Image', 'Background Image'),
        'add_new_item' => __('Add New Background Image'),
        'new_item' => __('New Background Image'),
        'edit_item' => __('Edit Background Image'),
        'view_item' => __('View Background Image'),
        'all_items' => __('Background Images'),
        'search_items' => __('Search Background Images'),
        'parent_item_colon' => __('Parent Background Images:'),
        'not_found' => __('No Background Images found.'),
        'not_found_in_trash' => __('No Background Images found in Trash.')
      ),
      'public' => true,
      'has_archive' => true,
      'publicly_queryable' => true,
      'exclude_from_search' => true,
      'show_ui' => true,
      'show_in_menu' => 'edit.php?post_type=clans',
      'rewrite' => array('slug' => 'background-images'),
      'supports' => array('title'),
      'show_in_rest' => true,
      'with_front' => false
    );
    register_post_type('background_images', $data);

    $args = array(
      'labels' => array(
        'name' => __('Live Streams'),
        'singular_name' => __('Live Stream'),
        'name_admin_bar' => _x('Live Stream', 'add new on admin bar'),
        'add_new' => _x('Add New Live Stream', 'Add New Live Stream'),
        'add_new_item' => __('Add New Live Stream'),
        'new_item' => __('New Live Stream'),
        'edit_item' => __('Edit Live Stream'),
        'view_item' => __('View Live Stream'),
        'all_items' => __('All Live Streams'),
        'search_items' => __('Search Live Streams'),
        'not_found' => __('No Live Streams found.'),
        'not_found_in_trash' => __('No Live Streams found in Trash.')
      ),
      'hierarchical' => false,
      'public' => true,
      'publicly_queryable' => false,
      'exclude_from_search' => true,
      'show_ui' => true,
      'show_in_menu' => true,
      'has_archive' => false,
      'supports' => array('thumbnail', 'editor', 'title'),
      'show_in_rest' => true,
    );
    register_post_type('live_stream', $args);

    $args = array(
      'labels' => array(
        'name' => __('Hero Carousel'),
        'singular_name' => __('Hero Slide'),
        'name_admin_bar' => _x('Hero Slide', 'add new on admin bar'),
        'add_new' => _x('New Hero Slide', 'New Hero Slide'),
        'add_new_item' => __('New Hero Slide'),
        'new_item' => __('New Hero Slide'),
        'edit_item' => __('Edit Hero Slide'),
        'view_item' => __('View Hero Slide'),
        'all_items' => __('All Hero Slides'),
        'search_items' => __('Search Hero Slides'),
        'not_found' => __('No Hero Slides found.'),
        'not_found_in_trash' => __('No Hero Slides found in Trash.')
      ),
      'hierarchical' => false,
      'public' => true,
      'publicly_queryable' => false,
      'exclude_from_search' => false,
      'show_ui' => true,
      'show_in_menu' => 'edit.php?post_type=hero_header',
      'has_archive' => false,
      'supports' => array('thumbnail', 'editor', 'title'),
      'show_in_rest' => true,
    );
    register_post_type('hero_slide', $args);


    $args = array(
      'labels' => array(
        'name' => __('Hero Header Carousel'),
        'singular_name' => __('Hero Header Carousel Slide'),
        'name_admin_bar' => _x('Hero Header Carousel Slide', 'add new on admin bar'),
        'add_new' => _x('New Hero Header Carousel Slide', 'New Hero Header Carousel Slide'),
        'add_new_item' => __('New Hero Header Carousel Slide'),
        'new_item' => __('New Hero Header Carousel Slide'),
        'edit_item' => __('Edit Hero Header Carousel Slide'),
        'view_item' => __('View Hero Header Carousel Slide'),
        'all_items' => __('All Hero Header Carousel Slides'),
        'search_items' => __('Search Hero Header Carousel Slides'),
        'not_found' => __('No Hero Header Carousel Slides found.'),
        'not_found_in_trash' => __('No Hero Header Carousel Slides found in Trash.')
      ),
      'hierarchical' => false,
      'public' => true,
      'publicly_queryable' => false,
      'exclude_from_search' => false,
      'show_ui' => true,
      'show_in_menu' => 'edit.php?post_type=hero_header',
      'has_archive' => false,
      'supports' => array('thumbnail', 'editor', 'title'),
      'show_in_rest' => true,
    );
    register_post_type('hero_header_carousel', $args);

    $args = array(
      'labels' => array(
        'name' => __('Hero Franchise'),
        'singular_name' => __('Hero Franchise'),
        'name_admin_bar' => _x('Hero Franchise', 'add new on admin bar'),
        'add_new' => _x('Add New Hero Franchise', 'Add New Hero Franchise'),
        'add_new_item' => __('Add New Hero Franchise'),
        'new_item' => __('New Hero Franchise'),
        'edit_item' => __('Edit Hero Franchise'),
        'view_item' => __('View Hero Franchise'),
        'all_items' => __('All Hero Franchises'),
        'search_items' => __('Search Hero Franchises'),
        'not_found' => __('No Hero Franchises found.'),
        'not_found_in_trash' => __('No Hero Franchises found in Trash.')
      ),
      'hierarchical' => false,
      'public' => true,
      'publicly_queryable' => false,
      'exclude_from_search' => true,
      'show_ui' => true,
      'show_in_menu' => 'edit.php?post_type=hero_header',
      'has_archive' => false,
      'supports' => array('thumbnail', 'editor', 'title'),
      'show_in_rest' => true,
    );
    register_post_type('hero_franchise', $args);

    $args = array(
      'labels' => array(
        'name' => __('Banner Franchise'),
        'singular_name' => __('Banner Franchise'),
        'name_admin_bar' => _x('Banner Franchise', 'add new on admin bar'),
        'add_new' => _x('Add New Banner Franchise', 'Add New Banner Franchise'),
        'add_new_item' => __('Add New Banner Franchise'),
        'new_item' => __('New Banner Franchise'),
        'edit_item' => __('Edit Banner Franchise'),
        'view_item' => __('View Banner Franchise'),
        'all_items' => __('All Banner Franchises'),
        'search_items' => __('Search Banner Franchises'),
        'parent_item_colon' => __('Parent Banner Franchises:'),
        'not_found' => __('No Banner Franchises found.'),
        'not_found_in_trash' => __('No Banner Franchises found in Trash.')
      ),
      'hierarchical' => false,
      'public' => true,
      'publicly_queryable' => false,
      'exclude_from_search' => true,
      'show_ui' => true,
      'show_in_menu' => 'edit.php?post_type=hero_franchise',
      'has_archive' => false,
      'supports' => array('thumbnail', 'editor', 'title'),
      'show_in_rest' => true,
    );
    register_post_type('banner_franchise', $args);

    $args = array(
      'labels' => array(
        'name' => __('Featured Franchise'),
        'singular_name' => __('Featured Franchise'),
        'name_admin_bar' => _x('Featured Franchise', 'add new on admin bar'),
        'add_new' => _x('Add New Featured Franchise', 'Add New Featured Franchise'),
        'add_new_item' => __('Add New Featured Franchise'),
        'new_item' => __('New Featured Franchise'),
        'edit_item' => __('Edit Featured Franchise'),
        'view_item' => __('View Featured Franchise'),
        'all_items' => __('All Featured Franchises'),
        'search_items' => __('Search Featured Franchises'),
        'parent_item_colon' => __('Parent Featured Franchises:'),
        'not_found' => __('No Featured Franchises found.'),
        'not_found_in_trash' => __('No Featured Franchises found in Trash.')
      ),
      'hierarchical' => false,
      'public' => true,
      'publicly_queryable' => false,
      'exclude_from_search' => true,
      'show_ui' => true,
      'show_in_menu' => 'edit.php?post_type=hero_franchise',
      'has_archive' => false,
      'supports' => array('thumbnail', 'editor', 'title'),
      'show_in_rest' => true,
    );
    register_post_type('featured_franchise', $args);

    $args = array(
      'labels' => array(
        'name' => __('Age Media'),
        'singular_name' => __('Media Video'),
        'name_admin_bar' => _x('Media Video', 'add new on admin bar'),
        'add_new' => _x('New Video', 'New Video'),
        'add_new_item' => __('New Video'),
        'new_item' => __('New Video'),
        'edit_item' => __('Edit Video'),
        'view_item' => __('View Video'),
        'all_items' => __('All Videos'),
        'search_items' => __('Search Videos'),
        'not_found' => __('No Videos found.'),
        'not_found_in_trash' => __('No Videos found in Trash.')
      ),
      'hierarchical' => false,
      'public' => true,
      'publicly_queryable' => false,
      'exclude_from_search' => false,
      'show_ui' => true,
      'show_in_menu' => true,
      'has_archive' => false,
      'supports' => array('thumbnail', 'editor', 'title'),
      'show_in_rest' => true,
    );
    register_post_type('media_video', $args);

    $args = array(
      'labels' => array(
        'name' => __('Media Screenshot'),
        'singular_name' => __('Media Screenshot'),
        'name_admin_bar' => _x('Media Screenshot', 'add new on admin bar'),
        'add_new' => _x('New Screenshot', 'New Screenshot'),
        'add_new_item' => __('New Screenshot'),
        'new_item' => __('New Screenshot'),
        'edit_item' => __('Edit Screenshot'),
        'view_item' => __('View Screenshot'),
        'all_items' => __('All Screenshots'),
        'search_items' => __('Search Screenshots'),
        'not_found' => __('No Screenshots found.'),
        'not_found_in_trash' => __('No Screenshots found in Trash.')
      ),
      'hierarchical' => false,
      'public' => true,
      'publicly_queryable' => false,
      'exclude_from_search' => false,
      'show_ui' => true,
      'show_in_menu' => 'edit.php?post_type=media_video',
      'has_archive' => false,
      'supports' => array('thumbnail', 'editor', 'title'),
      'show_in_rest' => true,
    );
    register_post_type('media_screenshot', $args);

    $args = array(
            'labels' => array(
                'name' => __('Flight Videos'),
                'singular_name' => __('Flight Video'),
                'name_admin_bar' => _x('Add Flight Video', 'add new on admin bar'),
                'add_new' => _x('Add Flight Video', 'New Flight Video'),
                'add_new_item' => __('New Flight Video'),
                'new_item' => __('New Flight Video'),
                'edit_item' => __('Edit Flight Video'),
                'view_item' => __('View Flight Video'),
                'all_items' => __('All Flight Videos'),
                'search_items' => __('Search Flight Videos'),
                'not_found' => __('No Flight Videos found.'),
                'not_found_in_trash' => __('No Flight Videos found in Trash.')
            ),
            'hierarchical' => false,
            'public' => true,
            'publicly_queryable' => false,
            'exclude_from_search' => true,
            'show_ui' => true,
            'show_in_menu' => true,
            'has_archive' => false,
            //'taxonomies' => array('category'),
            'supports' => array('thumbnail', 'azure_storage', 'title'),
            'show_in_rest' => true,
        );
        register_post_type('flight_videos', $args);

    $args = array(
      'labels' => array(
        'name' => __('Media Wallpaper'),
        'singular_name' => __('Media Wallpaper'),
        'name_admin_bar' => _x('Media Wallpaper', 'add new on admin bar'),
        'add_new' => _x('New Wallpaper', 'New Wallpaper'),
        'add_new_item' => __('New Wallpaper'),
        'new_item' => __('New Wallpaper'),
        'edit_item' => __('Edit Wallpaper'),
        'view_item' => __('View Wallpaper'),
        'all_items' => __('All Wallpapers'),
        'search_items' => __('Search Wallpapers'),
        'not_found' => __('No Wallpapers found.'),
        'not_found_in_trash' => __('No Wallpapers found in Trash.')
      ),
      'hierarchical' => false,
      'public' => true,
      'publicly_queryable' => false,
      'exclude_from_search' => false,
      'show_ui' => true,
      'show_in_menu' => 'edit.php?post_type=media_video',
      'has_archive' => false,
      'supports' => array('thumbnail', 'editor', 'title'),
      'show_in_rest' => true,
    );
    register_post_type('media_wallpaper', $args);

    $args = array(
      'labels' => array(
        'name' => __('Comparison'),
        'singular_name' => __('Comparison'),
        'name_admin_bar' => _x('Comparison', 'add new on admin bar'),
        'add_new' => _x('New Comparison', 'New Comparison'),
        'add_new_item' => __('New Comparison'),
        'new_item' => __('New Comparison'),
        'edit_item' => __('Edit Comparison'),
        'view_item' => __('View Comparison'),
        'all_items' => __('All Comparisons'),
        'search_items' => __('Search Comparisons'),
        'not_found' => __('No Comparisons found.'),
        'not_found_in_trash' => __('No Comparisons found in Trash.')
      ),
      'hierarchical' => false,
      'public' => true,
      'publicly_queryable' => false,
      'exclude_from_search' => true,
      'show_ui' => true,
      'show_in_menu' => true,
      'has_archive' => false,
      'supports' => array('thumbnail', 'editor', 'title'),
      'show_in_rest' => true,
    );
    register_post_type('comparison', $args);
  }


  // ------------------------------------------------
  // Register Taxonomies
  // ------------------------------------------------

  public function register_taxonomies(){
    $args = array(
      'hierarchical'      => true,
      'labels'            => array(
        'name'              => _x( 'Game', 'taxonomy general name' ),
        'singular_name'     => _x( 'Game', 'taxonomy singular name' ),
        'search_items'      => __( 'Search Games' ),
        'all_items'         => __( 'All Games' ),
        'parent_item'       => __( 'Parent Games' ),
        'parent_item_colon' => __( 'Parent Games:' ),
        'edit_item'         => __( 'Edit Game' ),
        'update_item'       => __( 'Update Game' ),
        'add_new_item'      => __( 'Add New Game' ),
        'new_item_name'     => __( 'New Game' ),
        'menu_name'         => __( 'Games' ),
      ),
      'query_var'         => false,
      "show_in_rest" 		=> true,
      'show_admin_column' => true,
      'rewrite'      => array('slug' => 'game', 'with_front' => true)
    );
    register_taxonomy( 'game', ['post','learn_to_play'], $args );

    $args = array(
      'hierarchical'      => true,
      'labels'            => array(
        'name'              => _x( 'Sub categories', 'taxonomy general name' ),
        'singular_name'     => _x( 'Sub category', 'taxonomy singular name' ),
        'search_items'      => __( 'Search Sub categories' ),
        'all_items'         => __( 'All Sub categories' ),
        'parent_item'       => __( 'Parent Sub categories' ),
        'parent_item_colon' => __( 'Parent Sub categories:' ),
        'edit_item'         => __( 'Edit Sub category' ),
        'update_item'       => __( 'Update Sub category' ),
        'add_new_item'      => __( 'Add New Sub category' ),
        'new_item_name'     => __( 'New Sub category' ),
        'menu_name'         => __( 'Sub categories' ),
      ),
      'query_var'         => false,
      "show_in_rest" 		=> true,
      'show_admin_column' => true,
      'rewrite'      => array('slug' => 'sub-categories', 'with_front' => true)
    );
    register_taxonomy( 'sub_categories', 'post', $args );

    $args = array(
            'hierarchical' => true,
            'labels' => array(
                'name' => _x('Flight', 'taxonomy general name'),
                'singular_name' => _x('Flight', 'taxonomy singular name'),
                'search_items' => __('Search Flights'),
                'all_items' => __('All Flights'),
                'parent_item' => __('Parent Flight'),
                'parent_item_colon' => __('Parent Flights:'),
                'edit_item' => __('Edit Flight'),
                'update_item' => __('Update Flight'),
                'add_new_item' => __('Add New Flight'),
                'new_item_name' => __('New Flight'),
                'menu_name' => __('Flights'),
            ),
            'query_var' => false,
            "show_in_rest" => true,
            'show_admin_column' => true,
            'rewrite' => array('slug' => 'flight', 'with_front' => true)
        );
        register_taxonomy('flights', 'flight_videos', $args);

    $args = array(
            'hierarchical' => true,
            'labels' => array(
                'name' => _x('Flight Category', 'taxonomy general name'),
                'singular_name' => _x('Flight Category', 'taxonomy singular name'),
                'search_items' => __('Search Flight Categories'),
                'all_items' => __('All Flight Categories'),
                'parent_item' => __('Parent Flight Category'),
                'parent_item_colon' => __('Parent Flights Categories:'),
                'edit_item' => __('Edit Flight Category'),
                'update_item' => __('Update Flight Category'),
                'add_new_item' => __('Add New Flight Category'),
                'new_item_name' => __('New Flight Category'),
                'menu_name' => __('Flight Categories'),
            ),
            'query_var' => false,
            "show_in_rest" => true,
            'show_admin_column' => true,
            'rewrite' => array('slug' => 'flight-category', 'with_front' => true)
        );
        register_taxonomy('flight_categories', 'flight_videos', $args);


  }
}
