<?php

namespace Roots\Controllers;

class TranslationsController
{

    public function __construct(){
        add_filter( 'wp', [$this, 'build_lang_verions_of_nav'],  10, 0);
        add_action('init', [$this, 'register_poly_strings'],  10, 0);
    }

    public function build_lang_verions_of_nav() {
        if(function_exists('pll_current_language')) {
            $current_lang = pll_current_language();
        } else {
            $current_lang = 'en';
        }

        $locations = get_nav_menu_locations(); //get all menu locations
        $menu = wp_get_nav_menu_object($locations['primary_navigation']);//get the menu object
        $passed_name = $menu->name;
        $original_menu = wp_get_nav_menu_object( $passed_name );
    }

    /* register in-page strings for translation  */
    /* they appear in languages/string translations */
    public function register_poly_strings() {
        if(function_exists('pll_register_string')) {
            $name = 'polyinpage';
            $group = 'polylang';
            $multiline = false;
            pll_register_string($name, 'Sign In', $group, $multiline);
            pll_register_string($name, 'Recent News', $group, $multiline);
            pll_register_string($name, 'Watch Trailer', $group, $multiline);
            pll_register_string($name, 'Buy Now', $group, $multiline);
            pll_register_string($name, 'Categories', $group, $multiline);
            pll_register_string($name, 'Select Language', $group, $multiline);
            pll_register_string($name, 'Posted by', $group, $multiline);
            pll_register_string($name, 'See All News', $group, $multiline);
            pll_register_string($name, 'Become an Age Insider', $group, $multiline);
            pll_register_string($name, 'Insiders unlock access to', $group, true);
            pll_register_string($name, 'Access to private forums', $group, true);
            pll_register_string($name, 'The chance to join exclusive', $group, true);
            pll_register_string($name, 'Channels to provide feedback', $group, true);
            pll_register_string($name, 'Sign Up to Begin', $group, $multiline);
            pll_register_string($name, 'Sign In to Begin', $group, $multiline);
            pll_register_string($name, 'Note You need an Xbox Live account', $group, $multiline);
            pll_register_string($name, 'Community Connections', $group, $multiline);
            pll_register_string($name, 'US/CANADA', $group, $multiline);
            pll_register_string($name, 'Blood', $group, $multiline);
            pll_register_string($name, 'Violence', $group, $multiline);
            pll_register_string($name, 'Mild Language', $group, $multiline);
            pll_register_string($name, 'USK Rating 12', $group, $multiline);
            pll_register_string($name, 'GERMANY', $group, $multiline);
            pll_register_string($name, 'PEGI Rating 12', $group, $multiline);
            pll_register_string($name, 'EUROPE', $group, $multiline);
            pll_register_string($name, 'Facebook', $group, $multiline);
            pll_register_string($name, 'Instagram', $group, $multiline);
            pll_register_string($name, 'Twitter', $group, $multiline);
            pll_register_string($name, 'Discord', $group, $multiline);
            pll_register_string($name, 'YouTube', $group, $multiline);
            pll_register_string($name, 'Terms of Use', $group, $multiline);
            pll_register_string($name, 'Trademarks', $group, $multiline);
            pll_register_string($name, 'Privacy & Cookies', $group, $multiline);
            pll_register_string($name, 'All rights reserved', $group, $multiline);
            pll_register_string($name, 'Discuss', $group, $multiline);
            pll_register_string($name, 'Be the first to comment', $group, $multiline);
            pll_register_string($name, 'Post Comment', $group, $multiline);
            pll_register_string($name, 'Displaying', $group, $multiline);
            pll_register_string($name, 'of', $group, $multiline);
            pll_register_string($name, 'Pre-Order Now', $group, $multiline);
            pll_register_string($name, 'No results found', $group, $multiline);
            pll_register_string($name, 'Youre an Age Insider', $group, $multiline);
            pll_register_string($name, 'Whats Next', $group, $multiline);
            pll_register_string($name, 'Get connected to the', $group, $multiline);
            pll_register_string($name, 'Read all About the Most Recent News', $group, $multiline);
            pll_register_string($name, 'Discuss the Games on the Insider Forums', $group, $multiline);
            pll_register_string($name, 'Check out our Discord', $group, $multiline);
            pll_register_string($name, 'Visit Our Support FAQ', $group, $multiline);
            pll_register_string($name, 'Review Your Insiders Page', $group, $multiline);
            pll_register_string($name, 'Search', $group, $multiline);
            pll_register_string($name, 'Submit Search', $group, $multiline);
            pll_register_string($name, 'Open Search', $group, $multiline);
            pll_register_string($name, 'Welcome', $group, $multiline);
            pll_register_string($name, 'My Profile', $group, $multiline);
            pll_register_string($name, 'My Stats', $group, $multiline);
            pll_register_string($name, 'My Clan', $group, $multiline);
            pll_register_string($name, 'Log Out', $group, $multiline);
            pll_register_string($name, 'Messages', $group, $multiline);
            pll_register_string($name, 'Alerts', $group, $multiline);
            pll_register_string($name, 'Bookmarks', $group, $multiline);
            pll_register_string($name, 'Open Menu', $group, $multiline);
            pll_register_string($name, 'Buy Now', $group, $multiline);
            pll_register_string($name, 'Buy Now', $group, $multiline);
            pll_register_string($name, 'Buy Now', $group, $multiline);
        }/* end polylang exists check */
    }
}