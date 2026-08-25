<?php \Roots\Clans\ClansRedirect::redirectTag(); ?>
@extends('layouts.base-alt')

@section('content')

  @include('partials.clans-banner')
  <div class="content section--gold-divider background--rock">
      <div class="row">
          <main class="main section--padding-bottom">
              <div class="clans-filters section--gold-divider background--rock-dark"></div>

              <div class="clans-featured section--arrow-divider">
                  <h2 class="h3 light">Clans with the Most Members</h2>
                  <a class="search-params button button--double-arrow" href="/clans/?q=&skill=&activity=&memberRange=&dateRange=&language=&sort=member_count&sortOrder=DESC">See All</a>

                  <div class="results-container"></div>

                  <div class="no-results hide">
                    <p>Sorry, there are no featured Clans to display at the moment.</p>
                  </div>

                  <div class="error-results hide">
                    <p>Oops, something went wrong.</p>
                  </div>
              </div>

              <div class="clans-featured">
                  <h2 class="h3 light">Most Recently Created</h2>
                  <a class="search-params button button--double-arrow" href="/clans/?q=&skill=&activity=&memberRange=&dateRange=&language=&sort=date&sortOrder=DESC">See All</a>

                  <div class="results-container"></div>

                  <div class="no-results hide">
                    <p>Sorry, there are no featured Clans to display at the moment.</p>
                  </div>

                  <div class="error-results hide">
                    <p>Oops, something went wrong.</p>
                  </div>
              </div>

              <div class="pagination-container"></div>

              <div id="clans-search-results">
                <div class="results-container"></div>

                <div class="no-results hide">
                  <p>Sorry, there are no Clans matching this criteria. Please try again.</p>
                </div>

                <div class="error-results hide">
                  <p>Oops, something went wrong.</p>
                </div>
              </div>

              @yield('content')
          </main>
      </div>
  </div>
@endsection
