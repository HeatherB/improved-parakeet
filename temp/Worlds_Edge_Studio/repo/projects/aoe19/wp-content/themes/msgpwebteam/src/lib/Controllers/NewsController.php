<?php

namespace Roots\Controllers;

use WP_Query;
use HTMLPurifier;

class NewsController
{

    public $default_args = array(
        "post_type" => 'post',
        "post_status" => 'publish',
        "posts_per_page" => 3,
        "paged" => '',
    );

    public static $comment_number = 10;

    public $comment_fields = [
        'comment_id',
        'comment_content',
        'comment_avatar',
        'comment_time',
        'comment_date',
        'comment_author',
        'comment_children',
        'comment_class',
        'comment_has_children',
    ];

    public function __construct()
    {
        add_filter('sage/template/blog/data', [$this, 'news_roll']);
        add_filter('sage/template/home/data', [$this, 'home_data']);
        add_filter('sage/template/tax-game/data', [$this, 'tax_data']);
        add_filter('sage/template/category/data', [$this, 'cat_data']);
        add_filter('sage/template/single-post/data', [$this, 'single_posts']);
        add_filter('sage/template/page-template-page-mods-single-blade/data', [$this, 'page_posts']);
        add_filter('query_vars', [$this, 'prefix_register_query_var']);
        add_action('init', [$this, 'games_tax_rewrite_tag'], 10, 0);

        add_action('wp_ajax_post_comment', [$this, 'post_comment']);
        add_action('wp_ajax_nopriv_post_comment', [$this, 'post_comment']);
        add_action('wp_ajax_load_comments', [$this, 'load_comments']);
        add_action('wp_ajax_nopriv_load_comments', [$this, 'load_comments']);
        add_action('wp_ajax_delete_comment', [$this, 'delete_comment']);
        add_action('wp_ajax_nopriv_delete_comment', [$this, 'delete_comment']);
    }

    public function prefix_register_query_var($vars)
    {
        $vars[] = 'game';
        return $vars;
    }

    public function games_tax_rewrite_tag()
    {
        add_rewrite_tag('%game%', '([^&]+)');
    }

    public function home_data()
    {
        $this->default_args['posts_per_page'] = 3;
        $data = $this->news_roll();
        return $data;
    }

    public function game_data()
    {
        $game_id = get_the_ID();
        $title = get_the_title($game_id);
        $game_slug = '';
        if($title == 'Age of Empires II HD') :
            $game_slug = 'aoeii';
        elseif($title == 'Age of Empires II: Definitive Edition') :
            $game_slug = 'aoeiide';
        elseif($title == 'Age of Empires III') :
            $game_slug = 'aoeiii';
        elseif($title == 'Age of Empires III: Definitive Edition') :
            $game_slug = 'aoeiiide';
        elseif($title == 'Age of Empires IV') :
            $game_slug = 'aoeiv';
        // no game news to show yet - change to aoeiv when news added
        elseif($title == 'Age of Mythology') :
            $game_slug = 'aoem';
        elseif($title == 'Age of Empires: Definitive Edition') :
            $game_slug = 'aoede';
        endif;
        $data = $this->news_roll($game_slug);
        return $data;
    }

    public function tax_data()
    {
        $term = get_term_by('slug', get_query_var('term'), get_query_var('taxonomy'));
        $this->default_args['tax_query'] = array(
            array(
                'taxonomy' => 'game',
                'field' => 'slug',
                'terms' => $term->slug,
            ),
        );
        $data = $this->news_roll();
        return $data;
    }

    public function cat_data()
    {
        $category_id = get_query_var('cat') ?? '';
        $this->default_args['cat'] = $category_id;
        $data = $this->news_roll();
        return $data;
    }

    public function news_roll($game_page_slug = '')
    {
        $game_id = get_the_ID();
        $title = get_the_title($game_id);
        $game_slug = '';
        if($title == 'Age of Empires II HD') :
            $game_slug = 'aoeii';
        elseif($title == 'Age of Empires II: Definitive Edition') :
            $game_slug = 'aoeiide';
        elseif($title == 'Age of Empires III') :
            $game_slug = 'aoeiii';
        elseif($title == 'Age of Empires III: Definitive Edition') :
            $game_slug = 'aoeiiide';
        elseif($title == 'Age of Empires IV') :
            $game_slug = 'aoeiv';
        elseif($title == 'Age of Mythology') :
            $game_slug = 'aoem';
        elseif($title == 'Age of Empires: Definitive Edition') :
            $game_slug = 'aoede';
        endif;
        $tax = get_query_var('game', $game_page_slug) ?? null;
        $category_id = get_query_var('cat') ?? null;
        $news_home = get_site_url() . "/news";
        $current_base = $news_home;
        $paged = (get_query_var('paged')) ? get_query_var('paged') : 1;
        if($category_id) :
            $category_id = (int)$category_id;
            $category = get_category($category_id);
            $current_base = $current_base . "/category/" . strtolower($category->slug);
        endif;
        if($tax == "aoeii" || $tax == "aoeiide") {
            $this->default_args['tax_query'] = array(
                array(
                    'taxonomy' => 'game',
                    'field' => 'slug',
                    'terms' => array("aoeii", "aoeiide"),
                ),
            );
        } else if($tax == "aoeiii" || $tax == "aoeiiide") {
            $this->default_args['tax_query'] = array(
                array(
                    'taxonomy' => 'game',
                    'field' => 'slug',
                    'terms' => array("aoeiii", "aoeiiide"),
                ),
            );
        } else if(!empty($tax)) {
            $this->default_args['tax_query'] = array(
                array(
                    'taxonomy' => 'game',
                    'field' => 'slug',
                    'terms' => $tax,
                ),
            );
        }
        $wp_fields = [
            'headline',
            'excerpt',
            'permalink',
            'cats',
            'current_page',
            'featured_image_url',
            'tax',
            'date',
            'author',
            'ID'
        ];
        $this->default_args['paged'] = $paged;
        $news_query = new WP_Query($this->default_args);
        $data = [];
        $temp = [];
        while($news_query->have_posts()) : $news_query->the_post();
            foreach($wp_fields as $field) {
                global $post;
                $temp[$field] = call_user_func_array(array($this, $field), array($post->ID, $paged));
            };
            $data['news_posts'][] = $temp;
        endwhile;


        $total_pages = $news_query->max_num_pages;
        if($paged > ($total_pages - 2)) :

        else:
            $show_last_nav = true;
        endif;
        if($paged > 3 && $total_pages > 4 && $paged < ($total_pages - 2) && $total_pages > 3) :
            $show_first_nav = true;
            $show_last_nav = true;
            $arr_page_range = [$paged - 1, $paged, $paged + 1];
        elseif($paged >= ($total_pages - 2) && $total_pages > 3) :
            $show_first_nav = true;
            $show_last_nav = false;
            $arr_page_range = [$total_pages - 3, $total_pages - 2, $total_pages - 1];
        elseif($paged <= 3 && $total_pages > 4) :
            $arr_page_range = [2, 3, 4];
            $show_first_nav = false;
            $show_last_nav = true;
        elseif($total_pages == 4) :
            $arr_page_range = [2, 3];
            $show_first_nav = false;
            $show_last_nav = false;
        elseif($total_pages == 3) :
            $arr_page_range = [2];
            $show_first_nav = false;
            $show_last_nav = false;
        elseif($total_pages == 2) :
            $arr_page_range = [];
            $show_first_nav = false;
            $show_last_nav = false;
        elseif($total_pages == 1) :
            $arr_page_range = [];
            $show_first_nav = false;
            $show_last_nav = false;
        else :
            $arr_page_range = [];
            $show_first_nav = false;
            $show_last_nav = false;
        endif;
        $num_item_start = ($paged !== 1) ? ($paged - 1) * $this->default_args['posts_per_page'] + 1 : 1;
        $data['pagination'] = array(
            'numItemStart' => $num_item_start,
            'numItemEnd' => ($num_item_start + $news_query->post_count) - 1,
            'numTotalItems' => $news_query->found_posts,
            'numTotalPages' => $total_pages,
            'numCurPage' => $paged,
            'showFirstNav' => $show_first_nav,
            'showLastNav' => $show_last_nav,
            'arrPageRange' => $arr_page_range
        );
        $data['cats'] = $this->cat_names();
        $data['current_tax'] = (!empty($tax)) ? strval($tax) : ''; //get_query_var('game');
        $data['news_home'] = $news_home;
        $data['current_base'] = $current_base;
        $data['paged'] = $paged;

//        var_dump($data);
//    die();
        return $data;

    }

