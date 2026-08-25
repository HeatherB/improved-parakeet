<?php

namespace Roots\Dynamics;

class Email {

    // Send Email From Template
    static public function send_email($data)
    {

        $userObj = wp_get_current_user();

        if(empty($userObj->d365_contactid)) {
            $headers = [
                'Content-Type: application/json',
                'Accept: application/json',
                'Prefer: return=representation',
                'OData-MaxVersion: 4.0',
                'OData-Version: 4.0',
                'Authorization: Bearer ' . Token::crmAuthToken()
            ];

            $email = [
                "TemplateId" => Config::EMAIL_TEMPLATES[$data['template']],
                "Regarding" => [
                    "contactid" => $userObj->d365_contactid,
                    "@odata.type" => "Microsoft.Dynamics.CRM.contact"
                ],
                "Target" => [
                    "regardingobjectid_contact@odata.bind" => "/contacts(".$userObj->d365_contactid.")",
                    "email_activity_parties" => [
                        [
                            "partyid_systemuser@odata.bind" => "/systemusers(".Config::SYSTEM_USER.")",
                            "participationtypemask" => 1
                        ],
                        [
                            "partyid_contact@odata.bind" => "/contacts(".$userObj->d365_contactid.")",
                            "participationtypemask" => 2
                        ]
                    ],
                    "@odata.type" => "Microsoft.Dynamics.CRM.email"
                ]
            ];

            $response = Methods::postAPI(Config::APIURL . '/SendEmailFromTemplate', json_encode($data), [], $headers);

            return $response;

        }

    }

}