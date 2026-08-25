<?php /**
 * Plugin Name: AOE Translator
 * Description: Allow Translator in Admin menu.
 * Version: 1.0
 * Author: Heather Sullivan
 * Dependencies: jQuery, Polylang
 */

add_action('admin_enqueue_scripts', 'my_admin_translator_add_js_file');
/* allow transaltion menu on posts and pages, in polylang widget, only */
/* but check for its existence first */
add_action('admin_init', 'check_for_polylang');
// creating Ajax call for WordPress
add_action( 'wp_ajax_pva_create', 'pva_create' );
add_action( 'wp_ajax_unlock_trans', 'unlock_trans' );
add_action( 'wp_ajax_lock_trans', 'lock_trans' );
// add translate a string page to menu
add_action('admin_menu', 'my_admin_translator_translate_menu');
add_action('admin_notices','translation_success_notice');


function check_for_polylang() {
    if(is_plugin_active('polylang/polylang.php')) {
        add_action('pll_before_post_translations', 'my_admin_translator_add_translate');
    }
}

function my_admin_translator_translate_menu() {
    if(is_plugin_active('polylang/polylang.php')) {
        if( function_exists('acf_add_options_page') ) {
            acf_add_options_sub_page(array(
                'page_title'  => 'Translate Content',
                'menu_title'  => 'Translate Content',
                'parent_slug'   => 'mlang',
                'capability' => 'manage_options',
                'menu_slug'   => 'translate-content',
            ));
        }
        add_submenu_page(
            null,
            __('Translate Content'),
            __('Translate Content'),
            'manage_options',
            'translate-content',
            'translate_content',
            3
        );
    }
}

function unlock_trans() {
    global $wpdb; // this is how you get access to the database

    $unlocked_language = $_POST["transData"];
    echo ' $unlocked_language ';
    var_dump($unlocked_language);

    $unlock = $locked_translations[$unlocked_language] = 'false';
    $thisPost = $_POST["pll_post_id"];
    //update_post_meta( $thisPost, $unlock, false);

    wp_die(); // this is required to terminate immediately and return a proper response
}
function lock_trans() {
    global $wpdb; // this is how you get access to the database

    $locked_language = $_POST["transData"];
    echo ' $locked_language ';
    var_dump($locked_language);

    $lock = $locked_translations[$locked_language] = 'true';
    $thisPost = $_POST["pll_post_id"];
    //update_post_meta( $thisPost, $lock, true);

    //update_post_meta( $thisPost, 'locked_translations', $locked_translations);

    wp_die(); // this is required to terminate immediately and return a proper response
}

function translation_success_notice() {
    
    if (isset($_SESSION['build_translation_success'])) {?>
                
    <div class="notice notice-success is-dismissible">
        <p><?php _e( 'Your translation request was successful.', 'aoe-translator' ); ?></p>
    </div>
        
    <?php }


}

function pva_create() {
    if(isset($_POST)){
        $returned_data = $_POST["transData"];

         //$strip_data = stripslashes($returned_data);
        //$html_data = htmlentities($strip_data, 0, 'UTF-8');
        //$decode_data = json_decode($html_data, true);
        //var_dump($decode_data);


        $decode_data = json_decode(stripslashes($returned_data), true);
        //var_dump($decode_data);
        //my_fake_create_post();
        my_admin_translator_create_post($decode_data);

        //my_admin_translator_create_post($test_decoded_data);
    }

    wp_die(); // this is required to terminate immediately and return a proper response
}

