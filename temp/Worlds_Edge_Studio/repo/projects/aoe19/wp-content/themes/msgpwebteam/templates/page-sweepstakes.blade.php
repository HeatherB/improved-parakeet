{{--
  Template Name: Sweepstakes
--}}

@extends('layouts.base-alt')

@section('content')
    <div class="dividers dividers--default">

        @include('partials.banner-sweepstakes')
        @while(have_posts()) @php(the_post())
        @include('partials.content-sweepstakes')
        @endwhile
    </div>
@endsection
