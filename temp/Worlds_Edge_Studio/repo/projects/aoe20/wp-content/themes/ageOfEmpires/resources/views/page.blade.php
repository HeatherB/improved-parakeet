@extends('layouts.app')

@section('content')
	<section>
		<div class="page-container">
			@while(have_posts()) @php the_post() @endphp
				@include('partials.content-page')
			@endwhile
		</div>
	</section>    
@endsection
