<?php

namespace Roots\Clans;

use \WP_Query;
use Carbon\Carbon;

class ClansMain
{

    public function __construct()
    {
        add_action('wp_ajax_clans', [$this, 'get_data']);
        add_action('wp_ajax_nopriv_clans', [$this, 'get_data']);
        //Allow wordpress search
    }

    public $default_args = array(
        'post_type' => 'clans',
        'post_status' => 'publish',
        'posts_per_page' => -1,
        "s" => '',
        "post__in" => '',
        "orderby" => '',
        "order" => '',
        "date_query" => array(
            "before" => '',
            "after" => '',
            "inclusive" => true
        ),
        "meta_query" => array(
            "relation" => "AND",
            "average_skill_level" => array(
                "key" => "average_skill_level",
                "compare" => "EXISTS",
            ),
            "activity_level" => array(
                "key" => "activity_level",
                "compare" => "EXISTS",
            ),
            "language" => array(
                "key" => "language",
                "compare" => "EXISTS",
            ),
            "applications" => array(
                "key" => "applications",
                "compare" => "EXISTS",
            ),
            "clan_tag" => array(
                "key" => "clan_tag",
                "compare" => "LIKE",
            ),
            "member_count" => array(
                "member_min" => array(
                    "key" => "member_count",
                    "compare" => ">=",
                    "type" => "NUMERIC"
                ),
                "member_max" => array(
                    "key" => "member_count",
                    "compare" => "<=",
                    "type" => "NUMERIC"
                )
            )
        )
    );

    public $filters = array(
        "date" => [
            "Last Week" => 'last_week',
            "Last Month" => "last_month",
            "Last Year" => "last_year",
            "This Month" => "this_month",
        ],
        "member_range" => [
            "50" => array(
                "min" => 0,
                "max" => 50
            ),
            "51-100" => array(
                "min" => 51,
                "max" => 100
            ),
            "101-200" => array(
                "min" => 101,
                "max" => 200
            ),
            "201-500" => array(
                "min" => 201,
                "max" => 500
            ),
            "501-1000" => array(
                "min" => 501,
                "max" => 1000
            ),
            "1000" => array(
                "min" => 1000,
                "max" => ''
            )
        ]
    );

    public $wp_fields = [
        'clanId',
        'createDate',
        'visibility',
        'application',
        'clanName',
        'permalink',
        'clanTag',
        'memberCount',
        'language',
        'clanMotto',
        'dailyMessage',
        'manifesto',
        'skill',
        'activity',
        'bannerPoster',
        'logoIcon',
        'logoShield',
        'clanLogo',
        'backgroundImage',
        'memberStatusClan',
        'memberRoleClan',
    ];

    public function format_dates($range)
    {
        $fn = $this->filters['date'][$range];
        $date = call_user_func_array(array($this, $fn), array($range));
    }

    public function get_data($args)
    {
        $clan_id = $_REQUEST['clanId'] ?? null;
        $user_id = ($_REQUEST['dummyUserId']) ? $_REQUEST['dummyUserId'] : get_current_user_id();
        $paged = ($_REQUEST['paged']) ?? null;
        $posts_per_page = ($_REQUEST['postsPerPage']) ?? null;
        $s = ($_REQUEST['q']) ?? null;
        $activity_level = ($_REQUEST['activity']) ?? null;
        $skill_level = ($_REQUEST['skill']) ?? null;
        $language = ($_REQUEST['language']) ?? null;
        $application = ($_REQUEST['application']) ?? null;
        $member_count = $_REQUEST['memberCount'] ?? null;
        $member_range = $_REQUEST['memberRange'] ?? null;
        $dateRange = $_REQUEST['dateRange'] ?? null;
        $sort = $_REQUEST['sort'] ?? null;
        $sortOrder = $_REQUEST['sortOrder'] ?? null;
        $tagToggle = $_REQUEST['searchby'] ?? null;


        // Add arguments to $this->default_args if they are present
        if(!$clan_id) :
            $this->default_args['meta_query']['visibility']['value'] = 'Public';
        endif;
        if($clan_id) :
            $clan_id_arr = array($clan_id);
            $this->default_args['post__in'] = $clan_id_arr;
        endif;
        if($dateRange) :
            $this->format_dates(urldecode($dateRange));
        endif;
        if($s) :
            if($tagToggle == 'title') {
                $this->default_args['s'] = $s;
            } else {
                $this->default_args['meta_query']['clan_tag']['value'] = $s;
            }
        endif;
        if($activity_level) :
            $this->default_args['meta_query']['activity_level']['value'] = $activity_level;
        endif;
        if($skill_level) :
            $this->default_args['meta_query']['skill_level']['value'] = $skill_level;
        endif;
        if($language) :
            $this->default_args['meta_query']['language']['value'] = urldecode($language);
        endif;
        if($application) :
            $this->default_args['meta_query']['application']['value'] = $application;
        endif;
        if($member_range) :
            $this->default_args['meta_query']['member_count']['member_min']['value'] = $this->filters['member_range'][$member_range]['min'];
            if($member_range !== '1000') :
                $this->default_args['meta_query']['member_count']['member_max']['value'] = $this->filters['member_range'][$member_range]['max'];
            endif;
        endif;
        if($sort && $sortOrder) :

            if($sort == 'member_count') :
                $this->default_args['orderby'] = 'member_min';
                $this->default_args['order'] = $sortOrder;
            elseif($sort == 'clanName') :
                $this->default_args['orderby'] = 'title';
                $this->default_args['order'] = $sortOrder;
            elseif($sort == 'clanTag') :
                $this->default_args['meta_key'] = 'clan_tag';
                $this->default_args['orderby'] = 'clan_tag';
                $this->default_args['order'] = $sortOrder;
            else :
                $this->default_args['orderby'] = $sort;
                $this->default_args['order'] = $sortOrder;
            endif;
        endif;

        $args = $this->default_args;

        if($paged) :
            $args['paged'] = $paged;
        endif;
        if($posts_per_page) :
            $args['posts_per_page'] = $posts_per_page;
        endif;

        $clans_query = new \WP_Query($args);

        $data = [];
        $temp = [];

        if($clans_query->have_posts()) :
            while($clans_query->have_posts()) : $clans_query->the_post();
                foreach($this->wp_fields as $field) {
                    global $post;
                    $temp[$field] = call_user_func_array(array($this, $field), array($post, $user_id));
                };
                $data[] = $temp;
            endwhile;
        endif;

        header('Content-Type: application/json');
        echo json_encode(array(
            "clans" => $data,
            "totalCount" => $clans_query->found_posts
        ));
        die();
    }