    public function get_comments($post_id)
    {
        $args = array(
            'number' => NewsController::$comment_number,
            'post_id' => $post_id,
            'parent' => 0,
        );
        $comments = get_comments($args);
        $data = $this->build_data($comments);
        return $data;
    }

    public function build_data($comments)
    {
        $data = [];
        $temp = [];
        foreach($comments as $comment):
            foreach($this->comment_fields as $field):
                $temp[$field] = call_user_func_array(array($this, $field), array($comment));
            endforeach;
            $data[] = $temp;
        endforeach;
        return $data;
    }

    public function post_comment()
    {
        check_ajax_referer('the_nonce', 'security');
        $user = wp_get_current_user();
        $post_ID = $_REQUEST['post_ID'] ?? null;
        $comment_parent = $_REQUEST['comment_parent'] ?? 0;
        $comment_content = $_REQUEST['comment_content'] ?? null;

        $purifier = new HTMLPurifier();
        $comment_content = htmlspecialchars($comment_content);
        $comment_content = stripslashes($comment_content);
        $comment_content = $purifier->purify($comment_content);
        $comment_content = wpautop($comment_content, true);

        $comment = array(
            'comment_post_ID' => $post_ID,
            'comment_author' => $user->user_nicename,
            'comment_author_email' => $user->user_email,
            'comment_author_url' => null,
            'comment_content' => $comment_content,
            'comment_type' => '',
            'comment_parent' => $comment_parent,
            'user_id' => $user->ID,
            'comment_author_IP' => preg_replace('/[^0-9a-fA-F:., ]/', '', $_SERVER['REMOTE_ADDR']),
            'comment_agent' => '',            
            'comment_approved' => 1,
        );

        $comment_ID = wp_insert_comment($comment);

//    echo $comment_ID;
//    die();

        $args = array(
            'number' => '1',
            'comment__in' => [$comment_ID],
        );

        $comments = get_comments($args);
        $data['comments'] = $this->build_data($comments);
        $data['comment_count'] = $this->comment_count($post_ID);
        $data['comment_number'] = $this->comment_number;
        $data['comment_parent'] = ($comment_parent) ? $comment_parent : 'parent';
        header('Content-Type: application/json');
        echo json_encode($data);
        die();
    }

    public function load_comments()
    {
        $offset = $_REQUEST['offset'] ?? null;
        $comment_parent = $_REQUEST['comment_parent'] ?? 0;
        $post_id = $_REQUEST['post_ID'] ?? null;
        $args = array(
            'number' => $this->comment_number,
            'offset' => $offset,
            'post_id' => $post_id,
            'parent' => $comment_parent,
        );
        $comments = get_comments($args);
        $data['comments'] = $this->build_data($comments);
        $data['comment_count'] = $this->comment_count($post_id);
        $data['comment_number'] = $this->comment_number;
        $data['comment_offset'] = intval($offset);
        header('Content-Type: application/json');
        echo json_encode($data);
        die();
    }
    public static function comment_number() {
        return self::$comment_number;
    }
    public function comment_id($comment)
    {
        return $comment->comment_ID;
    }

    public function comment_content($comment)
    {
        $comment_content = get_comment_text($comment->comment_ID);
        return $comment_content;
    }

    public function comment_avatar($comment)
    {
        $user = get_user_by('email', $comment->comment_author_email);

        if(is_object($user)) {
            if(in_array('subscriber', (array)$user->roles)) {
                $avatar = get_avatar($comment->comment_author_email, 100);
            } else {
                $avatar = "<img src='" . get_avatar_url($user->ID, 100) . "'/>";
            }
        } else {
            $avatar = "<img src='" . get_avatar_url("", 100) . "'/>";
        }

        return $avatar;
    }

    public function comment_date($comment)
    {
        $comment_date = date("F j, Y", strtotime($comment->comment_date));
        return $comment_date;
    }

    public function comment_time($comment)
    {
        $comment_time = date("g:i a", strtotime($comment->comment_date));
        return $comment_time;
    }

    public function comment_author($comment)
    {
        $comment_author = $comment->comment_author;
        return $comment_author;
    }

    public function comment_children($comment)
    {
        $args = array(
            'number' => '10',
            'post_id' => $comment->comment_post_ID,
            'parent' => $comment->comment_ID
        );
        $comments = get_comments($args);
        $comment_children = $this->build_data($comments);
        return $comment_children;
    }

    public function comment_has_children($comment)
    {
        $args = array(
            'count' => true,
            'post_id' => $comment->comment_post_ID,
            'parent' => $comment->comment_ID
        );
        $comment_has_children = (get_comments($args) > 0) ? 'comment--has-children' : '';
        return $comment_has_children;
    }

    public function comment_class($comment)
    {
        $comment_class = (!empty($comment->comment_parent)) ? 'comment--child' : 'comment--parent';
        return $comment_class;
    }


    public function delete_comment()
    {
        $comment_id = $_REQUEST['comment_id'] ?? null;
        if(current_user_can('administrator')):
            $delete_status = wp_delete_comment($comment_id, false);
        else:
            $delete_status = "No permissions";
        endif;
        header('Content-Type: application/json');
        echo json_encode([$comment_id, $delete_status]);
        die();
    }

