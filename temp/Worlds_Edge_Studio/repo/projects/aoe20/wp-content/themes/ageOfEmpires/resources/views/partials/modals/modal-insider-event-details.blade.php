<div class="insiders__event-reveal" id="eventDetails{{$cardIndex}}" data-reveal>
    <div class="insiders__event-reveal-inner">

            <div class="insiders__event-reveal-header">
                <div class="insiders__event-reveal-title">
                    <h4 class="insiders__event-reveal-game">
                        {{$card['game']['label']}}

                        @if($card['platform'][0] == "steam")
                            <div class="insiders__event-reveal-platform --steam">
                                @include('partials.svg.svg_steam')
                            </div>
                        @else
                            <div class="insiders__event-reveal-platform --microsoft">
                                @include('partials.svg.svg_ms')
                            </div>
                        @endif
                    </h4>
                    <h3 class="insiders__event-reveal-name">{{$card['event_name']}}</h3>
                </div>

                @if ( $card['duration']['start'] && $card['duration']['end'] )
                    <div class="insiders__event-reveal-duration">
                        <h6 class="insiders__event-reveal-subheader">Duration:</h6>
                        <p class="insiders__event-reveal-copy">{{$card['duration']['start']}} - {{$card['duration']['end']}}</p>
                    </div>
                @endif
            </div>   

            <div class="insiders__event-reveal-content">
                {!!$card['full_description']!!}

                <div class="insiders__event-reveal-requirements">
                    <h6 class="insiders__event-reveal-subheader">System Requirements:</h6>
                    <ul class="insiders__event-reveal-requirements-list">

                        @foreach($card['system_requirements'] as $key => $req)
                            @if (!empty($req))
                                @php 
                                    $unit = '';
                                    $label = '';

                                    switch($key) {
                                        case 'ram':
                                            $unit = 'GB';
                                            $label = 'RAM';
                                            break;
                                        case 'vram':
                                            $unit = 'GB';
                                            $label = 'VRAM';
                                            break;
                                        case 'cpu':
                                            $unit = 'Ghz';
                                            $label = 'CPU';
                                            break;
                                        case 'disc_space':
                                            $unit = 'GB';
                                            $label = 'Disk Space';
                                            break;
                                    }
                                @endphp

                                <li class="insiders__event-reveal-requirement">{{$req}}{{$unit}} {{$label}}</li>
                            @endif
                        @endforeach
                    </ul>
                </div>
            </div> 
            

        <button class="insiders__event-reveal-close" data-close aria-label="Close modal" type="button">
        </button>
    </div>
</div>
