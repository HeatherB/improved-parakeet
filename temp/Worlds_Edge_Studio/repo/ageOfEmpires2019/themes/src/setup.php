<?php

namespace App;

use Illuminate\Contracts\Container\Container as ContainerContract;
use Roots\Sage\Assets\JsonManifest;
use Roots\Sage\Config;
use Roots\Sage\Template\Blade;
use Roots\Sage\Template\BladeProvider;

/**
 * Theme assets
 */
add_action('admin_enqueue_scripts', function() {
    wp_enqueue_script('sage/main.js', asset_path('scripts/admin-main.js'), null, null, true);
});
add_action('wp_enqueue_scripts', function () {
    $newscontroller = new \Roots\Controllers\NewsController;
    if ( current_user_can( 'manage_options' ) ) {
        $admin = 1;
    } else {
        $admin = 0;
    }
    $useragent=$_SERVER['HTTP_USER_AGENT'];
    if(preg_match('/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i',$useragent)||preg_match('/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i',substr($useragent,0,4))) :
      $is_mobile = true;
    else :
      $is_mobile = false;
    endif;
    $is_logged_in = ( is_user_logged_in()) ? true : false;
    $user_id =  ( $is_logged_in ) ? get_current_user_id() : null;  
    $user_data = null;  
    if ($is_logged_in) {
        $user_data = array_map( function( $a ){ return $a[0]; }, get_user_meta( $user_id ) );
        if (isset($user_data['msa_xuid'])) {
            $response = wp_remote_get("https://webapi.ageofempires.com/api/AgeInsiders/users/".$user_data['msa_xuid']);
            if (!is_wp_error($response)) {
                $flight_groups = json_decode($response['body']);
            }
        } else if (isset($user_data['steam_id'])) {
            $response = wp_remote_get("https://webapi.ageofempires.com/api/AgeInsiders/users/".$user_data['steam_id']);
            if (!is_wp_error($response)) {
                $flight_groups = json_decode($response['body']);
            }
        }
        if (!isset($_COOKIE['age_auto_login']) && isset($user_data['msa_gt']) && isset($_COOKIE['_AgeOfEmpiresServices'])) {
            $request = wp_remote_get("https://forums.ageofempires.com/users/" . str_replace(' ', '', $user_data['msa_gt']) . ".json");
            if( !is_wp_error( $request ) ) {
                $body = wp_remote_retrieve_body( $request );
                $forum_user_data = json_decode( $body );
                if (isset($forum_user_data->user->id)) {
                    setcookie('age_auto_login', true, time() + (86400 * 30), "/", ".ageofempires.com");
                }
            }
        }
    }
     
    wp_enqueue_style('sage/main.css', asset_path('styles/main.css'), false, null);
    wp_enqueue_style('sage/style.css', get_template_directory_uri() . '/style.css', false, null);
    wp_enqueue_script('sage/main.js', asset_path('scripts/main.js'), null, null, true);
    /*pinyin coversion */
   /* add_action('admin_enqueue_scripts', function() {
        wp_enqueue_script('MakePinyinAvilable.js', asset_path('scripts/admin-main.js'), null, null, true);
    });*/
    /* lottie script */
   /* if ( 'learn_to_play' === get_post_type() ) {
    //if (strpos($_SERVER['REQUEST_URI'], '/learn-to-play')) {
        wp_enqueue_script('lottieWeb.js', 'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.7.5/lottie.min.js', null, null, true);
    //}
    }*/

    $currentUser = ( $is_logged_in ? $user_id : '1' );
    $all_flagged = get_post_meta(get_the_id(),'flagged_by');
    (empty($all_flagged) ? $all_flagged = [] : '' );
    $is_flagged = in_array($currentUser,$all_flagged);
    $gamertag = null;
    $gamertag = ($gamertag == null && isset($user_data['msa_gt']) && !empty($user_data['msa_gt'])) ? $user_data['msa_gt'] : $gamertag;
    $gamertag = ($gamertag == null && isset($user_data['steam_personaname']) && !empty($user_data['steam_personaname'])) ? $user_data['steam_personaname'] : $gamertag;
    $gamertag = (get_query_var('gamertag')) ? get_query_var('gamertag') : $gamertag;
    $gameType = ( (get_query_var('gameType')) ? get_query_var('gameType') : isset($_GET['gameType']) ) ? $_GET['gameType'] : '';
    $game = (get_query_var('game')) ? get_query_var('game') : '';
    $modernGamertag = $user_data['msa_modern_gamertag'] ?? $gamertag;
    $gameId = ( (get_query_var('gameId')) ? get_query_var('gameId') : isset($_GET['gameId']) ) ? $_GET['gameId'] : '';
    $profileId = ( (get_query_var('profileId')) ? get_query_var('profileId') : isset($_GET['profileId']) ) ? $_GET['profileId'] : 0;
    $profileId = (is_numeric($profileId) || $profileId == null) ? $profileId : 0;
    $locale = get_locale();
    wp_localize_script( 'sage/main.js', 'wp_object',
        array(
            'ajaxurl' => admin_url( 'admin-ajax.php' ),
            'jsonurl' => esc_url_raw( home_url() ) . "/wp-content/themes/msgpwebteam/assets/json/",
            'imageurl' => esc_url_raw( home_url() ) . "/wp-content/themes/msgpwebteam/assets/images/",
            'animationurl'  => asset_path('images/anims/button-highlight4.json'),
            'homeUrl' => esc_url_raw( home_url() ),
            'user_logged_in' => array(
                'status' => (bool) $is_logged_in,
                'flight_groups' => isset($flight_groups) ? $flight_groups->groups : '',
            ),
            'user_id' => $user_id,
            'gamertag' => $gamertag,
            'modernGamertag' => $modernGamertag,
            'gameType' => $gameType,
            'game' => $game,
            'player' => isset($_GET['player']) ? $_GET['player'] : '',
            'gameId' => $gameId,
            'locale' => $locale,
            'devices' =>array(
              'isMobile' => $is_mobile,
            ),
            'ajax_nonce' => wp_create_nonce('the_nonce'),
            'can_edit'  => $admin,
            'avatar' => get_avatar( get_current_user_id() ),
            'loading_spinner' =>  "<img src='" . get_stylesheet_directory_uri() . "/assets/images/placeholder_loading.gif' class='overlay__image' />",
            'ltp_btn_point_animationurl'  => asset_path('images/anims/anim-point.json'),
            'ltp_btn_magin_animationurl'  => asset_path('images/anims/anim-magin.json'),
            'ltp_btn_magout_animationurl'  => asset_path('images/anims/anim-magout.json'),
            'ltp_btn_prev_animationurl'  => asset_path('images/anims/anim-prev.json'),
            'ltp_btn_next_animationurl'  => asset_path('images/anims/anim-next.json'),
            'ltp_btn_minus_animationurl'  => asset_path('images/anims/anim-minus.json'),
            'ltp_btn_plus_animationurl'  => asset_path('images/anims/anim-plus.json'),
            'sandbutton'                => asset_path('images/anims/sandbutton.json'),
            'modId' => (get_query_var('mod_id')) ? get_query_var('mod_id') : null,
            //'playerId' => (get_query_var('player_id')) ? get_query_var('player_id') : 'd54fa70fc74eb929', // TODO: should be null, but hardcoding for now
            //Needed for clan edit
            'clanId' => (get_query_var('clan_id')) ? get_query_var('clan_id') : null,
            'clan_ID' => (get_post_type() == 'clans') ? get_the_ID() : null,
            //'memberId' => ( $member_id ) ? $member_id : null,
            'post_ID' => get_the_ID(),
            'comment_number' => $newscontroller->comment_number,
            'playerId' => $user_id,
            'clanIsFlagged' => $is_flagged,
            'clanAssoc' => $user_data['clan_assoc'] ?? '',
            'ownsClan' => $user_data['owns_clan'] ?? '',
            'clanRole' => isset($user_data['member_role_clan_']) ? $user_data['member_role_clan_'] : '',
            'profileId' => $profileId,
        )
    );
}, 100);


