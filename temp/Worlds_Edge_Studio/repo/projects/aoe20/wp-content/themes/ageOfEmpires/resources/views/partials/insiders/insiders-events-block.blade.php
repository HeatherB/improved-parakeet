<!-- the parent template included this partial ike so
/*@foreach($eventFields as $event)
    @include('partials.insiders.insiders-events-block', ['content' => $event, 'cards' => $eventCards])
@endforeach*/
-->
<!-- other fields from controller or cms -->
<!-- !!todo!!
$eventFields = get_field('events');
$eventCards = get_field('event_cards');
$only_one_card = false;
-->

<section id="insiderEvents">
    <div class="page-container">
        <div class="insiders__block">

            <h3 class="insiders__block-heading">{{$content['title']}}</h3>
            <p class="insiders__block-copy">{{$content['intro']}}</p>

            <div class="insiders__events-cards {{$only_one_card}}">
                <?php $cardIndex = 1 ?>

                @foreach($cards as $card)

                    <!-- determine if card is expired -->
                    <?php
                        $card['expireCard'] = "false";
                        if($card['expire_card_date']) {
                            $date = $card['expire_card_date'];
                            //Create a new DateTime objects.
                            $futureDateTime = new DateTime($date);
                            $currentDateTime = new DateTime();
                            //Format them into a Unix timestamp.
                            $futureTimestamp = $futureDateTime->format('U');
                            $currentTimestamp = $currentDateTime->format('U');
                            if ($currentTimestamp > $futureTimestamp) {
                                $card['expireCard'] = "true";
                            }
                        }
                    ?>

                    @if($card['is_active'] && $card['expireCard'] == "false")
                        @include('partials.insiders.insiders-events-card')
                        <?php $cardIndex++ ?>
                    @endif

                @endforeach

                @if(!empty($content['has_extra_card']))
                    <div class="insiders__event-card --more">
                        <div class="insiders__event-card-content-container">
                            <img class="insiders__event-logo" src="@asset('images/logos/aoe-logo.png')" />
                            <h4 class="insiders__event-copy">{{$content['extra_card_message']}}</h4>
                        </div>
                    </div>
                @endif
            </div>
        </div>

        <div class="insiders__block">
            <div class="insiders__block-copy">
            {!!$content['lower_content']!!}
            </div>

            @if (count($content['buttons']) > 0)
                <div class="insiders__block-buttons">

                    @foreach ($content['buttons'] as $button)
                        <?php 
                            $buttonHref = "";

                            switch($button['type']) {
                                case 'blog_article':
                                    $buttonHref = get_permalink($button['article']->ID);
                                    break;
                                case 'internal_page':
                                    $buttonHref = $button['page'];
                                    break;
                                case 'url':
                                    $buttonHref = $button['url'];
                                    break;
                                case 'sign_in':
                                    $buttonHref = "https://auth.ageofempires.com";
                                    break;
                            }
                        ?>

                        @if ($button['type'] === 'sign_in' && !is_user_logged_in())
                            <a class="insiders__button" href={{$buttonHref}}>{{$button['button_text']}}</a>
                        @else
                            <a class="insiders__button" href="{{$buttonHref}}">{{$button['button_text']}}</a>
                        @endif
                    @endforeach
                </div>
            @endif
        </div>

    </div>
</section>