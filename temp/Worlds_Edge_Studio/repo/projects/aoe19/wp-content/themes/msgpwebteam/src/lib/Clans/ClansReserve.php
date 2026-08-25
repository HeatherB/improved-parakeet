<?php

namespace Roots\Clans;

use WP_Query;

class ClansReserve
{
    public function __construct()
    {
        add_action('wp_ajax_club_reserve', [$this, 'club_reserve']);
        add_action('wp_ajax_nopriv_club_reserve', [$this, 'club_reserve']);
    }

    public function club_reserve()
    {

        $result = \Clubs\Utilities\Calls::post(CLUB_ACCOUNTS_ENDPOINT . "/clubs/reserve/", [
            'name' => $_REQUEST['ClanName'],
            'type' => 'open',
        ],
            [],
            [
                'x-xbl-contract-version: 1',
                'Content-Type: application/json',
                'Accept: application/json',
                'Authorization: XBL3.0 x=' . get_user_meta(get_current_user_id(), 'msa_uhs', true) . ';' . get_user_meta(get_current_user_id(), 'msa_token', true),

            ]);

        if ($result) {
            if ($result['code'] == 200 || $result['code'] == 201) {
                echo json_encode(['success' => 'true', 'code' => $result['code']]);
            } else {
                echo json_encode(['success' => 'false', 'code' => $result['code'], 'name' => $_REQUEST['ClanName']]);
            }
        } else {
            echo json_encode(['success' => 'error', 'error' => $result['reponse'], 'code' => $result['code']]);
        }

        die();

    }

}