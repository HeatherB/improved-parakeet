<?php

namespace Roots\Controllers;

class ModeratorsController
{
    CONST PROFILE_UPDATE_URL = 'https://survey.ageofempires.com/survey/profile_update.php';
    CONST INSIDER_INFO_URL = 'https://survey.ageofempires.com/survey/insider_info.php';
    CONST INSIDER_FLIGHTS_URL = 'https://survey.ageofempires.com/survey/insider_flights.php';
    CONST INSIDERS_COUNT_URL = 'https://subscribe.microsoftstudios.com/api/subscriptions/GetSurveyCount?AuthCode=iE3Yt6haewaLIFXv0a2E6OHz75cO-gJmh1yU0-U8Hf8hK2fU';
    CONST INSIDERS_BETA_MATCHCOUNT_URL = 'https://stats.ageofempires.com/api/GameCount/';
    CONST INSIDERS_FORUM_URL = 'https://forums.ageofempires.com';
    CONST SPARKPOST_TRANSMIT_URL = 'https://api.sparkpost.com/api/v1/transmissions';
    CONST SPARKPOST_AUTH = 'a5de9e6d7a1d2f774a6a6e8e164c39fa194ad1ff';

    public function __construct()
    {
        add_action('wp_ajax_turnin_vcm_application', [$this, 'turnin_vcm_application']);
       // add_action('wp_ajax_purge_insider_data', [$this, 'purge_insider_data']);
       // add_action('wp_ajax_update_pref_email', [$this, 'update_pref_email']);
       // add_action('wp_ajax_update_dxdiag', [$this, 'update_dxdiag']);
       // add_action('wp_ajax_delete_steam', [$this, 'delete_steam']);
       // add_action('wp_ajax_forums_get_latest', [$this, 'forums_get_latest']);
       // add_action('wp_ajax_update_beta_prefs', [$this, 'update_beta_prefs']);
       // add_action('wp_ajax_update_survey_answers', [$this, 'update_survey_answers']);
       // add_action('wp_ajax_update_country', [$this, 'update_country']);
       // add_action('wp_ajax_send_beta_invite', [$this, 'send_beta_invite']);
       // add_action('wp_login', [$this, 'insider_status_check']);
    }

    // send email / recieve test data
    static public function turnin_vcm_application()
    {
        $returned_data = $_REQUEST['transData'];
        $returned_decode = json_decode(stripslashes($returned_data), true);
        $data['returned_decode'] = $returned_decode;

        header('Content-Type: application/json');
        //echo json_encode($data);
        var_dump($data);
        wp_die();
    }

    // Send an OPT-OUT Email
    private function send_oo_email($user_info)
    {

        $body = "<p>AgeFlightTeam,<br><br>";
        $body .= "An Age Insider has opted out, and we may need to remove the following:";

        foreach($user_info as $flight) {
            $body .= "<ul>";
            foreach($flight as $key => $value) {
                if(empty($value)) {
                    $value = "N/A";
                }
                $body .= "<li>$key: $value</li>";
            }
            $body .= "<ul>";
        }

        $body .= "</p>";

        $headers = array('Content-Type: text/html; charset=UTF-8');
        $to = ["saharr@microsoft.com", "v-juridd@microsoft.com", "ageflightteam@microsoft.com"];
        $subject = 'Age Insider Program — A beta participant has Opted-Out';

        return wp_mail($to, $subject, $body, $headers);

    }

    // Retrieve and Revoke Keys
    private function revoke_keys()
    {

        $headers = [
            'Content-Type: application/json'
        ];

        $data = [
            "action" => "optout_flights",
            "xuid" => wp_get_current_user()->msa_xuid,
            "site_key" => get_field('insiders_database_key','option')
        ];

        $response = InsidersController::post(self::INSIDER_FLIGHTS_URL, $data, [], $headers);

        if($response['code'] == 200) {
            return $response;
        }

    }

    // Insider Status Check
    static public function insider_status_check()
    {
        $insiderInfo = json_decode(InsidersController::get_insider_info(), true);

        $insider_status = (isset($insiderInfo['results'][0]['survey_data']) ? 1 : 0);

        // TODO -- Add current betas??????

        update_user_meta(get_current_user_id(), 'is_insider', $insider_status);
    }

