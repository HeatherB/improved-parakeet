<?php

namespace Roots\Insiders;

class InsidersPage
{

    public $data = [];

    public function __construct()
    {
        add_filter('sage/template/page-template-template-insider-landing-blade/data', [$this, 'insiders_page']);
    }

    public function insiders_page()
    {

        $acf = get_fields();

        $this->data = [
            'showProfile'               => $acf['show_profile'],
            'signUpBlock'               => $acf['sign_up_block'],
            'communityBlock'            => $acf['insider_community_block'],
            'eventFields'               => $acf['events'],
            'eventCards'                => $acf['event_cards'],
            'faq'                       => $acf['insider_faq'],
            'addlContentSections'       => $acf['additional_content'],
            'numCards'                  => 0,
            'extraCard'                 => 0,
            'insiderEventCards'         => 0,
            'insiderExtraCard'          => false,
            'show_flight_vids'          => false,
            'has_extra_card'            => false,
            'communityBlockInsider'     => false,
            'communityBlockNonInsider'  => false,
            'insider_status'            => 0,
        ];

        foreach ($this->data['communityBlock'] as $block) {
            if ($block['user_state'] === 'logged_in' || $block['user_state'] === 'all') {
                $this->data['communityBlockInsider'] = true;
            } else {
                $this->data['communityBlockNonInsider'] = true;
            }
        }

        // User Is Logged In
        if (is_user_logged_in()) {
            // User Object
            $usrObj = wp_get_current_user();

            if(isset($usrObj->d365_contactid)) {
                $this->data['insider'] = $this->get_insider();
                $this->data['pc_specs'] = $this->get_pc_specs();
            }
        }

        $this->data['flights']  = $this->get_flight();

        $this->data['events'] = $this->events();

        return $this->data;
    }

    private function get_insider()
    {
        // Insider Info
        $insider = json_decode(\Roots\Dynamics\Subscription::getSubscriber('gps_isinsider,gps_moderngamertag,gps_gamertag,gps_steamid,gps_personaname,gps_pcspecs')) ?? new \stdClass();

        $this->data['insider_status'] = (isset($insider->gps_isinsider) && $insider->gps_isinsider);

        if ($this->data['insider_status']) {
            $insider->gamerName = $insider->gps_moderngamertag ?? $insider->gps_gamertag;
            $insider->has_specs = (isset($insider->gps_pcspecs) && !empty($insider->gps_pcspecs) && $insider->gps_pcspecs != '{}' && $insider->gps_pcspecs != '""' && $insider->gps_pcspecs != 'null' ? 'complete' : 'incomplete');
            $insider->has_steam = (isset($insider->gps_steamid) && !empty($insider->gps_steamid) && $insider->gps_steamid != '{}' && $insider->gps_steamid != '""' && $insider->gps_steamid != 'null' ? 'complete' : 'incomplete');
        }

        return $insider;
    }

    private function get_flight()
    {
        // Flight Info
        $flight = new \stdClass();

        $flight->flight_data = \Roots\Insiders\Insider::getBetaStatus('keys');

        $flight->betaEnrollment = array_keys($flight->flight_data);

        if(is_array(array_keys($flight->betaEnrollment))){
            $flight->flight_enrolled = array_map('strtolower', $flight->betaEnrollment);
        }

        // Flight Videos
        $flight->flight_terms = get_terms([
            'taxonomy' => ['flights'],
            'hide_empty' => true,
        ]);

        // Flight Categories
        $flight->flight_cats = get_terms([
            'taxonomy' => ['flight_categories'],
            'hide_empty' => false,
        ]);

        if ($flight->flight_terms && isset($flight->flight_enrolled) && is_array($flight->flight_enrolled)) {
            foreach ($flight->flight_terms as $flight_term) {
                if (in_array($flight_term->slug, $flight->flight_enrolled)) {
                    $this->data['show_flight_vids'] = true;
                }
            }
        }
        // Populated By Event Card loop
        $flight->currentBetas = [];

        return $flight;

    }