    public function single_posts()
    {
        $user = wp_get_current_user();
        $post_id = get_the_ID();
        $tax = get_the_terms($post_id, 'game');
        $terms = [];
        if($tax) :
            foreach($tax as $term) {
                array_push($terms, $term->slug);
            }
        endif;
        $this->default_args['tax_query'] = array(
            array(
                'taxonomy' => 'game',
                'field' => 'slug',
                'terms' => $terms,
            ),
        );
        $cats = [];
        $categories = get_the_category($post_id);
        if($categories) :
            foreach($categories as $cat) {
                array_push($cats, $cat->term_id);
            }
        endif;
        $this->default_args['category__in '] = $cats;
        $this->default_args['posts_per_page'] = 3;
        $data['related'] = $this->news_roll();
        $data['user_avatar'] = get_avatar($user->user_email, 100);
        $data['comment_count'] = $this->comment_count($post_id);
        $data['author_avatar'] = \App\author_avatar();
        $data['author_display_name'] = \App\author_display_name();
        $data['author_link'] = \App\author_link();
        $data['author_title'] = \App\author_title();
        $data['author_projects'] = \App\author_projects();
        $data['post_date'] = get_the_date('F j, Y', $post_id);
        $data['post_id'] = $post_id;
        $data['comments'] = $this->get_comments($post_id);
        $data['comment_number'] = $this->comment_number;
        $data['discussion_link'] = get_post_meta( $post_id,'discourse_topic_url',true);

        return $data;
    }

    public function page_posts(){
        $post_id = get_the_ID();
        $user = wp_get_current_user();
        // Pattern to check for page type and incoming ID
        $modsPattern = 'mods/details/';
        $uri = $_SERVER['REQUEST_URI'];

        // If Mods Page
        if(strpos($uri,$modsPattern)){

            $mod = (int)basename($uri);
            //Check for existing mod
            $modObj = \Roots\Mods\ModsMain::check_mod_obj($mod);

            if(!empty($modObj)){
                $post_id = $modObj;
            }

        }

        $data['user_avatar'] = get_avatar($user->user_email, 100);
        $data['comment_count'] = $this->comment_count($post_id);
        $data['author_avatar'] = \App\author_avatar();
        $data['author_display_name'] =\App\author_display_name();
        $data['author_link'] = \App\author_link();
        $data['author_title'] = \App\author_title();
        $data['author_projects'] = \App\author_projects();
        $data['post_date'] = get_the_date('F j, Y', $post_id);
        $data['post_id'] = $post_id;
        $data['comments'] = $this->get_comments($post_id);
        $data['comment_number'] = NewsController::$comment_number;

        return $data;
    }

    public function comment_count($post_id)
    {
        $args = array(
            'number' => '-1',
            'post_id' => $post_id,
            'parent' => 0,
            'count' => true
        );
        $comment_count = get_comments($args);
        return $comment_count;
    }

    public function headline($post_id)
    {
        $title = get_the_title($post_id);
        return $title;
    }

    public function tax($post_id)
    {
        $font_names = array(
            "Age of Empires DE" => $this->age1,
            "Age of Empires II HD" => $this->age2,
            "Age of Empires II DE" => $this->age2,
            "Age of Empires III" => $this->age3,
            "Age of Empires III DE" => $this->age3,
            "Age of Empires IV" => $this->age4,
            "Age of Mythology" => $this->myth,
            "Legacy Games" => null,
        );
        $tax = get_the_terms($post_id, 'game');
        $data = [];
        $temp = [];
        $count = 0;
        if($tax) :
            foreach($tax as $item) {
                $count++;
                $temp[$count]['svg'] = isset($font_names[$item->name]) ? $font_names[$item->name] : '';
                $temp[$count]['slug'] = $item->slug;
            }
        endif;
        $data = $temp;
        return $data;
    }

    public function ID($post_id)
    {
        return $post_id;
    }

    public function date($post_id)
    {
        $date = get_the_date('M j, Y', $post_id);
        return $date;
    }

    public function author($post_id)
    {
        $author = get_the_author_meta('display_name');
        return strtoupper($author);
    }

    public function cat_names()
    {
        $categories = get_categories();
        $arr_cats = [];
        $temp = [];
        if($categories) :
            foreach($categories as $cat) {
                $temp[$cat->name]['name'] = $cat->name;
                $temp[$cat->name]['href'] = get_category_link($cat->term_id);
                $temp[$cat->name]['ID'] = $cat->term_id;
            }
        endif;
        $arr_cats[] = $temp;
        return $arr_cats;
    }

    public function excerpt($post_id)
    {
        $excerpt = get_the_excerpt($post_id);
        $limit = (strlen(get_the_title(get_the_ID())) > 120 ? 200 : 260);

        $line = preg_replace_callback("/(&#[0-9]+;)/", function($m) {
            return mb_convert_encoding($m[1], "UTF-8", "HTML-ENTITIES");
        }, $excerpt);
        if(preg_match('/^.{1,' . $limit . '}\b/s', $line, $match)) {
            $line = $match[0];
            $line .= "...";
        }
        return $line;
    }

    public function permalink($post_id)
    {
        $permalink = get_the_permalink($post_id);
        return $permalink;
    }

    public function cats($post_id)
    {
        $cats_obj = get_the_category($post_id);
        $cats = [];
        $temp = [];
        for($i = 0; $i < count($cats_obj); $i++) {
            $temp[$cats_obj[$i]->cat_ID] = [];
            $temp[$cats_obj[$i]->cat_ID]['name'] = $cats_obj[$i]->cat_name;
            $temp[$cats_obj[$i]->cat_ID]['link'] = get_category_link($cats_obj[$i]->cat_ID);
        }
        $cats = $temp;
        return $cats;
    }

    public function featured_image_url($post_id)
    {
        $url = get_the_post_thumbnail_url($post_id);
        if(has_post_thumbnail()) {
            $the_post_thumbnail = wp_get_attachment_image_src(get_post_thumbnail_id($post_id), 'thumbnail_16x9');
            if(is_array($the_post_thumbnail) && $the_post_thumbnail[3]) {
                $the_post_thumbnail_url = $the_post_thumbnail[0];
            } else {
                $the_post_thumbnail = wp_get_attachment_image_src(get_post_thumbnail_id($post_id), 'medium_large');
                if(is_array($the_post_thumbnail) && $the_post_thumbnail[3]) {
                    $the_post_thumbnail_url = $the_post_thumbnail[0];
                }
            }
            $the_post_thumbnail_url = empty($the_post_thumbnail_url) ? get_the_post_thumbnail_url() : $the_post_thumbnail_url;
            $the_post_thumbnail_url = empty($the_post_thumbnail_url) ? $url : $the_post_thumbnail_url;
        } else {
            $the_post_thumbnail_url = $url;
        }
        return $the_post_thumbnail_url;
    }

    public function current_page($post_id, $paged)
    {
        return $paged;
    }

