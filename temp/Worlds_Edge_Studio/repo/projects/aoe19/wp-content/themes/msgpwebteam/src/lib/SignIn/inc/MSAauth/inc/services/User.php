<?php

namespace MSAauth\Services;

use MSAauth\Utilities\Helpers;

class User{

    public function __construct()
    {
        add_filter( 'manage_users_columns', array('\MSAauth\Services\User','userColumns'));
        add_filter( 'manage_users_custom_column', array('\MSAauth\Services\User', 'userColumnContents'), 10, 3);
        add_action( 'manage_users_columns', array('\MSAauth\Services\User', 'remove_user_columns'));
        add_action( 'personal_options_update',  array('\MSAauth\Services\User','profileSave'));
        add_action( 'edit_user_profile_update',  array('\MSAauth\Services\User','profileSave'));
        add_action( 'show_user_profile', array('\MSAauth\Services\User','profileShow'));
        add_action( 'edit_user_profile', array('\MSAauth\Services\User','profileShow'));
        add_action( 'get_avatar', array('\MSAauth\Services\User','filter_avatars'), 1 , 5 );
    }


    static public function remove_user_columns( $columns ){
        $filterEmail = Helpers::get_option('msa_backend_filterEmail');
        if($filterEmail){
            unset($columns['email']);
        }
        unset($columns['posts']);
        return $columns;
    }


    static public function userColumns( $columns ){
        $filterEmail = Helpers::get_option('msa_backend_filterEmail');
        $showGamertag = Helpers::get_option('msa_backend_showGamertag');
        $showAgeGroup = Helpers::get_option('msa_backend_showAgeGroup');
        if($filterEmail){
            $columns['filteredEmail'] = 'Email';
        }
        if($showGamertag){
            $columns['gamertag'] = 'Gamertag';
        }
        if($showAgeGroup){
            $columns['agegroup'] = 'Age Group';
        }
        return $columns;
    }


    static public function userColumnContents($val, $column_name, $user_id){
        $user = get_userdata($user_id);
        switch($column_name){
            case 'gamertag':
                $val = get_user_meta($user_id, 'msa_gt', true);
                break;
            case 'filteredEmail':
                $val = !strpos($user->user_email, '@microsoftemail.com') ? '<a href="mailto:'.$user->user_email.'" >'.$user->user_email.'</a>' : '';
                break;
            case 'agegroup':
                $val = get_user_meta($user_id, 'msa_ag', true);
                break;
        }
        return $val;
    }


    static public function profileShow( $user ){
        echo '<h3>MSA information</h3>';
        echo '<table class="form-table">';

        if(current_user_can('edit_posts')){
            echo '<tr>';
            echo '<th scope="row">Disable Name Update</th>';
            $lockname = get_user_meta($user->ID, 'msa_lockname',true);
            echo '<td><label for="lockname">';
            echo $lockname ? '<input type="checkbox" name="lockname" id="lockname" value="false" checked="checked">' : '<input type="checkbox" name="lockname" id="lockname" value="false">';
            echo 'Do not update users display and nice name with gamertag</label>';
            echo '</tr>';
        }
        echo '<tr>';
        echo '<th scope="row">Gamertag</th>';
        echo '<td><input type="text" name="msa_gt" id="msa_gt" value="'.get_user_meta($user->ID, 'msa_gt', true).'" disabled="disabled" class="regular-text"></td>';
        echo '</tr>';
        echo '<tr>';
        echo '<th scope="row">Age Group</th>';
        echo '<td><input type="text" name="msa_ag" id="msa_agt" value="'.get_user_meta($user->ID, 'msa_ag', true).'" disabled="disabled" class="regular-text"></td>';
        echo '</tr>';
        echo '<tr>';
        echo '<th scope="row">Proflie Pic</th>';
        echo '<td><img src="'.esc_url(self::getProfilePicUrl($user->ID)).'" class="avatar avatar-90" height="90" width="90" /></td>';
        echo '</tr>';

        echo '</table>';
    }


    static public function profileSave( $user_id ){
        if ( !current_user_can( 'edit_user', $user_id ) ){
            return false;
        }
        update_usermeta( $user_id, 'msa_lockname', isset($_POST['lockname']) );
    }


