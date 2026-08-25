<?php
/* Template Name: Moderator Application */
?>

@extends('layouts.base-alt')

@section('content')
    <div class="dividers dividers--default">
        @include('partials.banner-page')
        @while(have_posts()) @php(the_post())
        @include('partials.content-moderator-application')
        @endwhile
    </div>
@endsection

