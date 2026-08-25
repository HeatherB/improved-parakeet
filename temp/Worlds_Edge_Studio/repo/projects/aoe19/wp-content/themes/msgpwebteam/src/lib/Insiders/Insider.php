<?php

namespace Roots\Insiders;

use Roots\Dynamics\AbusePrevention;
use Roots\Dynamics\Config;
use Roots\Dynamics\Email;
use Roots\Dynamics\Methods;
use Roots\Dynamics\Utilities;

class Insider {

    public function __construct()
    {
        // DxDiag
        add_action('wp_ajax_deleteDxDiag',[$this,'delete_dx_diag']);
        add_action('wp_ajax_updateDxDiag',[$this,'update_dx_diag']);
        // Steam
        add_action('wp_ajax_updateSteam', [$this, 'update_steam']);
        add_action('wp_ajax_deleteSteam', [$this, 'delete_steam']);
        // Subscriber
        add_action('wp_ajax_insiderOptOut', [$this, 'insider_optout']);
        add_action('wp_ajax_updateUserPrefs', [$this, 'update_user_prefs']);
        add_action('wp_ajax_updateCommunicationPrefs', [$this, 'update_communication_prefs']);
        add_action('wp_ajax_updateBetaPrefs', [$this, 'update_beta_prefs']);
        add_action('wp_ajax_createInsider', [$this, 'create_insider']);
        add_action('wp_ajax_sendEmailVerification', [$this, 'send_email_verification']);
        add_action('wp_ajax_checkExistingEmail', [$this, 'check_existing_email']);
        // Forum
        add_action('wp_ajax_forums_get_latest', [$this, 'forums_get_latest']);

    }

    // Forums
    static public function forums_get_latest()
    {

        $headers = [
            'Content-Type: application/json'
        ];

        $response = Methods::getAPI('https://forums.ageofempires.com/c/insiders/insiders-resources/87/l/latest.json', [], $headers);

        $posts = json_decode($response['response'], true)['topic_list']['topics'];

        usort($posts, function($a, $b) {
            $t1 = strtotime($a['created_at']);
            $t2 = strtotime($b['created_at']);
            return $t1 - $t2;
        });

        $posts = array_slice($posts,-3);

        if($response['code'] == 200) {
            $latest = $posts;
        } else {
            $latest = "Error";
        }

        echo json_encode($latest);

        wp_die();
    }

    // Send Email
    static public function send_email_verification(){

        if(!wp_verify_nonce($_REQUEST['nonce'], 'sendEmailVerification')) {
            return;
            wp_die();
        }

        $userObj = wp_get_current_user();

        // If a Dynamics user doesn't exist, then create one
        if(!isset($userObj->d365_contactid)) {
            self::create_basic_subscriber($userObj,$_REQUEST);
        }

        $emailResponse = self::send_sparkpost_email("insiders-email-verification", ["verification_key" => self::generate_verfication_value()], $_REQUEST['pref_email']);

        if ($emailResponse['success']) {
            echo json_encode(["action" => "sendEmailVerification", "success" => true, "message" => "Email Sent"]);
        } else {
            echo json_encode(["action" => "sendEmailVerification", "success" => false, "message" => "There was a problem performing the requested action."]);
        }


        wp_die();
    }

    // DxDiag
    static public function delete_dx_diag()
    {
        if(!wp_verify_nonce($_REQUEST['nonce'], 'deleteDxDiag')) {
            return;
            wp_die();
        }

        $userObj = wp_get_current_user();

        $data = [
            "gps_dxdiag"            => null,
            "gps_pcspecs"           => null,
            "new_ram"               => null,
            "new_dedicatedmemory"   => null,
            "new_sharedmemory"      => null,
            "new_directx"           => null,
            "new_cpu"               => null,
            "new_windowsversion"    => null,
            "new_dxdiagisuploaded"  => false,
            "new_lastupdate"        => date('n/j/Y H:i:s'),
        ];

        $response = \Roots\Dynamics\Subscription::updateSubscriberValue($data);

        if($response['success']){
            echo json_encode(["action" => "deleteDxDiag", "success" => true]);
        } else {
            echo json_encode(["action" => "deleteDxDiag", "success" => false, "message" => $response['message']]);
        }

        wp_die();
    }

