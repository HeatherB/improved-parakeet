@extends('layouts.base-alt')


@section('content')
    <div class="banner clans-banner clans-detail-banner">
        <div class="row column text-center">
            <h1 class="light">History</h1>
        </div>
    </div>

    <div class="content section--divider-egypt-mid background--rock single-layout history-layout" id="history-content-start">
        <div class="row">
            <main class=" main section--padding section--padding-lr-med-only js-mainContent"  style="height: 900px;">
                <div class="timeline-wrapper history-archive">
                    @include('partials.timeline-archive')
                </div>
            </main>
        </div>
    </div>
@endsection