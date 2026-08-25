<?php
    $profileId = (isset($_GET['profileId']) ? intval($_GET['profileId']) : '');
    $button_leaderboard = '';
    $button_myStats = '';
    $class = '';

    if($buttons) {
        foreach($buttons as $button) {
            if($button == 'Leaderboard') {
                $button_leaderboard = '<a href="'. get_home_url() .'/stats/ageiide" class="button cta">LEADERBOARDS</a>';
            }
            if($button == 'View Stats') {
                $button_myStats = '<button type="submit" class="btn--search gamertag-search button cta">View My Stats</button>';
            }
        }
        if(!$profileId && $button_leaderboard) {
            $button_myStats = '';
        }
    }

    // Get post slug, like ageiide for/stats/ageiide/ page
    $post_slug = get_post_field( 'post_name', get_post() );
?>

@include('partials.stats-game-id')
<?php
    // Function from @include('partials.stats-game-id') above
    // that returns game id (like 'age2' for /stats/ageiide/ page)
    // and is assigned to $data_age_id
    $data_age_id = getGameIdForStatsPages();

    // Function that will be passed to page-stats.game.blade.php
    // and can add in associative array elements later as needed
    function variablesFromStatsBannerBlade() {
    $data = array(
        'data_age_id'   =>  getGameIdForStatsPages(),
    );
    return $data;
}    
?>

<div id="stats-banner-id" data-age-id="{{$data_age_id}}" class="banner stats-banner @if($class) {{$class}} @endif">
    <div class="row column text-center">
        <h1 class="light">{!! App\title() !!}</h1>
    <?php
        echo $button_leaderboard;

        // If on NOT on /stats/ageiiide/
        // show post stats button (echo $button_myStats),
        // like on /stats/ageiide/ page
        if( $post_slug !== 'ageiiide' ):
          echo $button_myStats;
        endif;
    ?>

    </div>
</div>
