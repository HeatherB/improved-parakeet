<?php

namespace Roots\Insiders;

class Signup{

    public function __construct()
    {
        add_filter('sage/template/page-template-template-insider-survey-blade/data', [$this, 'insider_survey']);
    }

    public static function insider_survey(){

        $data = [
            'insider_steam'         => get_field('insider_steam', 'option'),
            'insider_welcome'       => get_field('insider_welcome', 'option'),
            'insider_beta_prefs'    => get_field('insider_beta_preferences', 'option'),
            'insider_contact_prefs' => get_field('insider_contact_preferences', 'option'),
        ];

        if(is_user_logged_in()){

            // User Info
            $user = wp_get_current_user();

            // Check For Blocked
            $pref_email_abuse = new \Roots\Dynamics\AbusePrevention('pref_email');
            if($pref_email_abuse->abuse_check(false)){
                wp_redirect(home_url('/profile/?warning=excessive_tries'));
            }

            // Dynamics Account
            $insider = json_decode(\Roots\Dynamics\Subscription::getSubscriber(),true);
            // Redirect to MS login if logged in with steam or for some reason have no xuid
            if(empty($user->msa_xuid)){
                wp_redirect('https://auth.ageofempires.com/');
                exit;
            } else if(isset($insider['new_programban']) && $insider['new_programban']){ // Redirect to profile if user is banned or already an insider
                header('Location: ' . home_url('/profile?banned=true'));
            } else if(isset($insider['gps_isinsider']) && $insider['gps_isinsider']){
                header('Location: ' . home_url('/profile'));
            }

            $data['country']    = $user->msa_country;
            $data['gamertag']   = $user->msa_modern_gamertag ?? $user->msa_gt;
            $data['pref_email'] = $user->user_email;

        }

        return $data;
    }

}