    // Update DXDIAG
    static public function update_dxdiag()
    {

        if(wp_verify_nonce($_REQUEST['nonce'], 'upload_dxdiag') || wp_verify_nonce($_REQUEST['nonce'], 'delete_dxdiag')) {
            $headers = [
                'Content-Type: application/json',
            ];

            $dxDiag = json_decode(html_entity_decode( stripslashes ($_POST['data']['dxDiag'])));
            $PCSpecs = json_decode(html_entity_decode( stripslashes ($_POST['data']['PCSpecs'])));

            $data = [
                "action" => "update_dxdiag",
                "dxDiag" => json_encode($dxDiag),
                "PCSpecs" => json_encode($PCSpecs),
                "xuid" => wp_get_current_user()->msa_xuid,
                "site_key" => get_field('insiders_database_key','option')
            ];

            $response = InsidersController::post(self::PROFILE_UPDATE_URL, $data, [], $headers);

            echo $response['response'];

            wp_die();
        } else {
            echo json_encode(['success'=>false,'message'=>'Actions must be performed from user profile']);
            wp_die();
        }

    }

    // Init at page load.
    static public function get_insider_info()
    {

        $headers = [
            'Content-Type: application/json'
        ];

        $data = [
            "action" => "get_insider_info",
            "xuid" => wp_get_current_user()->msa_xuid,
            "site_key" => get_field('insiders_database_key','option')
        ];

        $response = InsidersController::post(self::INSIDER_INFO_URL, $data, [], $headers);

        if($response['code'] == 200) {
            return $response['response'];
        }

    }

    // Update Beta Prefs
    public function update_beta_prefs()
    {

        if(!wp_verify_nonce($_REQUEST['nonce'], 'update_beta_prefs')) {
            return;
            wp_die();
        }

        // Get existing insider information
        $survey = json_decode(InsidersController::get_insider_info(), true)['results'][0];

        // Add the new contact prefs
        $survey_data = json_decode($survey['survey_data']);
        $survey_data->{'contact_prefs'} = $_POST['data'];

        $headers = [
            'Content-Type: application/json',
            'dataType: json'
        ];

        $data = [
            "action" => "update_survey_data",
            "xuid" => wp_get_current_user()->msa_xuid,
            "data" => json_encode($survey_data),
            "site_key" => get_field('insiders_database_key','option')
        ];

        $response = InsidersController::post(self::PROFILE_UPDATE_URL, $data, [], $headers);

        echo $response['response'];

        wp_die();
    }

    // Update Survey Answers
    public function update_survey_answers()
    {

        if(!wp_verify_nonce($_REQUEST['nonce'], 'update_survey_answers')) {
            return;
            wp_die();
        }

        // Get existing insider information
        $survey = json_decode(InsidersController::get_insider_info(), true)['results'][0];
        $survey_data = json_decode($survey['survey_data']);

        // Extract Beta Pref data to append later
        $beta_prefs = $survey_data->{'Contact Preferences'};

        // Get Posted values
        $values = $_POST['questions'];

        // Lots of key variations so replace them with static keys
        $survey_data = $values;

        // Append the beta prefs
        $survey_data['Contact Preferences'] = $beta_prefs;

        $headers = [
            'Content-Type: application/json'
        ];

        $data = [
            "action"    => "update_survey_data",
            "xuid"      => wp_get_current_user()->msa_xuid,
            "data"      => json_encode($survey_data),
            "site_key"  => get_field('insiders_database_key','option')
        ];

        $response = InsidersController::post(self::PROFILE_UPDATE_URL, $data, [], $headers);

        echo $response['response'];


        wp_die();
    }

    // Purge User Data
    public function purge_insider_data()
    {

        if(!wp_verify_nonce($_REQUEST['nonce'], 'opt_out')) {
            return;
            wp_die();
        }

        // Revoke Keys
        $flight_keys = $this->revoke_keys();

        $response['flights'] = json_decode($flight_keys['response'])->results;

        if(!empty($response['flights'])) {
            $response['revocation'] = $this->send_oo_email($response['flights']);
        }

        $headers = [
            'Content-Type: application/json'
        ];

        $data = [
            "action" => "purge_insider_data",
            "xuid" => wp_get_current_user()->msa_xuid,
            "site_key" => get_field('insiders_database_key','option')
        ];

        $response = InsidersController::post(self::PROFILE_UPDATE_URL, $data, [], $headers);

        if($response['code'] == 200) {
            echo $response['response'];
        }

        delete_user_meta(get_current_user_id(), 'is_insider', 0);

        wp_die();

    }

