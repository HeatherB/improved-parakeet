@extends('layouts.hero')

@section('content')

    @include('partials.hero-header')

    <div class="section--divider-frank-mid"></div>

    <div class="news section--divider-frank-mid section--padding background--rock">
        @include('partials.extra-advert')
    </div>

    @if($news_posts)
        <div class="news section--padding section--divider-frank-mid">
            <div class="row">
                <div class="columns">
                    <h1 class="darkish">Recent News</h1>
                    <div class="news-container">
                        @include('partials.content-news')
                    </div>
                    <div class="row column small-12 news__button">
                        <a href="/news" class="btn btn--small">SEE ALL NEWS
                        </a>
                    </div>
                </div>
            </div>
        </div>
    @endif

    @include('partials.media-games')
    @include('partials.game-content')
    <div class="section--divider-frank-mid"></div>
    @include('partials.dynamic-insider-banner')

@endsection

