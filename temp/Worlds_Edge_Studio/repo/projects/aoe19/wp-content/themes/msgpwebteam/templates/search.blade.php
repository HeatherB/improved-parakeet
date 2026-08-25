@extends('layouts.base')

@section('content')


  @include('partials.banner-search')

  <div class="section--divider-frank-mid background--rock">
    <div class="section-divider">
        <section class="news-roll section--padding">
          <main class="news-roll__wrapper">
            <div class="row" style="padding-bottom: 75px">
              @if (!have_posts())
                <div class="alert alert-warning search__alert">
                  {{  __('Sorry, no results were found.', 'sage') }}
                </div>
                <br />
                <br />
                {!! get_search_form(false) !!}
              @endif
              {!! App\wordpress_numeric_post_nav() !!}
              @while(have_posts()) @php(the_post())
              @if( !in_array(get_page_template_slug($post), array("templates/page-bug-create.blade.php","templates/page-bug-manage.blade.php")))
                @include('partials.content-search')
              @endif
              @endwhile
            </div>

          </main>
        </section>
    </div>
  </div>


@endsection
