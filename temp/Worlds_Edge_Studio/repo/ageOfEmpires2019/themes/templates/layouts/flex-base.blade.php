<!DOCTYPE html>
<html @php(language_attributes())>
  @include('partials.head')

  <body @php(body_class())>
     @include('components.telemetry')
    <div class="site-container">

      @include('partials.header')

      <div class="wrap container" role="document">

        <main class="main">
          @yield('content')
        </main>

        @if (App\display_sidebar())
          <aside class="sidebar">
            @include('partials.sidebar')
          </aside>
        @endif
    </div>

    @php(do_action('get_footer'))

    @include('partials.footer')

    @php(wp_footer())

  </body>
</html>