    static public function getProfilePicUrl( $user_id = null){
        $output = null;
        if($user_id && is_numeric($user_id)){
            $pic = get_user_meta($user_id, 'msa_pp', true);
        }
        if(isset($pic) && $pic){
            $output = esc_url($pic);
        }else{
            $default = Helpers::get_option('msa_defaultImage');
            if($default){
                $output =  wp_get_attachment_thumb_url($default);
            }else{
                $output = MSA_DEFJPG;
            }
        }
        return $output;
    }

    static public function filter_avatars( $avatar, $id_or_email, $size, $default, $alt ){
        $user = false;
        if ( is_numeric( $id_or_email ) ) {
            $id = (int) $id_or_email;
            $user = get_user_by( 'id' , $id );
        } elseif ( is_object( $id_or_email ) ) {
            if ( ! empty( $id_or_email->user_id ) ) {
                $id = (int) $id_or_email->user_id;
                $user = get_user_by( 'id' , $id );
            }
        } else {
            $user = get_user_by( 'email', $id_or_email );
        }

        $pic = $user && is_object($user) ? User::get_profile_pic_url($user->ID) : User::get_profile_pic_url();
        return "<img alt='{$alt}' src='{$pic}' class='avatar avatar-{$size} photo' height='{$size}' width='{$size}'/>";
    }

    static public function get_profile_pic_url( $user_id = null){
        $output = null;
        $user_data = get_userdata($user_id);
        if($user_id && is_numeric($user_id)){
            $pic = get_user_meta($user_id, 'msa_pp', true);
            $steam_pic = get_user_meta($user_id, 'steam_avatarfull', true);
        }
        if(isset($pic) && $pic){
            $output = esc_url($pic);
            $output = str_replace("http://images-eds.xboxlive.com", "https://images-eds-ssl.xboxlive.com", $output);
        }else if (isset($steam_pic) && $steam_pic) {
            $output = esc_url($steam_pic);
        }else{
            $default = Helpers::get_option('msa_defaultImage');
            if($default){
                $output =  wp_get_attachment_thumb_url($default);
            }else{
                if ($user_data) :
                    $hash = md5( strtolower( trim( $user_data->user_email ) ) );
                    $output = "https://www.gravatar.com/avatar/$hash";
                endif;
            }
        }
        return $output;
    }


    static public function findUser($xid = '', $email = '', $steamid = ''){
        if ($email != '') {
            $users = get_users( array( 'search' => $email ) );
        }
        if ((!$users || !isset($users[0])) && $xid != '') {
            $users = get_users(['meta_key' => 'msa_xuid', 'meta_value' => $xid]);
        }
        if ((!$users || !isset($users[0])) && $steamid != '') {
            $users = get_users(['meta_key' => 'steam_id', 'meta_value' => $steamid]);
        }
        if ((!$users || !isset($users[0])) && $steamid != '') {
            $userhash = Helpers::hash_xid($steamid);
            $email = $userhash.'@microsoftemail.com';
            $users = get_users( array( 'search' => $email ) );
        }
        return $users && isset($users[0]) ? $users[0] : null;
    }


    static public function createUser($user_data) {
        $userhash = Helpers::hash_xid($user_data["Xuid"] ?? $user_data["SteamData"]["steamid"]);
        $email = $user_data['Email'] ?? $user_data['MSEmail'] ?? $userhash.'@microsoftemail.com';
        $username = '';
        $pointer = 50;

        while(!$username || username_exists($username)){
            $username = Helpers::hash_to_username($userhash, $pointer);
            $pointer -= 1;
        }
        $id = wp_create_user($username,time(),$email);
        if($id){
            if(is_wp_error($id)){
                //error_log($username.$gamertag);
                Auth::error_redirect('wp_create');
            }else{
                wp_update_user([
                    'ID' => $id,
                    'show_admin_bar_front' => 'false',
                    'use_ssl' => 0,
                ]);
                $user_data["UserId"] = $id;
                self::updateUser($user_data);

                self::manualLogin($id);
            }
        }else{
            Auth::error_redirect('wp_create');
        }
    }


