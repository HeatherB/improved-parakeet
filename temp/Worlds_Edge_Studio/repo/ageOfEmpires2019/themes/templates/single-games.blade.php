@extends('layouts.hero')

@section('content')

  @include('partials.hero-header')

  <?php $bodyclasses = get_body_class();   ?>

  @if($news_posts)
    @if(in_array("aoeii", $bodyclasses, true))
      <div class="news section--divider-egypt-mid section--padding background--rock">
        @include('partials.extra-advert')
      </div>
    @elseif(in_array("aoeiii", $bodyclasses, true))
      <div class="news section--divider-egypt-mid section--padding background--rock">
        @include('partials.extra-advert')
      </div>
    @else
    <div class="news section--divider-egypt-mid section--padding background--rock">
      @include('partials.extra-advert')
        <div class="row">
          <div class="columns">
              <h1 class="light">Recent News</h1>
              <div class="news-container">
                @include('partials.content-news')
              </div>
              <div class="row column small-12 news__button">
                <a href="/news" class="btn btn--small">SEE ALL NEWS
                </a>
              </div>
          </div>
        </div>
      @endif
    </div>
  @endif

  @include('partials.game-content')

  @include('partials.media-games')

@endsection
