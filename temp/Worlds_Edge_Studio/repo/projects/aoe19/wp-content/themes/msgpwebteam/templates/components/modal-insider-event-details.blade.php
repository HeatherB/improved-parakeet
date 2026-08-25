<div class="reveal aoe-modal simple" id="eventDetails{{$cardIndex}}" data-reveal>
    <div class="modal-inner">
        <div class="modal-content">

            <div class="event-details-modal__header">
                <div class="event-details-modal__title">
                    <h4 class="insider-event__game">
                        {{$card['game']['label']}}

                        @if($card['platform'][0] == "steam")
                            <div class="insider-event__platform --steam">
                                @include('partials.svg_steam')
                            </div>
                        @else
                            <div class="insider-event__platform --microsoft">
                                @include('partials.svg_ms')
                            </div>
                        @endif
                    </h4>
                    <h3 class="insider-event__name">{{$card['event_name']}}</h3>
                </div>

                @if ( $card['duration']['start'] && $card['duration']['end'] )
                    <div class="event-details-modal__event-duration">
                        <h6 class="insider-event__content__block__header">Duration:</h6>
                        <p class="insider-event__duration">{{$card['duration']['start']}} - {{$card['duration']['end']}}</p>
                    </div>
                @endif
            </div>   

            <div class="event-details-modal__content">
                {!!$card['full_description']!!}

                <div class="insider-event__system-requirements">
                    <h6 class="insider-event__content__block__header">System Requirements:</h6>
                    <ul class="insider-event__system-requirements__list not_a_list">

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

                                <li>{{$req}}{{$unit}} {{$label}}</li>
                            @endif
                        @endforeach
                    </ul>
                </div>
            </div> 
            
        </div>

        <button class="close-button btn-close" data-close aria-label="Close modal" type="button">
        </button>
    </div>
</div>
