@extends('layouts.hero')

@section('content')

  @include('partials.banner')

  @include('partials.civilizations-sub-nav')

  @include('partials.civilizations-content-areas')
  
  @include('partials.civilizations-carousels')

  @include('partials.civilizations-dynasties')

@endsection