    public function memberStatusClan($post, $user_id)
    {
        $meta = get_user_meta($user_id, 'member_status_clan_' . $post->ID, true);
        $member_status_clan = ($meta != '') ? $meta : false;
        return $member_status_clan;
    }

    public function memberRoleClan($post, $user_id)
    {
        $meta = get_user_meta($user_id, 'member_role_clan_' . $post->ID, true);
        $member_role_clan = ($meta != '') ? $meta : false;
        return $member_role_clan;
    }

    public function currentUserRole($post, $user_id)
    {
        return null;
    }

    public function user($post, $user_id)
    {
        $member_clan_association = get_user_meta($user_id, 'clan_assoc', false);
        $user = [];
        $user['ID'] = $user_id;
        $user['clan_assoc'] = [];
        $temp = [];
        foreach($member_clan_association as $clan_id) :
            $obj = [];
            $obj['clan_id'] = $clan_id;
            $key = 'member_role_clan_' . $clan_id;
            $obj['member_role'] = get_user_meta($user_id, $key, true);
            $key = 'member_status_clan_' . $clan_id;
            $obj['member_status'] = get_user_meta($user_id, $key, true);
            array_push($temp, $obj);
        endforeach;
        $user['clan_assoc'] = $temp;
        return $user;
    }


    public function activity($post, $user_id)
    {
        $meta_value = get_post_meta($post->ID, 'activity_level', true);
        $value = ($meta_value) ? $meta_value : null;
        return $value;
    }

    public function skill($post, $user_id)
    {
        $meta_value = get_post_meta($post->ID, 'average_skill_level', true);
        $value = ($meta_value) ? $meta_value : null;
        return $value;
    }

    public function clanId($post, $user_id)
    {
        $clan_id = $post->ID;
        return $clan_id;
    }

    public function permalink($post, $user_id)
    {
        return get_the_permalink($post->ID);
    }

    public function status($post, $user_id)
    {
        $clan_id = get_post_status($post->ID);
        return $clan_id;
    }

    public function clanName($post, $user_id)
    {
        $clan_name = get_the_title($post->ID);
        return $clan_name;
    }

    public function createDate($post, $user_id)
    {
        $date = get_the_date('c', $post->ID);
        return $date;
    }

    public function clanTag($post, $user_id)
    {
        $meta_value = get_post_meta($post->ID, 'clan_tag', true);
        $value = ($meta_value) ? $meta_value : null;
        return $value;
    }

    public function clanMotto($post, $user_id)
    {
        $meta_value = get_post_meta($post->ID, 'clan_motto', true);
        $value = ($meta_value) ? $meta_value : null;
        return $value;
    }

    public function manifesto($post, $user_id)
    {
        $meta_value = get_post_meta($post->ID, 'manifesto', true);
        $value = ($meta_value) ? $meta_value : null;
        return $value;
    }