    public $age1 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 22"><path d="M22.8 13.6c.1-.2.2-.3.2-.5V13c-.2-.3-.3-.7-.4-1.1-.1-2.1.4-4.2 1.4-6.1.2-.4.4-.7.7-1 .4-.5.8-1 1.3-1.5.5-.4 1.1-.7 1.7-1 .6-.3 1.2-.6 1.9-.8 1.3-.4 2.7-.6 4.1-.7 1.7 0 3.5.2 5.3.6.8.1 1.6.3 2.4.4.4 0 .7.3.7.6V3c0 .2-.5.2-.5.2.1.2.3.4.5.6V4c0 1-.1 2-.1 3v.2c-.7 0-1.1-.3-1.2-.9-.1-1-.7-1.9-1.7-2.5-1-.6-2.1-.9-3.2-1-1.4-.2-2.9-.2-4.4.2-.8.2-1.6.6-2.2 1.1-1.3 1-2 2.3-2.3 3.8-.6 2.5-.3 5.2.9 7.5.3.7.8 1.3 1.3 1.8.9 1 2.1 1.7 3.3 2.1.6.2 1.3.3 2 .4.9.1 1.8.1 2.7-.1.2 0 .3-.1.5-.1.3 0 .4-.3.4-.5v-1c-.1-.6-.1-1.2 0-1.8.1-.7.1-1.5 0-2.2 0-.3 0-.7-.1-1 0-.3-.3-.6-.6-.6-.3-.1-.7-.1-1.1-.1-.1 0-.3 0-.4-.2-.2-.3-.5-.6-.8-.9h9l-.7 1c-.1.1-.1.1-.2.1h-.3c-.9.1-1.2.4-1.1 1.3.1.5.1 1 0 1.5-.1.8-.1 1.6 0 2.3v2.1c.1.5-.3.9-.7.9H41c-.9.2-1.8.4-2.7.7-2.3.6-4.7.7-7.1.3-1.8-.3-3.5-1-5-2-.3-.2-.5-.4-.8-.6l-.1-.1c-.1 0-.1-.3-.2-.4s-.4-.1-.5-.3c-.8-1-1.4-2.1-1.8-3.3.2-.4.4-.4-.1-.5.1-.2.1-.4.1-.6zm-17.5.7c.2-.5.5.1.5-.7v-.1c0-.1 0-.3.1-.4.1-.3.3-.6.5-.9l1.5-3.3c.1-.7.4-1.3.7-2 .6-1.4 1.3-2.9 1.9-4.3.3-.9.8-1.6 1.6-2.2l.1-.1.6 1.5 1 2.5 3.3 8.1.6 1.4c.1.2.1.3.1.5 0 .1-.2.2-.2.3.1.1.3.1.5.2.5 1.2 1 2.4 1.5 3.5.1.2.2.4.4.6.4.7 1.1 1.2 1.9 1.1.3 0 .6.1.8.4.1.2.3.4.5.7H15c.3-.4.6-.8 1-1.1.2-.1.1-.3 0-.4-.4-1-.8-2.1-1.2-3.1l-.9-2.4c0-.2-.2-.3-.4-.3H8.7c-.1 0-.3.1-.3.2-.6 1.6-1.3 3.3-1.8 5-.2.8-.1 1 .7.9.3 0 .5.1.7.3.2.3.4.5.6.8H.2c.2-.3.4-.7.7-1 0-.1.1 0 .2 0 .3 0 .7-.1 1-.2.1 0 .1 0 .2-.1.5-.6 1-1.3 1.3-2 .6-1 1.1-2.2 1.7-3.4zm7.8-2l-2-5.2L9 12.2l4.1.1zm35.7 2.2c0-.2.3-.2.3-.3 0-.1-.3-.1-.3-.3 0-2.2.1-4.4.1-6.6 0-1.3 0-2.6-.1-3.8 0-.8-.3-1.1-1.1-1.1-.6.1-1.1-.2-1.5-.7l-.5-.5h11.7c.4 0 .9 0 1.3-.2.3-.1.6 0 .7.3.1.1.1.2 0 .4 0 .6-.1 1.2-.2 1.8-.1.8-.2 1.5-.3 2.3l-1-.8c.1-.1.1-.2.1-.2 0-1-.3-1.3-1.3-1.4-1-.1-2-.2-3-.1h-.9v6.3H55c.2 0 .4 0 .6-.1.3 0 .6-.2.8-.4.1-.2.2-.4.5-.2s.5.3.4.6c0 .5-.1 1.1-.1 1.6-.1.9-.2 1.8-.2 2.7v.1l-1-.4c-.1-.1-.1-.1-.1-.2v-.5c-.1-.7-.3-1-1-1.1-.6-.1-1.3-.1-1.9-.1V14c0 1.2.1 2.4.1 3.6 0 .3 0 .6.1.9.1.3.3.6.7.7.9.2 1.7.2 2.6.1.4 0 .7 0 1.1-.1.7-.1 1.3-.6 1.4-1.3.1-.5.4-.9.9-1.2.2-.1.3-.2.6-.4v.4l-.6 3.6c0 .2 0 .5-.1.7s-.1.3-.3.2-.2 0-.3 0H46c.3-.3.5-.6.8-.8.2-.2.5-.4.8-.4.7 0 .8-.1 1-.9.1-1 .2-2.1.2-3.1 0-.4-.1-1 0-1.5zm26-8.9c0-.1 0-.1 0 0 0-.3-.2-.6-.2-.6.1-.3.2 0 .2-.4v-.4V4c0-.3.1-.6.1-.9.2-.7.3-.8 1-.9.3 0 .6-.1.8-.4.3-.3.3-.4.7-.8h-1.9l-3 .1-2.7-.1H68c.3.3.5.6.8.8.1.2.4.4.7.3.7 0 .7.1.9.9.1 1 .2 2.1.2 3.1v6.2c0 .3.3.4.3.6-.2.5-.3 1-.3 1.4v2.5c0 .7 0 1.3-.1 1.8 0 .2 0 .3-.1.5-.2.7-.3.9-1 .9-.3 0-.6.1-.8.4-.2.3-.5.5-.8.8h2.6l2.1-.1 3 .1h2.4l-.8-.8c-.3-.4-.5-.3-1-.4-.7 0-.8-.1-1-.9 0-.2-.1-.5-.1-.8v-1.1-.8-7.6-2.6c-.2-.3-.2-.5-.2-.6z"/></svg>';

