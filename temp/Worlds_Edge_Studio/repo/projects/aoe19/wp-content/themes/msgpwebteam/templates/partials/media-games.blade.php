<?php

/**
 *  Media Carousel for Videos
 */

wp_reset_query();
// Get the custom post type single post ID to be used in queries
$game_info_radio_button_value = get_field('game_info_radio_button_value');

// set args for media video related to GAME only
$args = array(
    'post_type' => 'media_video',
    'post_status' => 'publish',
    'posts_per_page' => '-1',
    'orderby' => array(
        'date' => 'DESC' // Today, yesterday, day before that, etc.
    ),
    'meta_query' => array(
        "relation" => "AND",
        array(
            'key' => 'media_video_game',
            'value' => $game_info_radio_button_value,
            'compare' => '=',
        )
    )
);

// query media video
$query = new \WP_Query($args);

$media_video_youtube_id_arr = [];

while ($query->have_posts()) : $query->the_post();
    // get media video data
    $media_video_game = get_field('media_video_game');
    $media_video_game_value = $media_video_game['value'];
    $media_video_youtube_id = get_field('media_video_youtube_id');
    array_push($media_video_youtube_id_arr,$media_video_youtube_id);
endwhile;

// NOTE:  There are two decent sizes available for youtube thumbnail images
//        mqdefault.jpg = 320x180 px + no black bars and is 16x9
//        hqdefault.jpg = 480x360 px + black bars top and bottom but content area is 16x9
if (!empty($media_video_youtube_id_arr)) :
    $media_video_youtube_id_arr_sizeof = sizeof($media_video_youtube_id_arr) - 1;
    $media_video_youtube_img_url = 'https://img.youtube.com/vi/'.$media_video_youtube_id_arr[mt_rand (0,$media_video_youtube_id_arr_sizeof)].'/maxresdefault.jpg';
endif;

// set args for media wallpapers related to GAME only
$args = array(
    'post_type' => 'media_wallpaper',
    'post_status' => 'publish',
    'posts_per_page' => '-1',
    'orderby' => array(
        'date' => 'DESC' // Today, yesterday, day before that, etc.
    ),
    'meta_query' => array(
        "relation" => "AND",
        array(
            'key' => 'media_wallpaper_game',
            'value' => $game_info_radio_button_value,
            'compare' => '=',
        )
    )
);

// query media wallpaper
$query = new \WP_Query($args);

$media_wallpaper_desktop_1920x1080_url_arr = [];

while ($query->have_posts()) : $query->the_post();
// get media wallpaper data
    $media_wallpaper_desktop_1920x1080 = get_field('media_wallpaper_desktop_1920x1080');
    $media_wallpaper_desktop_1920x1080_url = $media_wallpaper_desktop_1920x1080['url'];
    array_push($media_wallpaper_desktop_1920x1080_url_arr,$media_wallpaper_desktop_1920x1080_url);
endwhile;

$media_wallpaper_desktop_1920x1080_url_arr_sizeof = sizeof($media_wallpaper_desktop_1920x1080_url_arr) - 1;

// set args for media screenshots related to GAME only
$args = array(
    'post_type' => 'media_screenshot',
    'post_status' => 'publish',
    'posts_per_page' => '-1',
    'orderby' => array(
        'date' => 'DESC' // Today, yesterday, day before that, etc.
    ),
    'meta_query' => array(
        "relation" => "AND",
        array(
            'key' => 'media_screenshot_game',
            'value' => $game_info_radio_button_value,
            'compare' => '=',
        )
    )
);

// query media screenshots
$query = new \WP_Query($args);

$media_screenshot_image_url_arr = [];

while ($query->have_posts()) : $query->the_post();
// get media screenshot data
    $media_screenshot_image = get_field('media_screenshot_image');
    $media_screenshot_image_url = $media_screenshot_image['url'];
    array_push($media_screenshot_image_url_arr,$media_screenshot_image_url);
endwhile;

$media_screenshot_image_url_arr_sizeof = sizeof($media_screenshot_image_url_arr) - 1;

wp_reset_query(); wp_reset_postdata();

$post_slug = get_post_field( 'post_name', get_post() );
?>

<div class="media section--padding @if($post_slug == "aoeiide" || $game_info_radio_button_value == "aoe2de") background--rock section--divider-frank-mid @else section--divider-egypt-mid background--paper @endif">
    <div id="media-games__container">
        <div class="row ">
            <div class="relative__container">
                <div id="media-games__container-videos">
                    <div class="media-games-frame__container background--rock">
                        <div class="media-games-content_container">
                            <div class="media-games-header">
                                Videos <span class="item-count">(<?php echo sizeof($media_video_youtube_id_arr);?>)</span>
                            </div>
                            <div class="media-games-content">
                                <a href="<?php echo (get_site_url() . '/media/?filter=' . $game_info_radio_button_value); ?>&section=videos" style="background-image: url(<?php echo $media_video_youtube_img_url; ?>);">
                                    <span class="visually-hidden">{{getAriaPhrase($post_slug)}} Videos</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="media-games__container-stills-wrapper">
                    <div id="media-games__container-wallpapers">
                        <div class="media-games-frame__container background--rock">
                            <div class="media-games-content_container">
                                <div class="media-games-header">
                                    Wallpapers (<?php echo sizeof($media_wallpaper_desktop_1920x1080_url_arr);?>)
                                </div>
                                <div class="media-games-content">
                                    <a href="<?php echo (get_site_url() . '/media/?filter=' . $game_info_radio_button_value); ?>&section=wallpapers" style="background-image: url(<?php echo $media_wallpaper_desktop_1920x1080_url_arr[mt_rand (0,$media_wallpaper_desktop_1920x1080_url_arr_sizeof)]; ?>);">
                                        <span class="visually-hidden">{{getAriaPhrase($post_slug)}} Wallpapers</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="media-games__container-screenshots">
                        <div class="media-games-frame__container background--rock">
                            <div class="media-games-content_container">
                                <div class="media-games-header">
                                    Screenshots (<?php echo sizeof($media_screenshot_image_url_arr);?>)
                                </div>
                                <div class="media-games-content">
                                    <a href="<?php echo (get_site_url() . '/media/?filter=' . $game_info_radio_button_value); ?>&section=screenshots" style="background-image: url(<?php echo $media_screenshot_image_url_arr[mt_rand (0,$media_screenshot_image_url_arr_sizeof)]; ?>);"><span class="visually-hidden">{{getAriaPhrase($post_slug)}} Screenshots</span></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<?php wp_reset_query(); ?>


