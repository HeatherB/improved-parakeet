<?php

namespace Roots\Dynamics;

class Config {

    const TKNURL        = "https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47/oauth2/token";
    const APIURL        = "https://xboxgamedev.api.crm.dynamics.com/api/data/v9.1/";
    const CPM_APIKEY    = "KaBfqGXH4ss3zciAarA6jBrh8pYJ-jtyMGgdRHxbMi63b5hNj8tGTopHj";
    const CPM_RAL_API   = "https://api.ageofempires.com/cpm/redalert";

    // Dynamics Email
    CONST SYSTEM_USER = "E8E1BB0C-83F3-EA11-A817-000D3A4F7C67";
    // Segment IDs
    CONST SEG_INSIDERS = "aebc03c6-7015-eb11-a813-000d3a8c09cf";

    CONST EMAIL_TEMPLATES = [
        "signup"            => "FF857735-B3E8-EA11-A813-000D3A53A8CD",
        "email_change"      => "",
        "email_validation"  => "",
        "profile_update"    => "",
        "optout"            => "",
        "betakey"           => ""
    ];

    // Sparkpost
    CONST SPARKPOST_TRANSMIT_URL = 'https://api.sparkpost.com/api/v1/transmissions';
    CONST SPARKPOST_AUTH = 'a5de9e6d7a1d2f774a6a6e8e164c39fa194ad1ff';

    ///////////////
    // Instances //
    ///////////////

    // DEV
    public static $newsletterID   = '642ae608-0dd6-e911-a9a2-000d3a1362e3';
    public static $resource       = 'https://xboxgamedev.api.crm.dynamics.com/';
    public static $ms_contact_ID  = 'd9f900a2-145d-ea11-a811-000d3a8c06d9';

   /* // UAT
    public static $newsletterID   = 'F5E6B9C4-09F7-E911-A985-000D3A30DA4F';
    public static $resource       = 'https://xboxgameuat.api.crm.dynamics.com/';*/

    // Studio
    /*public static $newsletterID   = '642ae608-0dd6-e911-a9a2-000d3a1362e3';
    public static $resource         = 'https://xboxgamestudio.api.crm.dynamics.com/';
    public static $ms_contact_ID    = 'd9f900a2-145d-ea11-a811-000d3a8c06d9';*/

}