    public $age2 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 22"><path d="M22.9 13.6c.1-.2.2-.3.2-.5V13c-.2-.3-.3-.7-.4-1.1-.1-2.1.4-4.2 1.5-6.1.2-.4.4-.7.7-1 .4-.5.8-1 1.3-1.5.5-.4 1.1-.7 1.7-1 .6-.3 1.2-.6 1.9-.8 1.3-.4 2.7-.6 4.1-.7 1.8-.1 3.6.1 5.3.4.8.1 1.6.3 2.4.4.4 0 .7.3.7.6v.6c0 .2-.5.2-.5.2.1.2.3.4.5.6v.2c0 1-.1 2-.1 3V7c-.7 0-1.1-.3-1.2-.9-.1-1-.7-1.9-1.7-2.5-1-.6-2.1-.9-3.2-1-1.4-.2-2.9-.2-4.4.2-.8.2-1.6.6-2.2 1.1-1.2.9-1.9 2.2-2.2 3.7-.6 2.5-.3 5.2.9 7.5.3.7.8 1.3 1.3 1.8.9 1 2.1 1.7 3.3 2.1.6.2 1.3.3 2 .4.9.1 1.8.1 2.7-.1.2 0 .3-.1.5-.1.3 0 .4-.3.4-.5v-1c-.1-.6-.1-1.2 0-1.8.1-.7.1-1.5 0-2.2 0-.3 0-.7-.1-1 0-.3-.3-.6-.6-.6-.3-.1-.7-.1-1.1-.1-.1 0-.3 0-.4-.2-.2-.3-.5-.6-.8-.9h9l-.7 1c-.1.1-.1.1-.2.1h-.3c-.9.1-1.2.4-1.1 1.3.1.5.1 1 0 1.5-.1.8-.1 1.6 0 2.3v2.1c.1.5-.3.9-.7.9h-.1c-.9.2-1.8.4-2.7.7-2.3.6-4.7.7-7.1.3-1.8-.3-3.5-1-5-2-.3-.2-.5-.4-.8-.6l-.1-.1c-.1 0-.1-.3-.2-.4s-.4-.1-.5-.3c-.8-1-1.4-2.1-1.8-3.3.2-.4.4-.4-.1-.5 0 .1 0-.1-.1-.3zm-17.4.7c.2-.5.5.1.5-.7v-.1c0-.1 0-.3.1-.4.1-.3.3-.6.5-.9l1.5-3.3c.3-.6.6-1.2.9-1.9.6-1.5 1.3-2.9 1.9-4.4.3-.9.8-1.6 1.6-2.2l.1-.1.4 1.6 1 2.5 3.3 8.1.6 1.4c.1.2.1.3.1.5 0 .1-.2.2-.2.3.1.1.3.1.5.2.5 1.2 1 2.4 1.5 3.5.1.2.2.4.4.6.4.7 1.1 1.2 1.9 1.1.3 0 .6.1.8.4.1.2.3.4.5.7h-8.2c.3-.4.6-.8 1-1.1.2-.1.1-.3 0-.4-.4-1-.8-2.1-1.2-3.1l-.9-2.4c0-.2-.2-.3-.4-.3H8.9c-.1 0-.3.1-.3.2-.6 1.6-1.3 3.3-1.8 5-.2.8-.1 1 .7.9.3 0 .5.1.7.3.2.3.4.5.6.8H.4c.2-.3.4-.7.7-1 0-.1.1 0 .2 0 .3 0 .7-.1 1-.2.1 0 .1 0 .2-.1.5-.6 1-1.3 1.3-2 .6-1.1 1.1-2.3 1.7-3.5zm7.8-2l-2-5.2-2.1 5.2h4.1zm35.6 2.2c0-.2.3-.2.3-.3 0-.1-.3-.1-.3-.3 0-2.2.1-4.4.1-6.6 0-1.3 0-2.6-.1-3.8 0-.8-.3-1.1-1.1-1.1-.6.1-1.1-.2-1.5-.7l-.5-.5h11.7c.4 0 .9 0 1.3-.2.3-.1.6 0 .7.3.1.1.1.2 0 .4 0 .6-.1 1.2-.2 1.8-.1.8-.2 1.5-.3 2.3L58 5c-.1-.1-.1-.2-.1-.3 0-1-.3-1.3-1.3-1.4-1-.1-2-.2-3-.1h-.9v6.3h2.1c.2 0 .4 0 .6-.1.3 0 .6-.2.8-.4.1-.2.2-.4.5-.2s.5.3.4.6c0 .5-.1 1.1-.1 1.6-.1.9-.2 1.8-.2 2.7v.1l-.9-.5c-.1-.1-.1-.1-.1-.2v-.5c-.1-.7-.3-1-1-1.1-.6-.1-1.3-.1-1.9-.1v2.4c0 1.2.1 2.4.1 3.6 0 .3 0 .6.1.9.1.3.3.6.7.7.9.2 1.7.2 2.6.1.4 0 .7 0 1.1-.1.7-.1 1.3-.6 1.4-1.3.1-.5.4-.9.9-1.2.2-.1.3-.2.6-.4v.4l-.4 3.9c0 .2 0 .5-.1.7s-.1.3-.3.2-.2 0-.3 0H46.2c.3-.3.5-.6.8-.8.2-.2.5-.4.8-.4.7 0 .8-.1 1-.9.1-1 .2-2.1.2-3.1-.1-.5-.1-1.1-.1-1.6zM75 5.6s0-.1 0 0c0-.3-.1-.6-.1-.6.1-.3.2 0 .2-.4v-.4V4c0-.3.1-.6.1-.9.2-.7.3-.8 1-.9.3 0 .6-.1.8-.4.2-.3.3-.4.6-.8h-1.9l-3 .1L70 1h-1.8c.3.3.5.6.8.8.1.2.4.4.7.4.7 0 .7.1.9.8.1 1 .2 2.1.2 3.1v6.2c0 .3.3.4.3.6-.2.5-.3 1-.3 1.4v2.4c0 .7 0 1.3-.1 1.8 0 .2 0 .3-.1.5-.2.7-.3.9-1 .9-.3 0-.6.1-.8.4-.2.3-.5.5-.8.8h2.6l2.1-.1 3 .1H78l-.8-.8c-.3-.4-.5-.3-1-.4-.7 0-.8-.1-1-.9 0-.2-.1-.5-.1-.8v-1.1-.8-7.5-2.6c-.1-.2-.1-.4-.1-.6zm11.6 0s0-.1 0 0c0-.3-.2-.5-.2-.6.1-.3.2 0 .2-.4v-.4V4c0-.3.1-.6.1-.9.2-.7.3-.8 1-.9.3 0 .6-.1.8-.4.2-.3.3-.4.6-.8h-1.9l-3 .1-2.6-.1h-1.8c.3.3.5.6.8.8.1.2.4.4.7.4.7 0 .7.1.9.8.1 1 .2 2.1.2 3.1v6.2c0 .3.3.4.3.6-.2.5-.3 1-.3 1.4v2.4c0 .7 0 1.3-.1 1.8 0 .2 0 .3-.1.5-.2.7-.3.9-1 .9-.3 0-.6.1-.8.4-.2.3-.5.5-.8.8h2.6l2.1-.1 3 .1h2.4l-.8-.8c-.3-.4-.5-.3-1-.4-.7 0-.8-.1-1-.9 0-.2-.1-.5-.1-.8v-1.1-.8-7.5-2.6c-.2-.2-.2-.4-.2-.6z"/></svg>';

