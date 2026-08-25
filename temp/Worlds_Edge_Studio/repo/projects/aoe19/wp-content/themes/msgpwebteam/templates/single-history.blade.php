@extends('layouts.base-alt')


@section('content')
    @while(have_posts()) @php(the_post())
    <div class="banner clans-banner clans-detail-banner">
        <div class="row column text-center">
            <div class="timeline-wrapper">
                @include('partials.timeline')
            </div>
        </div>
    </div>

    <div class="content section--divider-egypt-mid background--rock single-layout history-layout" id="history-content-start">
        <div class="row">
            <main class="main section--padding section--padding-lr-med-only">
                <div class="row" data-equalizer id="test-eq">
                    <div class="columns small-12 medium-4 medium-push-8" id="js-pos-container" data-equalizer-watch>
                        <div class="js-fixedSidebar">
                            <div class="frame-box frame-box--card show-for-small-only">
                                <div class="frame-box__inner frame-box__inner--dark">
                                    <div class="single-content__title">
                                        <h2 style="margin-bottom: 0;">{{ the_title() }}</h2>
                                    </div>
                                    <div class="single-content__byline">
                                        <div>
                                            <div class="single-content__meta">
                                                <div class="single-content__date">
                                                    @if(get_field('history_date_range'))
                                                        <span>{!! get_field('history_date_range') !!}</span>
                                                    @endif
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="frame-box frame-box--toc">
                                <div class="frame-box__inner frame-box__inner--dark">
                                        <div class="toc__header">
                                            <h4>Contents</h4>
                                            <span id="to-top" class="to-top"><i class="fa fa-angle-double-up"></i>Top</span>
                                        </div>
                                        <ol class="toc__list" id="toc">
                                            @if(get_field('location_content'))<li class="toc__list__item"><a data-id="location">Location</a></li>@endif
                                            @if(get_field('capital_content'))<li class="toc__list__item"><a data-id="capital">Capital</a></li>@endif
                                            @if(get_field('rise_to_power_content'))<li class="toc__list__item"><a data-id="rise_to_power">Rise to Power</a></li>@endif
                                            @if(get_field('economy_content'))<li class="toc__list__item"><a data-id="economy">Economy</a></li>@endif
                                            @if(get_field('religion_and_culture_content'))<li class="toc__list__item"><a data-id="religion_and_culture">Religion & Culture</a></li>@endif
                                            @if(get_field('government_content'))<li class="toc__list__item"><a data-id="government">Government</a></li>@endif
                                            @if(get_field('architecture_content'))<li class="toc__list__item"><a data-id="architecture">Architecture</a></li>@endif
                                            @if(get_field('military_content'))<li class="toc__list__item"><a data-id="military">Military</a></li>@endif
                                            @if(get_field('decline_and_fall_content'))<li class="toc__list__item"><a data-id="decline_and_fall">Decline And Fall</a></li>@endif
                                            @if(get_field('legacy_content'))<li class="toc__list__item"><a data-id="legacy">Legacy</a></li>@endif
                                        </ol>
                                </div>
                            </div>
                            @php
                            $video_description = get_field('video_description');
                            $youtube_id        = get_field('youtube_id');
                            @endphp
                            @if($youtube_id)
                                <div class="frame-box" style="padding-bottom: 0;">
                                    <div class="video-container">
                                        <div class="history-video js-videoContainer" style="background: url('https://i1.ytimg.com/vi/{{$youtube_id}}/hqdefault.jpg');">
                                            <div  class="history-video__inner" style="background: rgba(0,0,0,.6)">
                                                <div class="history-video__play">
                                                    <a data-video-id="{{$youtube_id}}" class="video play-button"><i class="fa fa-play-circle"></i></a>
                                                </div>
                                                    {{--<div class="js-videoContainer">--}}
                                                        {{--<a data-video-id="{{$youtube_id}}" class="video play-button button button--wide">Play Video</a>--}}
                                                    {{--</div>--}}
                                            </div>
                                        </div>
                                        @if($video_description)
                                            <div class="history-video__description">
                                                <div class="frame-box__inner frame-box__inner--dark">
                                                    {!! $video_description !!}
                                                </div>
                                            </div>
                                        @endif
                                    </div>
                                </div>
                            @endif
                        </div>
                    </div>
                    <div class="columns small-12 medium-8 medium-pull-4" data-equalizer-watch>
                        <div class="single-content history-content js-mainContent">
                            <div class="frame-box frame-box--card hide-for-small-only">
                                <div class="frame-box__inner frame-box__inner--dark">
                                    <div class="single-content__title">
                                        <h2 style="margin-bottom: 0;">{{ the_title() }}</h2>
                                    </div>
                                    <div class="single-content__byline">
                                        <div>
                                            <div class="single-content__meta">
                                                <div class="single-content__date">
                                                    <span>{!! get_field('history_date_range') !!}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>                                
                                @php
                                    $history_fields = [
                                        "introduction",
                                        "location",
                                        "capital",
                                        "rise_to_power",
                                        "economy",
                                        "religion_and_culture",
                                        "government",
                                        "architecture",
                                        "military",
                                        "decline_and_fall",
                                        "legacy"
                                    ];
                                @endphp
                                @foreach($history_fields as $field)
                                    @include('partials.history')
                                @endforeach
                            </div>
                            <h5 class="text-light text-center"><em>The text on this web page originally appeared in a slightly different form in the Age of Empires manual published by Microsoft Press, 1997</em></h5>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
    @endwhile
    @include('partials.image-modal-caption')
    <div id="utility-overlay"></div>
    <div id="relative-overlay"></div>
    <div id="video_modal" class="reveal-modal modal" data-reveal aria-labelledby="modalTitle" aria-hidden="true" role="dialog">
      <div id="my_video">
        <div id="youtube_video_source"></div>
        <a class="close-reveal-modal" aria-label="Close"><i class="fa fa-times" aria-hidden="true"></i></a>
      </div>
    </div>
@endsection