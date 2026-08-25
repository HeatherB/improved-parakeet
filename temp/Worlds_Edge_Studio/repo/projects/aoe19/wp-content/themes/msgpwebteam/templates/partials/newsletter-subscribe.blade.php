<?php
// $slug = get_post_field('post_name', get_post()); wasn't 
// showing slug on all pages so code below is more reliable
$current_page = sanitize_post( $GLOBALS['wp_the_query']->get_queried_object() );
$slug = $current_page->post_name;

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
?>

<div id="newsletter-subscribe" class="newsletter-subscribe section--padding {{$slug == 'age-of-empires-iv' ? '' : 'background--rock'}} {{ $content }}" role="contentinfo">
    <div class="substance teasers">

        <div class="tease insider lotw">
            <div class="bg">

                <img class="newsletter-subscribe-mobile-image" src="@asset('images/insiders/bgs/lotw/fp-bg-insider-signup-mobile.jpg')" alt="Lords of the West, Age of Empires II: Definitive Edition" />

                <div class="text">

                    <div class="text-inner">

                        <h4 class="title">
                            Become an <em>Age</em> Insider!
                        </h4>
                        <div class="words">
                            <p>
                                Insiders unlock access to exclusive news, updates, and opportunities to provide feedback about future releases. Here are some of the perks:
                            </p>
                            <ul>
                                <li>
                                    Access to private forums where you can interact with <em>Age</em> developers
                                </li>
                                <li>
                                    The chance to join exclusive beta opportunities through Steam and the Windows Store  
                                </li>
                                <li>
                                    Channels to provide feedback and inspire quality changes in your favorite <em>Age</em> titles 
                                </li>
                            </ul>
                            <div class="center">
                                <a href="<?php echo $survey_signin;?>" class="sandbutton linkreset">
                                    SIGN UP TO BEGIN
                                </a>
                            </div>
                            <p class="center smalltext">
                                Note: You need an Xbox Live account.
                                <a href="#" onclick="window.open('https://support.ageofempires.com/hc/en-us/articles/360047773032')">Learn more.
                               </a>
                           </p>
                        </div>    

                    </div>

                </div>

            </div>
            <div class="frame-gold jog"></div>
        </div>
    </div>
</div>
