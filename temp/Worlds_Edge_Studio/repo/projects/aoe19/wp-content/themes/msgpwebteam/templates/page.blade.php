
@extends('layouts.base-alt')

@section('content')
    <div class="dividers dividers--default">
        @include('partials.banner-page')
        @while(have_posts()) @php(the_post())
        @include('partials.content-page')
        @endwhile
    </div>
@endsection

