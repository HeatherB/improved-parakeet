<?php

namespace Roots\AzureStorage\Utilities;

use Roots\AzureStorage\AzureStorage;
use Roots\AzureStorage\Config;
use Roots\AzureStorage\Video;

class Metaboxes{

    public function __construct()
    {
        add_action('add_meta_boxes', [$this,'azure_storage_feature']);
        add_action('post_updated', [$this,'save_azure_storage_file']);
        add_action('post_edit_form_tag', [$this,'add_post_enctype']);
    }


    function add_post_enctype() {
        echo ' enctype="multipart/form-data"';
    }

    static public function azure_storage_feature(){

        $postType = get_post_type();

        if(post_type_supports($postType,'azure_storage')){
            self::azure_storage_metaboxes($postType);
        }
    }

    static public function azure_storage_metaboxes($postType){
        add_meta_box( "azure_upload", "Upload File", ['Roots\AzureStorage\Utilities\Metaboxes','azure_storage_file_upload'], $postType, 'normal', 'default', null );
    }


    static public function azure_storage_file_upload(){

        $postmeta = get_post_meta(get_the_id());
        $caption_src = isset($postmeta['caption_src'][0]) ? $postmeta['caption_src'][0] : "";

        if(!empty($postmeta['cdn_path'])){
            echo '<p>Name: '.$postmeta['cdn_file_name'][0].'</p>';
            echo '<p>Source Path: '.$postmeta['cdn_path'][0].'</p>';
            echo '<video width="320" height="240" controls src="'.$postmeta['cdn_path'][0].'"  ></video>';
            echo '<p>Caption Source:</p>';
            echo '<input id="azure_caption_source" name="azure_caption_source" type="text" class="azure_field" value="'.$caption_src.'" style="width: 100%;"/>';
        } else {
            echo '<p class="description">Upload Video File</p>';
            echo '<input id="azure_upload_file" name="azure_upload_file" type="file" class="azure_upload_button " value="" />';
            echo '<p>Caption Source:</p>';
            echo '<input id="azure_caption_source" name="azure_caption_source" type="text" class="azure_field" value="'.$caption_src.'" style="width: 100%;"/>';
        }

    }

    static public function save_azure_storage_file($post_id){
        if(defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }
        if(!current_user_can('edit_page', $post_id)) {
            return;
        }

        update_post_meta($post_id,'caption_src',$_POST['azure_caption_source']);

        // Check for file
        if(!empty($_FILES['azure_upload_file']['name'])) {

            $Video = new Video();
            $file = $_FILES['azure_upload_file'];
            // Upload File To Azure
            $Video->create_new_asset($post_id,$file);

        }

        return;
    }

}
