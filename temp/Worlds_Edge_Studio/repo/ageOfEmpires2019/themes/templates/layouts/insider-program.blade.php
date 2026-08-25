<!DOCTYPE html>
<html @php(language_attributes())>

  @include('partials.head')

  <body @php(body_class())>
    @include('partials.google-tag-manager')
    @include('components.telemetry')

    <div class="site-container">
      @include('partials.header')

      <div class="wrap container dividers dividers--default" role="document">
        @yield('content')
        @php(do_action('get_footer'))
        @include('partials.footer')
      </div>

      @php(wp_footer())
      
    </div>
  </body>
</html>
