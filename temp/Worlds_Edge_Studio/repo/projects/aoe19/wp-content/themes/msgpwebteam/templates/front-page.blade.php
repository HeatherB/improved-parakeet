@extends('layouts.hero')

@section('content')
    @include('partials.get-stream-data')
        <?php $streamData = getStreamData() ?>
    <?php wp_reset_query(); wp_reset_postdata() ?>

    @if (isset($streamData) && $streamData['online'])
        <div class="hero-header --streaming">
            @include ('partials.header-stream-overlay')
        </div>
    @endif
    
    @include('partials.hero-franchise')
    
    @while (have_posts()) @php(the_post())
    @endwhile

    @if($news_posts)
    <div class="news section--padding">
        <div class="row">
            <main class="main columns">
                <h1 class="darkish">
                    Recent News
                </h1>
                <div class="news-container ">
                    @if($news_posts)
                        @include('partials.content-news')
                    @endif
                </div>
                <div class="news__button">
                    <a href="/news" class="btn btn--small">
                        SEE ALL NEWS
                    </a>
                </div>
            </main>
        </div>
    </div>
    @endif

    <div class="section--divider-frank-mid"></div>

    @include('partials.dynamic-insider-banner')
    @include('partials.community-connections')
@endsection




