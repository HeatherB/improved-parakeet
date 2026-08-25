<?php

namespace Roots\Controllers;

class LearnToPlayController
{

    public function __construct()
    {
        add_filter('sage/template/learn_to_play-template-default/data', [$this, 'learn_to_play']);

        add_action('wp_ajax_update_ltp_progress', [$this, 'update_ltp_progress']);
        //add_action('admin_enqueue_scripts', [$this, 'add_points_to_map_add_js_file']);
        //add_action('admin_footer', [$this, 'add_map_popup']);
        //add_action('acf/render_field/name=map_point_copy', [$this, 'add_points_to_map_contents']);
    }

    public function add_points_to_map_add_js_file() {
        //wp_enqueue_script('map-points-plugin', get_template_directory_uri() . '/assets/scripts/admin-map-points.js', array(), '1.2', true);
        wp_enqueue_script('map-points-plugin', \App\asset_path('scripts/admin-map-points.js'), array(), '1.2', true);
        wp_register_style('mappointsstylesheet', get_stylesheet_directory_uri() . '/assets/styles/admin/ltp/styles.css');
        wp_enqueue_style('mappointsstylesheet');
    }


    public function add_map_popup() {
        $ltp_sections = get_field('sections');
        if($ltp_sections) {
            $map_groups = array_column($ltp_sections, "map_group");
            $map_imgs = array_column($map_groups, "map_img");
            $img_urls = array_column($map_imgs, "url");
        }

        $thispost = get_the_ID();
        $ptype = get_post_type( $thispost );

        if($ptype == 'learn_to_play' && (!empty($img_urls))) {
            echo '<div id="map_point_selection_wrapper" data-thispost="'. $thispost .'">
                <button type="button" id="close_map_point_selection">X</button>
                <p>Click the map to drop your point. Close this window when you are done.</p>
                <div class="scaled_map_image">
                    <img src="'. $img_urls[0] .'" alt="scaled map image" id="scaled_map_image" />
                </div>
            </div>
            <div id="map_sheer"></div>';
        }
    }

    public function add_points_to_map_contents() {
        echo '<button type="button" class="mappoint_btn">Select Map Points</button>';
    }

    public function update_ltp_progress() {
        $returned_data = $_REQUEST['transData'];
        $returned_decode = json_decode(stripslashes($returned_data), true);
        $data['returned_decode'] = $returned_decode;

        $pageID = $returned_decode["pageID"];
        $pointsTitle = 'points';
        $progressPoint = $returned_decode["progressPoint"];
        $completionTitle = 'page_completion';
        $pageCompletion = $returned_decode['pageCompletion'];
        $sectionTitle = 'sections';
        $sectionName = $returned_decode['sectionName'];
        $sectionCompletion = $returned_decode['sectionCompletion'];

        /* get the existing meta */
        if(is_user_logged_in()){
            $user = wp_get_current_user();
            //$data['user'] = $user;

           if(metadata_exists('user', $user->ID, 'ltp_progress')) {
                $ltp_progress = get_user_meta($user->ID, 'ltp_progress', true);

                /* update page completion */
                $ltp_progress[$pageID][$completionTitle] = $pageCompletion;
                /* update section completion */
                $ltp_progress[$pageID][$sectionTitle][$sectionName] = $sectionCompletion;
                /* update point */
                $ltp_progress[$pageID][$pointsTitle][$progressPoint] = 1;
                
                //$data['ltp_progress'] = $ltp_progress;
                update_user_meta( $user->ID, 'ltp_progress', $ltp_progress);
            }
        }


        //header('Content-Type: application/json');
        //echo json_encode($data);
        //var_dump($data);
        //die();
    }

