<?php
/**
 * Dynamics 365
 */
namespace Roots\Dynamics;

class Dynamics {

    function __construct()
    {
        $this->getIncluded();
        $this->initClasses();
    }

    private function getIncluded(){
        require_once('Config.php');
        require_once('API.php');
        require_once('Email.php');
        require_once('Subscription.php');
        require_once('Methods');
        require_once('AbusePrevention.php');
    }

    private function initClasses(){
      new API();
      new Subscription();
    }

}