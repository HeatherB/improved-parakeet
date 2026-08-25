<?php

namespace App\Controllers;

use WP_Query;

class GamesController
{

    public function __construct()
    {
        add_filter('sage/template/single-games/data', [$this, 'single_game_data']);
        add_filter('sage/template/post-type-archive-games/data', [$this, 'archive_data']);
    }

    public function single_game_data()
    {
        global $post;

        $background_image = get_field('background_image', $post->ID);
        $data['game']['background_image'] = $background_image;
        return $data;
    }

    public function archive_data()
    {
        $data['featured_game'] = $this->archive_featured_game();
        $data['games'] = $this->archive_games();
        return $data;
    }

    public function archive_featured_game()
    {
        $featured_game = get_field('featured_game', 'option');
        $featured_game_image = get_field('featured_game_image', 'option');
        $featured_game_title = get_field('featured_game_title', 'option');
        $data['title'] = $featured_game->post_title;
        $data['featured_title'] = $featured_game_title;
        $data['image'] = $featured_game_image;
        return $data;
    }

    public function archive_games()
    {
        $wp_fields = [
            'headline',
            'excerpt',
            'permalink',
            'featured_image',
            'date_available'
        ];
        $data = [];
        $temp = [];
        if (have_rows('archive_games', 'option')):
            while (have_rows('archive_games', 'option')): the_row();
                foreach ($wp_fields as $field) {
                    $post = get_sub_field('game');
                    $temp[$field] = call_user_func_array(array($this, $field), array($post->ID));
                };
                $data[] = $temp;
            endwhile;
        endif;
        return $data;
    }

    function date_available($post_id)
    {
        $date_available = get_field('date_available', $post_id);
        return $date_available;
    }

    function featured_image($post_id)
    {
        $featured_image = get_the_post_thumbnail_url($post_id);
        return $featured_image;
    }

    function headline($post_id)
    {
        $title = get_the_title($post_id);
        return $title;
    }

    function excerpt($post_id)
    {
        $excerpt = get_the_excerpt($post_id);
        $line = preg_replace_callback("/(&#[0-9]+;)/", function ($m) {
            return mb_convert_encoding($m[1], "UTF-8", "HTML-ENTITIES");
        }, $excerpt);
        if (preg_match('/^.{1,260}\b/s', $line, $match)) {
            $line = $match[0];
            $line .= "...";
        }
        return $line;
    }

    function permalink($post_id)
    {
        $permalink = get_the_permalink($post_id);
        return $permalink;
    }


}