function my_admin_translator_add_translate( ) {
    if (isset($_GET['post'])) {
        $requested_post_id = $_GET['post'];
    } else {
        /* making the post in english the first time, nothing to translate yet */
        return;
    }

    //$these_fields = get_fields($requested_post_id);
    //echo ' $these_fields ';
    //var_dump($these_fields);

    

    //echo ' seperated return ';
   // $sep_ret = get_post_meta($requested_post_id, '_color', true);
    //var_dump($sep_ret);



   // $final_flex_array = array();


      /*  foreach($sep_ret as $lvl_0_key => $lvl_0_value) {
            $keys = preg_split('/_(\d)_/', $lvl_0_key);

            //echo ' $keys ';
            //var_dump($keys);


            if(isset($keys[5])) {
                $final_flex_array[$keys[0]][$keys[1]][$keys[2]][$keys[3]][$keys[4]][$keys[5]] = $lvl_0_value;
            } else if(isset($keys[4])) {
                $final_flex_array[$keys[0]][$keys[1]][$keys[2]][$keys[3]][$keys[4]] = $lvl_0_value;
            } else if(isset($keys[3])) {
                $final_flex_array[$keys[0]][$keys[1]][$keys[2]][$keys[3]] = $lvl_0_value;
            } else if(isset($keys[2])) {
                $final_flex_array[$keys[0]][$keys[1]][$keys[2]] = $lvl_0_value;
            } else if(isset($keys[1])) {
                $final_flex_array[$keys[0]][$keys[1]] = $lvl_0_value;
            } else if(isset($keys[0])) {
                $final_flex_array[$keys[0]] = $lvl_0_value;
            }
        }*/

        //passed into another array
        //$this_post_metas = get_post_meta($requested_post_id);
       // echo ' $this_post_metas ';
        //var_dump($this_post_metas);
        //echo '<br />';

       // echo ' $final_flex_array ';
       // var_dump($final_flex_array);
       // echo '<br />';

  /*  $original_fields = get_fields($requested_post_id);

    

    $original_fields['page_sections'][1]['acf_teaser_content'][0]['cb_center_button_text'] = 'holy cow';

    echo ' $original_fields ';
    var_dump($original_fields);
    echo '<br />';

    if(array_key_exists('page_sections', $original_fields)) {
        if(array_key_exists(1, $original_fields['page_sections'])) {
            if(array_key_exists('acf_teaser_content', $original_fields['page_sections'][1])) {
                if(array_key_exists(0, $original_fields['page_sections'][1]['acf_teaser_content'])) {
                    if(array_key_exists('cb_center_button_text', $original_fields['page_sections'][1]['acf_teaser_content'][0])) {
                        echo ' found that little guy';
                    } else {
                        echo 'not found';
                    }
                } else { 
                    echo 'will it ever be found';
                }    
            } else {
                echo 'not this level';
            }  
        } else {
            echo 'nothing here';
        }
    } else {
        echo 'cant even start';
    }*/



    //echo ' $final_flex_array ';
    //var_dump($final_flex_array);
    //echo '<br />';

    //$final_meta = array_merge($original_fields,$final_flex_array);
    //echo ' $final_meta ';
    //var_dump($final_meta);


    //$check_metas = get_post_meta(58008);
    //echo ' $check_metas ';
    //var_dump($check_metas);

    //$check_sections = get_fields(57379);
    //echo ' $check_sections ';
    //var_dump($check_sections);

    /*$eng_one = get_post_meta(57887);
    echo ' $eng_one ';
    var_dump($eng_one);

    $vi_one = get_post_meta(57892);
    echo ' $vi_one ';
    var_dump($vi_one);*/

    /* only display for English content */
    /* make sure polylang function exists before use */
    if(function_exists('pll_get_post_language')) {
        $pll_lang = pll_get_post_language($requested_post_id);
        if($pll_lang == 'en') {

            $requested_post = get_post($requested_post_id);
           
            $requested_permalink = get_post_permalink($requested_post_id);

            /* gather all page content for translation */
            //$requested_fields = get_fields($requested_post_id);
            /* gather singulars for translation */
            $requested_title = $requested_post->post_title;
            $requested_content = $requested_post->post_content;
            // look at current page meta
            $current_post_metas = get_post_meta($requested_post_id);
            $current_post_fields = get_fields($requested_post_id);

            if(function_exists('pll_languages_list')) {
                $pll_lang_list = pll_languages_list();
                $pll_lang_list_slugs = pll_languages_list(array('fields' => 'slug'));
            }
            
            $should_lock = get_post_meta($requested_post_id, 'locked_translations', true);
            if(!$should_lock) {
                echo ' $should_lock empty';
                $initial_false = array_fill(0, count($pll_lang_list_slugs), false);
                $locked_translations = array_combine($pll_lang_list_slugs,$initial_false);
                update_post_meta( $requested_post_id, 'locked_translations', $locked_translations);

            } else {
                echo ' found $should_lock';
                var_dump($should_lock);
            }


            /* rework lock */
            /* should option to translate be locked */
           /* <p><sup>&ast;</sup><em>Lock entries</em> to prevent future edits. Only unlock and generate a new translation if you are <em>certain</em> you want to overwrite the exisitng entry.</p>

           <div class="lock_content"><span class="icon"></span></div>
            $lock_es = '';
            $lock_fr = '';
            $lock_it = '';


            $should_lock_es = get_post_meta($requested_post_id, 'isLock_es', true);
            $should_lock_fr = get_post_meta($requested_post_id, 'isLock_fr', true);
            $should_lock_it = get_post_meta($requested_post_id, 'isLock_it', true);

            if(!empty($should_lock_es)) {
                $lock_es = 'locked';
            }
            if(!empty($should_lock_fr)) {
                $lock_fr = 'locked';
            }
            if(!empty($should_lock_it)) {
                $lock_it = 'locked';
            }*/


            echo '
            <script type="text/javascript">
                // pass PHP variable declared above to JavaScript variable
                let requested_title = ' . json_encode($requested_title) . ';
                let requested_content = ' . json_encode($requested_content) . ';
                let requested_meta = ' . json_encode($current_post_metas) . ';
                let lang_list = ' . json_encode($pll_lang_list) . ';
            </script>
            <div id="my_admin_translator" class="translate_something_wrapper">
                <h4>Translation Service</h4>
                <div class="my_admin_translator_inner">
                    <p>Recreate this post/page in another language.</p>
                    <h4>Which languages would you like to generate a translation for?</h4>
                    <form method="post" action="options.php">
                    ';

                    if(function_exists('pll_languages_list')) {
                        $lang_list_slugs = pll_languages_list(array('fields' => 'slug'));
                        $lang_list_names = pll_languages_list(array('fields' => 'name'));
                        $combo_lang_list = array_combine($lang_list_slugs, $lang_list_names);

                        foreach($combo_lang_list as $lang_slug => $lang_name) {
                            if($lang_slug != 'en') {
                                $format_lang_slug = str_replace('_','-',$lang_slug);

                                echo '<div class="lock_content" data-lang="' . $format_lang_slug . '"><span class="icon '. $should_lock[$lang_slug] .'"></span><label><input type="checkbox" class="requested_lang" id="request' . $lang_name . '" name="request' . $lang_name . '" value="' . $format_lang_slug . '"><span>' . $lang_name . '</span></label></div>';
                            }
                        }
                    }

                echo '</form>
                    <input type="hidden" name="request_src_url" id="request_src_url" value="' . $requested_permalink . '" />
                    <button type="button" id="populate_translations">Create Translated Pages</button>
                </div>
                <div id="my_admin_translator_request_response" class="my_admin_translator_inner" data-translated=""></div>
            </div>';

       } /* end english restriction */
    }/* end polylang exists check */

}