    public $age3 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 102 22"><path d="M23.1 13.6c.1-.2.2-.3.2-.5V13c-.2-.3-.3-.7-.4-1.1-.1-2.1.4-4.2 1.5-6.1.2-.4.4-.7.7-1 .4-.5.8-1 1.3-1.5.5-.4 1.1-.7 1.7-1 .6-.3 1.2-.5 1.9-.7 1.3-.4 2.7-.6 4-.7 1.8-.1 3.6.1 5.3.4.8.1 1.6.3 2.4.4.4 0 .7.3.7.6v.6c0 .2-.5.2-.5.2.1.2.3.4.5.6v.2c0 1-.1 2-.1 3v.2c-.7 0-1.1-.3-1.2-.9-.1-1-.7-1.9-1.7-2.5-1-.6-2.1-.9-3.2-1-1.4-.2-2.9-.2-4.4.2-.8.2-1.6.6-2.2 1.1-1.2.9-1.9 2.2-2.2 3.7-.6 2.5-.3 5.2.9 7.5.3.7.8 1.3 1.3 1.8.9 1 2.1 1.7 3.3 2.1.6.2 1.3.3 2 .4.9.1 1.8.1 2.7-.1.2 0 .3-.1.5-.1.3 0 .4-.3.4-.5v-1c-.1-.6-.1-1.2 0-1.8.1-.7.1-1.5 0-2.2 0-.3 0-.7-.1-1 0-.3-.3-.6-.6-.6-.3-.1-.7-.1-1.1-.1-.1 0-.3 0-.4-.2-.2-.3-.5-.6-.8-.9h9l-.7 1c-.1.1-.1.1-.2.1h-.3c-.9.1-1.2.4-1.1 1.3.1.5.1 1 0 1.5-.1.8-.1 1.6 0 2.3v2.1c.1.5-.3.9-.7.9h-.1c-.9.2-1.8.4-2.7.7-2.3.6-4.7.7-7.1.3-1.8-.3-3.5-1-5-2-.3-.2-.5-.4-.8-.6l-.1-.1c-.1 0-.1-.3-.2-.4s-.4-.1-.5-.3c-.8-1-1.4-2.1-1.8-3.3.2-.4.4-.4-.1-.5.1 0 .1-.2 0-.4zm-17.4.7c.2-.5.5.1.5-.7v-.1c0-.1 0-.3.1-.4.1-.3.3-.6.5-.9l1.5-3.3c.1-.7.4-1.3.7-2 .6-1.5 1.3-2.9 1.9-4.4.3-.9.8-1.6 1.6-2.2l.1-.1.6 1.5 1 2.5 3.3 8.1.6 1.4c.1.2.1.3.1.5 0 .1-.2.2-.2.3.1.1.3.1.5.2.5 1.2 1 2.4 1.5 3.5.1.2.2.4.4.6.4.7 1.1 1.2 1.9 1.1.3 0 .6.1.8.4.1.2.3.4.5.7h-8.2c.3-.4.6-.8 1-1.1.2-.1.1-.3 0-.4-.4-1-.8-2.1-1.2-3.1l-.9-2.4c0-.2-.2-.3-.4-.3H9.1c-.1 0-.3.1-.3.2-.6 1.6-1.3 3.3-1.8 5-.2.8-.1 1 .7.9.3 0 .5.1.7.3.2.3.4.5.6.8H.6c.2-.3.4-.7.7-1 0-.1.1 0 .2 0 .3 0 .7-.1 1-.2.1 0 .1 0 .2-.1.5-.6 1-1.3 1.3-2 .6-.9 1.1-2.1 1.7-3.3zm7.8-2l-2-5.2-2.1 5.2h4.1zm35.6 2.2c0-.2.3-.2.3-.3 0-.1-.3-.1-.3-.3 0-2.2.1-4.4.1-6.6 0-1.3 0-2.6-.1-3.8 0-.8-.3-1.1-1.1-1.1-.6.1-1.1-.2-1.5-.7l-.5-.5h11.7c.4 0 .9 0 1.3-.2.3-.1.6 0 .7.3.1.1.1.2 0 .4 0 .6-.1 1.2-.2 1.8-.1.8-.2 1.5-.3 2.3l-1-.8c-.1-.1-.1-.2-.1-.3 0-1-.3-1.3-1.3-1.4-1-.1-2-.2-3-.1h-.9v6.3H55c.2 0 .4 0 .6-.1.3 0 .6-.2.8-.4.1-.2.2-.4.5-.2s.5.3.4.6c0 .5-.1 1.1-.1 1.6-.1.9-.2 1.8-.2 2.7v.1l-.9-.5c-.1-.1-.1-.1-.1-.2v-.5c-.1-.7-.3-1-1-1.1-.6-.1-1.3-.1-1.9-.1v2.4c0 1.2.1 2.4.1 3.6 0 .3 0 .6.1.9.1.3.3.6.7.7.9.2 1.7.2 2.6.1.4 0 .7 0 1.1-.1.7-.1 1.3-.6 1.4-1.3.1-.5.4-.9.9-1.2.2-.1.3-.2.6-.4v.4l-.6 3.6c0 .2 0 .5-.1.7s-.1.3-.3.2-.2 0-.3 0H46.2c.3-.3.5-.6.8-.8.2-.2.5-.4.8-.4.7 0 .8-.1 1-.9.1-1 .2-2.1.2-3.1.1-.2.1-.8.1-1.3zm26.1-8.9s0-.1 0 0c0-.3-.2-.6-.2-.6.1-.3.2 0 .2-.4v-.4V4c0-.3.1-.6.1-.9.2-.7.3-.8 1-.9.3 0 .6-.1.8-.4.2-.3.3-.4.6-.8h-1.9l-3 .1-2.6-.1h-1.8c.3.3.5.6.8.8.1.2.4.4.7.3.7 0 .7.1.9.9.1 1 .2 2.1.2 3.1v6.2c0 .3.3.4.3.6-.2.5-.3 1-.3 1.5v2.4c0 .7 0 1.3-.1 1.8 0 .2 0 .3-.1.5-.2.7-.3.9-1 .9-.3 0-.6.1-.8.4-.2.3-.5.5-.8.8h2.6l2.1-.1 3 .1h2.4l-.8-.8c-.3-.4-.5-.3-1-.4-.7 0-.8-.1-1-.9 0-.2-.1-.5-.1-.8v-1.1-.8-7.6-2.6c-.2-.2-.2-.4-.2-.6zm11.6 0s0-.1 0 0c0-.3-.2-.5-.2-.6.1-.3.2 0 .2-.4v-.4V4c0-.3.1-.6.1-.9.2-.7.3-.8 1-.9.3 0 .6-.1.8-.4.3-.3.3-.4.7-.8h-1.9l-3 .1-2.7-.1H80c.3.3.5.6.8.8.1.2.4.4.7.3.7 0 .7.1.9.9.1 1 .2 2.1.2 3.1v6.2c0 .3.3.4.3.6-.2.5-.3 1-.3 1.5v2.4c0 .7 0 1.3-.1 1.8 0 .2 0 .3-.1.5-.2.7-.3.9-1 .9-.3 0-.6.1-.8.4-.2.3-.5.5-.8.8h2.6l2.1-.1 3 .1h2.4l-.8-.8c-.3-.4-.5-.3-1-.4-.7 0-.8-.1-1-.9 0-.2-.1-.5-.1-.8v-1.1-.8-7.6-2.6c-.2-.2-.2-.4-.2-.6zm11.6 0c.1 0 .1-.1 0 0 0-.3-.2-.5-.2-.6.1-.3.2 0 .2-.4v-.4V4c0-.3.1-.6.1-.9.2-.7.3-.8 1-.9.3 0 .6-.1.8-.4.2-.3.3-.4.6-.8H99l-3 .1-2.6-.1h-1.8c.3.3.5.6.8.8.1.2.4.4.7.3.7 0 .7.1.9.9.1 1 .2 2.1.2 3.1v6.2c0 .3.3.4.3.6-.2.5-.3 1-.3 1.5v2.4c0 .7 0 1.3-.1 1.8 0 .2 0 .3-.1.5-.2.7-.3.9-1 .9-.3 0-.6.1-.8.4-.2.3-.5.5-.8.8H94l2.1-.1 3 .1h2.4l-.8-.8c-.3-.4-.5-.3-1-.4-.7 0-.8-.1-1-.9 0-.2-.1-.5-.1-.8v-1.1-.8-7.6-2.6c-.2-.2-.2-.4-.2-.6z"/></svg>';

