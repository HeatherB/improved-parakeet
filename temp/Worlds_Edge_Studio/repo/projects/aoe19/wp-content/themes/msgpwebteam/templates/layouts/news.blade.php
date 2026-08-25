<!DOCTYPE html>
<html @php(language_attributes())>
	@include('partials.head')

	<body @php(body_class())>
		@include('partials.google-tag-manager')
		@include('components.telemetry')
		
		<div class="site-container">
			@include('partials.header')

			<div class="dividers">
			    <section class="news-roll">
			        <main class="news-roll__wrapper">
			            @yield('content')
			        </main>
			    </section>

				@php(do_action('get_footer'))

				@include('partials.dynamic-insider-banner')
				@include('partials.footer')
			</div>
		</div>

		@php(wp_footer())
	
	</body>
</html>
