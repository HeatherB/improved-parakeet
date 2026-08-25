<?php
wp_reset_query();

// Get the custom post type single post ID to be used in queries
$game_id = get_field('game_info_radio_button_value');


// VIDEOS

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
            'value' => $game_id,
            'compare' => '=',
        )
    )
);

// query media video
$query = new \WP_Query($args);

// get video objects
$videos = [];

while ($query->have_posts()) : $query->the_post();
    $video = array(
    	'youtube_id' => get_field('media_video_youtube_id'),
    	'title' => html_entity_decode(get_the_title())
    );
    array_push($videos, $video);
endwhile;

function get_video_thumb($video_id) {
	return 'https://img.youtube.com/vi/' . $video_id . '/maxresdefault.jpg';
}

// WALLPAPERS

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
            'value' => $game_id,
            'compare' => '=',
        )
    )
);

// query media wallpaper
$query = new \WP_Query($args);

// get wallpaper urls
$wallpapers = [];

while ($query->have_posts()) : $query->the_post();
    $wallpaper = get_field('media_wallpaper_desktop_1920x1080');
    $wallpaper_url = $wallpaper['url'];
    array_push($wallpapers,$wallpaper_url);
endwhile;


// SCREENSHOTS

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
            'value' => $game_id,
            'compare' => '=',
        )
    )
);

// query media screenshots
$query = new \WP_Query($args);

// get screenshot urls
$screenshots = [];

while ($query->have_posts()) : $query->the_post();
    $screenshot = get_field('media_screenshot_image');
    $screenshot_url = $screenshot['url'];
    array_push($screenshots,$screenshot_url);
endwhile;

wp_reset_query(); wp_reset_postdata();

$post_slug = get_post_field( 'post_name', get_post() );
?>

{{-- the data-type of each slider must match the data-type of a toggle --}}
<div class="media__slider --videos js-media-slider" data-type="videos">
	@foreach($videos as $video)
        <div class="media__item">
			<a class="media__item__link">
                <img src="{{get_video_thumb($video['youtube_id'])}}" />
                {{icon('play','play-icon')}}
                <h4 class="media__video__title">
                    {{-- span is needed to control max number of rows --}}
                    <span>{{$video['title']}}</span>
                </h4>
			</a>
        </div>
	@endforeach
</div>	

<div class="media__slider --screenshots js-media-slider" data-type="screenshots">
	@foreach($screenshots as $screenshot)
        <div class="media__item">
			<a class="media__item__link">
				<img class="media__screenshot__thumbnail" src="{{$screenshot}}"/>
			</a>
        </div>
	@endforeach
</div>

<div class="media__slider --wallpapers js-media-slider" data-type="wallpapers">
	@foreach($wallpapers as $wallpaper)
        <div class="media__item">
			<a class="media__item__link">
				<img class="media__wallpaper__thumbnail" src="{{$wallpaper}}"/>
			</a>
        </div>
	@endforeach
</div>		

<nav class="media__nav">
    <div class="media__nav__arrows">
        <button class="media__nav__arrow --prev js-media-control-prev" title="Previous">
            {{icon('pointer-left')}}    
        </button>
        <button class="media__nav__arrow --next js-media-control-next" title="Next">
            {{icon('pointer-right')}}
        </button>
    </div>

    <?php
        $media_nav_items = array(
            array(
                'label' => 'Videos',
                'icon' => 'play',
                'image_path' => 'images/glp-temp-desk-reverse.png',
                'class_mod' => 'videos'
            ),
            array(
                'label' => 'Images',
                'icon' => 'news',
                'image_path' => 'images/glp-temp-desk-reverse.png',
                'class_mod' => 'screenshots'
            ),
            array(
                'label' => 'Wallpapers',
                'icon' => 'globe',
                'image_path' => 'images/glp-temp-desk-reverse.png',
                'class_mod' => 'wallpapers'
            )
        );
    ?>   

	<ul class="media__nav__list">
        @foreach($media_nav_items as $item)
            <li class="media__nav__item">
                {{-- the data-type of each toggle must match the data-type of a slider --}}
                <button class="media__nav__link --{{$item['class_mod']}} js-media-toggle" data-type="{{$item['class_mod']}}">
                    <span class="media__nav__text">{{$item['label']}}</span>
                    {{icon($item['icon'], '')}}
                    <img src="@asset($item['image_path'])" alt="" role="presentation"/>
                </button>
            </li>
        @endforeach
	</ul>
</nav>