function my_admin_translator_add_js_file($hook) {
    wp_enqueue_script( 'jquery' );
    wp_enqueue_script( 
        'aoe-translator-plugin',
        plugins_url( '/js/translatorAdmin.js', __FILE__ ),
        array(), '1.2', true
    );

    wp_register_style('mytranslatorstylesheet', '/wp-content/plugins/aoe-translator/styles/style.css');
    wp_enqueue_style('mytranslatorstylesheet');
}

function pull_aside_extras($pulled_extras) {

    //global $wpdb; // this is how you get access to the database

    $pageSectionsPieces = array();

    /*$ltp_post_lesson_group = array();
    foreach($ltp_posts as $ltp_post) {
          $found_lesson_group = get_post_meta($ltp_post->ID, 'lesson_group', true);
            if($found_lesson_group == $this_lesson_group) {
              $ltp_post_lesson_group[] = array(
                'ID' => $ltp_post->ID,
                'lesson_group' => get_post_meta($ltp_post->ID, 'lesson_group', true),
                'guid' => get_permalink($ltp_post->ID),
                'overview_title' => get_post_meta($ltp_post->ID, 'ltp_overview_title', true),
              );
            }
        }*/

    foreach($pulled_extras as $lvl_0_key => $lvl_0_value) {
        // remove keys that start with an underscore 
        if (substr($lvl_0_key, 0, 1) !== '_') {
            // find the page_sections fields (this name unique to addon expansion - their are other names)
            if (str_contains($lvl_0_key, 'page_sections')) {
                if (!is_array($lvl_0_value)) { 
                    $pageSectionsPieces[$lvl_0_key] = $lvl_0_value;
                    /*$pageSectionsPieces[] = array(
                        $lvl_0_key => $lvl_0_value,
                    );*/
                }
            }
        }
    }

    //echo ' $pageSectionsPieces ';
    //var_dump($pageSectionsPieces);

    $super_fields_1 = array();
    //$super_fields_2 = array();
    $super_fields_3 = array();
    //$super_fields_4 = array();
    $super_fields_5 = array();

        ksort($pageSectionsPieces);
        foreach($pageSectionsPieces as $lvl_0_key => $lvl_0_value) {
            $keys = preg_split('/_(\d)_/', $lvl_0_key, 0, PREG_SPLIT_DELIM_CAPTURE);
            $keyCount = count($keys);

            switch($keyCount) {
                case 5:
                    //echo ' count 5 ';
                    //echo ' $keys[0] ' . $keys[0];
                    //echo ' $keys[1] ' . $keys[1];
                    //echo ' $keys[2] ' . $keys[2];
                    //echo ' $keys[3] ' . $keys[3];
                    //echo ' $keys[4] ' . $keys[4];
                    //echo ' $lvl_0_value ' . $lvl_0_value;
                    $super_fields_5[] = array(
                        $keys[0] => array($keys[1] = array($keys[2] => array($keys[3] => array($keys[4] => $lvl_0_value)))),
                    );
                    //$most_fields[$keys[0]][$keys[1]][$keys[2]][$keys[3]][$keys[4]] = $lvl_0_value;
                    unset($keys[0]);
                    unset($keys[1]);
                    unset($keys[2]);
                    unset($keys[3]);
                    unset($keys[4]);
                    break;
                /*case 4:
                    //echo ' count 4 _value ';
                    //var_dump($lvl_0_value);
                    $super_fields_4[] = array(
                        $keys[0] => array($keys[1] => array($keys[2] => array($keys[3] => $lvl_0_value))),
                    );
                    //$medium_usually_not_fields[$keys[0]][$keys[1]][$keys[2]][$keys[3]] = $lvl_0_value;
                    unset($keys[0]);
                    unset($keys[1]);
                    unset($keys[2]);
                    unset($keys[3]);
                    break;*/
                case 3:
                    //echo ' count 3 _value ';
                    //var_dump($lvl_0_value);
                    $super_fields_3[] = array(
                        $keys[0] => array($keys[1] => array($keys[2] => $lvl_0_value)),
                    );
                    //$medium_fields[$keys[0]][$keys[1]][$keys[2]] = $lvl_0_value;
                    unset($keys[0]);
                    unset($keys[1]);
                    unset($keys[2]);
                    break;
                /*case 2:
                    //echo ' count 2 _value ';
                    //var_dump($lvl_0_value);
                    $super_fields_2[] = array(
                        $keys[0] => array($keys[1] => $lvl_0_value),
                    );
                    //$least_usually_not_fields[$keys[0]][$keys[1]] = $lvl_0_value;
                    unset($keys[0]);
                    unset($keys[1]);
                    break;*/
                case 1:
                    //echo ' count 1 _value ';
                    //var_dump($lvl_0_value);
                    $super_fields_1[] = array(
                        $keys[0] => $lvl_0_value,
                    );
                    //$least_fields[$keys[0]] = $lvl_0_value;
                    unset($keys[0]);
                    break;
                default:
                    echo ' HELP - unaccounted for number of keys ';
            }
        }

    /*echo ' $super_fields_5 ';
    var_dump($super_fields_5);*/

    //echo ' $super_fields_4 ';
    //var_dump($super_fields_4);

    echo ' $super_fields_3 ';
    var_dump($super_fields_3);
    echo '<br />';

    // break down to first occurance of unique key and start falttening
    // current / next / prev / reset might be helpful

    // start with $super_fields_3[0]
    // and compare to $super_fields_3[1]
    // and so on for length of $super_fields_3 array

   // echo ' current $super_fields_3 ' . current($super_fields_3);
   // echo ' next $super_fields_3 ' . next($super_fields_3);


    
    //echo ' $super_fields_2 ';
    //var_dump($super_fields_2);

    /*echo ' $super_fields_1 ';
    var_dump($super_fields_1);*/

    //return $super_fields;
    

    /*echo ' $most_fields ';
    var_dump($most_fields);

    echo ' $medium_usually_not_fields ';
    var_dump($medium_usually_not_fields);

    echo ' $medium_fields ';
    var_dump($medium_fields);

    echo ' $least_usually_not_fields ';
    var_dump($least_usually_not_fields);

    echo ' $least_fields ';
    var_dump($least_fields);*/



    //return $original_fields;

    //wp_die(); // this is required to terminate immediately and return a proper response

}

