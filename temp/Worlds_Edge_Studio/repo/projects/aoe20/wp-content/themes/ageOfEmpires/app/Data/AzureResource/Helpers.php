<?php


namespace App\Data\AzureResource;


class Helpers
{

    static public function cache_key($key, $action, $value = '') {

        if (function_exists('apcu_enabled') && apcu_enabled() && isset($action) && isset($key)) {

            switch ($action) {
                case "get":
                    return apcu_fetch($key);
                    break;
                case "set":
                    apcu_add($key, $value, 3600);
                    break;
                case "del":
                    apcu_delete($key);
                    break;
            }

        } else {

            return false;

        }

    }

}