    static public function update_dx_diag()
    {
        if(!wp_verify_nonce($_REQUEST['nonce'], 'updateDxDiag')) {
            return;
            wp_die();
        }

        $data = [
            "gps_dxdiag"            => $_REQUEST['data']['dxDiag'],
            "gps_pcspecs"           => stripslashes($_REQUEST['data']['PCSpecs']),
            "new_dxdiagisuploaded"  => true,
            "new_lastupdate"        => date('n/j/Y H:i:s'),
            "new_machineid"         => $_REQUEST['data']['machineID']
        ];

        $response = \Roots\Dynamics\Subscription::updateSubscriberValue($data);

        if($response['success']){
            echo json_encode(["action" => "updateDxDiag", "success" => true]);
        } else {
            echo json_encode(["action" => "updateDxDiag", "success" => false, "message" => $response['message']]);
        }

        wp_die();
    }

    // Steam
    static public function login_steam(){
        return \Roots\Insiders\Steam\Steam::steam();
    }

    static public function update_steam()
    {

        $userObj = wp_get_current_user();

        $data = [
            "gps_steamid"       => $userObj->insider_steamID,
            "gps_personaname"   => $userObj->insider_personaName,
            "new_lastupdate"    => date('n/j/Y H:i:s'),
        ];

        // Append Game Ownership if it exists
        $owned_games = self::map_owned_games($userObj);

        if(isset($owned_games['games_steam']) && !empty($owned_games['games_steam'])){
            $data['new_steamgamesowned'] = $owned_games['games_steam'];
        }

        $response = \Roots\Dynamics\Subscription::updateSubscriberValue($data);

        if($response['success']){
            echo json_encode(["action" => "updateSteam", "success" => true]);
        } else {
            echo json_encode(["action" => "updateSteam", "success" => false, "message" => "There was an error updating your Steam information"]);
        }

        wp_die();

    }

    // Subscriber
    static public function create_basic_subscriber($userObj,$request){

        // Basic User Data
        $subscriber = [
            "firstname"                     => $userObj->first_name,
            "lastname"                      => $userObj->last_name,
            "gps_xuid"                      => $userObj->msa_xuid,
            "gps_msemail"                   => $userObj->user_email,
            "gps_moderngamertag"            => $userObj->msa_modern_gamertag,
            "gps_gamertag"                  => $userObj->msa_gt,
            "gps_avatar"                    => $userObj->msa_pp,
            "new_ismsfte"                   => ($userObj->msa_is_microsoft == 1 || $userObj->msa_is_microsoft == "1" ) ? true : false,
            "gps_isinsider"                 => false,
            "gps_country"                   => $request['data']['country'],
            "emailaddress1"                 => $request['data']['pref_email'] ?? $userObj->user_email,
            "new_permissiontocontact"       => $request['data']['new_permissiontocontact'] ?? "No",
            "msdynhcp_publicationname"      => "Age Of Empires Communications",
            "new_emailverificationkey"      => self::generate_verfication_value()
        ];

        $subscription = \Roots\Dynamics\Subscription::createSubscriber($subscriber);
        sleep(10);

        // Uncomment to have created contact defaulted off
        //\Roots\Dynamics\Subscription::updateCPMSubscription(false);

        return $subscription;
    }

