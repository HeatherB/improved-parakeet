{{--
  Template Name: Clans Single
--}}

@extends('layouts.base-alt')

@section('content')

    @include('partials.clans-banner')
    <div class="content section--gold-divider background--rock">
        <div class="row">
            <main class="main section--padding-bottom">
                <h1>Clans Details Page</h1>
                <h3>The query variable (which is the clan_id) is....</h3>
                <p>{{ get_query_var('clan_id') }}
                @yield('content')
            </main>
        </div>
    </div>
@endsection
