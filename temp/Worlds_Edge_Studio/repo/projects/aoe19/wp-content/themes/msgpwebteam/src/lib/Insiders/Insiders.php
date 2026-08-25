<?php
/**
 * Main Class for Insiders functionality
 */
namespace Roots\Insiders;

use Roots\Insiders\Settings\Admin;
use Roots\Insiders\Steam\Steam;
use Roots\Insiders\Watermark\WaterMark;

class Insiders {

      function __construct()
      {
            $this->getIncluded();
            $this->initClasses();
      }

      private function getIncluded(){
            require_once( 'Settings/Admin.php' );
            require_once( 'Settings/FormFields.php' );
            require_once( 'Includes/Steam/Steam.php' );
            require_once( 'Insider.php' );
            require_once( 'Signup.php' );
            require_once( 'InsidersPage.php' );
            require_once( 'Includes/Watermark/WaterMark.php');
      }

      private function initClasses(){
            new Admin();
            new Steam();
            new Insider();
            new Signup();
            new InsidersPage();
            new WaterMark();
      }
}