/**
 * Theme setup
 */
add_action('after_setup_theme', function () {
    /**
     * Enable features from Soil when plugin is activated
     * @link https://roots.io/plugins/soil/
     */
    add_theme_support('soil-clean-up');
    add_theme_support('soil-jquery-cdn');
    add_theme_support('soil-nav-walker');
    add_theme_support('soil-nice-search');
    add_theme_support('soil-relative-urls');

    /**
     * Enable plugins to manage the document title
     * @link https://developer.wordpress.org/reference/functions/add_theme_support/#title-tag
     */
    add_theme_support('title-tag');

    /**
     * Register navigation menus
     * @link https://developer.wordpress.org/reference/functions/register_nav_menus/
     */
    register_nav_menus([
        'primary_navigation' => __('Primary Navigation', 'sage')
    ]);

    /**
     * Enable post thumbnails
     * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
     */
    add_theme_support('post-thumbnails');

    /**
     * Enable HTML5 markup support
     * @link https://developer.wordpress.org/reference/functions/add_theme_support/#html5
     */
    add_theme_support('html5', ['caption', 'comment-form', 'comment-list', 'gallery', 'search-form']);

    /**
     * Enable selective refresh for widgets in customizer
     * @link https://developer.wordpress.org/themes/advanced-topics/customizer-api/#theme-support-in-sidebars
     */
    add_theme_support('customize-selective-refresh-widgets');

    /**
     * Use main stylesheet for visual editor
     * @see assets/styles/layouts/_tinymce.scss
     */
    add_editor_style(asset_path('styles/main.css'));
}, 20);

/**
 * Register sidebars
 */