    public $age4 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 98 22"><path d="M74.8 5.6s0-.1 0 0c0-.3-.2-.5-.2-.6.1-.3.2 0 .2-.4v-.4V4c0-.3.1-.6.1-.9.2-.7.3-.8 1-.9.3 0 .6-.1.8-.4.2-.3.3-.4.6-.8h-1.9l-3 .1-2.7-.1H68c.3.3.5.6.8.8.1.2.4.4.7.3.7 0 .7.1.9.9.1 1 .2 2.1.2 3.1v6.2c0 .3.3.4.3.6-.2.5-.3 1-.3 1.5v2.4c0 .7 0 1.3-.1 1.8 0 .2 0 .3-.1.5-.2.7-.3.9-1 .9-.3 0-.6.1-.8.4-.2.3-.5.5-.8.8h2.6l2.1-.1 3 .1h2.4l-.8-.8c-.3-.4-.5-.3-1-.4-.7 0-.8-.1-1-.9 0-.2-.1-.5-.1-.8v-1.1-.8-7.6-2.6c-.2-.2-.2-.4-.2-.6zm-52.1 8c.1-.2.2-.3.2-.5V13c-.2-.3-.3-.7-.4-1.1-.1-2.1.4-4.2 1.5-6.1.2-.4.4-.7.7-1 .4-.5.8-1 1.3-1.5.5-.4 1.1-.7 1.7-1s1.2-.6 1.9-.8c1.3-.4 2.7-.6 4.1-.7 1.8-.1 3.6.1 5.3.4.8.1 1.6.3 2.4.4.3.1.6.4.6.7v.6c0 .2-.5.2-.5.2.1.2.3.4.5.6v.2c0 1-.1 2-.1 3v.2c-.7 0-1.1-.3-1.2-.9-.1-1-.7-1.9-1.7-2.5s-2.1-.9-3.2-1c-1.4-.2-2.9-.2-4.4.2-.8.2-1.6.6-2.2 1.1-1.2 1.1-2 2.4-2.2 3.9-.6 2.5-.3 5.2.9 7.5.3.7.8 1.3 1.3 1.8.9 1 2.1 1.7 3.3 2.1.6.2 1.3.3 2 .4.9.1 1.8.1 2.7-.1.2 0 .3-.1.5-.1.3 0 .4-.3.4-.5v-1c-.1-.6-.1-1.2 0-1.8.1-.7.1-1.5 0-2.2 0-.3 0-.7-.1-1 0-.3-.3-.6-.6-.6-.3-.1-.7-.1-1.1-.1-.1 0-.3 0-.4-.2-.2-.3-.5-.6-.8-.9h9l-.7 1c-.1.1-.1.1-.2.1h-.3c-.9.1-1.2.4-1.1 1.3.1.5.1 1 0 1.5-.1.8-.1 1.6 0 2.3v2.1c.1.5-.3.9-.7.9H41c-.9.2-1.8.4-2.7.7-2.3.6-4.7.7-7.1.3-1.8-.3-3.5-1-5-2-.3-.2-.5-.4-.8-.6l-.1-.1c-.1 0-.1-.3-.2-.4s-.4-.1-.5-.3c-.8-1-1.4-2.1-1.8-3.3.2-.4.4-.4-.1-.5.1-.2 0-.4 0-.6zm-17.5.7c.2-.5.5.1.5-.7v-.1c0-.1 0-.3.1-.4.1-.3.3-.6.5-.9l1.5-3.3c.2-.7.5-1.3.7-2 .7-1.4 1.3-2.9 1.9-4.3.3-.9.8-1.6 1.6-2.2l.1-.1.6 1.5 1 2.5 3.3 8.1.6 1.4c.1.2.1.3.1.5 0 .1-.2.2-.2.3.1.1.3.1.5.2.5 1.2 1 2.4 1.5 3.5.1.2.2.4.4.6.4.7 1.1 1.2 1.9 1.1.3 0 .6.1.8.4.1.2.3.4.5.7h-8.2c.3-.4.6-.8 1-1.1.2-.1.1-.3 0-.4-.4-1-.8-2.1-1.2-3.1l-.9-2.4c0-.2-.2-.3-.4-.3H8.6c-.1 0-.3.1-.3.2-.6 1.6-1.3 3.3-1.8 5-.2.8-.1 1 .7.9.3 0 .5.1.7.3.2.3.4.5.6.8H.2c.2-.3.4-.7.7-1 0-.1.1 0 .2 0 .3 0 .7-.1 1-.2.1 0 .1 0 .2-.1.5-.6 1-1.3 1.3-2 .6-1 1.1-2.2 1.6-3.4zm7.9-2l-2-5.2L9 12.2l4.1.1zm35.6 2.2c0-.2.3-.2.3-.3 0-.1-.3-.1-.3-.3 0-2.2.1-4.4.1-6.6 0-1.3 0-2.6-.1-3.8 0-.8-.3-1.1-1.1-1.1-.6.1-1.1-.2-1.5-.7l-.5-.5h11.8c.4 0 .9 0 1.3-.2.3-.1.6 0 .7.3.1.1.1.2 0 .4 0 .6-.1 1.2-.2 1.8 0 .7-.1 1.5-.2 2.3L58 5c-.1-.1 0-.2 0-.2 0-1-.3-1.3-1.3-1.4-1-.1-2-.2-3-.1h-.9v6.3h2.1c.2 0 .4 0 .6-.1.3 0 .6-.2.8-.4.1-.2.2-.4.5-.2s.5.3.4.6c0 .5-.1 1.1-.1 1.6-.1.9-.2 1.8-.2 2.7v.1l-.9-.4c-.1-.1-.1-.1-.1-.2v-.5c-.1-.7-.3-1-1-1.1-.6-.1-1.3-.1-1.9-.1V14c0 1.2.1 2.4.1 3.6 0 .3 0 .6.1.9s.3.6.7.7c.9.2 1.7.2 2.6.1.4 0 .7 0 1.1-.1.7-.1 1.3-.6 1.4-1.3.1-.5.4-.9.9-1.2.2-.1.3-.2.6-.4v.4l-.6 3.6c0 .2 0 .5-.1.7s-.1.3-.3.2-.2 0-.3 0H46.1c.3-.3.5-.6.8-.8.2-.2.5-.4.8-.4.7 0 .8-.1 1-.9.1-1 .2-2.1.2-3.1-.2-.4-.2-1-.2-1.5zM97.6 1h-.2c-.7 0-2.2.1-2.5.1S93.7 1 92.6 1h-1-.1c0 .2.2.4.4.6.3.2.5.3.8.4.4.1.4.7.3 1.2-.8 2.6-3 9-4 11.4-1-3.1-2.4-7.1-3.5-10.3-.2-.6-.4-1.2-.5-1.9.2-.4.7-.4 1-.5.4-.1.7-.5.8-.9h-8.4c.2.3.3.5.4.7.2.3.5.5.8.4.3 0 .6 0 .8.2.2.2.3.3.4.6.1.2.2.5.3.8L87 20c.4 1.2.6 1.6.9 1.6s.5-.4 1.2-1.9c.6-1.4 1.5-3.8 3-7.6 1.3-3.4 2.1-5.5 3-7.8.2-.6.4-1.1.6-1.4.3-.5.8-.8 1.4-1H97.4c.2-.2.3-.5.5-.7-.1-.2-.2-.2-.3-.2z"/></svg>';