    private function events()
    {
        // Events
        if(isset($this->data['eventCards']) && is_array($this->data['eventCards'])) {
            foreach ($this->data['eventCards'] as $i => $card) {

                // Current Beta List
                $current['flight_id'] = $card['flight_id'];
                $current['flight_name'] = $card['game']['label'] . " " . $card['event_name'];
                array_push($this->data['flights']->currentBetas, $current);

                // Append Flight Credentials to Cards
                if(isset($card['flight_id'])){
                    if(isset($this->data['flights']->flight_data[$card['flight_id']]['steam_key'])){
                        $this->data['eventCards'][$i]['steam_key'] = $this->data['flights']->flight_data[$card['flight_id']]['steam_key'];
                    }
                    if(isset($this->data['flights']->flight_data[$card['flight_id']]['branch_password'])){
                        $this->data['eventCards'][$i]['branch_password'] = $this->data['flights']->flight_data[$card['flight_id']]['branch_password'];
                    }
                }

                if ($card['insiders_only'] && $card['is_active']) {
                    $this->data['insiderEventCards']++;
                }

                if (!$card['insiders_only'] && $card['is_active']) {
                    $this->data['numCards']++;
                }
            }
        }

        if(isset($this->data['eventFields']) && is_array($this->data['eventFields'])) {
            foreach ($this->data['eventFields'] as $event) {

                if ($this->data['has_extra_card']) {
                    $this->data['extraCard'] = true;
                }

                if ($event['user_state'] === 'logged_in' && $event['has_extra_card']) {
                    $this->data['insiderExtraCard'] = true;
                }
            }
        }

        // only one card active, with no extra card
        if($this->data['numCards'] == 1 && $this->data['extraCard'] == false) {
            $this->data['only_one_card'] = 'only_one_card';
        } else {
            $this->data['only_one_card'] = '';
        }
    }

    private function get_pc_specs()
    {
        // PC SPECS
        $pc_specs = isset($this->data['insider']->gps_pcspecs) ? json_decode($this->data['insider']->gps_pcspecs) : new \stdClass();

        // Comparison Value
        $vram_value = 0;
        $pc_specs->vram = 0;
        $pc_specs->warnings = '';

        $pc_specs->ram = isset($pc_specs->Memory) ? floor(preg_replace("/[^0-9]/", "", $pc_specs->Memory) / 1000) : 0;

        // Cycle ALL GPU Cards and get highest VRAM
        if(isset($pc_specs->DisplayDevices)) {
            foreach ($pc_specs->DisplayDevices as $displayDevice) {
                if (is_array($displayDevice)) {
                    // If there are multiple
                    foreach ($displayDevice as $device) {
                        if (isset($device->DedicatedMemory) && $device->DedicatedMemory > 2000) {
                            $vram_value = preg_replace("/[^0-9]/", "", $device->DedicatedMemory);
                            $pc_specs->warnings = '';
                        } else {
                            // Using System Ram -- Generally half of total
                            if (preg_replace("/[^0-9]/", "", $device->DisplayMemory) >= 6000 || $vram_value == 0) {
                                $vram_value = preg_replace("/[^0-9]/", "", $device->DisplayMemory);
                                $pc_specs->warnings = 1;
                            }
                        }
                        if ($vram_value > $pc_specs->vram) {
                            $pc_specs->vram = round($vram_value, -3, PHP_ROUND_HALF_UP) / 1000;
                        }
                    }
                    // If there is one
                } else {

                    if (isset($displayDevice->DedicatedMemory) && $displayDevice->DedicatedMemory > 2000) {
                        $vram_value = preg_replace("/[^0-9]/", "", $displayDevice->DedicatedMemory);
                        $pc_specs->warnings = '';
                    } else {
                        // Using System Ram -- Generally half of total
                        if (preg_replace("/[^0-9]/", "", $device->DisplayMemory) >= 6000 || $vram_value == 0) {
                            $vram_value = preg_replace("/[^0-9]/", "", $displayDevice->DisplayMemory);
                            $pc_specs->warnings = 1;
                        }
                    }
                    if ($vram_value > $pc_specs->vram) {
                        $pc_specs->vram = round($vram_value, -3, PHP_ROUND_HALF_UP) / 1000;
                    }

                }
            }
        }

        return $pc_specs;

    }

}