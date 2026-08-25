@extends('layouts.app')

@section('content')

    <section class="games-landing__hero">
        <div class="games-landing__hero__container">
            @include ('partials.games-landing-page-clip-paths')

            <h2 class="visually-hidden">Games</h2>

            <a href="{{ home_url() }}/games/age-of-empires-iv" class="games-landing__hero__part --age4">
                <img class="games-landing__hero__logo" src="@asset('images/logos/aoeiv-logo.png')"
                     alt="{{get_aria_phrase('aoeiv')}}"/>
            </a>

            <a href="{{ home_url() }}/games/age-of-empires-iii-definitive-edition"
               class="games-landing__hero__part --age3">
                <img class="games-landing__hero__logo" src="@asset('images/logos/aoeiiide-logo.png')"
                     alt="{{get_aria_phrase('aoeiii')}}"/>
            </a>

            <a href="{{ home_url() }}/games/aoeiide" class="games-landing__hero__part --age2">
                <img class="games-landing__hero__logo" src="@asset('images/logos/aoeiide-logo.png')"
                     alt="{{get_aria_phrase('aoeii')}}"/>
            </a>

            <a href="{{ home_url() }}/games/aoe" class="games-landing__hero__part --age1">
                <img class="games-landing__hero__logo" src="@asset('images/logos/aoe-logo.png')"
                     alt="{{get_aria_phrase('aoe')}}"/>
            </a>

            <a href="{{ home_url() }}/games/aom" class="games-landing__hero__part --myth">
                <img class="games-landing__hero__logo" src="@asset('images/logos/myth-logo.png')"
                     alt="{{get_aria_phrase('myth')}}"/>
            </a>
        </div>
    </section>

    @if(have_posts())
        @while(have_posts())
            @php(the_post())

            @if(!get_field('game_info_exclude'))

                <section class="games-landing__section --{{get_field('game_info_class')}}">
                    <div class="page-container">
                        <div class="games-landing__section__logo">
                            @if(!empty(get_field('game_info_logo')))
                                <img src="{{get_field('game_info_logo')}}" alt=""/>
                            @endif
                        </div>

                        <div class="games-landing__section__info">
                            <p>{!! the_content() !!}</p>

                            <div class="games-landing__section__button-group ">
                                @if( have_rows('game_info_buttons') )
                                    @while ( have_rows('game_info_buttons') )
                                        @php(the_row())
                                        <a class="games-landing__section__button" href="{{get_sub_field('game_info_button_url')}}">{{get_sub_field('game_info_button_text')}}</a>
                                    @endwhile
                                @endif
                            </div>

                            <div class="games-landing__section__icon-group">
                                @if( have_rows('game_info_links') )
                                    @while ( have_rows('game_info_links') )
                                        @php(the_row())
                                        <a class="games-landing__section__icon-link" href="{{get_sub_field('game_info_links_url')}}">{{icon(get_sub_field('game_info_links_type'))}} <span class="icon__text">{{get_sub_field('game_info_links_text')}}</span></a>
                                    @endwhile
                                @endif
                            </div>

                        </div>
                    </div>
                </section>

            @endif

        @endwhile
    @endif

@endsection