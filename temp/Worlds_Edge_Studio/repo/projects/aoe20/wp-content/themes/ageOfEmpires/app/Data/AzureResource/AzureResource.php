<?php

namespace App\Data\AzureResource;

class AzureResource
{

    public function __construct()
    {
       $this->get_included();
    }

    public function get_included(){
        require_once('Methods');
        require_once('Helpers.php');
    }

    public static function get_key($keyvault_name){

        $key = Helpers::cache_key($keyvault_name,'get');

        if ( false !== $key ) {

            return $key;

        } else {

            $headers = [
                'Authorization: Bearer ' . self::get_auth('https://vault.azure.net'),
            ];

            $response = Methods::getAPI('https://agewebvault.vault.azure.net/secrets/' . $keyvault_name . '?api-version=7.1', [], $headers);

            if ($response['code'] == 200) {
                $decoded = json_decode($response['response']);

                Helpers::cache_key($keyvault_name,'set',$decoded->value);

                return $decoded->value;

            } else {
                error_log('KeyVault API ERROR:(get_key) Response:' . $response['response']);
            }

        }

    }

    public static function purge_front_door_cache(){        

        $headers = [
            'Authorization: Bearer ' . self::get_auth('https://management.core.windows.net/'),
            'Content-Type: application/json',
        ];
        $body = array (
            'contentPaths' => [ '/*' ]
        );

        $response = Methods::postAPI('https://management.azure.com/subscriptions/9105e942-89e1-4c54-8723-7d31cc2a5162/resourceGroups/AgeWebSecurity/providers/Microsoft.Network/frontDoors/age-web-fd/purge?api-version=2019-05-01', json_encode($body), [], $headers);

        if ($response['code'] == 200 || $response['code'] == 202) {

            error_log('Front door cache cleared.');
            return true;

        } else {
            error_log('Front Door API ERROR:(purge_front_door_cache) Response:' . $response['response']);
            return false;
        }       

    }

    private function get_auth($resource){

        if (isset($_SERVER['IDENTITY_ENDPOINT'])) {
            $headers = [
                'Metadata: true',
                'X-IDENTITY-HEADER: ' . $_SERVER['IDENTITY_HEADER']
            ];
            $url = $_SERVER['IDENTITY_ENDPOINT'];
            $apiVer = '2019-08-01';
        } else {
            $headers = [
                'Metadata: true'
            ];
            $url = 'http://169.254.169.254/metadata/identity/oauth2/token';
            $apiVer = '2018-02-01';
        }

        $response = Methods::getAPI($url . '?api-version=' . $apiVer . '&resource=' . $resource, [], $headers);

        if ($response['code'] == 200) {

            $decoded = json_decode($response['response']);

            return $decoded->access_token;

        } else {
            error_log('KeyVault API ERROR:(get_auth) Response:' . $response['response']);
        }

    }

    public static function get_key_test($keyvault_name,$temp_key){

        $headers = [
            'Authorization: Bearer ' . $temp_key,
        ];

        $response = Methods::getAPI('https://agewebvault.vault.azure.net/secrets/'.$keyvault_name.'?api-version=7.1',[],$headers);

        if($response['code'] == 200){
            $decoded = json_decode($response['response']);

            return $decoded->value;

        } else {
            error_log('KeyVault API ERROR:(get_key) Response:' . $response['response']);
        }

    }

}