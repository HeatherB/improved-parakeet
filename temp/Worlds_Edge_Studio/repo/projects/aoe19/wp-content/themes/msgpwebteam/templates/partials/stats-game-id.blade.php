<?php
function getGameIdForStatsPages() {
    //Get slug for individual post
    $post_id = get_queried_object_id();
    $post = get_post($post_id);
    $slug = $post->post_name;
    
    // Set data-age-id attribute value for 
    // to be used in div#stats-banner-id element below.
    // This attribute value will be called in:
    // assets/scripts/config.js to execute the correct JSON
    // on /stats/ageiide/, /stats/ageiiide/ or other stats pages.
    $data_age_id = '';
    switch($slug) {
        case 'ageiide':
            $data_age_id = 'age2';
            break;
        case 'ageiiide':
            $data_age_id = 'age3';
            break;           
    }

    return $data_age_id;
}