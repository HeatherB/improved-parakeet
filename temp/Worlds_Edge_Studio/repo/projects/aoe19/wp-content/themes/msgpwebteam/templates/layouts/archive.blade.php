<!DOCTYPE html>
<html @php(language_attributes())>
@include('partials.head')
<body @php(body_class())>
@include('partials.google-tag-manager')
@include('components.telemetry')
@include('partials.offcanvas-top')
<div class="site-container">
@include('partials.header')
<div class="wrap container" role="document">
    <div class="content">
        <main class="main">
            @yield('content')
        </main>
    </div>
    @yield('footer')
</div>
@php(do_action('get_footer'))

@include('partials.dynamic-insider-banner')

@include('partials.footer')
@php(wp_footer())
</body>
</html>
