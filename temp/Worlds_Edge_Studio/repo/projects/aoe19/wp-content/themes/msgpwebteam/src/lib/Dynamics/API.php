<?php

namespace Roots\Dynamics;

class API {

    public function __construct()
    {
        $this->getIncluded();
        $this->initClasses();
    }

    private function getIncluded(){
        require_once('Token.php');
        require_once('Subscription.php');
    }

    private function initClasses(){
        new Subscription();
    }

}