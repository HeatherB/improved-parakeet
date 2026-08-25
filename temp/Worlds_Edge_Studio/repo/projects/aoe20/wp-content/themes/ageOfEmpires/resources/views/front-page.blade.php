@extends('layouts.app')

@section('content')
<section class="front-page__hero">
    <img class="section-background" src="https://i.pinimg.com/originals/30/2b/3d/302b3d92847ab9448cca2114cee812e3.jpg" alt="random Craig Mullins art" />
    <div class="hero__content">
        {{-- TODO -- Probably should be a "featured" query since it contains forum posts --}}
        {{-- this might be curated content --}}
        <div class="front-page__hero__featured-content js-slides-wrapper mobile-hero-slider">
            <?php
                //!! temp
                $temp_post_content = [
                    'permalink' => '#temp',
                    'headline' => 'Headline',
                    'featured_image' => '<img src="https://illustratorslounge.com/wp-content/uploads/craig-mullins-07.png" alt="temp image" />',
                    'cats' => [0 => ['name' => 'Post Type']]
                ];
            ?>
            @include ('partials.content-post', ['post_content' => $temp_post_content])
            @include ('partials.content-post', ['post_content' => $temp_post_content])
            @include ('partials.content-post', ['post_content' => $temp_post_content])
                
        </div>
    </div>
</section>

<section class="front-page__streaming">
    <div class="front-page__streaming__content">
        <div class="active-stream">
            <iframe class="active-stream__frame" src="https://player.twitch.tv/?autoplay=false&video=v591842579" frameborder="0" allowfullscreen="true" scrolling="no" height="378" width="620"></iframe>
        </div>
        <ul class="more-streams">
            <li class="stream__thumb">
                <a class="stream__link"><img src="https://images.gamewatcherstatic.com/screenshot/image/5/10/142195/43703801.jpg" /></a>
            </li>
            <li class="stream__thumb">
                <a class="stream__link"><img src="https://images.gamewatcherstatic.com/screenshot/image/5/10/142195/43703801.jpg" /></a>
            </li>
            <li class="stream__thumb">
                <a class="stream__link"><img src="https://images.gamewatcherstatic.com/screenshot/image/5/10/142195/43703801.jpg" /></a>
            </li>
        </ul>
        <div class="streaming__guide">
            <h2>When to Watch</h2>
            <ol class="streaming__schedule">
                {{-- !!temp --}}
                <?php $days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']; ?>
                @foreach($days as $day)
                    <li class="streaming__schedule__line">
                        <span class="day">{{$day}}</span><a class="stream__name">@T90Official</a>&nbsp;&ndash;&nbsp;<time class="stream__time">3pm PST</time>
                    </li>
                @endforeach
                {{-- end !!temp --}}
            </ol>
        </div>
        <div class="streaming__button-group">
                <a class="mixer-button">Watch on Mixer</a>
                <a class="twitch-button">Watch on Twitch</a>
                <a class="more-streams-button">More Streams</a>
            </div>
    </div>
</section>

        <h1>
            right here
        </h1>
        {{icon('news')}}

<hr class="divider" />

@include ('partials.section-news')

<hr class="divider" />

@include('partials.section-learn-to-play')

</div>
@endsection