    static public function create_insider()
    {

        $data = $_POST;

        $userObj = wp_get_current_user();

        // Beta Preferences
        $d365_beta_preferences = [];
        foreach($data['beta_prefs'] as $pref => $value){
            if($pref == "1" && $value) {
                array_push($d365_beta_preferences, "1");
            } elseif($pref == "2" && $value) {
                array_push($d365_beta_preferences, "2");
            }
        }
        if(empty($d365_beta_preferences)){
            $d365_beta_preferences = ["0"];
        }

        // Contact Preferences
        foreach($data['contact_prefs'] as $pref => $value) {
            if($pref == "new_permissiontocontact" && $value){
                $permission_to_contact = "Yes";
            }
        }

        $demo_gender = !is_array($data['demographic']['demo_gender'][0]) ? $data['demographic']['demo_gender'][0] : $data['demographic']['demo_gender'][0]['other'];

        $dxUploaded = !empty($data['DxDiag']) ? true : false;

        // Insider Data
        $subscriber = [
            "firstname"                     => $userObj->first_name,
            "lastname"                      => $userObj->last_name,
            "gps_xuid"                      => $userObj->msa_xuid,
            "gps_msemail"                   => $userObj->user_email,
            "gps_moderngamertag"            => $userObj->msa_modern_gamertag,
            "gps_gamertag"                  => $userObj->msa_gt,
            "gps_avatar"                    => $userObj->msa_pp,
            "new_ismsfte"                   => ($userObj->msa_is_microsoft == 1 || $userObj->msa_is_microsoft == "1" ) ? true : false,
            "gps_steamid"                   => $userObj->insider_steamID,
            "gps_personaname"               => $userObj->insider_personaName,
            "new_dxdiagisuploaded"          => $dxUploaded,
            "gps_emailconfirmed"            => false,
            "gps_age"                       => $data['demographic']['demo_age'][0],
            "gps_gender"                    => $demo_gender,
            "gps_isinsider"                 => true,
            "gps_country"                   => $data['pref_country'],
            "emailaddress1"                 => $data['pref_email'],
            "gps_invitetoken"               => $data['invite_token'],
            "new_permissiontocontact"       => $permission_to_contact ?? "No",
            "gps_dxdiag"                    => $data['DxDiag'] == "{}" ? null : $data['DxDiag'],
            "gps_surveydata"                => json_encode($data['survey_data']),
            "gps_pcspecs"                   => stripslashes($data['pc_specs']),
            "new_betapreferredplatforms"    => implode(',', $d365_beta_preferences),
            "new_emailverificationkey"      => self::generate_verfication_value(),
            "new_msalias"                   => $userObj->msa_ms_pref_username,
            "new_ndasigndate"               => date('n/j/Y'),
            "gps_insidercreatedon"          => date('n/j/Y'),
            "new_machineid"                 => $data['machine_id']
        ];

        // If there is an existing contact ID check for CPM subscription and update that instead of creating a new one
        if(!empty($userObj->d365_contactid)) {
            $CPM = \Roots\Dynamics\Subscription::getPublicationID(\Roots\Dynamics\Config::$ms_contact_ID)['publicationID'];

            if(!empty($CPM)){
                if($permission_to_contact === "Yes"){
                    \Roots\Dynamics\Subscription::updateCPMSubscription(true);
                } else {
                    \Roots\Dynamics\Subscription::updateCPMSubscription(false);
                }
            }

        } else if($permission_to_contact === "Yes") {
            $subscriber['msdynhcp_publicationname'] = "Age Of Empires Communications";
            // HACK to fix issue where CPM subscription takes too long to be created and shows false on initial page load. Deleted in Profile logic
            update_user_meta($userObj->ID, 'tmpCPM', 1);
        }

        $response = \Roots\Dynamics\Subscription::createSubscriber($subscriber);

        if($response['success']){
            update_user_meta($userObj->ID, 'is_insider', 1);
            \Roots\Dynamics\Subscription::createNote("NDA Signed","This NDA signed - " . date('n/j/Y'));
            self::send_sparkpost_email("insiders-welcome-email-iv",["verification_key" => $userObj->email_verification_key['key']],$data['pref_email']);
        }

        echo json_encode($response);

        wp_die();

    }

    static public function link_ms_employee($data){

        $userObj = wp_get_current_user();

        if(!isset($userObj->d365_contactid) || empty($userObj->d365_contactid)){
          return;
        }

        $data = [
            "new_msalias" => $data['MSEmail'],
            "new_ismsfte" => $data['IsMicrosoft']
        ];

        $response = \Roots\Dynamics\Subscription::updateSubscriberValue($data);

        if(!$response['success']){
            error_log('DYNAMICS API ERROR:(link_ms_employee) Response:' . $response['response']);
        }

    }

