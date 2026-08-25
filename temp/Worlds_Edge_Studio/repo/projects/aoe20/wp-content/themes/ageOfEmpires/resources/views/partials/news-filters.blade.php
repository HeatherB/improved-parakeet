<?php
    $default_args = [
        'read_more' => false,
        'search' => true,
        'cat_select' => true
    ]; 

    if ( isset($args) ) {
        $merge = array_merge($default_args,$args);
        $args = $merge;
    } else {
        $args = $default_args;
    }
?>

<nav class="news-filters">
    <h4 class="news-filters__label">
        <span class="news-filters__label__text">Filter By Game</span>
    </h4>
    <a class="news-filter --age1" href="{{ $current_base }}?game=aoe" aria="{{get_aria_phrase('age1')}}">
        <img class="news-filter__icon" src="@asset('images/ui/icons/game-age1.png')" role="presentation" alt="Age I" />
    </a>
    <a class="news-filter --age2" href="{{ $current_base }}?game=aoeii" aria="{{get_aria_phrase('age2')}}">
        <img class="news-filter__icon" src="@asset('images/ui/icons/game-age2.png')" role="presentation" alt="Age II" />
    </a>
    <a class="news-filter --age3" href="{{ $current_base }}?game=aoeiii" aria="{{get_aria_phrase('age3')}}">
        <img class="news-filter__icon" src="@asset('images/ui/icons/game-age3.png')" role="presentation" alt="Age III" />
    </a>
    <a class="news-filter --age4" href="{{ $current_base }}?game=aoeiv" aria="{{get_aria_phrase('age4')}}">
        <img class="news-filter__icon" src="@asset('images/ui/icons/game-age4.png')" role="presentation" alt="Age IV" />
    </a>
    <a class="news-filter --myth" href="{{ $current_base }}?game=aoem" aria="{{get_aria_phrase('myth')}}">
        <img class="news-filter__icon" src="@asset('images/ui/icons/game-myth.png')" role="presentation" alt="Myth" />
    </a>
    @if ($args['read_more'])
        <a class="button more-news">Read More</a>
    @endif
</nav>
