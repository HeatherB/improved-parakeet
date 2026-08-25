<?php

namespace App\Controllers;

use WP_Query;
use HTMLPurifier;

class NewsController
{

    private $Comments;

    public $default_args = array(
        "post_type" => 'post',
        "post_status" => 'publish',
        "posts_per_page" => 6,
        "paged" => '',
    );

    public function __construct()
    {
        add_filter('sage/template/blog/data', [$this, 'news_roll']);
        add_filter('sage/template/archive/data', [$this, 'archive_page']);
        add_filter('sage/template/home/data', [$this, 'home_data']);
        add_filter('sage/template/tax-game/data', [$this, 'tax_data']);
        add_filter('sage/template/category/data', [$this, 'cat_data']);
        add_filter('sage/template/single-post/data', [$this, 'single_posts']);
        add_filter('sage/template/page-template-page-mods-single-blade/data', [$this, 'page_posts']);
        add_filter('query_vars', [$this, 'prefix_register_query_var']);
        add_filter('sage/template/single-games/data', [$this, 'game_data']);

        add_action('wp_ajax_get_ajax_posts',[$this,'get_ajax_posts']);
        add_action('wp_ajax_nopriv_get_ajax_posts',[$this,'get_ajax_posts']);

        $this->Comments = new \App\Controllers\CommentsController();
    }

    public function prefix_register_query_var($vars)
    {
        $vars[] = 'game';
        return $vars;
    }

    public function home_data()
    {
        $this->default_args['posts_per_page'] = 4;
        $data = $this->news_roll();
        return $data;
    }

    public function get_ajax_posts()
    {

        $this->default_args['post_type'] = $_REQUEST['data']['post_type'];
        $data = $this->news_roll();
        echo json_encode($data);
        wp_die();
    }

    public function archive_page(){
        $this->default_args['post_type'] = get_post_type();
        $data = $this->news_roll();
        return $data;
    }

    public function game_data()
    {
        $game_id = get_the_ID();
        $title = get_the_title(get_the_ID());
        $game_slug = '';
        if ($title == 'Age of Empires II HD') :
            $game_slug = 'aoeii';
        elseif ($title == 'Age of Empires II: Definitive Edition') :
            $game_slug = 'aoeiide';
        elseif ($title == 'Age of Empires III') :
            $game_slug = 'aoeiii';
        elseif ($title == 'Age of Empires IV') :
            $game_slug = 'aoeiv-na';
        // no game post to show yet - change to aoeiv when post added
        elseif ($title == 'Age of Mythology') :
            $game_slug = 'aoem';
        elseif ($title == 'Age of Empires: Definitive Edition') :
            $game_slug = 'aoe';
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
        $category_id = get_query_var('cat');
        $this->default_args['cat'] = $category_id;
        $data = $this->news_roll();
        return $data;
    }

    public function news_roll($game_page_slug = '')
    {
        $game_id = get_the_ID();
        $title = get_the_title(get_the_ID());
        $game_slug = '';
        if ($title == 'Age of Empires II HD') :
            $game_slug = 'aoeii';
        elseif ($title == 'Age of Empires II: Definitive Edition') :
            $game_slug = 'aoeiide';
        elseif ($title == 'Age of Empires III') :
            $game_slug = 'aoeiii';
        elseif ($title == 'Age of Empires IV') :
            $game_slug = 'aoeiv';
        elseif ($title == 'Age of Mythology') :
            $game_slug = 'aoem';
        elseif ($title == 'Age of Empires: Definitive Edition') :
            $game_slug = 'aoe';
        endif;
        $tax = get_query_var('game', $game_page_slug) ?? null;
        $category_id = get_query_var('cat') ?? null;
        $news_home = get_site_url() . "/" . $this::get_post_type_slug();
        $current_base = $news_home;
        $paged = (get_query_var('paged')) ? get_query_var('paged') : 1;
        if ($category_id) :
            $category_id = (int)$category_id;
            $category = get_category($category_id);
            $current_base = $current_base . "/category/" . strtolower($category->slug);
        endif;
        if ($tax == "aoeii" || $tax == "aoeiide") {
            $this->default_args['tax_query'] = array(
                array(
                    'taxonomy' => 'game',
                    'field' => 'slug',
                    'terms' => array("aoeii", "aoeiide"),
                ),
            );
        } else if ($tax == "aoeiii" || $tax == "aoeiiide") {
            $this->default_args['tax_query'] = array(
                array(
                    'taxonomy' => 'game',
                    'field' => 'slug',
                    'terms' => array("aoeiii", "aoeiiide"),
                ),
            );
        } else if (!empty($tax)) {
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
            'featured_image',
            'tax',
            'date',
            'author',
            'ID'
        ];
        $this->default_args['paged'] = $paged;
        $news_query = new WP_Query($this->default_args);
        $data = [];
        $temp = [];
        while ($news_query->have_posts()) : $news_query->the_post();
            foreach ($wp_fields as $field) {
                global $post;
                $temp[$field] = call_user_func_array(array($this, $field), array($post->ID, $paged));
            };
            $data['news_posts'][] = $temp;
        endwhile;

        $total_pages = $news_query->max_num_pages;
        if ($paged > ($total_pages - 2)) :

        else:
            $show_last_nav = true;
        endif;
        if ($paged > 3 && $total_pages > 4 && $paged < ($total_pages - 2) && $total_pages > 3) :
            $show_first_nav = true;
            $show_last_nav = true;
            $arr_page_range = [$paged - 1, $paged, $paged + 1];
        elseif ($paged >= ($total_pages - 2) && $total_pages > 3) :
            $show_first_nav = true;
            $show_last_nav = false;
            $arr_page_range = [$total_pages - 3, $total_pages - 2, $total_pages - 1];
        elseif ($paged <= 3 && $total_pages > 4) :
            $arr_page_range = [2, 3, 4];
            $show_first_nav = false;
            $show_last_nav = true;
        elseif ($total_pages == 4) :
            $arr_page_range = [2, 3];
            $show_first_nav = false;
            $show_last_nav = false;
        elseif ($total_pages == 3) :
            $arr_page_range = [2];
            $show_first_nav = false;
            $show_last_nav = false;
        elseif ($total_pages == 2) :
            $arr_page_range = [];
            $show_first_nav = false;
            $show_last_nav = false;
        elseif ($total_pages == 1) :
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
        $data['featured_post'] = (isset($data['news_posts']) && is_array($data['news_posts'])) ? $data['news_posts'][0] : null;

        return $data;

    }

