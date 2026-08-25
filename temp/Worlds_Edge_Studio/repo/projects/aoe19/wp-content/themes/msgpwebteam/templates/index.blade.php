@extends('layouts.news')

@section('content')

  @include('partials.news-banner')
  <div class="content section--divider-frank-mid section--padding-bottom background--rock mods-content mods-all-content games-nav-wrapper">
    <div class="row">
      <main class="main">
        @include('partials.games-nav')
        <div class="news-filters">
          <div class="frame-box mods-filters">
            <div class="frame-box__inner frame-box__inner--light">
              <div id="mods-filters">
                @if($cats)
                  @include('partials.news-filters')
                @endif
              </div>
            </div>
          </div>
        </div>
        <div id="mods-paginav" class="pagination-container">
          @if($pagination)
            @include('partials.pagination')
          @endif
        </div>
        <div class="news-container">
          @if($news_posts)
            @include('partials.content-news')
          @endif
        </div>
      </main>
    </div>
  </div>
@endsection