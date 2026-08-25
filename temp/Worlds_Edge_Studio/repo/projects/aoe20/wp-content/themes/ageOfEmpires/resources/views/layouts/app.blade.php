<!doctype html>
<html {!! get_language_attributes() !!}>
  @include('partials.head')
  @include('partials.icon-gradients')

  <body @php body_class() @endphp>

    <div class="site-container" role="document">
      @php do_action('get_header') @endphp
      @include('partials.header')

      <div class="site-container">

        <main class="main">
          @yield('content')
        </main>

      </div>
    </div>
    
    @php do_action('get_footer') @endphp
      @include('partials.insider-subscribe')
      @include('partials.footer')
    @php wp_footer() @endphp
  </body>
</html>