    static public function insider_optout(){

        if(!wp_verify_nonce($_REQUEST['nonce'], 'insiderOptOut')) {
            return;
            wp_die();
        }

        $userObj = wp_get_current_user();

        // Get users group info before removing
        $enrolledGroups = json_decode(\Roots\Dynamics\Subscription::getSubscriber('new_isladiesofage,new_councilstatus,new_isagefranchisepartner,new_sage,new_isinfluencer'));

        $specialGroups = [
            "Ladies Of Age"         => $enrolledGroups->new_isladiesofage,
            "Council Member"        => $enrolledGroups->new_isagefranchisepartner,
            "Sage"                  => $enrolledGroups->new_sage,
            "Influencer"            => $enrolledGroups->new_isinfluencer,
        ];

        $data = [
            "gps_isinsider" => false,
        ];

        $response = \Roots\Dynamics\Subscription::updateSubscriberValue($data);

        if($response['success']){
            // Cleanup Usermeta
            delete_user_meta($userObj->ID,'insider_steamID');
            delete_user_meta($userObj->ID,'insider_personaName');
            update_user_meta($userObj->ID,'is_insider',0);

            // Send Opt Out Email
            self::send_sparkpost_email('insiders-opt-out-iv', null, $_REQUEST['current_email']);

            $betaStatus = self::getBetaStatus('keys');

            if(sizeof($betaStatus)) {
                $list = "<ul>";
                foreach ($betaStatus as $flight => $key) {
                    $list .= "<li>$flight: " . $key['steam_key'] . "</li>";
                }
                $list .= "<ul>";
            }

            $groupsList = "<ul>";
            foreach($specialGroups as $key => $value){
                if($value) {
                    $groupsList .= "<li>$key</li>";
                }
            }
            $groupsList .= "</ul>";

            $data = [
                "gamertag" => $userObj->msa_gt,
                "xuid" => $userObj->msa_xuid,
                "new_ismsfte" => ($userObj->msa_is_microsoft) ? "Yes" : "No",
                "ms_email" => $userObj->user_email,
                "list" => $list,
                "groups" => $groupsList,
            ];

            // Create a note on the users D365 timeline
            \Roots\Dynamics\Subscription::createNote("Insider Opt Out ","This Subscriber has opted out - " . date('n/j/Y'));

            // Email to flight
            self::send_sparkpost_recipients('flight-opt-out-notification', $data,'insiders-opt-out-notification-recipients');

            echo json_encode(["action" => "insiderOptOut", "success" => true]);
        } else {
            error_log('DYNAMICS API ERROR:(insiderOptOut) Response:' . $response['response']);
            echo json_encode(["action" => "insiderOptOut", "success" => false, "message" => $response['response']]);
        }

        wp_die();
    }

    static public function update_user_prefs(){

        if(!wp_verify_nonce($_REQUEST['nonce'], 'updateUserPrefs')) {
            return;
            wp_die();
        }

        // Sort Questions and Demographic info
        $questions = $_REQUEST['questions'];

        $surveyData = [];
        $demographic = [];

        foreach($questions as $question => $answer){
            if($question == "demo_age"){
                $demographic[$question] = $answer[0];
            }elseif($question == "demo_gender"){
                $demographic[$question] = !is_array($answer[0]) ? $answer[0] :  $answer[0]['other'];
            } else {
                $surveyData[$question] = $answer;
            }
        }

        $data = [
            "gps_surveydata" => json_encode($surveyData),
            "gps_age" => $demographic['demo_age'],
            "gps_gender" => $demographic['demo_gender']
        ];

        $response = \Roots\Dynamics\Subscription::updateSubscriberValue($data);

        if($response['success']){
            echo json_encode(["action" => "updateUserPrefs", "success" => true]);
        } else {
            error_log('DYNAMICS API ERROR:(updateUserPrefs) Response:' . $response['response']);
            echo json_encode(["action" => "updateUserPrefs", "success" => false, "message" =>  $response['message']]);
        }

        wp_die();
    }

    static public function sync_dynamics_user($id){

        // Check account status and update user object
        \Roots\Dynamics\Subscription::checkSubscriber($id);

        // Get updated user object
        $userObj = get_user_by('id',$id);

        if(!$userObj->is_insider || !isset($userObj->d365_contactid)){
            return;
        }

        $data = [
            "gps_moderngamertag"    => $userObj->msa_modern_gamertag,
            "gps_gamertag"          => $userObj->msa_gt,
            "new_lastweblogin"      => date('Y-m-d\TH:i:s\Z'),
        ];

        // Append Game Ownership if it exists
        $owned_games = self::map_owned_games($userObj);

        if(isset($owned_games['games_ms']) && !empty($owned_games['games_ms'])){
            $data['new_msgamesowned'] = $owned_games['games_ms'];
        }
        if(isset($owned_games['games_steam']) && !empty($owned_games['games_steam'])){
            $data['new_steamgamesowned'] = $owned_games['games_steam'];
        }

        $response = \Roots\Dynamics\Subscription::updateSubscriberValue($data,$userObj);

        if(!$response['success']){
            error_log('INSIDERS API ERROR:(update_on_login) Response:' . $response['response']);
            return false;
        }

        return true;

    }

