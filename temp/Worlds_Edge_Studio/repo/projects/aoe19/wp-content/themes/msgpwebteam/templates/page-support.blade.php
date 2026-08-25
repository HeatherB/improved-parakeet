{{--
  Template Name: Support
--}}

@extends('layouts.base-alt')

@section('content')
    <div class="dividers dividers--default">
    	@include('partials.banner-page')        
        @while(have_posts()) @php(the_post())   
        	<div class="section-divider section--padding background--paper">
			    {{the_content()}}
			</div>
        @endwhile
    </div>
@endsection
