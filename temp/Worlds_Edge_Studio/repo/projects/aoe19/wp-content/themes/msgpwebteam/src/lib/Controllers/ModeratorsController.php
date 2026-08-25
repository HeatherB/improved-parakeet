<?php

namespace Roots\Controllers;

class ModeratorsController
{
    
    public function __construct()
    {
        add_action('wp_ajax_turnin_vcm_application', [$this, 'turnin_vcm_application']);
    }

    // Receive post data from ajax
    public function turnin_vcm_application()
    {
        $returned_data = $_REQUEST['transData'];
        $returned_decode = json_decode(stripslashes($returned_data), true);
        $data['returned_decode'] = $returned_decode;

        $this->send_vcm_application_email($returned_decode);

        //header('Content-Type: application/json');
        //echo json_encode($data);
        //wp_die();
    }

    // Send an VCM Application Email
    static public function send_vcm_application_email($moderator_applicant)
    {

        $body = "<p>Community Team,<br><br>";
        $body .= "An applicant has applied to be an Age Moderator. Here is the information they submitted:";

        $body .= "<ul>";
        foreach($moderator_applicant as $key => $value) {
            if(empty($value)) {
                $value = "N/A";
            }
            if(is_array($value)) {
                 $body .= "<li>$key:";
                foreach($value as $subkey => $subvalue) {
                    $body .= " $subvalue ";
                }
                $body .= "</li>";
            } else {
                $body .= "<li>$key: $value</li>";
            }
            
        }
        $body .= "<ul>";
        

        $body .= "</p>";

        $headers = array('Content-Type: text/html; charset=UTF-8');
        $to = ["AgeVCM@service.microsoft.com"];
        $subject = 'Volunteer Community Moderator — we have an applicant';

        wp_mail($to, $subject, $body, $headers);

    }

    
}