    static public function map_owned_games($userObj) {

        $game_map = [
            "1017900"       => 0, // Steam Age of Empires: Definitive Edition
            "221380"        => 1, // Steam Age of Empires II HD
            "813780"        => 2, // Steam Age of Empires II: Definitive Edition
            "933110"        => 3, // Steam Age of Empires III: Definitive Edition
            "105450"        => 4, // Steam Age of Empires III: Complete Collection
            "11831"         => 5, // Steam Age of Empires: Definitive Collection
            "266840"        => 6, // Steam Age of Mythology: Extended Edition
            "1389240"       => 7, // Steam Lords of the West
            "1581450"       => 8, // Steam Age of Empires III: DE – United States Civilization
            "9NJWTJSVGVLJ"  => 0, // MS Age of Empires: Definitive Edition
            "9NJDD0JGPP2Q"  => 2, // MS Age of Empires II: Definitive Edition
            "9N1HF804QXN4"  => 3, // MS Age of Empires III: Definitive Edition
            "9P4S0R97R36S"  => 5, // MS Age of Empires: Definitive Collection
            "p79t3khh6mn"   => 8, // MS Age of Empires III: DE – United States Civilization
            "CFQ7TTC0KGQ8"  => 9, // Xbox Game Pass for PC
            "CFQ7TTC0KHS0"  => 10, // Xbox Game Pass Ultimate
        ];

        $owned_games = [
            "games_ms"      => [],
            "games_steam"   => [],
        ];

        // Loop MS Games
        if(isset($userObj->owned_games_microsoft) && is_array($userObj->owned_games_microsoft)) {
            foreach ($userObj->owned_games_microsoft as $game) {
                if(!empty($game_map[$game['productId']])){
                    array_push($owned_games['games_ms'], $game_map[$game['productId']]);
                }
            }
        }
        // Loop Steam Games
        if(isset($userObj->owned_games_steam) && is_array($userObj->owned_games_steam)) {
            foreach ($userObj->owned_games_steam as $game) {
                if(!empty($game_map[$game['productId']])) {
                    array_push($owned_games['games_steam'], $game_map[$game['productId']]);
                }
            }
        }

        //  Format for D365 Multiselect field
        $owned_games['games_ms'] = implode(',',$owned_games['games_ms']);
        $owned_games['games_steam'] = implode(',',$owned_games['games_steam']);

        return $owned_games;

    }

    static public function update_communication_prefs()
    {

        if (!wp_verify_nonce($_REQUEST['nonce']['actionNonce'], 'updateCommunicationPrefs')) {
            return;
            wp_die();
        }

        $userObj = wp_get_current_user();
        $isEmailChange = false;

        // If there is no insider or Dynamics account, then create a basic Subscriber in Dynamics to track contact prefs
        if(!isset($userObj->d365_contactid)){

            self::create_basic_subscriber($userObj,$_REQUEST);

        } else {

            $data = [
                "new_permissiontocontact" => $_REQUEST['data']['new_permissiontocontact'],
                "gps_country" => $_REQUEST['data']['country'],
            ];

            if(!empty($_REQUEST['nonce']['CPMNonce']) && wp_verify_nonce($_REQUEST['nonce']['CPMNonce'], 'cpmnonce')) {
                \Roots\Dynamics\Subscription::updateCPMSubscription($_REQUEST['data']['new_permissiontocontact']);
            }

        }

        // Pref Email -- Check If different
        if ($_REQUEST['data']['pref_email'] != $_REQUEST['data']['current_email']) {

            $data['emailaddress1'] = $_REQUEST['data']['pref_email'];
            $data['gps_emailconfirmed'] = false;

            $isEmailChange = true;
        }

        $response = \Roots\Dynamics\Subscription::updateSubscriberValue($data);

        // If Email Exists
        if($response['code'] === 412){

            echo json_encode(["action" => "updateCommunicationPrefs", "success" => false, "message" => get_field('insider_email_taken', 'option')]);

        } else if ($response['success']) {

            // Send Email for email validation if successfully changed
            if($isEmailChange) {
                // Send to old email
                self::send_sparkpost_email('preferred-email-update-iv', ["pref_email" => $_REQUEST['data']['pref_email']], $_REQUEST['data']['current_email']);
                // Send to new email
                self::send_sparkpost_email('insiders-email-verification-iv', ["verification_key" => self::generate_verfication_value()], $_REQUEST['data']['pref_email']);
            }

            echo json_encode(["action" => "updateCommunicationPrefs", "success" => true]);

        } else {
            echo json_encode(["action" => "updateCommunicationPrefs", "success" => false, "message" => "There was an error updating your information."]);
        }

        wp_die();
    }