function my_admin_translator_create_post($decoded_data) {
    $pllPostID = $_POST["pll_post_id"];
    $requested_post = get_post($pllPostID);

    echo ' $decoded_data ';
    var_dump($decoded_data);

    echo ' count($decoded_data) ';
    var_dump(count($decoded_data));

    $total_trans_to_build = count($decoded_data);
    $trans_built = 0;

    /* all the content to be reproduced */
    /* content not translated */
    $duplicate_eng_author = $requested_post->post_author;
    $duplicate_eng_post_type = get_post_type($pllPostID);
    $duplicate_eng_fields = get_fields($pllPostID);

    //echo ' $duplicate_eng_fields ';
    //var_dump($duplicate_eng_fields);

    if(function_exists('pll_languages_list')) {
        $all_languages = pll_languages_list();
    }

    foreach($decoded_data as $decode_data) {
        $requested_title = $decode_data["title"];
        $requested_content = $decode_data["content"];
        $requested_language = $decode_data["to"];
        //$requested_fields = $decode_data["fields"];

        echo 'count($requested_language)';
        var_dump(count($requested_language));

        //echo ' $requested_fields ';
        //var_dump($requested_fields);

        /* reset some of the language values */
        if($decode_data["to"] == 'zh-Hant') {
            $requested_language = 'zh_tw';
        }
        if($decode_data["to"] == 'zh-Hans') {
            $requested_language = 'zh_cn';
        }
        if($decode_data["to"] == 'pt-PT') {
            $requested_language = 'pt_pt';
        }
        if($decode_data["to"] == 'pt') {
            $requested_language = 'pt_br';
        }

        

        $requested_extra = $decode_data;
        unset($requested_extra["title"]);
        unset($requested_extra["content"]);
        unset($requested_extra["to"]);

        $english_post_metas = get_post_meta($pllPostID);
        $anotherArray = [];

        foreach($english_post_metas as $current_meta_key => $current_meta_value) {
            // pull english version of page sections 
            if($current_meta_key == 'page_sections') { // "a:1:{i:0;s:13:"section_block";}" 
                $this_page_sections = $current_meta_value[0];
            }
            // pull english version of acf fields 
            if($current_meta_key == 'page_sections_0_acf_teaser_content') { // "a:1:{i:0;s:13:"content_block";}" 
                $this_page_sections_acf = $current_meta_value[0];
            }
            // pull english version of page template 
            if($current_meta_key == '_wp_page_template') { // "templates/page-addon-expansion.blade.php"
                $this_template = $current_meta_value[0];
            }
            // pull english version of addon expansion page template class 
            if($current_meta_key == 'addon_expansion_page_class') { // "bestpage" 
                $this_page_template_class = $current_meta_value[0];
            }
            // returned translated content 
            foreach($requested_extra as $new_meta_key => $new_meta_value) {
                if($new_meta_key == 'page_sections') {
                    // pass english version page section 
                    $anotherArray["page_sections"] = $this_page_sections;
                    unset($english_post_metas["page_sections"]);

                } else if($new_meta_key == 'page_sections_0_acf_teaser_content') {
                    // pass english version acf fields
                    $anotherArray["page_sections_0_acf_teaser_content"] = $this_page_sections_acf;
                    unset($english_post_metas["page_sections_0_acf_teaser_content"]);

                } else if($new_meta_key == "_wp_page_template") {
                    // pass english version page template 
                    $anotherArray["_wp_page_template"] = $this_template;
                    unset($english_post_metas["_wp_page_template"]);

                } else if($new_meta_key == 'addon_expansion_page_class') {
                    // pass english version acf fields 
                    $anotherArray["addon_expansion_page_class"] = $this_page_template_class;
                    unset($english_post_metas["addon_expansion_page_class"]);

                } else if($new_meta_key == $current_meta_key) {
                    // pass all other remaining english fields 
                    // if the key matches between english version and returned version 
                    $anotherArray[$current_meta_key] = $new_meta_value;
                    unset($english_post_metas[$current_meta_key]);
                }
            }
        }

        // remaining english fields - no match to returned data 
        foreach($english_post_metas as $leftover_meta_key => $leftover_meta_value) {
            $anotherArray[$leftover_meta_key] = "";
            unset($english_post_metas[$leftover_meta_key]);
        } 

        //echo ' $anotherArray ';
        //var_dump($anotherArray);
        //echo '<br />';

        // need to pull aside page_sections
        //$rebuilt_extras = pull_aside_extras($anotherArray);
   //     pull_aside_extras($anotherArray);
        //echo ' $rebuilt_extras ';
        //var_dump($rebuilt_extras);

        //$combo_fields = array_combine($duplicate_eng_fields, $rebuilt_extras);

        //echo ' $combo_fields ';
        //var_dump($combo_fields);
       /* $pageSectionsPieces = array();

        foreach($anotherArray as $lvl_0_key => $lvl_0_value) {
            // remove keys that start with an underscore 
            if (substr($lvl_0_key, 0, 1) !== '_') {
                // find the page_sections fields (this name unique to addon expansion - their are other names)
                if (str_contains($lvl_0_key, 'page_sections')) {
                    if (!is_array($lvl_0_value)) { 
                        $pageSectionsPieces[$lvl_0_key] = array($lvl_0_value);
                    }
                }
            }
        }*/

        //echo ' $pageSectionsPieces ';
       // var_dump($pageSectionsPieces);
        //echo '<br />';
        //$removeProblemChildren = array_slice($pageSectionsPieces, 2);
        //$revPageSectionsPieces = array_reverse($removeProblemChildren);

        // now have page sections pieces from english meta
        // break keys apart on _0_

        //$rebuildKeyStructure = array();
        //$saveThis = array();

         //$out = array();
        //$cur = &$out;

        //$justKeys = array_keys($pageSectionsPieces);
        //echo ' $justKeys ';
        //var_dump($justKeys);
        //echo '<br />';

        //for($i = 0; $i < count($justKeys); $i++) {
            //echo ' singles ';
            //var_dump(json_encode($justKeys[$i]));
            
        //}

     //   ksort($pageSectionsPieces);
        //echo ' $sorted ';
        //var_dump($sorted);


        //$original_fields['page_sections'][1]['acf_teaser_content'][0]['cb_center_button_text'] = 'endless grasshoppers';

        //echo ' $original_fields ';
        //var_dump($original_fields);

       // $string = 'one/two/three/four';
        //$strkeys = explode('/', $string);
        //echo ' $strkeys ';
        //var_dump($strkeys);

//global $wpdb; // this is how you get access to the database
        //foreach($pageSectionsPieces as $lvl_0_key => $lvl_0_value) {
            //echo ' $lvl_0_key ';
            //var_dump($lvl_0_key);

            //$original_fields['page_sections'][1]['acf_teaser_content'][0]['cb_center_button_text'] = 'sour grapes';



            //$keys = preg_split('/_(\d)_/', $lvl_0_key, 0, PREG_SPLIT_DELIM_CAPTURE);

            //echo count($keys);

            /*if(count($keys) == 5) {
                echo ' should be five keys ';
                echo 'key0 is ' . $keys[0];
                echo 'key1 is ' . $keys[1];
                echo 'key2 is ' . $keys[2];
                echo 'key3 is ' . $keys[3];
                echo 'key4 is ' . $keys[4];
                $original_fields[$keys[0]][$keys[1]][$keys[2]][$keys[3]][$keys[4]] = $lvl_0_value;
            }*/
        //    $keys = preg_replace('/_(\d)_/', '.[\\1].', $lvl_0_key);
           // $keyCount = count($keys);

          /*  switch($keyCount) {
                case 5:
                    echo ' count 5 ';
                    $original_fields[$keys[0]][$keys[1]][$keys[2]][$keys[3]][$keys[4]] = $lvl_0_value;
                    break;
                case 4:
                    echo ' count 4 ';
                    $original_fields[$keys[0]][$keys[1]][$keys[2]][$keys[3]] = $lvl_0_value;
                    break;
                case 3:
                    echo ' count 3 ';
                    $original_fields[$keys[0]][$keys[1]][$keys[2]] = $lvl_0_value;
                    break;
                case 2:
                    echo ' count 2 ';
                    $original_fields[$keys[0]][$keys[1]] = $lvl_0_value;
                    break;
                case 1:
                    echo ' count 1 ';
                    $original_fields[$keys[0]] = $lvl_0_value;
                    break;
                default:
                    echo ' HELP - unaccounted for number of keys ';
            }*/

            //wp_die(); // this is required to terminate immediately and return a proper response
            /*if(count($keys) > 5) {
                echo ' HELP - more keys than accounted for ';
               // $original_fields[$keys[0]][$keys[1]][$keys[2]][$keys[3]][$keys[4]] = $lvl_0_value;
            }
            if(count($keys) == 5) {
                echo ' count 5 ';
               // $original_fields[$keys[0]][$keys[1]][$keys[2]][$keys[3]][$keys[4]] = $lvl_0_value;
            }
            if(count($keys) == 4) {
                echo ' count 4 ';
                //$original_fields[$keys[0]][$keys[1]][$keys[2]][$keys[3]] = $lvl_0_value;
            }
            if(count($keys) == 3) {
                echo ' count 3 ';
                //$original_fields[$keys[0]][$keys[1]][$keys[2]] = $lvl_0_value;
            }
            if(count($keys) == 2) {
                echo ' count 2 ';
               // $original_fields[$keys[0]][$keys[1]] = $lvl_0_value;
            }
            if(count($keys) == 1) {
                echo ' count 1 ';
               // $original_fields[$keys[0]] = $lvl_0_value;
            }*/
            //echo ' exited count ';
           /*foreach($keys as $key) {
               if(is_numeric($key)) {
                    $key = intval($keys);
                }
                echo ' $key ';
                var_dump($key);
            }*/

            

            



            //$original_fields[$keys] = $lvl_0_value;

            //echo ' $original_fields ';
            //var_dump($original_fields);

           

            
            //echo '<br />';
            //$keys = preg_split('/_(\d)_/', $lvl_0_key, 0, PREG_SPLIT_DELIM_CAPTURE);
            //$wrapped_key = '["' . $lvl_0_key . '"]';
            //$keys = preg_replace('/_(\d)_/', '"][\\1]["', $lvl_0_key);


           /* if(isset($keys[5])) {
                $original_fields[$keys[0]][$keys[1]][$keys[2]][$keys[3]][$keys[4]][$keys[5]] = $lvl_0_value;
            } else if(isset($keys[4])) {
                $original_fields[$keys[0]][$keys[1]][$keys[2]][$keys[3]][$keys[4]] = $lvl_0_value;
            } else if(isset($keys[3])) {
                $original_fields[$keys[0]][$keys[1]][$keys[2]][$keys[3]] = $lvl_0_value;
            } else if(isset($keys[2])) {
                $original_fields[$keys[0]][$keys[1]][$keys[2]] = $lvl_0_value;
            } else if(isset($keys[1])) {
                $original_fields[$keys[0]][$keys[1]] = $lvl_0_value;
            } else if(isset($keys[0])) {
                $original_fields[$keys[0]] = $lvl_0_value;
            }*/


           // echo ' $rebuildKeyStructure ';
            //var_dump($rebuildKeyStructure);
            //echo '<br />';
       // }

        

    /*    function dict_set($var, $path, $val) {
    if(empty($var))
        $var = is_array($var) ? array() : new stdClass();

    $parts = explode('.', $path);
    $ptr =& $var;

    if(is_array($parts))
    foreach($parts as $part) {
        if('[]' == $part) {
            if(is_array($ptr))
                $ptr =& $ptr[];

        } elseif(is_array($ptr)) {
            if(!isset($ptr[$part]))
                $ptr[$part] = array();

            $ptr =& $ptr[$part];

        } elseif(is_object($ptr)) {
            if(!isset($ptr->$part))
                $ptr->$part = array();

            $ptr =& $ptr->$part;
        }
    }

    $ptr = $val;

    return $var;
}


        $array = [];

//$array = dict_set($array, 'resource1.unit1.2017-10', 'value1');
//$array = dict_set($array, 'resource1.unit2.2017-11', 'value2');
//$array = dict_set($array, 'resource2.unit1.2017-10', 'value3');
//$array = dict_set($array, $keys, 'value3');
        echo ' the number of keys is ' . count($keys);
        for($q = 0; $q < count($keys); $q++) {
            //echo 'num ' . $keys[$q];
           // $array = dict_set($array, $keys[$q], 'value3');
        }

*/
//print_r($array);

         //echo ' after $keys ';
            //var_dump($keys);

        /*function setVal(&$data,$chain,$value){
    $level = &$data;
    for($i=0;$i<count($chain);$i++){
        echo ' $i ';
        $level = &$level[$chain[$i]]; // set reference (&) in order to change the value of the object
    }
    $level = $value;
}

setVal($original_fields,$keys,'whatever');*/


        /*function insert_using_keys($arr, $keys, $value){
                echo 'inside the function';
    // we're modifying a copy of $arr, but here
    // we obtain a reference to it. we move the
    // reference in order to set the values.
    $a = &$arr;

    while( count($keys) > 0 ){
        // get next first key
        $k = array_shift($keys);

        // if $a isn't an array already, make it one
        if(!is_array($a)){
            $a = array();
        }

        // move the reference deeper
        $a = &$a[$k];
    }
    $a = $value;

    // return a copy of $arr with the value set
    return $arr;
    //echo ' $arr ';
    //var_dump($arr);
}*/

//var_dump(count($keys));

//insert_using_keys($original_fields, $keys, 'whatever');


       // echo ' after $original_fields ';
        //var_dump($original_fields);



        //echo ' $duplicate_eng_fields ';
            //var_dump($duplicate_eng_fields);
           //echo '<br />';

            //$trymerge = array_merge($duplicate_eng_fields,$rebuildKeyStructure);
            //echo ' $trymerge ';
            //var_dump($trymerge);
            //echo '<br />';




        
        //$new_arr = array_merge($duplicate_eng_fields,$rebuildKeyStructure);
        //echo ' $new_arr ';
        //var_dump($new_arr);



        //$unserialArr = unserialize($anotherArray);

        //echo ' unserialed ';
        //print_r($unserialArr);
        //echo '<br />';


        //$check_sections = get_fields($pllPostID);
        //echo ' original fields ';
        //var_dump($check_sections);

   /*     $flexibleContentPieces = array();

        
        foreach($anotherArray as $lvl_0_key => $lvl_0_value) {
             remove keys that start with an underscore 
            if (substr($lvl_0_key, 0, 1) !== '_') {
                 find the acf fields 
                if (str_contains($lvl_0_key, 'acf')) {
                    if (!is_array($lvl_0_value)) { 
                        //echo ' $lvl_0_key ' . $lvl_0_key;
                        //echo ' $lvl_0_value '. $lvl_0_value;

                        $flexibleContentPieces[$lvl_0_key] = array($lvl_0_value);
                    }
                }
            }
        }

        $original_fields = get_fields($pllPostID);*/
        //$final_meta = array_merge($original_fields,$flexibleContentPieces);

        //echo ' $final_meta ';
        //var_dump($final_meta);

    //    echo ' $original_fields ';
    //    var_dump($original_fields);
    //    echo '<br />';

   //     echo ' $flexibleContentPieces ';
    //    var_dump($flexibleContentPieces);
    //    echo '<br />';


    //    global $wpdb; // this is how you get access to the database

    //$saved_pieces = $flexibleContentPieces;
    //$thisPost = $pllPostID;
    //add_post_meta( $thisPost, '_color', $saved_pieces, true );


     /*    $final_flex_array = array();


         $sep_ret = get_post_meta($requested_post_id, '_color', true);


        //foreach($flexibleContentPieces as $lvl_0_key => $lvl_0_value) {
         foreach($sep_ret as $lvl_0_key => $lvl_0_value) {
            $keys = preg_split('/_(\d)_/', $lvl_0_key);

            //echo ' $keys ';
           // var_dump($keys);


            if(isset($keys[5])) {
                $final_flex_array[$keys[0]][$keys[1]][$keys[2]][$keys[3]][$keys[4]][$keys[5]] = $lvl_0_value;
            } else if(isset($keys[4])) {
                $final_flex_array[$keys[0]][$keys[1]][$keys[2]][$keys[3]][$keys[4]] = $lvl_0_value;
            } else if(isset($keys[3])) {
                $final_flex_array[$keys[0]][$keys[1]][$keys[2]][$keys[3]] = $lvl_0_value;
            } else if(isset($keys[2])) {
                $final_flex_array[$keys[0]][$keys[1]][$keys[2]] = $lvl_0_value;
            } else if(isset($keys[1])) {
                $final_flex_array[$keys[0]][$keys[1]] = $lvl_0_value;
            } else if(isset($keys[0])) {
                $final_flex_array[$keys[0]] = $lvl_0_value;
            }
        }*/

        //echo ' $final_flex_array ';
        //var_dump($final_flex_array);
        //echo '<br />';
       


        if((function_exists('pll_get_post')) && (function_exists('pll_languages_list'))) {
            foreach($all_languages as $each_language) {
                if($requested_language == $each_language) {
                    $existing_post = pll_get_post($pllPostID, $each_language);

                    if($existing_post) {
                        echo ' updating a post ';
                        $post_data_up = array(
                            'ID' => $existing_post,
                            'post_title' => $requested_title,
                            'post_content' => $requested_content,
                            'post_status' => 'draft',
                            'post_author' => $duplicate_eng_author,
                            'post_type' => $duplicate_eng_post_type,
                            'meta_input' => $anotherArray,
                        );
                        $newPostId = wp_update_post($post_data_up);
                        var_dump($newPostId);


                       // $post_data['ID'] = $existing_post;
                      //  echo ' exisitng post being updated ' . $post_data['ID'];
                      //  var_dump($post_data);
                      //  $newPostId = wp_update_post($post_data);

                    } else {
                       echo ' make a new post ';
                        $post_data_new = array(
                            'post_title' => $requested_title,
                            'post_content' => $requested_content,
                            'post_status' => 'draft',
                            'post_author' => $duplicate_eng_author,
                            'post_type' => $duplicate_eng_post_type,
                            'meta_input' => $anotherArray,
                        );
                        $newPostId = wp_insert_post($post_data_new);
                        var_dump($newPostId);
 

                        if(function_exists('pll_set_post_language')) {
                            pll_set_post_language($newPostId, $requested_language);

                        }
                        $newAssocArr = array(
                            $requested_language => $newPostId,
                            'en' => $pllPostID
                        );

                        if(function_exists('pll_save_post_translations')) {
                            pll_save_post_translations($newAssocArr);
                        }
                    }
                    //$newPostId = wp_insert_post($post_data);
                }    
            }
        }

        $taxonomies = get_post_taxonomies($pllPostID); 
        foreach($taxonomies as $taxonomy) {
            if($taxonomy == 'language') {
                // set language to correct $requested_language
                wp_set_object_terms($newPostId, $requested_language, 'language');
            } else {
                $post_terms = wp_get_object_terms($pllPostID, $taxonomy, array('fields' => 'slugs'));
                wp_set_object_terms($newPostId, $post_terms, $taxonomy);
            }
        }

        /* end of make translation */
        /* increment counter */
        $trans_built++;
        if($trans_built == $total_trans_to_build) {
            translations_done_building();
        }



        /* insist on meta fields */
        /* create post with meta input doesnt work very reliably with acf, hard to maintain required structure */
        //$check_sections = get_fields($pllPostID);
        //echo ' $check_section ';
       // var_dump($check_sections);
        //$final_flex_array
       

     /*   foreach($duplicate_eng_fields as $acfKey=>$acfValue) {
            update_field($acfKey,$acfValue,$newPostId);
        }*/


  /*$new_arr = array_merge($check_sections,$anotherArray);

  echo 'new ';
  var_dump($new_arr);


  foreach($new_arr as $acfKey=>$acfValue) {
            echo ' the new post should be ' . $newPostId;
            echo ' $acfKey ' . $acfKey;
            echo ' $acfValue ' . $acfValue;
            echo '<br />';
            update_field($acfKey,$acfValue,$newPostId);
        }*/




    } // end for each
        
}

