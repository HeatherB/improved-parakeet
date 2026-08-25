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
    $content = 'section--divider-frank-mid';
} elseif($slug != "aoeiide" && $slug != "age-of-empires-ii-de") {
    $content = "section-divider section--divider-egypt-mid";
}
?>
<div id="newsletter-subscribe" class="newsletter-subscribe section--padding {{$slug == 'age-of-empires-iv' ? '' : 'background--rock'}} {{ $content }}" role="contentinfo">
    <div class="substance teasers">

        <div class="tease insider lotw">
            <div class="bg">

                <img class="newsletter-subscribe-mobile-image" src="@asset('images/insiders/bgs/lotw/fp-bg-insider-signup-mobile.jpg')" alt="Lords of the West, Age of Empires II: Definitive Edition" />

                <div class="text">
                    
                    <div class="text-inner">

                        <h4 class="title">
                            You're an <em>Age</em> Insider!
                            <span style="white-space: nowrap;">
                            What's Next?
                            </span>
                        </h4>
                        <div class="words">
                            <p>
                                Get connected to the <em>Age of Empires</em> community!  
                            </p>
                            <ul>
                                <li>
                                    <a href="/news">
                                    Read all About the Most Recent News    
                                    </a>
                                </li>
                                <li>
                                    <a href="https://forums.ageofempires.com/c/insiders/" target="_blank">
                                    Discuss the Games on the Insider Forums
                                    </a>
                                </li>
                                <li>
                                    <a href="https://discordapp.com/invite/ageofempires" target="_blank">
                                    Check out our Discord
                                    </a>
                                </li>
                                <li>
                                    <a href="https://support.ageofempires.com/hc/en-us/categories/360002935491-Insider-Program">
                                    Visit Our Support & FAQ Pages 
                                    </a>
                                </li>
                                <li>
                                    <a href="/insiders">
                                    Review Your Insiders Page
                                    </a>
                                </li>
                            </ul>

                        </div>

                    </div>


                </div>
                
            </div>


            <div class="frame-gold jog"></div>
        </div>
    </div>
</div>













