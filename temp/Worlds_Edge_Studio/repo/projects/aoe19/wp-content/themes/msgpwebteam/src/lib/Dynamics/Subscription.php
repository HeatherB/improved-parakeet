<?php

namespace Roots\Dynamics;

class Subscription {

    // Subscriber
    static public function createSubscriber($subscriber)
    {

        $userObj = wp_get_current_user();

        $headers = [
            'Content-Type: application/json',
            'Accept: application/json',
            'Prefer: return=representation',
            'OData-MaxVersion: 4.0',
            'OData-Version: 4.0',
            'MSCRM.SuppressDuplicateDetection: false',
            'Authorization: Bearer ' . Token::crmAuthToken()
        ];

        if(empty($userObj->d365_contactid)) {
            $response = Methods::postAPI(Config::APIURL . '/contacts', json_encode($subscriber), [], $headers);
        } else {
            $response = Methods::postAPI(Config::APIURL . '/contacts(' . $userObj->d365_contactid .')',json_encode($subscriber),[],$headers,'PATCH');
        }

        if($response['code'] == 201 || $response['code'] == 200) {
            $decoded = json_decode($response['response']);

            // Save Subscribers Contact ID
            update_user_meta($userObj->ID, 'd365_contactid', $decoded->contactid);

            return ["Code" => $response['code'], "action" => "createSubscriber", "success" => true];

        // Returns Code: 412 if account already exists
        } else if($response['code'] == 412){
            error_log('DYNAMICS API ERROR:(createSubscriber) UserID: ' . $userObj->ID . ' ContactID: ' . $userObj->d365_contactid . ' Response:' . $response['response'] );
            return ["Code" => $response['code'], "action" => "createSubscriber", "success" => false, "message" => "This account is already signed up."];
        }  else {
            error_log('DYNAMICS API ERROR:(createSubscriber) UserID: ' . $userObj->ID . ' Response:' . $response['response'] );
            return ["Code" => $response['code'], "action" => "createSubscriber", "success" => false, "message" => "There was a problem submitting your information."];
        }

    }

    static public function updateSubscriberValue($data,$userObj = null)
    {

        if(!isset($userObj)){
            $userObj = wp_get_current_user();
        }

        $headers = [
            'Content-Type: application/json',
            'Accept: application/json',
            'Prefer: return=representation',
            'OData-MaxVersion: 4.0',
            'OData-Version: 4.0',
            'MSCRM.SuppressDuplicateDetection: false',
            'Authorization: Bearer ' . Token::crmAuthToken()
        ];

        $data['new_lastupdate'] = date('n/j/Y H:i:s');

        $response = Methods::postAPI(Config::APIURL . '/contacts(' . $userObj->d365_contactid .')',json_encode($data),[],$headers,'PATCH');
        if($response['code'] == 200){
            return ["action" => "updateSubscriber", "success" => true];
        } else {
            error_log('DYNAMICS API ERROR:(updateSubscriberValue) Response:' . $response['response']);
            return ["code" => $response['code'], "action" => "updateSubscriber", "success" => false, "message" => $response];
        }

    }

    static public function deleteSubscriber()
    {
        $userObj = wp_get_current_user();

        $headers = [
            'Content-Type: application/json',
            'Accept: application/json',
            'Authorization: Bearer ' . Token::crmAuthToken()
        ];

        $response = Methods::postAPI(Config::APIURL . '/contacts(' . $userObj->d365_contactid .')','{}',[],$headers,'DELETE');
        $decoded = json_decode($response['response']);
        if($response['code'] == 204){
            return ["action" => "deleteSubscriber", "success" => true];
        } else {
            error_log('DYNAMICS API ERROR:(deleteSubscriber) Response:' . $response['response']);
            return ["action" => "deleteSubscriber", "success" => true,  "message" => $decoded->message];
        }
    }

    static public function getSubscriber($args = "") {

        $userObj = wp_get_current_user();

        if(empty($userObj->d365_contactid)){
            return json_encode(["action" => "getSubscriber", "success" => false, "message" => 'No Account ID']);
        }

        $select = '';

        if(!empty($args)){
            $select = '?$select=' . $args;
        }

        $headers = [
            'Content-Type: application/json',
            'Accept: application/json',
            'Prefer: return=representation',
            'OData-MaxVersion: 4.0',
            'OData-Version: 4.0',
            'Authorization: Bearer ' . Token::crmAuthToken()
        ];

        $response = Methods::getAPI(Config::APIURL . '/contacts('. $userObj->d365_contactid .')' . $select,[],$headers);

        if($response['code'] == 200){
            return $response['response'];
        } else {
            error_log('DYNAMICS API ERROR:(getSubscriber) Response:' . $response['response']);
            return json_encode(["Code" => $response['code'], "action" => "getSubscriber", "success" => false, "message" => $response['response']]);
        }

    }

