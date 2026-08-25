<?php
$time = current_time('Y-m-d H:i:s');
?>
<div id="newsletter-subscribe" class="newsletter-subscribe section--padding background--paper">
    <div class="substance teasers">
        <div class="tease countdown">
            <div class="bg">
                <div class="text center">
                    <img class="teaser_logo" src="@asset('images/age2de-logo-plain.png')" alt="Age 2 Logo">
                    <h1 id="launch_count" data-time="{{$time}}"></h1>
                    <div class="words">
                        <ul class="not_a_list">
                            <li><a href="https://www.ageofempires.com/buy-now" class="button cta linkreset">PRE-ORDER NOW!</a></li>
                            <li><a href="/games/aoeiide/" class="button cta linkreset">LEARN MORE</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="frame-gold jog"></div>
        </div>
    </div>
</div>