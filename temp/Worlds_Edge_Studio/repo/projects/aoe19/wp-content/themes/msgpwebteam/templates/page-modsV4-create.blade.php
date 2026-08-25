{{--
  Template Name: Mods V4 Create
--}}

@extends('layouts.base-alt')

@section('content')
  @while(have_posts()) @php(the_post())
    @include('partials.mods-all-banner')
    <div class="content section--divider section--padding-bottom background--rock mods-content mods-all-content">
      <div class="row">
        <main class="main" id="mods-create-main">
          @include('partials.mods-nav')
          <div class="frame-box frame-box--form">
            <div class="frame-box__inner frame-box__inner--light frame-box__inner--loading">
              <div id="mods-create"></div>
            </div>
          </div>
        </main>
      </div>
    </div>
  @endwhile
@endsection
