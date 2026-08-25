@php
global $wp;
@endphp
<?php
    $thisProfileId = $_GET['profileId'];
?>
<div class="stats-match-header">
    <div class="frame-box">
        <div class="frame-box__inner frame-box__inner--dark stats-match-header__flexer">
            <div class="stats-match-header__left">
                <div class="stats-match-header__map_image">
                </div>
                <div class="stats-match-header__meta">
                    <div class="stats-match-header__meta-top">
                        <div class="stats-match-header__map-name">
                            <h4 class="js-matchMap-value"></h4>
                        </div>
                    </div>
                    <div class="stats-match-header__meta-bottom">
                        <div class="stats-match-header__match-length">
                            <span class="stats-match-header__label js-matchLength">Match Length</span>
                            <span class="stats-match-header__value hrs_mins">
                                <span class="js-matchLength-value-hours">0</span> 
                                <span class="js-matchLength-value-mins">0</span>
                            </span>
                            <span class="stats-match-header__value total">
                                <span class="js-matchLength-value-total">0</span> 
                            </span>
                        </div>
                        <div class="stats-match-header__match-data">
                            <span class="stats-match-header__label js-matchDate">Match Date</span>
                            <span class="stats-match-header__value js-matchDate-value"></span>
                        </div>
                        <a class="how_help_link" target="_blank" href="/support/aoe2/#replay-download">How do I use the replay files?</a>
                    </div>
                </div>
            </div>
            <div class="stats-match-header__right">
                <div class="stats-match-header__social">
                    <ul class="not_a_list">
                        <li>Share Match</li>
                        <li><a target="_blank" href="https://twitter.com/intent/tweet?via=AgeOfEmpires&hashtags=AgeofEmpires&short_url_length=5&text=@php echo urlencode('I just played the new Age of Empires Defninite Edition!');@endphp&url=@php echo 'https://aoe.ms/match-details/?game=age2&gameId=' . get_query_var('gameId') . '&profileId=' .$thisProfileId; @endphp"><img src="@asset('images/social-tw.png')" /></a></li>
                        <li><a target="_blank" href="http://www.facebook.com/sharer.php?u=@php echo 'https://aoe.ms/match-details/?game=age2&gameId=' . get_query_var('gameId') . '&profileId=' . $thisProfileId; @endphp"><img src="@asset('images/social-fb.png')" /></a></li>
                    </ul>
                </div>
                <div class="stats-match-header__page-title">
                    <span>MATCH RESULTS</span>
                </div>
            </div>
        </div>
    </div>
</div>