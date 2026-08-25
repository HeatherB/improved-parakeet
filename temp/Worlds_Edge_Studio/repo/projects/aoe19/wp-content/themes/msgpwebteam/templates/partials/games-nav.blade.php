<?php
global $wp;
$current_url = home_url(add_query_arg(array(),$wp->request));

?>

<div class="clans-featured">
    <nav class="game-nav row" aria-label="Filter by Game:">
        <div class="game-nav__menu-item news-game-nav-item">
            <div class="frame-box frame-box--button">
                <div class="frame-box__inner frame-box__inner--button">
                    <a href="{{$current_base}}" class="section-nav__link all-games @if(!$current_tax) is-current" aria-current="true" @else " @endif>ALL <span class="hide-for-small-only">GAMES</span></a>
                </div>
            </div>
        </div>
        <div class="game-nav__menu-item news-game-nav-item">
            <div class="frame-box frame-box--button">
                <div class="frame-box__inner frame-box__inner--button">
                    <a href="{{ $current_base }}?game=aoede" class="section-nav__link @if($current_tax && $current_tax == 'aoede') is-current" aria-current="true" @else " @endif>
                        <span class="visually-hidden">Age of Empires 1</span>
                        @include('partials.icon_age1')
                    </a>
                </div>
            </div>
        </div>
        <div class="game-nav__menu-item news-game-nav-item">
            <div class="frame-box frame-box--button">
                <div class="frame-box__inner frame-box__inner--button">
                    <a  href="{{ $current_base }}?game=aoeii" class="section-nav__link @if($current_tax && $current_tax == 'aoeii') is-current" aria-current="true" @else " @endif>
                        <span class="visually-hidden">Age of Empires 2</span>
                        @include('partials.icon_age2')
                    </a>
                </div>
            </div>
        </div>
        <div class="game-nav__menu-item news-game-nav-item">
            <div class="frame-box frame-box--button">
                <div class="frame-box__inner frame-box__inner--button">
                    <a href="{{ $current_base }}?game=aoeiii" class="section-nav__link @if($current_tax && $current_tax == 'aoeiii') is-current" aria-current="true" @else " @endif>
                        <span class="visually-hidden">Age of Empires 3</span>
                        @include('partials.icon_age3')
                    </a>
                </div>
            </div>
        </div>
        <div class="game-nav__menu-item news-game-nav-item">
            <div class="frame-box frame-box--button">
                <div class="frame-box__inner frame-box__inner--button">
                    <a href="{{ $current_base }}?game=aoeiv" class="section-nav__link @if($current_tax && $current_tax == 'aoeiv') is-current" aria-current="true" @else " @endif>
                        <span class="visually-hidden">Age of Empires 4</span>
                        @include('partials.icon_age4')
                    </a>
                </div>
            </div>
        </div>
        <div class="game-nav__menu-item news-game-nav-item">
            <div class="frame-box frame-box--button">
                <div class="frame-box__inner frame-box__inner--button">
                    <a  href="{{ $current_base }}?game=aoem" class="section-nav__link @if($current_tax && $current_tax == 'aoem') is-current" aria-current="true" @else " @endif>
                        <span class="visually-hidden">Age of Mythology</span>
                        @include('partials.icon_myth')
                    </a>
                </div>
            </div>
        </div>
    </nav>
</div>