@if(!$age4_game_style['customize_boolean'])
    <div class="wide-banner">
        <div class="wide-banner__inner">
            <img src="@asset('images/logo-age4-horz.png')" />
        </div>
    </div>
@else
    @php
    $options = $age4_game_style['hero_logos'];
    @endphp
    <div class="wide-banner_custom-logo">
        <div class="wide-banner__inner">
            @if(!empty($options))
                @include('partials.hero-logo', ['options' => $options])
            @endif
        </div>
    </div>
@endif