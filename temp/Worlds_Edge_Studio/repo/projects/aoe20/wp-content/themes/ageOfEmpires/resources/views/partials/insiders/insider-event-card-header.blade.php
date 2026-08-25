<div class="insiders__event-header">
    <h4 class="insiders__event-game">{{$card['game']['label']}}</h4>
    <h3 class="insiders__event-name">{{$card['event_name']}}</h3>

    @if(!empty($card['platform']))
        <div class="insiders__event-platform">
            @foreach($card['platform'] as $platform)
                @if($platform === 'steam')
                    {{svg('images/logos/steam.svg', 'platform-logo --steam')}}
                @else
                    {{svg('images/logos/ms-store.svg', 'platform-logo --ms-store')}}
                @endif
            @endforeach
        </div>
    @endif
</div>