    static public function update_beta_prefs(){

        if(!wp_verify_nonce($_REQUEST['nonce'], 'updateBetaPrefs')) {
            return;
            wp_die();
        }

        $data = [
            "new_betapreferredplatforms"  => implode(',', $_REQUEST['data'])
        ];

        $response = \Roots\Dynamics\Subscription::updateSubscriberValue($data);

        if($response['success']){
            echo json_encode(["action" => "updateBetaPrefs", "success" => true]);
        } else {
            echo json_encode(["action" => "updateBetaPrefs", "success" => false, "message" => $response['message']]);
        }

        wp_die();
    }

    static public function confirmEmail(){

        $data = [
            "gps_emailconfirmed" => true,
        ];

        $response = \Roots\Dynamics\Subscription::updateSubscriberValue($data);

        if($response['success']){
            return 'Location: ?action=email_confirmed&success=true';
        } else {
            return 'Location: ?action=email_confirmed&success=false';
        }
    }

    // Insiders - Dynamics calls that are specific to insiders
    static public function get_insiders_count() {

        $headers = [
            'Content-Type: application/json',
            'Accept: application/json',
            'OData-MaxVersion: 4.0',
            'OData-Version: 4.0',
            'Authorization: Bearer ' . \Roots\Dynamics\Token::crmAuthToken()
        ];

        $response = \Roots\Dynamics\Methods::getAPI(\Roots\Dynamics\Config::APIURL . '/msdyncrm_segments('.\Roots\Dynamics\Config::SEG_INSIDERS.')?$select=msdyncrm_segmentsize',[],$headers);

        if($response['code'] == 200){
            $decoded = json_decode($response['response']);
            return $decoded->msdyncrm_segmentsize;
        } else {
            return 0;
        }
    }

    static public function getBetaStatus($type = null) {
        $userObj = wp_get_current_user();

        if(!empty($userObj->d365_contactid)) {

            $enrolled = [];

            $headers = [
                'Content-Type: application/json; odata.metadata=minimal',
                'Accept: application/json',
                'OData-MaxVersion: 4.0',
                'OData-Version: 4.0',
                'Authorization: Bearer ' . \Roots\Dynamics\Token::crmAuthToken()
            ];

            // Get Associated Flight
            $response = \Roots\Dynamics\Methods::getAPI(\Roots\Dynamics\Config::APIURL . 'gps_flightproductkeyses?$filter=_gps_userid_value+eq+'. $userObj->d365_contactid . '&$expand=gps_groupid($select=gps_groupid,gps_groupname,statecode)&$count=true', [], $headers);

            if ($response['code'] == 200) {
                $decoded = json_decode($response['response']);

                // Loop through responses according to type
                switch($type) {
                    case "keys":
                        // Flight Name, Key, Branch Password
                        foreach ($decoded->value as $flight) {
                            if(!$flight->gps_groupid->statecode){ // Screen for inactive flight  (0 = active)
                                $enrolled[$flight->gps_groupid->gps_groupname] = ['steam_key' => $flight->gps_productkey, 'branch_password' => $flight->new_branchpassword];
                            }
                        }
                        break;
                    default:
                        // Flight Name Only
                        foreach ($decoded->value as $flight) {
                            if(!$flight->gps_groupid->statecode) { // Screen for inactive flight  (0 = active)
                                array_push($enrolled, $flight->gps_groupid->gps_groupname);
                            }
                        }
                        break;
                }

                return $enrolled;
            } else {
                return 0;
            }
        } else {
            return 0;
        }

    }