/* translations have all built, refresh page and show flash message */
function translations_done_building() {
    echo ' would be nice if the page could refresh itself ';
    $_SESSION['build_translation_success'] = 'true';
}

/* fake create */
function my_fake_create_post() {
    $pllPostID = $_POST["pll_post_id"];
    $requested_post = get_post($pllPostID);

    /* all the content to be reproduced */
    /* content not translated */
    $duplicate_eng_author = $requested_post->post_author;
    $duplicate_eng_post_type = get_post_type($pllPostID);
    $requested_title = $requested_post->post_title;
    $requested_content = $requested_post->post_content;
    $english_post_metas = get_post_meta($pllPostID);

    $post_data_new = array(
        'post_title' => $requested_title . '_copy_test_alteration',
        'post_content' => $requested_content,
        'post_status' => 'draft',
        'post_author' => $duplicate_eng_author,
        'post_type' => $duplicate_eng_post_type,
        'meta_input' => $english_post_metas,
    );
    $newPostId = wp_insert_post($post_data_new);
    var_dump($newPostId);

    $taxonomies = get_post_taxonomies($pllPostID); 
    foreach($taxonomies as $taxonomy) {
        $post_terms = wp_get_object_terms($pllPostID, $taxonomy, array('fields' => 'slugs'));
        wp_set_object_terms($newPostId, $post_terms, $taxonomy);
    }

    /*$original_fields = get_fields($pllPostID);
    foreach($original_fields as $acfKey=>$acfValue) {
        update_field($acfKey,$acfValue,$newPostId);
    }*/



    $final_fields_array = array();
    $dupe_original_fields = get_fields($pllPostID);

    foreach($dupe_original_fields as $lvl_0_key => $lvl_0_value) {
        $keys = preg_split('/_(\d)_/', $lvl_0_key);


        if(isset($keys[5])) {
            $final_fields_array[$keys[0]][$keys[1]][$keys[2]][$keys[3]][$keys[4]][$keys[5]] = $lvl_0_value;
        } else if(isset($keys[4])) {
            $final_fields_array[$keys[0]][$keys[1]][$keys[2]][$keys[3]][$keys[4]] = $lvl_0_value;
        } else if(isset($keys[3])) {
            $final_fields_array[$keys[0]][$keys[1]][$keys[2]][$keys[3]] = $lvl_0_value;
        } else if(isset($keys[2])) {
            $final_fields_array[$keys[0]][$keys[1]][$keys[2]] = $lvl_0_value;
        } else if(isset($keys[1])) {
            $final_fields_array[$keys[0]][$keys[1]] = $lvl_0_value;
        } else if(isset($keys[0])) {
            $final_fields_array[$keys[0]] = $lvl_0_value;
        }
    }

    foreach($final_fields_array as $acfKey=>$acfValue) {
        update_field($acfKey,$acfValue,$newPostId);
    }
}
/* end fake create */