    static public function updateUser($user_data) {
        $output = null;
        $userhash = Helpers::hash_xid($user_data["Xuid"] ?? $user_data["SteamData"]["steamid"]);
        $email = $user_data['Email'] ?? $user_data['MSEmail'] ?? $userhash.'@microsoftemail.com';
        $id = $user_data['UserId'];
        if(!$id){
            $u = self::findUser($user_data['Xuid'], $email, $user_data['SteamData']['steamid']);
            if($u){
                $id = $u->ID;
                if (!isset($user_data['Email']) && !isset($user_data['MSEmail']) && isset($u->user_email)) {
                    $email = $u->user_email;
                } else {
                    $email = $user_data['Email'] ?? $user_data['MSEmail'];
                }
            }
        }

        if($id){
            $email = $user_data['Email'] ?? $user_data['MSEmail'];
            $username = $user_data['ModernGamertag'] ?? $user_data['Gamertag'] ?? $user_data['SteamData']['personaname'] ?? str_replace('@microsoft.com', '', $user_data["MSEmail"]);
            $lockname = get_user_meta($id, 'msa_lockname',true);
            if (!empty($email)) {
                if ($lockname) {
                  wp_update_user([
                      'ID' => $id,
                      'nickname' => $username,
                      'user_email' => $email,
                      'first_name' => $user_data['FirstName'],
                      'last_name' => $user_data['LastName'],
                  ]);
                } else {
                  wp_update_user([
                      'ID' => $id,
                      'display_name' => $username,
                      'user_nicename' => $username,
                      'nickname' => $username,
                      'user_email' => $email,
                      'first_name' => $user_data['FirstName'],
                      'last_name' => $user_data['LastName'],
                  ]);
                }
            } else {
                if ($lockname) {
                  wp_update_user([
                      'ID' => $id,
                      'nickname' => $username,
                      'first_name' => $user_data['FirstName'],
                      'last_name' => $user_data['LastName'],
                  ]);
                } else {
                  wp_update_user([
                      'ID' => $id,
                      'display_name' => $username,
                      'user_nicename' => $username,
                      'nickname' => $username,
                      'first_name' => $user_data['FirstName'],
                      'last_name' => $user_data['LastName'],
                  ]);
                }
            }

            update_user_meta($id, 'msa_xuid', $user_data['Xuid']);
            update_user_meta($id, 'msa_gt', $user_data['GamerTag']);
            update_user_meta($id, 'msa_ag', $user_data['AgeGroup']);

	        //update_user_meta($id, 'msa_uh', \MSA\Utilities\Helpers::hash_xid($user_data['Xuid']));
	        //update_user_meta($id, 'msa_rp', $user_data['RPToken']);
            $avatar = $user_data['AvatarUrl'] ?? $user_data['SteamData']['avatarfull'];

            if(@is_array(getimagesize($avatar))) {
                update_user_meta($id, 'msa_pp', $avatar);
            }
            update_user_meta($id, 'msa_uhs', $user_data['XasuHash']);
            update_user_meta($id, 'msa_token', $user_data['Token']);
            update_user_meta($id, 'msa_modern_gamertag', $user_data['ModernGamertag']);
            if ($user_data['IsMicrosoft'] == true) {
              update_user_meta($id, 'msa_ms_email', $user_data['MSEmail']);
              update_user_meta($id, 'msa_is_microsoft', $user_data['IsMicrosoft']);
            }
            if (isset($user_data['SteamData']['steamid'])) {
                update_user_meta($id, 'steam_id', $user_data['SteamData']['steamid']);
                update_user_meta($id, 'steam_personaname', $user_data['SteamData']['personaname']);
                update_user_meta($id, 'steam_profileurl', $user_data['SteamData']['profileurl']);
                update_user_meta($id, 'steam_avatarfull', $user_data['SteamData']['avatarfull']);
            }

            if (isset($user_data['OwnedGamesSteam']) && count($user_data['OwnedGamesSteam']) > 0) {
                update_user_meta($id, 'owned_games_steam', $user_data['OwnedGamesSteam']);
            }
            if (isset($user_data['OwnedGamesMicrosoft']) && count($user_data['OwnedGamesMicrosoft']) > 0) {
                update_user_meta($id, 'owned_games_microsoft', $user_data['OwnedGamesMicrosoft']);
            }

            // Sync D365
            if(class_exists('\Roots\Insiders\Insider',false)) {
                \Roots\Insiders\Insider::sync_dynamics_user($id);
            }

            do_action('msa_user_updated');
        }

        return $output;
    }


    static public function manualLogin($id, $u = null){
        if(!$u){
            $u = get_user_by('id',$id);
        }
        if($u){
            wp_set_current_user($id, $u->user_login);
            wp_set_auth_cookie($id);
            do_action('wp_login', $u->user_login,$u);
        }else{
            Auth::error_redirect('wp_authenticate');
        }
    }

}