    static public function checkSubscriber($id) {

        $userObj = get_user_by('id',$id);

        if(!isset($userObj->msa_xuid)){
            return;
        }

        $headers = [
            'Content-Type: application/json; odata.metadata=minimal ',
            'Accept: application/json',
            'OData-MaxVersion: 4.0',
            'OData-Version: 4.0',
            'Authorization: Bearer ' . Token::crmAuthToken()
        ];

        $response = Methods::getAPI(Config::APIURL . '/contacts?$select=contactid,gps_isinsider,new_programban&$filter=gps_xuid+eq+\'' . $userObj->msa_xuid . '\'',[],$headers);

        // Add Contact ID to Subscriber
        if($response['code'] == 200) {

            $decoded = json_decode($response['response']);

            // Set Contact ID
            if (!empty($decoded->value[0]->contactid)) {
                update_user_meta($userObj->ID, 'd365_contactid', $decoded->value[0]->contactid);
            }
            // Set Insider status
            if (!empty($decoded->value[0]->gps_isinsider)) {
                $is_insider = $decoded->value[0]->gps_isinsider ?? 0;
                update_user_meta($userObj->ID, 'is_insider', $is_insider);
            } else {
                update_user_meta($userObj->ID, 'is_insider', 0);
            }
        } else {
            error_log('DYNAMICS API ERROR:(checkSubscriber) UserID: ' . $userObj->ID . ' Response:' . $response['response']);
        }
        
        return;

    }

    static public function checkExistingEmail($value) {

        $userObj = wp_get_current_user();

        $headers = [
            'Content-Type: application/json; odata.metadata=minimal ',
            'Accept: application/json',
            'OData-MaxVersion: 4.0',
            'OData-Version: 4.0',
            'Authorization: Bearer ' . Token::crmAuthToken()
        ];

        $response = Methods::getAPI(Config::APIURL . '/contacts?$select=contactid&$filter=emailaddress1+eq+\'' . $value . '\'+and+gps_emailconfirmed+eq+true+and+gps_xuid+ne+\'' . $userObj->msa_xuid . '\'',[],$headers);

        if($response['code'] == 200) {

            $decoded = json_decode($response['response']);

            return sizeof($decoded->value) ? 1 : 0;

        } else {
            error_log('DYNAMICS API ERROR:(checkExisting) Response:' . $response['response']);
        }

    }

    // Subscription
    static public function createNewsletterSubscription()
    {
        $userObj = wp_get_current_user();

        $headers = [
            'Content-Type: application/json',
            'Accept: application/json',
            'OData-MaxVersion: 4.0',
            'OData-Version: 4.0',
            'Prefer: return=representation',
            'Authorization: Bearer ' . Token::crmAuthToken()
        ];

        $data = [
            "gps_subscriberid@odata.bind"  => "/contacts(". $userObj->d365_contactid .")",
            "gps_newsletterid@odata.bind"  => "/gps_newsletters(". Config::$newsletterID .")",
            "gps_additionalinfo"           => "",
            "gps_legacynewsletterid"       => null,
            "gps_legacysubscriberid"       => null,
            "gps_confirmed"                => false,
            "gps_name"                     => "Age Of Empires",
        ];

        $response = Methods::postAPI(Config::APIURL . '/gps_subscriptions',json_encode($data),[],$headers);
        if($response['code'] == 201 ){
            $decoded = json_decode($response['response']);
            return ["action" => "createSubscription", "success" => true];
        } else {
            error_log('DYNAMICS API ERROR:(createNewsletterSubscription) Response:' . $response['response']);
            return ["action" => "createSubscription", "success" => false, "message" => "Error Creating Supscription"];
        }

    }

    static public function checkCPMSubscription($pref_email){

        $userObj = wp_get_current_user();

        $email = (!empty($pref_email)) ? $pref_email : $userObj->user_email;

        $headers = [
            'Content-Type: application/json',
            'Accept: application/json'
        ];

        $response = Methods::getAPI('https://api.ageofempires.com/cpm/?email=' . $email . '&code=' . Config::CPM_APIKEY,[],$headers);
        if($response['code'] == 200 || $response['code'] == 201) {
            $decoded = json_decode($response['response']);
            return ["action" => "checkCPMSubscription", "success" => true, "email" => $email, "status" => $decoded];
        } else {
            error_log('DYNAMICS API ERROR:(checkCPMSubscription) Response:' . $response['response']);
            return ["action" => "checkCPMSubscription", "success" => false];
        }
    }