    // Init at "Link Steam" button click. Page reloads
    static public function update_steam($steam_data, $return_url)
    {

        if(!wp_verify_nonce($steam_data['nonce'], 'link_steam')) {
            return;
            wp_die();
        }

        $headers = [
            'Content-Type: application/json'
        ];

        $data = [
            "action"        => "steam_update",
            "steamid"       => $steam_data['steamid'],
            "personaname"   => $steam_data['personaname'],
            "xuid"          => wp_get_current_user()->msa_xuid,
            "site_key"      => get_field('insiders_database_key','option')
        ];

        $response = InsidersController::post(self::PROFILE_UPDATE_URL, $data, [], $headers);

        if($response['code'] == 200) {
            return header('Location: ' . $return_url);
        } else {
            return header('Location: ' . $return_url . '?error=' . urlencode('Data not saved'));
        }
    }

    // Update Steam AJAX
    static public function delete_steam()
    {

        if(!wp_verify_nonce($_REQUEST['nonce'], 'delete_steam')) {
            return;
            wp_die();
        }

        $headers = [
            'Content-Type: application/json'
        ];

        $data = [
            "action" => "steam_update",
            "steamid" => NULL,
            "personaname" => NULL,
            "xuid" => wp_get_current_user()->msa_xuid,
            "site_key" => get_field('insiders_database_key','option')
        ];

        $response = InsidersController::post(self::PROFILE_UPDATE_URL, $data, [], $headers);

        if($response['code'] == 200) {
            echo $response['response'];
        }

        wp_die();
    }

    // Update Pref email
    static public function update_pref_email()
    {

        $headers = [
            'Content-Type: application/json'
        ];

        $data = [
            "action" => "update_pref_email",
            "pref_email" => $_POST['pref_email'],
            "xuid" => wp_get_current_user()->msa_xuid,
            "site_key" => get_field('insiders_database_key','option')
        ];

        $response = InsidersController::post(self::PROFILE_UPDATE_URL, $data, [], $headers);

        if($response['code'] == 200) {

            if(isset($_POST['pref_email'])) {
                InsidersController::profileUpdatedEmail($_POST['old_email'], $_POST['pref_email']);
            }
            echo $response['response'];
        }

        wp_die();
    }

    // Update Country
    public function update_country(){

        if(!wp_verify_nonce($_REQUEST['nonce'], 'update_country')) {
            return;
            wp_die();
        }

        $headers = [
            'Content-Type: application/json'
        ];

        $data = [
            "action" => "update_country",
            "country" => $_POST['country'],
            "xuid" => wp_get_current_user()->msa_xuid,
            "site_key" => get_field('insiders_database_key','option')
        ];

        $response = InsidersController::post(self::PROFILE_UPDATE_URL, $data, [], $headers);

        if($response['code'] == 200) {
            echo $response['response'];
        }

        wp_die();
    }

    // Get Insider Count
    static public function get_insiders_count()
    {
        $headers = [
            'Content-Type: application/xml'
        ];

        $response = InsidersController::get(self::INSIDERS_COUNT_URL, [], $headers);

        return $response['response'];

        wp_die();
    }

    // Beta
    static public function get_beta_match_count($groupID)
    {
        $headers = [
            'Content-Type: application/xml'
        ];

        $response = InsidersController::get(self::INSIDERS_BETA_MATCHCOUNT_URL . $groupID, [], $headers);

        $response = json_decode($response['response']);

        return $response[0]->count;

        wp_die();
    }

    static public function get_steam_key($flight_id){

        $headers = [
            'Content-Type: application/json'
        ];

        $data = [
            "action" => "get_key",
            "xuid" => wp_get_current_user()->msa_xuid,
            "flight_id" => $flight_id,
            "site_key" => get_field('insiders_database_key','option')
        ];

        $response = InsidersController::post(self::INSIDER_FLIGHTS_URL, $data, [], $headers);
        $decoded = json_decode($response['response']);

        if($response['code'] == 200) {
            return $decoded->results[0]->product_key;
        }

    }

