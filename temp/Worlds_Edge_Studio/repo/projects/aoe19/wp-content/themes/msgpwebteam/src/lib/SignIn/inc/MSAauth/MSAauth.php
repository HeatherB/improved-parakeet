<?php

namespace Roots\MSAauth;

class MSAauth
{

    function __construct()
    {
        self::constants();
        self::includes();
        self::init();
        self::hooks();
    }


    static public function constants()
    {
        define('MSA_JS', '/js');
        define('MSA_DEFJPG', '/img/default-avatar.svg');
        define('MSA_JPG_SIZE', '150');
    }


    static public function includes()
    {
        require_once('inc/utilities/Helpers.php');
        require_once('inc/settings/Settings.php');
        require_once('inc/services/Auth.php');
        require_once('inc/services/Token.php');
        require_once('inc/services/User.php');
    }


    static public function init()
    {
        new \MSAauth\Settings\Settings();
        new \MSAauth\Services\Auth();
        new \MSAauth\Services\Token();
        new \MSAauth\Services\User();
    }

    static public function hooks()
    {
        add_action( 'init', array('\MSAauth\Services\Token','process_token'),10);
    }

}
