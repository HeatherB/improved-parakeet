<?php

namespace Roots\Clans;

use WP_Query;

class ClansImages  {
  public function __construct()
  {
    //Not using
  }
  
  static public function logoImgs($background, $shield, $logo){
    return 'https://dlassets-ssl.xboxlive.com/public/content/aoe/clan/' . $background . $shield . '/' . $background . '.' . $shield . '.' . $logo . '.png';
  }
	
	static public function clanBG($background){	
		return 'https://dlassets-ssl.xboxlive.com/public/content/aoe/clan/banners/' . $background . '.jpg';
  }
    
}