    public function get_post_type_slug(){
        $post_type = get_post_type();

        $post_type_data = get_post_type_object($post_type);
        $post_type_slug = $post_type_data->rewrite['slug'] ?? 'news';

        return $post_type_slug;
    }

    public function single_posts()
    {
        $user = wp_get_current_user();
        $post_id = get_the_ID();
        $tax = get_the_terms($post_id, 'game');
        $terms = [];
        if ($tax) :
            foreach ($tax as $term) {
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
        if ($categories) :
            foreach ($categories as $cat) {
                array_push($cats, $cat->term_id);
            }
        endif;
        $this->default_args['category__in '] = $cats;
        $this->default_args['posts_per_page'] = 3;
        $data['related'] = $this->news_roll();
        $data['user_avatar'] = get_avatar($user->user_email, 100);
        $data['comment_count'] = $this->Comments->comment_count($post_id);
        $data['author_avatar'] = \App\author_avatar();
        $data['author_display_name'] = \App\author_display_name();
        $data['author_link'] = \App\author_link();
        $data['author_title'] = \App\author_title();
        $data['author_projects'] = \App\author_projects();
        $data['post_date'] = get_the_date('F j, Y', $post_id);
        $data['post_id'] = $post_id;
        $data['comments'] = $this->Comments->get_comments($post_id);
        $data['comment_number'] = $this->Comments->comment_number;

        return $data;
    }

    public function page_posts()
    {
        $post_id = get_the_ID();
        $user = wp_get_current_user();
        // Pattern to check for page type and incoming ID
        $modsPattern = 'mods/details/';
        $uri = $_SERVER['REQUEST_URI'];

        // If Mods Page
        if (strpos($uri, $modsPattern)) {

            $mod = (int)basename($uri);
            //Check for existing mod
            $modObj = \Roots\Mods\ModsMain::check_mod_obj($mod);

            if (!empty($modObj)) {
                $post_id = $modObj;
            }

        }

        $data['user_avatar'] = get_avatar($user->user_email, 100);
        $data['comment_count'] = $this->Comments->comment_count($post_id);
        $data['author_avatar'] = \App\author_avatar();
        $data['author_display_name'] = \App\author_display_name();
        $data['author_link'] = \App\author_link();
        $data['author_title'] = \App\author_title();
        $data['author_projects'] = \App\author_projects();
        $data['post_date'] = get_the_date('F j, Y', $post_id);
        $data['post_id'] = $post_id;
        $data['comments'] = $this->Comments->get_comments($post_id);
        $data['comment_number'] = $this->comment_number;

        return $data;
    }

    public function headline($post_id)
    {
        $title = get_the_title($post_id);
        return $title;
    }

    public function tax($post_id)
    {

        $tax = get_the_terms($post_id, 'game');
        $data = [];
        $temp = [];
        $count = 0;
        if ($tax) :
            foreach ($tax as $item) {
                $count++;
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
        if ($categories) :
            foreach ($categories as $cat) {
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

        $line = preg_replace_callback("/(&#[0-9]+;)/", function ($m) {
            return mb_convert_encoding($m[1], "UTF-8", "HTML-ENTITIES");
        }, $excerpt);
        if (preg_match('/^.{1,' . $limit . '}\b/s', $line, $match)) {
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
        for ($i = 0; $i < count($cats_obj); $i++) {
            $temp[$cats_obj[$i]->cat_ID] = [];
            $temp[$cats_obj[$i]->cat_ID]['name'] = $cats_obj[$i]->cat_name;
            $temp[$cats_obj[$i]->cat_ID]['link'] = get_category_link($cats_obj[$i]->cat_ID);
        }
        $cats = $temp;
        return $cats;
    }

    public function featured_image($post_id)
    {
        return get_the_post_thumbnail($post_id,'full');
    }

    public function current_page($post_id, $paged)
    {
        return $paged;
    }
}