    public function dailyMessage($post, $user_id)
    {
        $meta_value = get_post_meta($post->ID, 'daily_message', true);
        $value = ($meta_value) ? $meta_value : null;
        return $value;
    }

    public function visibility($post, $user_id)
    {
        $meta_value = get_post_meta($post->ID, 'visibility', true);
        $value = ($meta_value) ? $meta_value : null;
        return $value;
    }

    public function application($post, $user_id)
    {
        $meta_value = get_post_meta($post->ID, 'applications', true);
        $value = ($meta_value) ? $meta_value : null;
        return $value;
    }

    public function language($post, $user_id)
    {
        $meta_value = get_post_meta($post->ID, 'language', true);
        $value = ($meta_value) ? $meta_value : null;
        return $value;
    }

    public function clanLogo($post, $user_id)
    {
        $post_id = get_post_meta($post->ID, 'cdn_logo', true);
        return $post_id;
    }

    public function bannerPoster($post, $user_id)
    {
        $post_id = get_post_meta($post->ID, 'logo_background_clan', true);
        $img_obj = get_field('logo_background', $post_id);
        $attach_id = $img_obj['ID'];
        $obj = [];
        $obj['postId'] = $post_id;
        $img_href = wp_get_attachment_image_src($attach_id, false);
        $obj['href'] = $img_href[0];
        return $obj;
    }

    public function logoIcon($post, $user_id)
    {
        $post_id = get_post_meta($post->ID, 'logo_icon_clan', true);
        $img_obj = get_field('logo_icon', $post_id);
        $attach_id = $img_obj['ID'];
        $obj = [];
        $obj['postId'] = $post_id;
        $img_href = wp_get_attachment_image_src($attach_id, false);
        $obj['href'] = $img_href[0];
        return $obj;
    }

    public function logoShield($post, $user_id)
    {
        $post_id = get_post_meta($post->ID, 'logo_shield_clan', true);
        $img_obj = get_field('logo_shield', $post_id);
        $attach_id = $img_obj['ID'];
        $obj = [];
        $obj['postId'] = $post_id;
        $img_href = wp_get_attachment_image_src($attach_id, false);
        $obj['href'] = $img_href[0];
        return $obj;
    }

    public function backgroundImage($post, $user_id)
    {
        $post_id = get_post_meta($post->ID, 'background_image_clan', true);
        $img_obj = get_field('background_image', $post_id);
        $attach_id = $img_obj['ID'];
        $obj = [];
        $obj['postId'] = $post_id;
        $img_href = wp_get_attachment_image_src($attach_id, false);
        $obj['href'] = $img_href[0];
        return $obj;
    }

    public function clanOwner($post, $user_id)
    {
        $meta_value = get_post_meta($post->ID, 'clan_owner', true);
        $user['userId'] = $meta_value;
        $user['gamertag'] = get_user_meta($meta_value, 'msa_gt', true);
        $user['profilePic'] = get_user_meta($meta_value, 'msa_pp', true);
        return $user;
    }

    public function clanCreator($post, $user_id)
    {
        $meta_value = get_post_meta($post->ID, 'clan_creator', true);
        $user['userId'] = $meta_value;
        $user['gamertag'] = get_user_meta($user_id, 'msa_gt', true);
        $user['profilePic'] = get_user_meta($user_id, 'msa_pp', true);
        return $user;
    }

    public function memberCount($post, $user_id)
    {
        $meta_value = get_post_meta($post->ID, 'member_count', true);
        $value = ($meta_value) ? $meta_value : null;
        return $value;
    }

    public function this_month($range)
    {
        $this->default_args['date_query']['month'] = date('n', current_time('timestamp'));
        $this->default_args['date_query']['year'] = date('Y', current_time('timestamp'));
        Carbon::setTestNow();
    }

    public function last_week($range)
    {
        $now = Carbon::now();
        Carbon::setTestNow($now);
        $before = $now->previous(Carbon::SUNDAY)->toDateTimeString();
        $after = $now->previous(Carbon::SUNDAY)->toDateTimeString();
        $this->default_args['date_query']['before'] = $before;
        $this->default_args['date_query']['after'] = $after;
        Carbon::setTestNow();
    }

    public function last_month($range)
    {
        $now = Carbon::now();
        Carbon::setTestNow($now);
        $before = new Carbon('last day of last month');
        $after = new Carbon('first day of last month');
        $this->default_args['date_query']['before'] = $before;
        $this->default_args['date_query']['after'] = $after;
        Carbon::setTestNow();
    }

    public function last_year($range)
    {
        $now = Carbon::now();
        Carbon::setTestNow($now);
        $before = new Carbon('last day of last year');
        $after = new Carbon('first day of last year');
        $this->default_args['date_query']['before'] = $before;
        $this->default_args['date_query']['after'] = $after;
        Carbon::setTestNow();
    }
}