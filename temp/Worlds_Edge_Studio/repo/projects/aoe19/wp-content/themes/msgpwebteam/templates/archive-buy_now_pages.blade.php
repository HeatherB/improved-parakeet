@extends('layouts.base-alt')
<?php wp_reset_query(); ?>
@section('content')
    @include('partials.buy-now-banner')
    <script>
        var exports = { __esModule: true };
    </script>
    <div class="buy-now content section--padding-bottom background--rock">

          @if($featured)
              @include('partials.content-featured-game')
          @endif

          @if($defaults)
              @include('partials.content-game-products')
          @endif

    </div>
@endsection

