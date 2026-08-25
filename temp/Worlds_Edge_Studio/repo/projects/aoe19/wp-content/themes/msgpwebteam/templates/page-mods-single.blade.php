{{--
  Template Name: Mods Single
--}}

@extends('layouts.base-alt')

@section('content')
  @while(have_posts()) @php(the_post())
    <div class="banner mods-banner mod-detail-banner" id="mod-detail-banner"></div>
    <div class="content section-divider section--padding-bottom background--rock mods-content mods-single-content">
      <div class="row">
        <main class="main" id="mod-detail-main">
          <div class="mod-detail-top" id="mod-detail-top"></div>
          <aside class="mod-detail-sidebar" id="mod-detail-sidebar"></aside>
          <div class="mod-detail-bottom" id="mod-detail-bottom"></div>
          <div class="mod-detail-comments" id="mod-detail-comments">
              <section class="comments">
                  @include('partials.comments')
              </section>
          </div>
        </main>
      </div>
    </div>

    @include('components.modal-mod-flag-reason')

    </div>    
  @endwhile
@endsection
