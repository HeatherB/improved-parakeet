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

function unlock_trans() {
    global $wpdb; // this is how you get access to the database

    /* piece returned to work with */
    $locked_language = $_POST["transData"]; //isLock_es
    $locked_lang_key = str_replace("isLock_","",$locked_language); //es

    /* get the existing meta */
    $thisPost = $_POST["pll_post_id"];
    $already_locked = get_post_meta($thisPost, 'locked_translations', true);

    /* create the new locked value */
    $new_locked = array($locked_lang_key => false);
    $replaced_lock = array_replace($already_locked,$new_locked);
  
    update_post_meta( $thisPost, 'locked_translations', $replaced_lock);

    wp_die(); // this is required to terminate immediately and return a proper response
}

function lock_trans() {
    global $wpdb; // this is how you get access to the database

    /* piece returned to work with */
    $locked_language = $_POST["transData"]; //isLock_es
    $locked_lang_key = str_replace("isLock_","",$locked_language); //es

    /* get the existing meta */
    $thisPost = $_POST["pll_post_id"];
    $already_locked = get_post_meta($thisPost, 'locked_translations', true);

    /* create the new locked value */
    $new_locked = array($locked_lang_key => true);
    $replaced_lock = array_replace($already_locked,$new_locked);
  
    update_post_meta( $thisPost, 'locked_translations', $replaced_lock);

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
        $decode_data = json_decode(stripslashes($returned_data), true);
        //echo ' $decode_data ';
        //var_dump($decode_data);
        my_admin_translator_create_post($decode_data);
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

    /* only display for English content */
    /* make sure polylang function exists before use */
    if(function_exists('pll_get_post_language')) {
        $pll_lang = pll_get_post_language($requested_post_id);
        if($pll_lang == 'en') {

            $requested_post = get_post($requested_post_id);
           
            $requested_permalink = get_post_permalink($requested_post_id);

            /* gather all page content for translation */
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
                $initial_false = array_fill(0, count($pll_lang_list_slugs), false);
                $locked_translations = array_combine($pll_lang_list_slugs,$initial_false);
                update_post_meta( $requested_post_id, 'locked_translations', $locked_translations);
                $should_lock = get_post_meta($requested_post_id, 'locked_translations', true);
            }

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
                                $locked = 'locked';
                                if($should_lock[$lang_slug] === false) {
                                    $locked = '';
                                }

                                echo '<div class="lock_content '.  $locked .'" data-lang="' . $lang_slug . '"><span class="icon"></span><label><input type="checkbox" class="requested_lang" id="request' . $lang_name . '" name="request' . $lang_name . '" value="' . $format_lang_slug . '"><span>' . $lang_name . '</span></label></div>';
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

function sortLength($a,$b){
    return strlen($b)-strlen($a);
}

function my_admin_translator_create_post($decoded_data) {
    $pllPostID = $_POST["pll_post_id"];
    $requested_post = get_post($pllPostID);

    $total_trans_to_build = count($decoded_data);
    $trans_built = 0;

    /* all the content to be reproduced */
    /* content not translated */
    $duplicate_eng_author = $requested_post->post_author;
    $duplicate_eng_post_type = get_post_type($pllPostID);
    $duplicate_eng_fields = get_fields($pllPostID);
    $english_post_metas = get_post_meta($pllPostID);
    $anotherArray = [];

    $pageSectionsPieces = array();

    if(function_exists('pll_languages_list')) {
        $all_languages = pll_languages_list();
    }

    foreach($decoded_data as $decode_data) {
        $requested_title = $decode_data["title"];
        $requested_content = $decode_data["content"];
        $requested_language = $decode_data["to"];

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
                        echo ' this is what should have built ';
                        var_dump($post_data_new);
 
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


        /* pull aside page_sections acf fields, flexible content type (array of arrays), must be passed to new page as a fields update */
        /* remove unwanted from english fields */
        $sliced_eng_fields = $duplicate_eng_fields['page_sections'];
        /* need to restrict this to only the pages/posts that have these extra fields */
        if($sliced_eng_fields) {
            echo ' an extra content page ';
            $new_arr = array();
            $new_arr['page_sections'] = $sliced_eng_fields;
            /* create structure first with english content */
            foreach($new_arr as $acfKey=>$acfValue) {
                update_field($acfKey,$acfValue,$newPostId);
            }
            /* replace english content with correct language */
            foreach($anotherArray as $lvl_0_key => $lvl_0_value) {
                // remove keys that start with an underscore 
                if (substr($lvl_0_key, 0, 1) !== '_') {
                    // find the page_sections fields (this name unique to addon expansion - their are other names)
                    if (str_contains($lvl_0_key, 'page_sections')) {
                        if (!is_array($lvl_0_value)) { 
                            $pageSectionsPieces[$lvl_0_key] = $lvl_0_value;
                        }
                    }
                }
            }

            $keys = array_map('strlen', array_keys($pageSectionsPieces));
            array_multisort($keys, SORT_ASC, $pageSectionsPieces);

            foreach($pageSectionsPieces as $lvl_0_key => $lvl_0_value) {
                $keys = preg_split('/_(\d)_/', $lvl_0_key, 0, PREG_SPLIT_DELIM_CAPTURE);
                $keyCount = count($keys);

                switch($keyCount) {
                    case 1:
                        /* remove serialized fields */
                        if(!preg_match('/^([adObis]:|N;)/m',$lvl_0_value)) {
                            update_sub_field($keys[0], $lvl_0_value, $newPostId );
                            unset($keys[0]);
                        }
                        break;
                    case 3:
                        /* remove serialized fields */
                        if(!preg_match('/^([adObis]:|N;)/m',$lvl_0_value)) {
                            $firstposition = intval($keys[1]) + 1;
                            update_sub_field( array($keys[0],$firstposition,$keys[2]), $lvl_0_value, $newPostId );
                            unset($keys[0]);
                            unset($keys[1]);
                            unset($keys[2]);
                        }
                        break;
                    case 5:
                        $firstposition = intval($keys[1]) + 1;
                        $thirdposition = intval($keys[3]) + 1;
                        $didupdate = update_sub_field( array($keys[0],$firstposition,$keys[2],$thirdposition,$keys[4]), $lvl_0_value, $newPostId );
                        unset($keys[0]);
                        unset($keys[1]);
                        unset($keys[2]);
                        unset($keys[3]);
                        unset($keys[4]);
                        break;
                    default:
                        echo ' HELP - unaccounted for number of keys ';
                }
            }
        } else {
            echo ' no extra weird stuff ';
        }
        

        /* end of make translation */
        /* increment counter */
        $trans_built++;
        if($trans_built == $total_trans_to_build) {
            translations_done_building();
        } 

    } // end for each
        
}

/* translations have all built, refresh page and show flash message */
function translations_done_building() {
    echo ' would be nice if the page could refresh itself ';
    $_SESSION['build_translation_success'] = 'true';
}

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
                            $format_lang_slug = str_replace('_','-',$lang_slug);

                            echo '<span class="icon"></span><label><input type="checkbox" class="requested_lang" id="request' . $lang_name . '" name="request' . $lang_name . '" value="' . $format_lang_slug . '"><span>' . $lang_name . '</span></label>';
                        }
                    }
                }

                echo'<script type="text/javascript">
                let lang_list = ' . json_encode($lang_list) . ';
                </script>';
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