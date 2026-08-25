<?php
// TODO Break out validation into its own class for these specific clan pieces.
// TODO Add HTMLPurifier to the process
// TODO Test Meta with live API and ensure data is clean and singular
namespace Roots\Clans;
use \HTMLPurifier;

class ClansMemberJoin
{


    /*
    *  $current_user
    *
    *  Current user that is sending the requests
    *
    *
    *  @type	property | private | boolean
    *
    *  @param	n/a
    *  @return	n/a
    */
    private $current_user = false;



    /*
    *  $member_fields
    *
    *  Array used to validate $_POST data and call the proper method
    *  for validation inside of this Class
    *
    *  @type	property | private | array
    *
    *  @param	n/a
    *  @return	n/a
    */
    private $member_fields = [
        'clan_id',
        'user_id'
    ];




    /*
    *  $ajax_methods
    *
    *  Array used add all ajax actions
    *  Each on is it's associated method name inside this Class
    *
    *  @type	property | private | array
    *
    *  @param	n/a
    *  @return	n/a
    */
    private $ajax_methods = [
        'member_join',
    ];




    /*
    *  __construct
    *
    *  Registers all AJAX actions and sets a new property
    *  for the HTMLPurifier helper Class
    *  In addition it sets the content type to JSON
    *
    *  @type method | public
    *
    *  @param	N/A
    *  @return	N/A
    */
    public function __construct(){
        $this->purifier = new HTMLPurifier();
        $this->current_user = wp_get_current_user();
        foreach ($this->ajax_methods as $method) {
            add_action('wp_ajax_' . $method, [$this, $method]);
            add_action('wp_ajax_nopriv_' . $method, [$this, $method]);
        }
    }



    /*
    *  member_join
    *
    *  Adds member to a clan with a fixed association and a
    *  member status/role. Calls proper methods for validation
    *  and input
    *
    *  @type method | public
    *
    *  @param	N/A
    *  @return	JSON
    */
    public function member_join(){
        header('Content-Type: application/json');
        $post_fields = $_REQUEST;
        $data = $this->handle_post_data($post_fields);
        echo json_encode($data);
        die();
    }


    /*
    *  handle_post_data
    *
    *  Takes $this->member_fields array and
    *  member status/role. Calls proper methods for validation
    *  and input
    *
    *  @type method | private
    *
    *  @param	$_POST data
    *  @return	JSON
    */
    private function handle_post_data($post_data){
        foreach($this->member_fields as $member_field){
            $data = call_user_func_array(array($this, $member_field), array($post_data));
            if($data['status'] === false){
                return $data;
                break;
            }
        }
        $member_join = $this->member_data_process($post_data);
        return $member_join;
    }


    /*
    *  member_data_process
    *
    *  Inputs data for initial join of a member
    *
    *  @type method | private
    *
    *  @param	$_POST data
    *  @return	ARRAY
    */
    private function member_data_process($post_data){
        $clan_id = $post_data['clan_id'];
        $user_id = $post_data['user_id'];

        $clan_assoc = get_user_meta($user_id, 'clan_assoc', false);
        if(!in_array($clan_id, $clan_assoc)){
            add_user_meta( $user_id, 'clan_assoc', $clan_id, false );
        }
        $member_status = get_user_meta($user_id, 'member_status_clan_' . $clan_id, true);
        if($member_status == ''){
            $member_status_data = add_user_meta( $user_id, 'member_status_clan_' . $clan_id, $user_id, true );
        } else {
            $member_status_data = update_user_meta( $user_id, 'member_status_clan_' . $clan_id, $user_id, $member_status );
        }
        $member_role = get_user_meta($user_id, 'member_role_clan_' . $clan_id, true);
        if($member_role == ''){
            $member_role_data = add_user_meta( $user_id, 'member_role_clan_' . $clan_id, $user_id, true );
        } else {
            $member_role_data = update_user_meta( $user_id, 'member_role_clan_' . $clan_id, $user_id, $member_role );
        }

        if($member_role_data != '' && $member_status_data != ''){
            $data = [
                "status" => true,
                "reason" => "Successfully updated user"
            ];
            return $data;
        } else {
            $data = [
                "status" => false,
                "reason" => "Something went wrong"
            ];
            return $data;
        }

    }


    /*
    *  clan_id
    *
    *  Validates clan_id and does a series of checks to ensure it
    *  is ready to input meta data
    *
    *  @type method | protected
    *
    *  @param	$_POST data
    *  @return	ARRAY
    */
    protected function clan_id($post_data){
        $data = [
            "status" => true,
        ];
        $clan_id = $post_data['clan_id'];

        if( $clan_id == '' || $clan_id === null ){
            $data = [
                "status" => false,
                "reason" => "Clan ID must be passed"
            ];
            return $data;
        }

        if( !is_numeric($clan_id) ){
            $data = [
                "status" => false,
                "reason" => "Clan ID must be numeric"
            ];
            return $data;
        }

        if( FALSE === get_post_status( $clan_id ) ){
            $data = [
                "status" => false,
                "reason" => "Clan does not exist"
            ];
            return $data;
        }

        if(get_post_type( $clan_id ) != 'clans'){
            $data = [
                "status" => false,
                "reason" => "Post exists but is not a clan"
            ];
            return $data;
        }

        return $data;
    }


    /*
    *  user_id
    *
    *  Adds member to a clan with a fixed association and a
    *  member status/role. Calls proper methods for validation
    *  and input
    *
    *  @type method | protected
    *
    *  @param	$_POST data
    *  @return	ARRAY
    */
    protected function user_id($post_data){
        $data = [
            "status" => true,
        ];

        $user_id = $post_data['user_id'];

        if( $user_id == '' || $user_id === null ){
            $data = [
                "status" => false,
                "reason" => "User ID must be passed"
            ];
            return $data;
        }

        if( !is_numeric($user_id) ){
            $data = [
                "status" => false,
                "reason" => "User ID must be numeric"
            ];
            return $data;
        }

        if( !$this->user_id_exists($user_id) ){
            $data = [
                "status" => false,
                "reason" => "User does not exist"
            ];
            return $data;
        }

        return $data;
    }



    /*
    *  user_id
    *
    *  Checks if user is valid by ID
    *
    *  @type method | private
    *
    *  @param	$_POST data
    *  @return	BOOLEAN
    */
    private function user_id_exists($user){

        global $wpdb;

        $count = $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM $wpdb->users WHERE ID = %d", $user));

        if($count == 1){ return true; }else{ return false; }

    }
}