add_action('widgets_init', function () {
    $config = [
        'before_widget' => '<section class="widget %1$s %2$s">',
        'after_widget'  => '</section>',
        'before_title'  => '<h3>',
        'after_title'   => '</h3>'
    ];
    register_sidebar([
        'name'          => __('Primary', 'sage'),
        'id'            => 'sidebar-primary'
    ] + $config);
    register_sidebar([
        'name'          => __('Footer', 'sage'),
        'id'            => 'sidebar-footer'
    ] + $config);
});

/**
 * Updates the `$post` variable on each iteration of the loop.
 * Note: updated value is only available for subsequently loaded views, such as partials
 */
add_action('the_post', function ($post) {
    sage('blade')->share('post', $post);
});

/**
 * Setup Sage options
 */
add_action('after_setup_theme', function () {
    /**
     * Sage config
     */
    $paths = [
        'dir.stylesheet' => get_stylesheet_directory(),
        'dir.template'   => get_template_directory(),
        'dir.upload'     => wp_upload_dir()['basedir'],
        'uri.stylesheet' => get_stylesheet_directory_uri(),
        'uri.template'   => get_template_directory_uri(),
    ];
    $viewPaths = collect(preg_replace('%[\/]?(templates)?[\/.]*?$%', '', [STYLESHEETPATH, TEMPLATEPATH]))
        ->flatMap(function ($path) {
            return ["{$path}/templates", $path];
        })->unique()->toArray();
    config([
        'assets.manifest' => "{$paths['dir.stylesheet']}/dist/assets.json",
        'assets.uri'      => "{$paths['uri.stylesheet']}/dist",
        'view.compiled'   => "{$paths['dir.upload']}/cache/compiled",
        'view.namespaces' => ['App' => WP_CONTENT_DIR],
        'view.paths'      => $viewPaths,
    ] + $paths);

    /**
     * Add JsonManifest to Sage container
     */
    sage()->singleton('sage.assets', function () {
        return new JsonManifest(config('assets.manifest'), config('assets.uri'));
    });

    /**
     * Add Blade to Sage container
     */
    sage()->singleton('sage.blade', function (ContainerContract $app) {
        $cachePath = config('view.compiled');
        if (!file_exists($cachePath)) {
            wp_mkdir_p($cachePath);
        }
        (new BladeProvider($app))->register();
        return new Blade($app['view'], $app);
    });

    /**
     * Create @asset() Blade directive
     */
    sage('blade')->compiler()->directive('asset', function ($asset) {
        return '<?= App\\asset_path(\''.trim($asset, '\'"').'\'); ?>';
    });
});

add_action( 'init', function() {
  //error_log('cookie val: '.$_COOKIE["age_forum_logged_in"] . 'redirect: ' . $_COOKIE["age_login_redirect"]);
    if (isset($_COOKIE["age_forum_logged_in"]) && $_COOKIE["age_forum_logged_in"] == true 
        && !is_user_logged_in() 
        && isset($_COOKIE["age_login_redirect"]) && $_COOKIE["age_login_redirect"] != true) {
    setcookie('age_login_redirect', true, time() + 14400, "/");
    setcookie('MSA_PAGE_REDIRECT', home_url($_SERVER['REQUEST_URI']), time() + 14400, "/");
    wp_redirect('https://auth.ageofempires.com/?env=dev');
    exit;
	}
}, 1 );

/**
 * Init config
 */
sage()->bindIf('config', Config::class, true);
new \Roots\Data\DataTypes;
new \Roots\Data\JuicerData;
new \Roots\Mods\ModsMain;
new \Roots\Mods\ModsModeration;
new \Roots\Clans\ClansMain;
new \Roots\Clans\ClansRewrites;
new \Roots\Clans\ClansSave;
new \Roots\Clans\ClansEdit;
new \Roots\Clans\ClansExistingCheck;
new \Roots\Clans\ClansImages;
new \Roots\Clans\ClansRedirect;
new \Roots\Clans\ClansRefreshToken;
new \Roots\Clans\ClansReserve;
//new \Roots\Clans\ClansBannerPosters;
new \Roots\Clans\ClansLogoIcons;
new \Roots\Clans\ClansLogoShields;
new \Roots\Clans\ClansLogoBackgrounds;
new \Roots\Clans\ClansBackgroundImages;
new \Roots\Clans\ClansMembers;
new \Roots\Clans\ClansMemberProfile;
new \Roots\Clans\ClansApplicants;
new \Roots\Clans\ClansBlocked;
new \Roots\Controllers\BuyNowController;
new \Roots\Clans\ClansMemberJoin;
new \Roots\Insiders\Insiders;
new \Roots\Controllers\NewsController;
new \Roots\Controllers\UserController;
new \Roots\Controllers\InsidersController;
new \Roots\Stats\StatsMain;
new \Roots\Clans\Languages;
new \Roots\Controllers\TranslationsController;
new \Roots\Controllers\LearnToPlayController;
new \Roots\Controllers\FlightVideos;