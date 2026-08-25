{{--
  Template Name: Mods All
  --}}

  @extends('layouts.base-alt')

  @section('content')
  @while(have_posts()) @php(the_post())
  @include('partials.mods-all-banner')
  <div class="content section--divider-egypt-mid section--padding-bottom background--rock mods-content mods-all-content">
    <div class="row">
      <main class="main" id="mods-list-main">
        @include('partials.mods-nav')
        <div class="frame-box mods-filters">
          <div class="frame-box__inner frame-box__inner--light">
            <div id="mods-filters"></div>
          </div>
        </div>
        <p class="text-center hide-for-large">
          <a class="btn-aoe btn-aoe--small" href="https://www.ageofempires.com/mods/mods-download-install-instructions/">Download &amp; Install Instructions</a>
        </p>
        <section class="mods-list__pagination">
          <div class="columns small-12 large-4 show-for-large">
            <a class="btn-aoe btn-aoe--small" href="https://www.ageofempires.com/mods/mods-download-install-instructions/">Download &amp; Install Instructions</a>
          </div>

          <div class="columns small-12 large-8 large-align-right">
            <div id="mods-paginav" class="pagination-container"></div>
          </div>
        </section>

        <div class="frame-box search-results mods-search-results">
          <div id="mods-listing" class="frame-box__inner frame-box__inner--light frame-box__inner--no-pad frame-box__inner--loading"></div>
        </div>

        <section class="mods-list__pagination">
          <div class="columns small-12 large-12 large-align-right">
            <div id="mods-paginav" class="pagination-container"></div>
          </div>
        </section>

      </main>
    </div>
  </div>
  @endwhile
  @endsection
