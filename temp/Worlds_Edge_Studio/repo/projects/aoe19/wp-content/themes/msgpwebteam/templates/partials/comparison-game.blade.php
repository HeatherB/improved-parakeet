<?php

/**
 *  Comparison slide for images and mp4 videos
 */

wp_reset_query();
// Get the custom post type single post ID to be used in queries
$game_info_radio_button_value = get_field('game_info_radio_button_value');

// set args for comparison related to GAME only
$args = array(
        'post_type' => 'comparison',
        'post_status' => 'publish',
        'posts_per_page' => '1',
        'orderby' => array(
                'date' => 'DESC' // Today, yesterday, day before that, etc.
        ),
        'meta_query' => array(
                "relation" => "AND",
                array(
                        'key' => 'comparison_game',
                        'value' => $game_info_radio_button_value,
                        'compare' => '=',
                )
        )
);

// query comparison
$query = new \WP_Query($args);

?>


<?php

echo('<div id="comparison-wrapper">');

// start loop for comparison display area
while ($query->have_posts()) : $query->the_post();
    // get comparison data
    $comparison_type = get_field('comparison_type');
    if($comparison_type == 'compare_image'){
        $comparison_before_image_url = get_field('comparison_before_image');
        $comparison_after_image_url = get_field('comparison_after_image');
    } else {
        $comparison_before_poster_image_url = get_field('comparison_before_poster_image');
        $comparison_after_poster_image_url = get_field('comparison_after_poster_image');
        $comparison_before_mp4_url = get_field('comparison_before_mp4');
        $comparison_after_mp4_url = get_field('comparison_after_mp4');
    }
    $comparison_before_text = get_field('comparison_before_text');
    $comparison_after_text = get_field('comparison_after_text');

    $comparison_caption_text = get_field('comparison_caption_text');



    echo('<div id="comparison" class="frame-box">');
    echo('    <div class="comparison-container">');
    if($comparison_type == 'compare_image'){
        // comparison image
        echo ('<img src="'.$comparison_before_image_url.'" />');
    } else {
        // comparison video
        echo ('<img class="mobile-only" src="'.$comparison_before_poster_image_url.'" />');
        echo('<video id="video-before" muted loop poster="'.$comparison_before_poster_image_url.'">');
        echo('    <source src="'.$comparison_before_mp4_url.'">');
        echo('</video>');

    }
        echo('<span class="comparison-label" data-type="before">'.$comparison_before_text.'</span>');
    echo('        <div class="resizable-container">');
    if($comparison_type == 'compare_image'){
        // comparison image
        echo ('<img src="'.$comparison_after_image_url.'" />');
    } else {
        // comparison video
        echo ('<img class="mobile-only" src="'.$comparison_after_poster_image_url.'" />');
        echo('<video id="video-after" muted loop poster="'.$comparison_after_poster_image_url.'">');
        echo('    <source src="'.$comparison_after_mp4_url.'">');
        echo('</video>');

    }
    echo('<span class="comparison-label" data-type="after">'.$comparison_after_text.'</span>');
    echo('        </div>');
    echo('        <span class="comparison-bar"></span>');
    echo('    </div>');
    echo('</div>');

    if($comparison_caption_text){
        echo('<div class="heading-box background--rock-dark">');
        echo('<span class="caption">'.$comparison_caption_text.'</span>');
        echo('</div>'); // end .heading-box
    }

endwhile; // end comparison loop for display area

echo('</div>'); // end #comparison-wrapper

?>

<?php wp_reset_query(); ?>
