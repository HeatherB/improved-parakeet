<!DOCTYPE html>
<html @php(language_attributes())>
    @include('partials.head')

    <body @php(body_class())>
        @include('partials.google-tag-manager')
        @include('components.telemetry')

        <div class="site-container">
            @include('partials.header')

            <div class="wrap container dividers dividers--frank" role="document">
                <div class="hero-content">
                    <main class="main">
                        @yield('content')
                    </main>
                </div>
            </div>

            @if(!is_front_page() && get_post_field( 'post_name', get_post() ) !== "aoeiide")
                @include('partials.dynamic-insider-banner')
            @endif

            @php(do_action('get_footer'))
            @include('partials.footer')
        </div>

        @php(wp_footer())
    </body>
</html>
