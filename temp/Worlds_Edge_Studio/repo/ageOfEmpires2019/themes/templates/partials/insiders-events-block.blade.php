<div class="tease insider-events" id="insiderEvents">

    <div class="text-block">
        <div class="text-content">
            <h3 class="insider-events__title">{{$content['title']}}</h3>
            <p>{{$content['intro']}}</p>
        </div>
    </div>

    <div class="insider-events__cards">
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

            @if( $card['insiders_only'] && $card['is_active'] && $card['expireCard'] == "false")
                @if ($insider_status)
                    @include('partials.insiders-events-card')
                    <?php $cardIndex++ ?>
                @endif
            @elseif (!$card['insiders_only'] && $card['is_active'] && $card['expireCard'] == "false")
                @include('partials.insiders-events-card')
                <?php $cardIndex++ ?>
            @endif
        @endforeach

        @if (!empty($content['has_extra_card']))
            <div class="insider-event__card --more">
                <div class="insider-event__card__content-container">
                    <img class="logo" src="@asset('images/aoe_logo_stacked.png')" />
                    <h4 class="title">{{$content['extra_card_message']}}</h4>
                </div>
            </div>
        @endif
    </div>

    <div class="text-block">
        <div class="text-content">
            {!!$content['lower_content']!!}

            @if (count($content['buttons']) > 0)
                <div class="buttons">

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
                            <a class="sandbutton" href={{$buttonHref}}>{{$button['button_text']}}</a>
                        @else
                            <a class="sandbutton" href="{{$buttonHref}}">{{$button['button_text']}}</a>
                        @endif
                    @endforeach
                </div>
            @endif
        </div>
    </div>
</div>
