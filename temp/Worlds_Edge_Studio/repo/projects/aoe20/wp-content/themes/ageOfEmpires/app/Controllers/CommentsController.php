<?php

namespace App\Controllers;

class CommentsController
{

    public $comment_number = 10;

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
        add_action('wp_ajax_post_comment', [$this, 'post_comment']);
        add_action('wp_ajax_nopriv_post_comment', [$this, 'post_comment']);
        add_action('wp_ajax_load_comments', [$this, 'load_comments']);
        add_action('wp_ajax_nopriv_load_comments', [$this, 'load_comments']);
        add_action('wp_ajax_delete_comment', [$this, 'delete_comment']);
        add_action('wp_ajax_nopriv_delete_comment', [$this, 'delete_comment']);
    }

    public function get_comments($post_id)
    {
        $args = array(
            'number' => $this->comment_number,
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

        $d = Carbon::now();

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
            'comment_date' => $d,
            'comment_approved' => 1,
        );

        $comment_ID = wp_insert_comment($comment);

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


}
