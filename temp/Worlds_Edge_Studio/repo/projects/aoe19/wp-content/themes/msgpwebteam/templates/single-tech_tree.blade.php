@extends('layouts.hero')
@section('content')

    <section id="tech-tree" class="background--rock">

        <div id="tech-tree-banner">
            <h1>Age of Empires: Definitive Edition Tech Tree</h1>
        </div>
        <div class="section--divider-egypt-mid"></div>
        <div class="content section--padding-bottom">

            <?php
            // get data civilization
            $active_tech_tree_civilization = get_field('tech_tree_civilization');
            $active_tech_tree_civilization_value = $active_tech_tree_civilization['value'];
            $active_tech_tree_civilization_label = $active_tech_tree_civilization['label'];
            ?>

            <?php

            // set args for tech tree civilizations
            $args = array(
                    'post_type' => 'tech_tree',
                    'post_status' => 'publish',
                    'posts_per_page' => '-1',
                    'meta_query' => array(
                            "relation" => "AND",
                            array(
                                    'key' => 'tech_tree_display_order',
                                    'compare' => 'EXISTS',
                                    'type' => 'NUMERIC',
                            )
                    ),
                    'orderby' => array(
                            'tech_tree_display_order' => 'ASC',
                            'post_date' => 'ASC'                    // Today, yesterday, day before that, etc.
                    )
            );

            // query hero headers
            $query = new \WP_Query($args);

            ?>

            <div id="tech-tree-frame-wrapper">
                <div class="tech-tree-frame border-outside">
                    <div class="tech-tree-frame background">
                        <div class="tech-tree-frame border-inside">
                            <div class="tech-tree-frame content">

                                <?php
                                    // create tech tree tabs list
                                if ( $query->have_posts() ) :

                                    echo('<ul id="tech-tree-tabs">');

                                    // pre-loop vars
                                    $civ_bonuses_page_url = home_url() . '/aoetechtree';
                                    $civ_active_status = 'inactive';

                                    // start loop
                                    while ($query->have_posts()) : $query->the_post();

                                        // get data civilization
                                        $tech_tree_civilization = get_field('tech_tree_civilization');
                                        $tech_tree_civilization_value = $tech_tree_civilization['value'];
                                        $tech_tree_civilization_label = $tech_tree_civilization['label'];
                                        if($active_tech_tree_civilization_value == $tech_tree_civilization_value) {
                                            $civ_active_status = 'active';
                                            echo('<li class="tech-tree-tab ' . $civ_active_status . '" data-civ="' . $tech_tree_civilization_value . '">' . $tech_tree_civilization_label . '</li>');
                                        } else {
                                            $civ_active_status = 'inactive';
                                            echo('<li class="tech-tree-tab ' . $civ_active_status . '" data-civ="' . $tech_tree_civilization_value . '"><a href="' . get_permalink() . '">' . $tech_tree_civilization_label . '</a></li>');
                                        }

                                    endwhile; // end while loop $query->have_posts

                                    echo('<li class="tech-tree-tab inactive bonuses"><a href="' . $civ_bonuses_page_url . '">Bonuses List</a></li>');

                                    echo('</ul>'); // end #tech-tree-tabs

                                endif; // $query have_posts() for tabs

                                /* Reset Post Data */
                                wp_reset_postdata();

                                ?>

                                <div id="civ-bonus-wrapper">
                                    <div id="bonus-heading">
                                        <span class="civ-name"><?php echo($active_tech_tree_civilization_label); ?></span> Civilization Bonuses
                                    </div>
                                    <ul id="civ-bonus-data">
                                        <?php
                                        // check if the tech_tree_civilization_bonuses repeater field has rows of data
                                        if( have_rows('tech_tree_civilization_bonuses') ):
                                            // loop through the tech_tree_civilization_bonuses rows of data
                                            while ( have_rows('tech_tree_civilization_bonuses') ) : the_row();
                                                // get the tech_tree_civilization_bonus sub field value
                                                $active_tech_tree_civilization_bonus = get_sub_field('tech_tree_civilization_bonus');
                                                echo ('<li><span>' . $active_tech_tree_civilization_bonus . '</span></li>');
                                            endwhile;
                                        else :
                                            echo ('<li data-civ-bonus="No civilization bonuses"></li>');
                                        endif;
                                        ?>
                                    </ul>
                                </div>

                                <div id="tech-tree-info-bar">

                                    <div id="tech-tree-legend">
                                        <ul>
                                            <li class="tb"><span class="color-code"></span><span class="text">Technology
                                                    Building</span></li>
                                            <li class="ntb"><span class="color-code"></span><span class="text">Non-Technology Building</span></li>
                                            <li class="u"><span class="color-code"></span><span class="text">Units</span></li>
                                            <li class="ru"><span class="color-code"></span><span class="text">Research or Upgrade</span></li>
                                            <li class="ur"><span class="color-code"></span><span class="text">Upgrade Requirement</span></li>
                                        </ul>
                                    </div>
                                    <div id="tt-zoom-controls">
                                        <div id="tt-zoom-status">
                                            <div class="percentage">Zoom Level <span class="value">%</span></div>
                                            <div class="status"></div>
                                        </div>
                                        <div id="tt-zoom-in" class="fa fa-search-plus" aria-hidden="true"></div>
                                        <div id="tt-zoom-out"  class="fa fa-search-minus" aria-hidden="true"></div>
                                        <div id="tt-compress" class="fa fa-compress" aria-hidden="true"></div>
                                    </div>

                                </div>



                                <div id="tech-tree-wrapper" class="<?php echo($active_tech_tree_civilization_value); ?>">
                                    <div class="relative-container">
                                        <div id="tech-tree-bkg"></div>
                                        <div id="tech-tree-container" class="transition-style">
                                            <div class="relative-container">
                                                <div id="tech-tree-image">
                                                    <?php
                                                    $active_tech_tree_image = get_field('tech_tree_image');
                                                    $active_tech_tree_image_url = $active_tech_tree_image['url'];
                                                    ?>
                                                    <img src="<?php echo($active_tech_tree_image_url); ?>" />
                                                </div>
                                                <div id="tech-tree-labels">
                                                    <?php echo('<img src="' . get_stylesheet_directory_uri() . '/dist/images/tech-tree/labels-ages.png" />'); ?>
                                                </div>
                                            </div>
                                        </div>
                                    </div>





                                </div>

                            </div><!-- tech-tree-frame content -->
                        </div><!-- tech-tree-frame-wrapper -->
                    </div><!-- tech-tree-frame border-outside -->
                </div><!-- tech-tree-frame background -->
            </div><!-- //end tech-tree-frame border-inside -->

        </div><!-- //end content section-divider section--padding-bottom background--rock -->
    </section>


@endsection




