@extends('layouts.app')

@section('content')
	<section>
		<div class="page-container">
			<h2>Page not found</h2>
			@if (!have_posts())
			    <div class="alert alert-warning">
			    	{{ __('Sorry, but the page you were trying to view does not exist.', 'sage') }}
			    </div>
			    {!! get_search_form(false) !!}
			@endif
		</div>
	</section>
@endsection