    static public function send_sparkpost_email($email_template_id,$meta,$email) {

        if(!self::check_red_alerts($email)['status']){
            return false;
        }

        $headers = [
            'Authorization: ' . Config::SPARKPOST_AUTH,
            'Content-Type: application/json',
            'Accept: application/json'
        ];

        $body = [
            "options" => [
                "open_tracking" => true,
                "click_tracking" => true
            ],
            "content" => [
                "template_id" => $email_template_id
            ],
            "substitution_data" => $meta,
            "recipients" => [
                [
                    "address" => [
                        "email" => $email
                    ]
                ]
            ]
        ];

        $response = Methods::postAPI(Config::SPARKPOST_TRANSMIT_URL,json_encode($body),[],$headers);
        if($response['code'] == 200 || $response['code'] == 201) {
            return ["action" => "send_sparkpost_email", "success" => true];
        } else {
            error_log('INSIDERS API ERROR:(check_red_alerts) Response:' . $response['response']);
            return ["action" => "send_sparkpost_email", "success" => false, "message" => $response['response']];
        }

    }

    static public function send_sparkpost_recipients($email_template_id,$meta,$listID) {

        $headers = [
            'Authorization: ' . Config::SPARKPOST_AUTH,
            'Content-Type: application/json',
            'Accept: application/json'
        ];

        $body = [
            "content" => [
                "template_id" => $email_template_id
            ],
            "substitution_data" => $meta,
            "recipients" => ["list_id" => $listID]
        ];

        $response = Methods::postAPI(Config::SPARKPOST_TRANSMIT_URL,json_encode($body),[],$headers);
        if($response['code'] == 200 || $response['code'] == 201) {
            return ["action" => "send_sparkpost_recipients", "success" => true];
        } else {
            error_log('INSIDERS API ERROR:(send_sparkpost_recipients) Response:' . $response['response']);
            return ["action" => "send_sparkpost_recipients", "success" => false, "message" => $response['response']];
        }
    }

    static public function send_email($type) {

        $data = [
            "type" => $type
        ];

        $response = Email::send_email($data);
        if($response['code'] == 200 || $response['code'] == 201) {
            return ["action" => "send_email", "success" => true];
        } else {
            error_log('INSIDERS API ERROR:(send_email) Response:' . $response['response']);
            return ["action" => "send_email", "success" => false, "message" => $response['response']];
        }
    }

    static public function check_red_alerts($email){
        $userObj = wp_get_current_user();

        $headers = [
            'Content-Type: application/json',
            'Accept: application/json'
        ];

        $response = Methods::getAPI(Config::CPM_RAL_API . '?email=' . $email . '&code=' . Config::CPM_APIKEY,[],$headers);
        if($response['code'] == 200 || $response['code'] == 201) {
            $decoded = json_decode($response['response']);
            return ["action" => "check_red_alerts", "success" => true, "email" => $userObj->user_email, "status" => $decoded];
        } else {
            error_log('INSIDERS API ERROR:(check_red_alerts) Response:' . $response['response']);
            return ["action" => "check_red_alert", "success" => false];
        }
    }

    static public function generate_verfication_value(){

        $userObj = wp_get_current_user();

        //Generate Random Key
        $pool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        $key = array();
        $poolLength = strlen($pool) - 1;
        for($i = 0; $i < 16; $i++) {
            $n = rand(0, $poolLength);
            $key[] = $pool[$n];
        }

        $key = implode($key);

        $data = [
            "new_emailverificationkey" => $key
        ];

        if(!empty($userObj->d365_contactid)) {
            $response = \Roots\Dynamics\Subscription::updateSubscriberValue($data);
            if(!$response['success']) {
                error_log('INSIDERS API ERROR:(generate_verfication_value) Message: There was an error saving the verification key to D365 for user: ' . $userObj->msa_xuid . ' Response:' . $response['response']);
            }
        }

        update_user_meta($userObj->ID, 'email_verification_key', ["key" => $key, "timestamp" => time()]);

        return $key;

    }

    static public function check_existing_email(){

        $abuse_detection = new AbusePrevention('pref_email');

        if($abuse_detection->abuse_check()){

            $response = ["action" => "abuse_check", "success" => false, "error" => "Failed abuse check", "message" => get_field('warning_excessive_tries', 'option'), 'redirect' => home_url('/profile/?warning=excessive_tries')];

        }else if(\Roots\Dynamics\Subscription::checkExistingEmail($_POST['pref_email'])){

            $response = ["action" => "check_existing_email", "success" => false, "message" => get_field('insider_email_taken', 'option')];

        } else {

            $response = ["action" => "check_existing_email", "success" => true];

        }

        echo json_encode($response);

        wp_die();
    }

}
