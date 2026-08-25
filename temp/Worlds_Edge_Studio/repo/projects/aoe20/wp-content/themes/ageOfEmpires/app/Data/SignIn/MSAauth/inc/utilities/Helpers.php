<?php

namespace MSAauth\Utilities;

use \App\Data\AzureResource\AzureResource;

class Helpers
{


    static public function get_option($name)
    {
        $options = get_option('msa_settings');
        return $options && isset($options[$name]) ? $options[$name] : null;
    }


    static public function get_type_select_options($type, $params = [])
    {
        $output = [];
        $items = get_posts(array_merge(['posts_per_page' => '-1', 'post_type' => $type], $params));
        if ($items) {
            foreach ($items as $i) {
                $output[$i->ID] = $i->post_title;
            }
        }
        return $output;
    }


    static public function hash_xid($xid)
    {
        return hash('sha256', stripslashes($xid));
    }


    static public function hash_to_username($hash, $offset = 50)
    {
        return str_pad(substr($hash, 0, $offset), 50, '_x_' . session_id());
    }

    static public function decryptRJ256($encrypted)
    {
        //PHP strips "+" and replaces with " ", but we need "+" so add it back in...
        $encrypted = str_replace(' ', '+', $encrypted);

        // Get Keys
        $RPS_ENCRYPT_KEY = AzureResource::get_key('RPSEncryptKey');
        $RPS_ENCRYPT_IV = AzureResource::get_key('RPSEncryptIV');

        //get all the bits
        $method = 'aes-256-cbc';
        $key = base64_decode($RPS_ENCRYPT_KEY);
        $iv = base64_decode($RPS_ENCRYPT_IV);

        $decrypted = openssl_decrypt(base64_decode($encrypted), $method, $key, OPENSSL_RAW_DATA, $iv);
        return ($decrypted);
    }

    //removes PKCS7 padding
    static public function unpad($value)
    {
        $blockSize = mcrypt_get_block_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_CBC);
        $packing = ord($value[strlen($value) - 1]);
        if ($packing && $packing < $blockSize) {
            for ($P = strlen($value) - 1; $P >= strlen($value) - $packing; $P--) {
                if (ord($value[$P]) != $packing) {
                    $packing = 0;
                }
            }
        }

        return substr($value, 0, strlen($value) - $packing);
    }

}