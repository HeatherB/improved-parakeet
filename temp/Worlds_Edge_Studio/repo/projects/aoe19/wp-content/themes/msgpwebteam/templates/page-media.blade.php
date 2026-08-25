@extends('layouts.hero')

@section('content')    
    <div id="header-hero-media">
        <div class="relative__container">
            <div id="hero-background"></div>
            <div id="hero-overlay"></div>
            <h1 class="light">Media</h1>
        </div>
    </div>

    @include('partials.media-carousel-videos')
    @include('partials.media-carousel-screenshots')
    @include('partials.media-carousel-wallpapers')
@endsection




