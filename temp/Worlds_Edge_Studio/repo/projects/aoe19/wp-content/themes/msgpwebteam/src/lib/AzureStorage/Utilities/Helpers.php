<?php
namespace Roots\AzureStorage\Utilities;

class Helpers
{

    static public function get_option($name)
    {
        $options = get_option('azure_storage_settings');
        return $options && isset($options[$name]) ? $options[$name] : null;
    }

    static public function get_type_select_options($type, $params = [])
    {
        $output = [];
        $items = get_posts(array_merge(['posts_per_page' => '-1', 'post_type' => $type], $params));
        if($items) {
            foreach($items as $i) {
                $output[$i->ID] = $i->post_title;
            }
        }
        return $output;
    }

    //Password Generator
    static public function generatedPassword($lengh)
    {
        $pool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        $pass = array();
        $poolLength = strlen($pool) - 1;
        for($i = 0; $i < $lengh; $i++) {
            $n = rand(0, $poolLength);
            $pass[] = $pool[$n];
        }
        return implode($pass);
    }
}