<?php

namespace App\Controllers;

use WP_Query;

class ZenFaqsController
{

    public function __construct()
    {
        add_action('admin_menu', [$this, 'my_admin_zendesk_faq_menu']);
        add_action('admin_enqueue_scripts', [$this, 'my_admin_zendesk_add_js_file']);
    }

    public function my_admin_zendesk_faq_menu() {
        /*if( function_exists('acf_add_options_page') ) {
            acf_add_options_sub_page(array(
                'page_title'  => 'Insider Zendesk FAQs',
                'menu_title'  => 'Insider Zendesk FAQs',
                'parent_slug'   => 'insider-settings',
                'capability' => 'manage_options',
                'menu_slug'   => 'insider-zendesk-faqs',
            ));
        }
        add_submenu_page(
            null,
            __('Insider Zendesk FAQs'),
            __('Insider Zendesk FAQs'),
            'manage_options',
            'insider-zendesk-faqs',
            'my_admin_zendesk_faq_contents',
            3
        );*/
        add_menu_page(
            __('Insider Zendesk FAQs'),
            __('Insider Zendesk FAQs'),
            'manage_options',
            'insider-zendesk-faqs',
            [$this,'my_admin_zendesk_faq_contents'],
            'dashicons-schedule',
            85
        );
        add_action( 'admin_init', [$this, 'update_zendesk_faqs']);
    }

    public function my_admin_zendesk_add_js_file() {
        wp_enqueue_script('zendesk-faqs-plugin', get_stylesheet_directory_uri() . '/assets/scripts/admin-zen-faqs.js', array(), '1.2', true);
        wp_register_style('myzendeskstylesheet', get_stylesheet_directory_uri() . '/assets/styles/vendor/zendesk.css');
        wp_enqueue_style('myzendeskstylesheet');
    }

    //if( !function_exists("update_zendesk_faqs") ) { 
    public function update_zendesk_faqs() {   
        register_setting( 'zendesk-faq-selection-settings', 'zendesk_faq_selection_0' );
        register_setting( 'zendesk-faq-selection-settings', 'zendesk_faq_selection_1' );
        register_setting( 'zendesk-faq-selection-settings', 'zendesk_faq_selection_2' ); 
    }
    //}

    public function my_admin_zendesk_faq_contents() { ?>
        <div id="zendesk_faq_adminMenu_wrapper">
            <h1>Zendesk Support Site FAQs</h1>
            <small>The Insiders' landing page, <a href="https://www.ageofempires.com/insiders" target="_blank">https://www.ageofempires.com/insiders</a>, shows three of our most popular Frequently Asked Questions.<br />You may select those FAQs here.</small>
            <p>The support site for Age of Empires has moved over to Zendesk, <a href="https://support.ageofempires.com/hc/en-us" target="_blank">https://support.ageofempires.com/hc/en-us.</a><br />If you need to edit the actual FAQs, you must do that over in Zendesk.</p>
            <ol>
                <li>Click the 'Edit The FAQ' button for the FAQ you wish to edit.</li>
                <li>Select an article from the drop-down list, or enter the ID of the article into the article ID field.
                    <ul>
                        <li>If you enter the article ID, make sure to also press enter/return or the tab key to 'commit' your choice.</li>
                    </ul>
                </li>
                <li>Once you have made a valid faq selection, the article title and body copy are shown to verify the selection.</li>
                <li>Hit the 'Save' button when you are done, and the FAQs featured on the Insiders' landing page will update.</li>
            </ol>
            
            <h2>Select an FAQ</h2>
            <div id="article_category_list">
                <p>Select a Category to narrow down your article results</p>
                <form></form>
            </div>
            <div class="faqSelector">
                <ul id="zenFAQ">
                    <li id="load-more">loading . . .</li>
                </ul>
            </div>
        
            <form method="post" action="options.php">
            <?php settings_fields( 'zendesk-faq-selection-settings' ); ?>
            <?php do_settings_sections( 'zendesk-faq-selection-settings' ); ?>
                <table class="form-table" id="zendesk_form_table">
                    <thead>
                        <tr valign="top">
                            <th scope="row"><h2>Active FAQs on Insiders' Landing page</h2></th>
                        </tr>
                        <tr valign="top">
                            <td id="editting_msg_wrapper"></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr valign="top">
                            <td>
                                <div>
                                    <h3 class="heading">
                                        <span>1st</span> FAQ - ArticleID: <input type="text" class="zendesk_faq_selection" id="zendesk_faq_id_0" name="zendesk_faq_selection_0" value="<?php echo get_option( 'zendesk_faq_selection_0' ); ?>"/>
                                        <label>
                                            <input type="radio" name="edit-this-faq" class="edit-this-faq" value="_0" /><span>edit this faq</span>
                                        </label>
                                    </h3>
                                    <div class="preview_wrapper">
                                        <span id="faq_title_0" class="faq_title"></span>
                                        <div id="faq_copy_preview_0" class="preview_copy"></div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr valign="top">
                            <td>
                                <div>
                                    <h3 class="heading">
                                        <span>2nd</span> FAQ - ArticleID: <input type="text" id="zendesk_faq_id_1" class="zendesk_faq_selection" name="zendesk_faq_selection_1" value="<?php echo get_option( 'zendesk_faq_selection_1' ); ?>"/>
                                        <label>
                                            <input type="radio" name="edit-this-faq" class="edit-this-faq" value="_1" /><span>edit this faq</span>
                                        </label>
                                    </h3>
                                    <div class="preview_wrapper">
                                        <span id="faq_title_1" class="faq_title"></span>
                                        <div id="faq_copy_preview_1" class="preview_copy"></div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr valign="top">
                            <td>
                                <div>
                                    <h3 class="heading">
                                        <span>3rd</span> FAQ - ArticleID: <input type="text" id="zendesk_faq_id_2" class="zendesk_faq_selection" name="zendesk_faq_selection_2" value="<?php echo get_option( 'zendesk_faq_selection_2' ); ?>"/>
                                        <label>
                                            <input type="radio" name="edit-this-faq" class="edit-this-faq" value="_2" /><span>edit this faq</span>
                                        </label>
                                    </h3>
                                    <div class="preview_wrapper">
                                        <span id="faq_title_2" class="faq_title"></span>
                                        <div id="faq_copy_preview_2" class="preview_copy"></div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            <?php submit_button(); ?>
            </form>
        </div><!-- end of zenfaq admin wrapper -->
    <?php }


    


}