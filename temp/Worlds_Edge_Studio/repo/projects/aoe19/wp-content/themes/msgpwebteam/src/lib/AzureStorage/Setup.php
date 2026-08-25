<?php
/**
 * Azure Storage Setup
 *
 * Options Page
 */

namespace Roots\AzureStorage;

class Setup{

    public function __construct()
    {
        add_action('admin_menu', [$this,'addSettingsPage']);
        add_action('admin_menu', [$this,'settingsInit']);
    }

    static public function addSettingsPage()
    {
        add_menu_page('Azure Storage Settings', 'Azure Storage Settings', 'manage_options', 'azure-storage-settings', ['\Roots\AzureStorage\Setup', 'settingsPageRender'], 'dashicons-id', 100);
    }

    static public function settingsInit(){
        register_setting('azure_storage_settings', 'azure_storage_settings');

        // Media Settings
        add_settings_section('azure_storage_settings', 'Media Settings', ['\Roots\AzureStorage\Setup', 'settingsSectionCallback'], 'azure_storage_settings');
        self::addSettingsField('mediaTenantID', 'Storage Tenant ID', 'azure_storage_settings', ['type' => 'text', 'text' => 'Azure Tenant ID']);
        self::addSettingsField('aadTenantDomain', 'AAD Tenant Domain', 'azure_storage_settings', ['type' => 'text', 'text' => 'Azure Tenant Domain']);
        self::addSettingsField('aadClientID', 'ADD Client ID', 'azure_storage_settings', ['type' => 'text', 'text' => 'ADD Client ID']);
        self::addSettingsField('aadClientSecret', 'ADD Client Secret', 'azure_storage_settings', ['type' => 'text', 'text' => 'ADD Client Secret']);
    }

    static public function settingsPageRender()
    {
        echo '<div class="azure_storage_settings">';
        echo '<div class="azure_storage_settings">';
        echo '<form action="options.php" method="post">';
        echo '<h1>Azure Storage Settings</h1>';
        settings_fields('azure_storage_settings');
        do_settings_sections('azure_storage_settings');
        submit_button();
        echo '</form>';
        echo '</div>';
        echo '</div>';
    }

    static private function addSettingsField($name, $title, $section, $args)
    {
        $args['name'] = $name;
        $args['title'] = $title;
        add_settings_field($name, $title, array('\Roots\AzureStorage\Setup', 'settingsFieldRender'), 'azure_storage_settings', $section, $args);
    }

    static public function settingsFieldRender($args)
    {
        if(isset($args['name']) && isset($args['type'])) {
            $value = \Roots\AzureStorage\Utilities\Helpers::get_option($args['name']);
            switch($args['type']) {
                case 'text':
                    echo '<input name="azure_storage_settings[' . $args['name'] . ']" id="azure_storage_settings[' . $args['name'] . ']" type="text" class="regular-text" value="' . $value . '"/>';
                    echo isset($args['text']) ? '<p class="description">' . $args['text'] . '</p>' : '';
                    break;
                case 'textarea':
                    echo '<textarea name="azure_storage_settings[' . $args['name'] . ']" id="azure_storage_settings[' . $args['name'] . ']" class="regular-text" value="' . $value . '">' . $value . '</textarea>';
                    echo isset($args['text']) ? '<p class="description">' . $args['text'] . '</p>' : '';
                    break;
                case 'image':
                    $image_thumb = $value ? wp_get_attachment_thumb_url($value) : '';
                    echo '<img id="' . $args['name'] . '_preview" class="image_preview" src="' . $image_thumb . '" /><br/>' . "\n";
                    echo '<input id="' . $args['name'] . '_button" type="button" data-uploader_title="Upload an image" data-uploader_button_text="Use image" class="image_upload_button button" value="Upload new image" />';
                    echo '<input id="' . $args['name'] . '_delete" type="button" class="image_delete_button button" value="Remove Image" />';
                    echo '<input id="' . $args['name'] . '" class="image_data_field" type="hidden" name="azure_storage_settings[' . $args['name'] . ']" value="' . $value . '"/>';
                    echo isset($args['text']) ? '<p class="description">' . $args['text'] . '</p>' : '';
                    break;
                case 'button':
                    echo '<input name="azure_storage_settings[' . $args['name'] . ']" id="azure_storage_settings' . $args['name'] . '" type="button" class="regular-text" value="' . (isset($args['text']) ? $args['text'] : '') . '" />';
                    break;
                case 'checkbox':
                    $checked = $value ? 'checked="checked" ' : '';
                    echo '<label for="azure_storage_settings[' . $args['name'] . ']">';
                    echo '<input name="azure_storage_settings[' . $args['name'] . ']" type="checkbox" id="azure_storage_settings[' . $args['name'] . ']" data-action="' . $args['name'] . '" value="1" ' . $checked . '/>';
                    echo isset($args['text']) ? $args['text'] : '';
                    echo '</label>';
                    break;
                case 'select':
                    if(isset($args['options'])) {
                        echo '<select name="azure_storage_settings[' . $args['name'] . ']" id="azure_storage_settings[' . $args['name'] . ']">';
                        echo '<option></option>';
                        if($args['options']) {
                            foreach($args['options'] as $id => $title) {
                                if($value == $id) {
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

    static public function settingsSectionCallback(){

    }
}