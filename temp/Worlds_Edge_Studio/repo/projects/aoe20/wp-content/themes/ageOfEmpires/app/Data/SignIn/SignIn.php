<?php


namespace App\Data\SignIn;


class SignIn
{

    public function __construct()
    {
        $this->get_included();
        $this->init_classes();
    }

    public function get_included(){
        require_once('MSAauth/MSAauth.php');
    }

    public function init_classes(){
        new \App\MSAauth\MSAauth();
    }

}