    // Resend Beta Invite
    static public function send_beta_invite(){
        // Check NONCE
        if(!wp_verify_nonce($_REQUEST['nonce'], 'send_beta_invite')) {
            return;
            wp_die();
        }

        $steam_key = self::get_steam_key($_REQUEST['flight_id']);
        $email_template_id = $_REQUEST['template'];

        $survey_data = json_decode(self::get_insider_info(),true);
        if($survey_data['success']){
            $email = $survey_data['results'][0]['pref_email'];
        } else {
            echo json_encode(["success" => false,"message" => "There was an issue getting your insider information."]);
            wp_die();
        }

        $headers = [
            'Authorization: ' . self::SPARKPOST_AUTH,
            'Content-Type: application/json',
            'Accept: application/json'
        ];

        $body = [
            "content" => [
                "template_id" => $email_template_id
            ],
            "substitution_data" => [
                "steam_code" => $steam_key
            ],
            "recipients" => [
                [
                    "address" => [
                        "email" => $email
                    ]
                ]
            ]
        ];

        $response = self::post(self::SPARKPOST_TRANSMIT_URL,$body,[],$headers);

        if($response['code'] == 200){
            echo json_encode(["success" => 1,"message" => "Invite Sent"]);
        } else {
            echo json_encode(["success" => 0,"message" => "Error: Not Sent"]);
        }

        wp_die();
    }

    static public function get_beta_status($flight)
    {
        $response = wp_remote_get("https://webapi.ageofempires.com/api/AgeInsiders/users/" . wp_get_current_user()->msa_xuid);

        if(is_wp_error( $response )){
            error_log('INSIDERS ERROR: https://webapi.ageofempires.com/api/AgeInsiders/users/ - returned error');
            $response = [];
        }

        $decoded =  json_decode($response['body'],true);
        if(!empty($decoded['groups'])) {
            $groups = explode(',', $decoded['groups']);
        } else {
            $groups = [];
        }

        if($flight == 'all') {
            // Remove From the array
            if (($key = array_search('Age_Insider', $groups)) !== false) {
              unset($groups[$key]);
            }
            return $groups;
        } else {
            if(in_array($flight,$groups)){
                return true;
            } else {
                return false;
            }
        }
    }

    // Forums
    static public function forums_get_latest()
    {

        $headers = [
            'Content-Type: application/json'
        ];

        $response = InsidersController::get(self::INSIDERS_FORUM_URL . '/c/insiders/insiders-resources/l/latest.json', [], $headers);

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

    static public function get($url, $args, $headers = [])
    {
        $output = false;

        $ch = curl_init($url);
        $a = array(
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_TIMEOUT => 60,
        );
        if(!empty($headers)) {
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        }
        curl_setopt_array($ch, $a);
        $result = curl_exec($ch);


        $output = [
            "code" => curl_getinfo($ch, CURLINFO_HTTP_CODE),
            "response" => $result
        ];

        curl_close($ch);

        return $output;
    }

    static public function post($url, $data, $args = [], $headers = [])
    {
        $output = false;

        $ch = curl_init($url);
        $a = array_replace([
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => json_encode($data),
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_TIMEOUT => 30,
        ], $args);
        if(!empty($headers)) {
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        }
        curl_setopt_array($ch, $a);
        $result = curl_exec($ch);

        $output = [
            "code" => curl_getinfo($ch, CURLINFO_HTTP_CODE),
            "response" => $result
        ];

        curl_close($ch);

        return $output;
    }

    static public function profileUpdatedEmail($oldEmail, $newEmail)
    {

        $body = "<p>
            We’ve received a request to change the preferred contact email address for your Insider account:<br><br>

            New Preferred Email: " . $newEmail . "<br><br>

            If you made this change, please visit the new email address within 30 days to verify the changes!
            If you DID NOT request this change, we recommend that you immediately reset the password of your Microsoft Account and visit your Insider profile page to verify your account information:
            <br><br>
            <ul>
                <li><a href='https://account.microsoft.com/'>Review your Microsoft Account Settings</a></li>
                <li><a href='https://www.ageofempires.com/profile'>Review your Insider Profile</a></li>
            </ul>
            <br><br>
            Need help with your Insider account? You can email us with questions or concerns at aoeinsidersupport@microsoft.com
            Sincerely,
            <br><br>
            —The Age Insider Team
            </p>
            ";


        $headers = array('Content-Type: text/html; charset=UTF-8');
        $to = $oldEmail;
        $subject = 'Age Insider Program — Your Account Preferences have been Updated';

        wp_mail($to, $subject, $body, $headers);


    }

}