function translate_content() { ?>
    <div id="translate_something_wrapper" class="translate_something_wrapper">
        <h1>Need a Translation?</h1>

        <form method="post" action="options.php">
            <?php
                $admin_url = admin_url('admin.php?page=translate-something');
                echo '<input type="hidden" name="request_src_url" id="request_src_url" value="' . $admin_url . '" />';
            ?>
            <h4>Enter the content to be translated</h4>
            <textarea name="translateThis" id="translateThis"></textarea>

            <h4>Which languages would you like to generate a translation for?</h4>
            <?php

                if(function_exists('pll_languages_list')) {
                    $lang_list_slugs = pll_languages_list(array('fields' => 'slug'));
                    $lang_list_names = pll_languages_list(array('fields' => 'name'));
                    $lang_list = array_combine($lang_list_slugs, $lang_list_names);

                    foreach($lang_list as $lang_slug => $lang_name) {
                        if($lang_slug != 'en') {
                           /* if($lang_listing == 'it') {
                                $lang_name = 'Italian';
                            } else if($lang_listing == 'es') {
                                $lang_name = 'Spanish';
                            } else if($lang_listing == 'fr') {
                                $lang_name = 'French';
                            } else {
                                $lang_name = $lang_listing;
                            }*/
                            $format_lang_slug = str_replace('_','-',$lang_slug);

                            echo '<span class="icon"></span><label><input type="checkbox" class="requested_lang" id="request' . $lang_name . '" name="request' . $lang_name . '" value="' . $format_lang_slug . '"><span>' . $lang_name . '</span></label>';
                        }
                    }
                }

                echo'<script type="text/javascript">
                let lang_list = ' . json_encode($lang_list) . ';
                </script>';

               /* if(function_exists('pll_languages_list')) {
                    $lang_list = pll_languages_list();
                    $lang_name = '';

                    foreach($lang_list as $lang_listing) {
                        if($lang_listing != 'en') {
                        
                            if($lang_listing == 'it') {
                                $lang_name = 'Italian';
                            } else if($lang_listing == 'es') {
                                $lang_name = 'Spanish';
                            } else if($lang_listing == 'fr') {
                                $lang_name = 'French';
                            } else {
                                $lang_name = $lang_listing;
                            }
                            echo '<span class="icon"></span><label><input type="checkbox" class="requested_lang" id="request' . $lang_name . '" name="request' . $lang_name . '" value="' . $lang_listing . '"><span>' . $lang_name . '</span></label>';
                        }
                    }
                }*/
            ?>
            <button type="button" id="translateThisBTN">Translate it!</button>
        </form>

        <div class="returned_translation_wrapper">
            <h4 id="success_response">Here is your translation back</h4>
            <h4 id="failure_response">Your content failed to translate</h4>
            <span id="returned_translation"></span>
        </div>
    </div>
<?php }


?>