    public function learn_to_play() {
        /*$ltp_sections = get_field('sections');
        $ltp_overview_title = get_field('ltp_overview_title');
        $ltp_lesson_groups = get_field('lesson_group');*/
        $ltp_fields = get_fields();
        $ltp_sections = $ltp_fields['sections'];
        $ltp_overview_title = $ltp_fields['ltp_overview_title'];
        $ltp_lesson_groups = $ltp_fields['lesson_group'];

        if(!empty($ltp_lesson_groups)) {
            foreach($ltp_lesson_groups as $ltp_lesson_group) {
                $related_posts = get_posts(array(
                    'numberposts' => -1,
                    'meta_value' => $ltp_lesson_group
                ));
            }
        }

        /* build related topics navigation */
        $this_post_ID = get_the_ID();
        $this_lesson_group = get_post_meta($this_post_ID, 'lesson_group', true);
        $this_lesson_title = get_post_meta($this_post_ID, 'ltp_overview_title', true);
        $ltp_post_lesson_group = array();

        $whats_my_type = get_post_type($this_post_ID);
        $data['whats_my_type'] = $whats_my_type;

        $ltp_posts = get_posts(array(
            'post_type' => 'learn_to_play',
            'numberposts' => -1,
            //'exclude' => array($this_post_ID),
        ));

        foreach($ltp_posts as $ltp_post) {
          $found_lesson_group = get_post_meta($ltp_post->ID, 'lesson_group', true);
            if($found_lesson_group == $this_lesson_group) {
              $ltp_post_lesson_group[] = array(
                'ID' => $ltp_post->ID,
                'lesson_group' => get_post_meta($ltp_post->ID, 'lesson_group', true),
                'guid' => get_permalink($ltp_post->ID),
                'overview_title' => get_post_meta($ltp_post->ID, 'ltp_overview_title', true),
                'lesson_position' => get_post_meta($ltp_post->ID, 'lesson_position', true),
                'current_lesson' => $this_post_ID == $ltp_post->ID ? 'current_lesson' : '',
              );
            }
        }
        $col = array_column( $ltp_post_lesson_group, 'lesson_position' );
        array_multisort( $col, SORT_ASC, $ltp_post_lesson_group );
        $data['ltp_post_lesson_group'] = $ltp_post_lesson_group;

        /* build in-page anchor navigation */
        $data['sections'] = $ltp_sections;
        $data['ltp_overview_title'] = $ltp_overview_title;
        $data['ltp_lesson_group'] = $ltp_lesson_group;
        $data['related_posts'] = $related_posts;
        $data['this_lesson_title'] = $this_lesson_title;
        $data['this_lesson_position'] = 'lesson_position_' . get_post_meta($this_post_ID, 'lesson_position', true);
        $quick_nav_array = array();
        $progress_headings_array = array();
        $progress_points_array = array();

        if(!empty($ltp_sections)) {
            foreach($ltp_sections as $ltp_section) {
                if(!empty($ltp_section)) {
                    /* map group */
                    if(!empty($ltp_section['map_group']['map_lesson'])) {
                        $lesson_heading_map = preg_replace('/ /', '_', $ltp_section['map_group']['map_lesson']);
                        $lesson_heading_map = strtolower($lesson_heading_map);
                        $quick_nav_array[$lesson_heading_map] = $ltp_section['map_group']['map_lesson'];

                        $progress_headings_array[$ltp_section['map_group']['map_lesson']] = 0;
                        foreach($ltp_section['map_group']['map_points'] as $map_point) {
                            $lesson_points = $map_point['map_point_label'];
                            $progress_points_array[$lesson_points] = 0;
                        }
                    }
                    /* video group */
                    if(!empty($ltp_section['video_group']['video_lesson'])) {
                        $lesson_heading_video = preg_replace('/ /', '_', $ltp_section['video_group']['video_lesson']);
                        $lesson_heading_video = strtolower($lesson_heading_video);
                        $quick_nav_array[$lesson_heading_video] = $ltp_section['video_group']['video_lesson'];

                        $progress_headings_array[$ltp_section['video_group']['video_lesson']] = 0;
                        foreach($ltp_section['video_group']['video_points'] as $video_point) {
                            $lesson_points = $video_point['video_point_label'];
                            $progress_points_array[$lesson_points] = 0;
                        }
                    }
                    /* content group */
                    if(!empty($ltp_section['content_group']['content_lesson'])) {
                        $lesson_heading_section = preg_replace('/ /', '_', $ltp_section['content_group']['content_lesson']);
                        $lesson_heading_section = strtolower($lesson_heading_section);
                        $quick_nav_array[$lesson_heading_section] = $ltp_section['content_group']['content_lesson'];
                    }
                    /* slide group */
                    if(!empty($ltp_section['slides_group']['slide_lesson'])) {
                        $lesson_heading_slides = preg_replace('/ /', '_', $ltp_section['slides_group']['slide_lesson']);
                        $lesson_heading_slides = strtolower($lesson_heading_slides);
                        $quick_nav_array[$lesson_heading_slides] = $ltp_section['slides_group']['slide_lesson'];

                        $progress_headings_array[$ltp_section['slides_group']['slide_lesson']] = 0;
                        foreach($ltp_section['slides_group']['slide_group'] as $slide_point) {
                            $lesson_points = $slide_point['slide_label'];
                            $progress_points_array[$lesson_points] = 0;
                        }
                    }
                }
            }
        }
        $data['quick_nav_array'] = $quick_nav_array;

         /* capture associated_game game by taxonomy slug */
        $args = array('fields' => 'slug');
        $game_tax = wp_get_object_terms( $this_post_ID, 'game' );
        if(!empty($game_tax)) {
            $game_tax = wp_list_pluck( $game_tax, 'slug' );
            foreach($game_tax as $key => $value) {
                $data['associated_game'] = $value;
            }
        } else {
            $data['associated_game'] = 'aoeiide';
        }
       

        /* capture user for progress */
        //$data['page_section_complete'] = 0;
        $data['page_completion'] = 0;
        if(is_user_logged_in()){
            $user = wp_get_current_user();
            $data['user'] = $user;
            $data['this_post_ID'] = $this_post_ID;
            $data['existing_user_meta'] = get_user_meta($user->ID);

            /* if no existing progress, create */
           if(metadata_exists('user', $user->ID, 'ltp_progress')) {
                $ltp_progress = get_user_meta($user->ID, 'ltp_progress', true);
                /* if this post_id not setup yet */
                if(!isset($ltp_progress['ltp_' . $this_post_ID])) {
                    $progress_steps_array = [
                        'ltp_' . $this_post_ID =>  [
                            'page_id' => $this_post_ID,
                            'page_completion' => 0,
                            'sections' => $progress_headings_array,
                            'points' => $progress_points_array,                   
                        ]
                    ];
                    $add_to_meta = array_merge($ltp_progress, $progress_steps_array);
                    update_user_meta( $user->ID, 'ltp_progress', $add_to_meta);
                    $ltp_progress = $add_to_meta;
                }
            }  else {
                $progress_steps_array = [
                    'ltp_' . $this_post_ID =>  [
                        'page_id' => $this_post_ID,
                        'page_completion' => 0,
                        'sections' => $progress_headings_array,
                        'points' => $progress_points_array,                   
                    ]
                ];
                update_user_meta( $user->ID, 'ltp_progress', $progress_steps_array);
                $ltp_progress = $progress_steps_array;
            }
            $data['ltp_progress'] = $ltp_progress;
            $data['page_completion'] = $ltp_progress['ltp_' . $this_post_ID]['page_completion'];
            $data['page_sections'] = $ltp_progress['ltp_' . $this_post_ID]['sections'];
            $data['page_points'] = $ltp_progress['ltp_' . $this_post_ID]['points'];
        }

        return $data;
    }


    
}