    public $myth = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 82 22"><path d="M4.1 12.6c0-.2.2-.2.2-.4v-.1c0-.1 0-.2-.1-.4l1.2-10c.1-.9.2-1.3.2-1.3s.7 0 1.2 1.3l3.4 6.6c.2.6.6 1.2.9 1.8l2.1 4.1 6.1-12.6c.2-.4.6-.8 1-1.1l.3 1.2v.4c0 .1-.1.3-.1.4v.1c.1.3 0 .6.2.9L22 14.2c0 .1-.2.2-.2.3.1.1.1.3.2.4l.1 1.3c.1 1.1.3 2.2.5 3.3 0 .2.1.4.3.6.3.2.6.3 1 .2.7 0 1.2.8 1.6 1.2h-.8c-1.9 0-3.1 0-5.3-.1h-2v-.1c.1-.2.1-.5.3-.7.2-.2.3-.1.5-.2.4-.3.4-.6.4-1v-.3l-.7-9.2-4 8.9c-.1.1-.2.1-.3.3v.1c0 .1.1.2.1.3l-.2.4c-.6 1.4-1.1 1.6-1.1 1.6l-.9-1.5c-.5-.7-.9-1.6-1.3-2.4 0-.1.1-.3.1-.4v-.1c-.1-.1-.3-.1-.4-.3-.5-1.1-1.1-2.3-1.6-3.3-.4-.9-1.3-2.8-1.6-3.5l-.5 6.9c-.1.7-.3 1.9 0 2.6.2 1.2 1.2.3 1.6 1.1-.1.5.1.8.3 1h-.7c-.7 0-1.5-.1-2.2-.1 0 0 .1 0 0 0H3c-.6 0-.9 0-1.6.1H.7l.7-.8c.1-.1.3-.4.3-.4h.5c.4 0 .6 0 .8-.2.2-.6.4-1.3.4-2l.7-5.6zM35.5.9h6.3c-.1.3-.3.5-.5.7H41c-.6.2-1 .5-1.4 1l-.3.4c-1.6 3-3 6-4.3 9-.2.8-.3 1.7-.3 2.6v4.1c0 .3.1.5.1.8.1.8.6.8 1.2.9.7.2 1.1.7 1.6 1.2H27.7c.3-.3.5-.6.8-.8.7-.7 1.6-.1 1.8-1.3 0-.9.1-1.8.1-2.7v-1.1c.1-.2.2-.5.3-.8 0-.3-.2-.6-.3-.9 0-.8-.3-1.6-.6-2.4-.5-1.1-1.2-2.7-2-4.2v-.1V7c-.1-.1-.2-.1-.2-.2v-.1c0-.1-.1-.3-.2-.3-.4-.8-.8-1.5-1-2-.1-.1-.1-.2-.2-.3 0-.1-.1-.2-.1-.3-.2-.3-.3-.5-.4-.8h-.1c-.1-.2-.2-.5-.4-.7-.2-.2-.5-.3-.8-.2-.3 0-.6-.1-.8-.4 0-.1-.1-.1-.1-.1-.1-.2-.2-.3-.4-.5H31.2c-.3.4-.6.8-1 1.1 0 0-.1 0-.1.1-.1.1 0 .2 0 .3 0 .2.1.3.2.4l.4 1c0 .1-.2.1-.2.1.3.3.5.6.7.9.9 2 2.2 4.8 2.4 5.3 1.6-3.7 2.5-5.7 2.9-6.8.2-.4.3-.8.4-1.3v-.1c0-.1 0-.1-.1-.1l-.1-.1c-.3 0-.5-.1-.7-.3-.2-.1-.4-.4-.5-.7-.1 0 0 0 0 0zM78.4 4.7c-.5.8 0 1.1 0 1.9v9.2c-.6.2-.7.2-.5.6.3.5.5.5.5 1.1v.1c0 .4 0 .8.1 1.1 0 .2 0 .4.1.6.3 1.2 1.4.5 2 1.3.2.3.5.5.8.8H71.6c.5-.5.6-1.1 1.4-1.2.7-.1.9-.1 1.1-.9 0-1.9.1-3.7.1-5.6v-2.1c0-.1-.1-.2-.1-.2h-6.6c-.1 0-.2 0-.2.2v2c0 1.3.1 2.6.1 3.9v.5c0 .3 0 .6.1 1v.1c0 .2 0 .3.1.5.2 1.3 1.3.4 1.9 1.3.2.3.5.5.8.8H60.5c.3-.3.5-.6.8-.8.7-.7 1.6-.1 1.8-1.3 0-.1 0-.3.1-.4v-.1c0-.4 0-.8.1-1.3v-.1c0-.9 0-1.9.1-2.8.1-.5.6-2.1-.1-2.3V8.9 6.1c0-1 0-2-.2-3.1-.1-.7-.3-.8-1-.9-.3 0-.6-.1-.8-.3-.2-.3-.5-.5-.8-.8H69.9c-.3.3-.5.6-.8.8-.2.2-.5.4-.8.3-.7 0-.6.1-.7.9-.1.4-.1.8-.1 1.3 0 .3-.2.7-.2.9v.1c.1.2.2.4.2.6V9c0 .2.1.2.2.2H74c.1 0 .2 0 .2-.2v-.5c0-1.8.2-3.7-.2-5.5-.2-.7 0-.8-.7-.9-.3 0-.6-.1-.8-.3-.2-.3-.5-.5-.7-.8h.7c1.2-.1 2.4 0 3.6 0 1.2 0 2.4-.1 3.7-.1h1.4c-.3.3-.5.6-.8.8-.3.9-1.7 0-1.9 1.3-.1.6-.1 1.1-.1 1.7zM48.7 18.1c0-.3.3-.4.2-.8 0-.1-.3-.4-.2-.5l-.1.1c-.1-.1 0-1.2 0-1.4V3.1c-.8 0-2.3 0-3.4.1-.3 0-.7.1-1 .2-.7.5-.5.9-.6 1.7l-.5.4-.5.3c0-.5 0-1 .1-1.5l.3-.7v-.1c.1-.8.2-1.6.3-2.3 0-.8.5-.5 1-.4.8.1 1.7.2 2.5.2h10c.4 0 .9 0 1.3-.1.2-.1.5-.1.7-.2.4 0 .2.7.2.9 0 .2 0 .4-.1.6-.1.1-.3.2-.3.4s.5.2.5.5c.1.8.2 1.7.2 2.5-.3-.3-.6-.5-1-.7 0-.4-.1-.8-.2-1.1-.3-.3-.7-.5-1.2-.5-.8-.1-2-.2-3.8-.2v5.1c-.2.3-.3.6-.2 1 0 .6.1 1.2.2 1.9V18.6c0 .2.1.5.1.7.2.8.6.7 1.3.9.7.2 1.1.7 1.6 1.2h-9.9c.3-.3.5-.6.8-.8.8-.8 1.5-.1 1.8-1.3 0-.2.1-.4.1-.6-.2-.1-.2-.3-.2-.6z"/></svg>';

}