    static public function updateCPMSubscription($value){

        $headers = [
            'Content-Type: application/json',
            'Accept: application/json',
            'Prefer: return=representation',
            'OData-MaxVersion: 4.0',
            'OData-Version: 4.0',
            'Authorization: Bearer ' . Token::crmAuthToken()
        ];

        $subscriber['msdynhcp_cancontact'] = $value;
        $subscriber['msdynhcp_enabledactive'] = $value;

        $response = Methods::postAPI(Config::APIURL . '/msdynhcp_subscriptions('.self::getPublicationID(Config::$ms_contact_ID)['publicationID'].')',json_encode($subscriber),[],$headers,'PATCH');

        if($response['code'] == 200){
            $decoded = json_decode($response['response']);
            return ["action" => "updateCPMSubscription", "success" => true];
        } else {
            error_log('DYNAMICS API ERROR:(updateCPMSubscription) Response:' . $response['response']);
            return ["action" => "updateCPMSubscription", "success" => false, "error" => "Could not update settings"];
        }

    }

    static public function getPublicationID($publicationID){

        $userObj = wp_get_current_user();

        $headers = [
            'Content-Type: application/json',
            'Accept: application/json',
            'Prefer: return=representation',
            'OData-MaxVersion: 4.0',
            'OData-Version: 4.0',
            'Authorization: Bearer ' . Token::crmAuthToken()
        ];

        $response = Methods::getAPI(Config::APIURL . '/msdynhcp_subscriptions?$select=msdynhcp_subscriptionid&$filter=_msdynhcp_contactlookup_value+eq+'.$userObj->d365_contactid .'+and+_msdynhcp_publicationlookup_value+eq+'.$publicationID,[],$headers);
        if($response['code'] == 200){
            $decoded = json_decode($response['response']);
            return ["action" => "getPublicationID", "success" => true, "publicationID" => $decoded->value[0]->msdynhcp_subscriptionid];
        } else {
            error_log('DYNAMICS API ERROR:(getPublicationID) Response:' . $response['response']);
            return ["action" => "getPublicationID", "success" => false, "error" => "Could not retrieve Publication ID"];
        }

    }

    static public function deleteSubscription($subscriptionID)
    {
        $headers = [
            'Content-Type: application/json',
            'Accept: application/json',
            'Authorization: Bearer ' . Token::crmAuthToken()
        ];

        $response = Methods::postAPI(Config::APIURL . '/msdynhcp_subscriptions('.$subscriptionID.')','{}',[],$headers,'DELETE');
        $decoded = json_decode($response['response']);
        if($response['code'] == 204){
            return ["action" => "deleteSubscription", "success" => true];
        } else {
            error_log('DYNAMICS API ERROR:(deleteSubscriber) Response:' . $response['response']);
            return ["action" => "deleteSubscription", "success" => true,  "message" => $decoded->message];
        }
    }

    // Misc
    static public function createNote($subject,$noteText){
        $userObj = wp_get_current_user();

        $headers = [
            'Content-Type: application/json',
            'Accept: application/json',
            'Prefer: return=representation',
            'OData-MaxVersion: 4.0',
            'OData-Version: 4.0',
            'Authorization: Bearer ' . Token::crmAuthToken()
        ];

        $note = [
            "notetext"                      =>  $noteText,
            "subject"                       =>  $subject,
            "objectid_contact@odata.bind"   =>  "/accounts(" . $userObj->d365_contactid .")"
        ];

        if(!empty($userObj->d365_contactid)) {
            $response = Methods::postAPI(Config::APIURL . '/annotations', json_encode($note), [], $headers);
        }

        if($response['code'] == 201 || $response['code'] == 200 || $response['code'] == 204) {
            return ["Code" => $response['code'], "action" => "createNote", "success" => true];
        } else {
            error_log('DYNAMICS API ERROR:(createNote) UserID: ' . $userObj->ID . ' ContactID: ' . $userObj->d365_contactid . ' Response:' . $response['response'] );
            return ["Code" => $response['code'], "action" => "createNote", "success" => false, "message" => "There was a error creating the note"];
        }
    }
}
