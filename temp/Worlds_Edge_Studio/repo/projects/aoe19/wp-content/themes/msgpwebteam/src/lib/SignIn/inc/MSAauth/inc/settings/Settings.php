<?php

namespace MSAauth\Settings;

use MSAauth\Utilities\Helpers;

class Settings
{


    public function __construct()
    {
        add_action('admin_menu', ['\MSAauth\Settings\Settings', 'addSettingsPage']);
        add_action('admin_init', ['\MSAauth\Settings\Settings', 'settingsInit']);
        add_action('wp_enqueue_scripts', ['\MSAauth\Settings\Settings', 'enqueue']);
    }


    static public function enqueue()
    {
        $auth = Helpers::get_option('msa_authPage');
        if ($auth) {
            if (is_page($auth)) {
                wp_enqueue_script('msa-check', MSA_JS . '/script.front.js', ['jquery']);
            }
        } else {
            wp_enqueue_script('msa-check', MSA_JS . '/script.front.js', ['jquery']);
        }
    }


    static public function addSettingsPage()
    {
        add_menu_page('MSA Auth', 'MSA Auth', 'manage_options', 'msaauth', array('\MSAauth\Settings\Settings', 'settingsPageRender'), 'dashicons-id', 100);
    }


    static private function addSettingsField($name, $title, $section, $args)
    {
        $args['name'] = $name;
        $args['title'] = $title;
        add_settings_field($name, $title, ['\MSAauth\Settings\Settings', 'settingsFieldRender'], 'msaAuthPage', $section, $args);
    }


    static public function settingsInit()
    {
        register_setting('msaAuthPage', 'msa_settings');
        add_settings_section('msa_authSection', 'MSA Settings', ['\MSAauth\Settings\Settings', 'settingsSectionCallback'], 'msaAuthPage');
        self::addSettingsField('msa_authPage', 'Auth Page', 'msa_authSection', ['type' => 'select', 'text' => '(Required) If set, serves as a landing point for auth activities. Make sure you have updated your redirect at http://accounts.live.com to point to this page', 'options' => Helpers::get_type_select_options('page')]);
        self::addSettingsField('msa_banPage', 'Banned Page', 'msa_authSection', ['type' => 'select', 'text' => 'If set, serves as a landing point for banned users when they attempt to authenticate to the site.', 'options' => Helpers::get_type_select_options('page')]);
        add_settings_section('msa_authBackendSection', 'WordPress Settings', ['\MSAauth\Settings\Settings', 'settingsSectionCallback'], 'msaAuthPage');
        self::addSettingsField('msa_backend_filterEmail', 'Filter Email', 'msa_authBackendSection', ['type' => 'checkbox', 'text' => 'Filter email address in user list']);
        self::addSettingsField('msa_backend_showGamertag', 'Show Gamertag', 'msa_authBackendSection', ['type' => 'checkbox', 'text' => 'Show gamertag in user list']);
        self::addSettingsField('msa_backend_showAgeGroup', 'Show Age Group', 'msa_authBackendSection', ['type' => 'checkbox', 'text' => 'Show age group in user list']);
    }


    static public function settingsSectionCallback($args)
    {
        switch ($args['id']) {
            case 'msa_authBackendSection':
                echo 'Settings for WordPress backend. These do not affect the experience your regular users will have.';
                break;

        }
    }


    static public function settingsFieldRender($args)
    {
        if (isset($args['name']) && isset($args['type'])) {
            $value = Helpers::get_option($args['name']);
            switch ($args['type']) {
                case 'text':
                    echo '<input name="msa_settings[' . $args['name'] . ']" id="msa_settings[' . $args['name'] . ']" type="text" class="regular-text" value="' . $value . '"/>';
                    echo isset($args['text']) ? '<p class="description">' . $args['text'] . '</p>' : '';
                    break;
                case 'image':
                    $image_thumb = $value ? wp_get_attachment_thumb_url($value) : '';
                    echo '<img id="' . $args['name'] . '_preview" class="image_preview" src="' . $image_thumb . '" /><br/>' . "\n";
                    echo '<input id="' . $args['name'] . '_button" type="button" data-uploader_title="Upload an image" data-uploader_button_text="Use image" class="image_upload_button button" value="Upload new image" />';
                    echo '<input id="' . $args['name'] . '_delete" type="button" class="image_delete_button button" value="Remove Image" />';
                    echo '<input id="' . $args['name'] . '" class="image_data_field" type="hidden" name="msa_settings[' . $args['name'] . ']" value="' . $value . '"/>';
                    echo isset($args['text']) ? '<p class="description">' . $args['text'] . '</p>' : '';
                    break;
                case 'checkbox':
                    $checked = $value ? 'checked="checked" ' : '';
                    echo '<label for="msa_settings[' . $args['name'] . ']">';
                    echo '<input name="msa_settings[' . $args['name'] . ']" type="checkbox" id="msa_settings[' . $args['name'] . ']" value="1" ' . $checked . '/>';
                    echo isset($args['text']) ? $args['text'] : '';
                    echo '</label>';
                    break;
                case 'select':
                    if (isset($args['options'])) {
                        echo '<select name="msa_settings[' . $args['name'] . ']" id="msa_settings[' . $args['name'] . ']">';
                        echo '<option></option>';
                        if ($args['options']) {
                            foreach ($args['options'] as $id => $title) {
                                if ($value == $id) {
                                    echo '<option value="' . $id . '" selected="selected">' . $title . '</option>';
                                } else {
                                    echo '<option value="' . $id . '">' . $title . '</option>';
                                }
                            }
                        }
                        echo '</select>';
                        echo isset($args['text']) ? '<p class="description">' . $args['text'] . '</p>' : '';
                    } else {
                        echo 'Invalid configuration';
                    }
                    break;
            }
        }
    }


    static public function settingsPageRender()
    {
        echo '<form action="options.php" method="post">';
        echo '<h1>MSA Auth Settings</h1>';
        echo '<p>These are the settings that control how the MSA auth behaves</p>';
        settings_fields('msaAuthPage');
        do_settings_sections('msaAuthPage');
        submit_button();
        echo '</form>';
    }
}