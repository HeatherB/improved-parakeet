<?php

namespace Roots\Clans;

use WP_Query;

class ClansMembers
{
  public $members_fields = array(
    'role',
    'playerId',
    'gamertag',
    'skill',
    'activity',
    'profileURL',
    'avatar',
    'member_status',
  );

  public $errors = array(
    'You must pass a clan ID.'
  );

  public function __construct()
  {
    add_action( 'wp_ajax_nopriv_members', [$this, 'get_members'] );
    add_action( 'wp_ajax_members', [$this, 'get_members'] );
  }

  public function get_members() {
    $gamertag = $_REQUEST['q'] ? $_REQUEST['q'] : null;
    $clanId = $_REQUEST['clanId'] ?? null;
    $args = $_REQUEST['args'] ?? null;
    $sort = $_REQUEST['sort'] ?? null;

    $default_args = array(
      'meta_query' => array(
        "clan_assoc" => array(
          "key" => "clan_assoc",
          "compare" => "EXISTS"
        ),
      )
    );
		
    if ( null == $args ) :
      $args = $default_args;
    endif;

    if (null !== $clanId) :
      $clan_assoc = array(
        'clan_assoc' => array(
          "key" => 'clan_assoc',
          "value" => $clanId
        )
      );
      $args['meta_query'] = array_merge($args['meta_query'], $clan_assoc);
    endif;

    if (null !== $gamertag) :
      $gt_query = array(
        'msa_gt' => array(
          "key" => 'msa_gt',
          "value" => $gamertag,
          "compare" => 'LIKE'
        ),
      );
      
      $relation = array(
        "relation" => 'OR'
      );
      $args['meta_query'] = array_merge($args['meta_query'], $gt_query);
    endif;

    $sortBy = null;
		
    switch($sort){
      case 'skill':
        $sortBy = 'member_skill_clan_';
        break;
      case 'activity':
        $sortBy = 'member_activity_clan_';
        break;
      default:
        $sortBy = 'msa_gt';
        break;
    }

    $args['meta_key'] = $sortBy;
    $args['orderby'] = $sortBy;
  
    $users = new \WP_User_Query($args);
		$totalUsers = count($users->results);

		$args['number'] = $_REQUEST['postsPerPage'];
    $args['paged'] = $_REQUEST['paged'];
		
    $members_query = new \WP_User_Query($args);

    $data = [];
    $temp = [];
    $data['playersList'] = [];
    if ( ! empty( $members_query->results ) ) {
      foreach ( $members_query->results as $member ) {
        foreach ($this->members_fields as $field) {
          $temp[$field] = call_user_func_array(array($this, $field), array($member->ID, $clanId));
        }
        array_push($data['playersList'],$temp);
        $data['totalCount'] = $totalUsers;
        $this->update_member_count($totalUsers,$clanId);
      }
    }
    header('Content-Type: application/json');
    echo json_encode($data);
    die();
  }

  public function update_member_count($member_count,$clanId){
    update_post_meta($clanId,'member_count',$member_count);
  }
  
  public function gamertag($member_id) {
    $meta_value = get_user_meta($member_id, 'msa_gt', true);
    $gamertag = ( $meta_value ) ? $meta_value : null;
    return $gamertag;
  }

  public function role( $member_id) {
    $meta_value = get_user_meta($member_id, 'member_role_clan_', true);
    $member_role = ( $meta_value ) ? $meta_value : null;
    return $member_role;
  }
  
  public function skill( $member_id) {
    $meta_value = get_user_meta($member_id, 'member_skill_clan_', true);
    $member_skill = ( $meta_value ) ? $meta_value : null;
    return $member_skill;
  }
  
  public function activity( $member_id) {
    $meta_value = get_user_meta($member_id, 'member_activity_clan_', true);
    $member_activity = ( $meta_value ) ? $meta_value : null;
    return $member_activity;
  }

  public function member_status( $member_id ) {
    $meta_value = get_user_meta($member_id, 'member_status_clan_', true);
    $member_status = ( $meta_value ) ? $meta_value : null;
    return $member_status;
  }

  public function avatar( $member_id) {
    $meta_value = get_user_meta($member_id, 'msa_pp', true);
    $profile_pic = ( $meta_value ) ? $meta_value : null;
    return $profile_pic;
  }
  
  public function profileURL( $member_id) {
    $meta_value = get_user_meta($member_id, 'msa_gt', true);
    $gamertag = ( $meta_value ) ? $meta_value : null;
    //return 'https://account.xbox.com/en-us/profile?gamerTag=' . $gamertag;
    return get_bloginfo('url') . '/stats/?gamertag=' . $gamertag . '&gameType=mp';
  }

  public function playerId( $member_id ) {
   return $member_id;
  }

}

