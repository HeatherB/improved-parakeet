<?php

namespace MSAauth\Services;

use MSAauth\Utilities\Helpers;

class Token
{

    static public function process_token()
    {
        if (isset($_GET["user_code"])) {
            $redis = new \Redis();
            $redisAuth = class_exists('\App\Data\AzureResource\AzureResource',false) ? \App\Data\AzureResource\AzureResource::get_key('RedisConnectionAuth') : '';

            if ($redis->connect('tls://age-web-sc.redis.cache.windows.net', 6380, 1, NULL, 0, 0, ['auth' => $redisAuth])) {
                $redis->select(0);
                $user_id = Helpers::decryptRJ256($_GET["user_code"]);
                $jsonString = $redis->hGet('AgeAuthToken' . $user_id, 'data');

                if ($jsonString == false) {
                    $jsonString = $redis->hGet('AgeAuthToken_Dev_' . $user_id, 'data');
                    $user_data = json_decode($jsonString, true);
                    $redis->rename('AgeAuthToken_Dev_' . $user_id, 'AgeWebAuth_Dev_' . $user_id);
                } else {                
                    $user_data = json_decode(Helpers::decryptRJ256($jsonString), true);
                    $redis->rename('AgeAuthToken' . $user_id, 'AgeWebAuth' . $user_id);
                }
                $redis->close();
                if ($jsonString == false) {
                    error_log('AgeAuth: JsonString Empty');
                    Auth::error_redirect('xbla_invalid');
                }
            } else {
                error_log('AgeAuth: Redis Connect Failed');
                Auth::error_redirect('xbla_invalid');
            }
            if (
                (!isset($user_data['Xuid']) || $user_data['Xuid'] == '') &&
                (!isset($user_data['SteamData']['steamid']) || $user_data['SteamData']['steamid'] == '') &&
                $user_data['IsMicrosoft'] != true
            ) {
                Auth::error_redirect('xbla_invalid');
            }

            $u = User::findUser($user_data['Xuid'], $user_data['Email'], $user_data['SteamData']['steamid']);

            if (isset($u) && in_array('banned_user', (array)$u->roles)) {
                $ban_url = Helpers::get_option('msa_banPage');
                if (isset($ban_url)) {
                    wp_redirect(esc_url(get_permalink($ban_url)));
                    exit();
                } else {
                    wp_redirect(esc_url(home_url()));
                    exit();
                }
            }

            // MS Account Link
            if($user_data['AccountLink']){
                if(class_exists('\Roots\Insiders\Insider',false)){
                    \Roots\Insiders\Insider::link_ms_employee($user_data); // Update Dynamics
                }
                if(isset($user_data['ReturnPath'])) {
                    wp_redirect(esc_url($user_data['ReturnPath']));
                    exit();
                } else {
                    return;
                }
            }

            if ($u) {
                $user_data['UserId'] = $u->ID;
                User::updateUser($user_data);
                User::manualLogin($u->ID, $u);
            } else {
                User::createUser($user_data);
            }

            if (session_status() == 1) {
                session_start();
            }
            unset($_SESSION['user_data']);
            unset($_SESSION['flight_groups']);
            setcookie('age_login_expire', true, time() + 14400, "/");
            if (isset($user_data['SteamData']['steamid'])) {
                setcookie('age_login_steam', true);
            }
            if (isset($_SESSION['MSA_PAGE_REDIRECT'])) {
                wp_redirect($_SESSION['MSA_PAGE_REDIRECT']);
            } else if (isset($_COOKIE['MSA_PAGE_REDIRECT'])) {
                wp_redirect($_COOKIE['MSA_PAGE_REDIRECT']);
            } else if (isset($user_data['OriginUrl'])) {
                wp_redirect($user_data['OriginUrl']);
                exit();
            } else {
                wp_redirect(home_url());
                exit();
            }
        } else if (isset($_GET['aad_token'])) {
            $user_data = json_decode(Helpers::decryptRJ256($_GET['aad_token']), true);

            if ($user_data['IsMicrosoft'] != true) {
                Auth::error_redirect('aad_invalid');
            }

            // MS Account Link
            if($user_data['AccountLink']){
                if(class_exists('\Roots\Insiders\Insider',false)){
                    \Roots\Insiders\Insider::link_ms_employee($user_data); // Update Dynamics
                }
                if(isset($user_data['ReturnPath'])) {
                    wp_redirect(esc_url($user_data['ReturnPath']));
                    exit();
                } else {
                    return;
                }
            }

            $u = User::findUser('', $user_data['MSEmail'], '');
            if ($u) {
                $user_data['UserId'] = $u->ID;
                User::updateUser(
                    $user_data
                );
                User::manualLogin($u->ID, $u);
            } else {
                User::createUser(
                    $user_data
                );
            }
            unset($_SESSION['user_data']);
            unset($_SESSION['flight_groups']);
            setcookie('age_login_expire', true, time() + 14400, "/");
            if (isset($user_data['SteamData']['steamid'])) {
                setcookie('age_login_steam', true);
            }
            if (isset($_SESSION['MSA_PAGE_REDIRECT'])) {
                wp_redirect($_SESSION['MSA_PAGE_REDIRECT']);
            } else if (isset($_COOKIE['MSA_PAGE_REDIRECT'])) {
                wp_redirect($_COOKIE['MSA_PAGE_REDIRECT']);
            } else if (isset($user_data['OriginUrl'])) {
                wp_redirect($user_data['OriginUrl']);
                exit();
            } else {
                wp_redirect(home_url());
                exit();
            }
        }
    }

}