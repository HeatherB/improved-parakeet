<?php
$slug = get_post_field('post_name', get_post());
if($slug == "tournaments" || is_post_type_archive('buy_now_pages')) {
    $content = "section--divider-aztec-mid";
} elseif($slug == "media" || $slug == "insider-faq" || is_search() || is_singular('post') || is_home()) {
    $content = "section--divider-frank-mid";
} elseif(is_post_type_archive('history') || $slug == "stats" || $slug == "mods") {
    $content = "section--divider-egypt-mid";
} elseif($slug == "insiders" || $slug == "gamescom-2019" || $slug == "profile") {
    $content = "section--divider-mali-mid";
} elseif(is_front_page()) {
    $content = '';
} elseif($slug != "aoeiide" && $slug != "age-of-empires-ii-de") {
    $content = "section-divider section--divider-egypt-mid";
}

// Insider sign up options
$survey_signin = home_url('insider-signup');

// Sweepstakes url
$sweepstakes_url = "https://www.ageofempires.com/sweepstakes";
?>

<div id="newsletter-subscribe" class="newsletter-subscribe section--padding background--rock {{ $content }}" role="contentinfo">
    <div class="substance teasers">

        <div class="tease insider pc-giveaway">
            <div class="bg">

                <div class="text">
                    <div class="text-inner">

                      <h4 class="title">Age of Empires x Alienware</h4>
                      <div class="words">
                          <p>
                              In partnership with Alienware, we are giving you another way to celebrate the <em>Age of Empires: Fan Preview</em> with your chance to be <em>the</em> lucky <em>Age</em> Insider who wins a custom, one-of-a-kind <em>Age of Empires</em> Alienware Aurora R11 Desktop—along with an exciting selection of gaming peripherals!
                          </p>
                          <ul>
                              <li>Already an <em>Age</em> Insider? Simply click <a href="{{ $sweepstakes_url }}">Enter Sweepstakes</a> and provide the information requested</li>
                              <li>Not yet an <em>Age</em> Insider? What are you waiting for?! <a href="{{ $survey_signin }}">Sign up</a> and then head straight to the <a href="{{ $sweepstakes_url }}">Sweepstakes sign-up page</a> for your chance to win</li>
                          </ul>

                          <div class="center">
                            <a href="{{ $sweepstakes_url }}" class="sandbutton linkreset">Enter Sweepstakes</a>
                            <a href="{{ $survey_signin }}" class="sandbutton linkreset">Insider Sign-up</a>
                          </div>

                          <p class="center smalltext">
                            <b>NO PURCHASE NECESSARY.</b> Open only to Age of Empires Insider members who are legal residents of Canada (excl. QB) age of majority or Germany, UK, US 18+. <span style="text-decoration: underline;">Ends at 11:59 p.m. PDT on April 24, 2021.</span>
                            <span style="display:block;">See Official Rules: <a href="https://bit.ly/3rGc1vc">https://bit.ly/3rGc1vc</a>.</span>
                          </p>
                      </div>

                </div>

                </div>

            </div>
            
          <div class="frame-gold jog"></div>
        </div>
        

    </div>
</div>

