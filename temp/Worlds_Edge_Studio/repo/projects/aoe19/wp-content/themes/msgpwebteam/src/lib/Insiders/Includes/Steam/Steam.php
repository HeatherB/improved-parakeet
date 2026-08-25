<?php
/**
 * Steam Services 365
 */
namespace Roots\Insiders\Steam;

class Steam {

    function __construct()
    {
        $this->getIncluded();

        add_action('wp_ajax_steamConnect',[$this,'steam_connect']);
        add_action('wp_ajax_steamDelete',[$this,'steam_delete']);
    }

    private function getIncluded(){
        require_once('Config.php');
        require_once('inc/openid.php');
    }

    static public function steam(){

        $userObj = wp_get_current_user();

        $key = \Roots\AzureResource\AzureResource::get_key('PhoenixSteamAppKey');

        try
        {
            $openid = new \LightOpenID( home_url() );

            if(!$openid->mode)
            {
                $openid->identity = 'http://steamcommunity.com/openid/?l=english';    // This is forcing english because it has a weird habit of selecting a random language otherwise
                header('Location: ' . $openid->authUrl());
                exit;
            }
            elseif($openid->mode == 'cancel')
            {
                echo 'User has canceled authentication!';
            }
            else
            {
                if($openid->validate())
                {
                    $id = $openid->identity;
                    // identity is something like: http://steamcommunity.com/openid/id/76561197960435530
                    // we only care about the unique account ID at the end of the URL.
                    $ptn = "/^https:\/\/steamcommunity\.com\/openid\/id\/(7[0-9]{15,25}+)$/";

                    preg_match($ptn, $id, $matches);

                    $url = Config::API_URL . "/ISteamUser/GetPlayerSummaries/v0002/?key=" . $key . "&steamids=$matches[1]";
                    $json_object = file_get_contents($url);

                    $decoded = json_decode($json_object);

                    // Account Details
                    update_user_meta($userObj->ID,'insider_steamID',$decoded->response->players[0]->steamid);
                    update_user_meta($userObj->ID,'insider_personaName',$decoded->response->players[0]->personaname);

                    // Ownership
                    self::get_ownership($userObj);

                    return 'Location: ?action=login_steam&success=1&persona=' . $decoded->response->players[0]->personaname;

                }
            }
        }
        catch(ErrorException $e)
        {
            return 'Location: ?action=login_steam&success=0';
        }

    }

    public static function get_ownership($userObj){

        $key = \Roots\AzureResource\AzureResource::get_key('PhoenixSteamAppKey');

        $owned = [];

        $legend = [
            "1017900"   => "Age of Empires: Definitive Edition",
            "813780"    => "Age of Empires II: Definitive Edition",
            "221380"    => "Age of Empires II HD",
            "933110"    => "Age of Empires III: Definitive Edition",
            "105450"    => "Age of Empires III: Complete Collection",
            "11831"     => "Age of Empires: Definitive Collection",
            "266840"    => "Age of Mythology: Extended Edition",
            "1389240"   => "Lords of the West",
            "1581450"   => "Age of Empires III: DE – United States Civilization",
        ];

        try {

            $url = Config::API_URL . "/ISteamUser/GetPublisherAppOwnership/v2/?key=$key&steamid=$userObj->insider_steamID";
            $json_object = file_get_contents($url);

            $decoded = json_decode($json_object);

            foreach($decoded->appownership->apps as $app){
                if($app->ownsapp){
                    array_push($owned,[
                        "productId" => $app->appid,
                        "gameTitle" => $legend[$app->appid],
                        "store" => "Steam",
                        "owned" => 1
                    ]);
                }
            }

            update_user_meta($userObj->ID,'owned_games_steam',$owned);

            return true;

        }
        catch(ErrorException $e)
        {
            return false;
        }

    }

    public static function steam_connect(){
        $usrObj = wp_get_current_user();

        $steamInfo = [
            "steam_id"              => $usrObj->insider_steamID,
            "steam_personaName"     => $usrObj->insider_personaName,
        ];

        if(!empty($steamInfo['steam_id']) && !empty($steamInfo['steam_personaName'])){
            echo json_encode($steamInfo);
        }

        wp_die();
    }

    static public function steam_delete(){

        if(!wp_verify_nonce($_REQUEST['nonce'], 'deleteSteam')) {
            return;
            wp_die();
        }

        $userObj = wp_get_current_user();

        $data = ["gps_steamid" => null,"gps_personaname" => null,"new_steamgamesowned" => null];

        $response = \Roots\Dynamics\Subscription::updateSubscriberValue($data);

        if($response['success']){
            delete_user_meta($userObj->ID,'insider_steamID');
            delete_user_meta($userObj->ID,'insider_personaName');
            echo json_encode(["action" => "deleteSteam", "success" => true]);
        } else {
            echo json_encode(["action" => "deleteSteam", "success" => false, "message" => $response['response']]);
        }

        wp_die();
    }


}