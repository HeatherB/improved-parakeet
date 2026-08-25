<?php

/**
 * Azure Storage
 */

namespace Roots\AzureStorage;

class AzureStorage
{

    function __construct()
    {
        // Setup
        $this->getIncluded();
        $this->initIncluded();

    }

    private function getIncluded()
    {
        require_once('Utilities/Helpers.php');
        require_once('Utilities/Metaboxes.php');
        require_once('Video.php');
        require_once('Setup.php');
        require_once('Config.php');
        require_once('Methods');
    }

    private function initIncluded()
    {
       new Setup();
       new Utilities\Metaboxes();
    }



}