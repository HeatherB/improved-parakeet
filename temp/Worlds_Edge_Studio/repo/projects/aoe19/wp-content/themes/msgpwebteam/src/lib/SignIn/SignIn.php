<?php


namespace Roots\SignIn;


class SignIn
{

    public function __construct()
    {
        $this->get_included();
        $this->init_classes();
    }

    public function get_included(){
        require_once('inc/MSAauth/MSAauth.php');
    }

    public function init_classes(){
        new \Roots\MSAauth\MSAauth();
    }

}