<div class="insider-event__header">
    <h4 class="insider-event__game">{{$card['game']['label']}}</h4>
    <h3 class="insider-event__name">{{$card['event_name']}}</h3>

    @if(!empty($card['platform']))
        <div class="insider-event__platform">
            @foreach($card['platform'] as $platform)
                @if($platform === 'steam')
                    @include('partials.svg_steam')
                @else
                    @include('partials.svg_ms')
                @endif
            @endforeach
        </div>
    @endif
</div>