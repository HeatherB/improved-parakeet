<?php

namespace Roots\Dynamics;

class Token {

    static public function crmAuthToken()
    {

        // Get Saved Token
        $token = \Roots\AzureResource\Helpers::cache_key('d365_token','get');

        if ( false !== $token ) {
            return $token;
        }

        $headers = [
            "Content-Type" => "application/json"
        ];

        $data = [
            "grant_type" => "client_credentials",
            "client_id" => \Roots\AzureResource\AzureResource::get_key('AgeAuth--Dynamics--ClientId'),
            "client_secret" => \Roots\AzureResource\AzureResource::get_key('AgeAuth--Dynamics--ClientSecret'),
            "resource" => Config::$resource
        ];

        $response = Methods::postAPI(Config::TKNURL,$data, [], $headers);

        if($response['code'] == 200){

            $token = json_decode($response['response'])->access_token;

            \Roots\AzureResource\Helpers::cache_key('d365_token','set',$token);

            return $token;

        } else {
            error_log('DYNAMICS API ERROR:(TOKEN) Code:' . $response['code'] . ' Description: ' . 'Unauthorized');
            return;
        }
    }

}