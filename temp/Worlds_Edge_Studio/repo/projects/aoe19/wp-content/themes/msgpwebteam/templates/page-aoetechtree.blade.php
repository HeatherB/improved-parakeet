@extends('layouts.hero')
@section('content')

    <section id="aoe-civs" class="background--rock">

        <div id="aoe-civs-banner">
            <h1>Age of Empires Civilization Bonuses</h1>
        </div>
        <div class="section--divider-egypt-mid"></div>
        <div class="content section--padding-bottom">

            <?php

            // set args for tech tree civilizations list
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

            <div id="aoe-civs-list-frame-wrapper">
                <div class="aoe-civs-list-frame border-outside">
                    <div class="aoe-civs-list-frame background">
                        <div class="aoe-civs-list-frame border-inside">
                            <div class="aoe-civs-list-frame content">

                                <?php

                                // ------------------------------------------------------
                                // if there is tech tree data
                                // build the list of civilizations
                                // ------------------------------------------------------
                                if ( $query->have_posts() ) :

                                    echo('<ul id="aoe-civs-list">');

                                    // start loop
                                    while ($query->have_posts()) : $query->the_post();

                                        // get data civilization
                                        $tech_tree_civilization = get_field('tech_tree_civilization');
                                        $tech_tree_civilization_value = $tech_tree_civilization['value'];
                                        $tech_tree_civilization_label = $tech_tree_civilization['label'];
                                        $tech_tree_civilization_map_background = get_field('tech_tree_civilization_map_background');
                                        $tech_tree_civilization_map_background_url = $tech_tree_civilization_map_background['url'];

                                        // insert tech tree tab with active class (if first item) and the civ data and label value
                                        echo('<li class="aoe-civs-list-item" style="background-image: url(' . $tech_tree_civilization_map_background_url . ');">');
                                        echo('    <a href="' . get_permalink() . '" class="content">');
                                        echo('        <div class="civ-name">' . $tech_tree_civilization_label . '</div>');
                                        echo('        <ul class="civ-bonuses">');

                                        // check if the tech_tree_civilization_bonuses repeater field has rows of data
                                        if( have_rows('tech_tree_civilization_bonuses') ):
                                            // loop through the tech_tree_civilization_bonuses rows of data
                                            while ( have_rows('tech_tree_civilization_bonuses') ) : the_row();
                                                // get the tech_tree_civilization_bonus sub field value
                                                $tech_tree_civilization_bonus = get_sub_field('tech_tree_civilization_bonus');
                                                echo ('<li class="civ-bonus"><span>' . $tech_tree_civilization_bonus . '</span></li>');
                                            endwhile;
                                        else :
                                            echo ('<li data-civ-bonus="No civilization bonuses"></li>');
                                        endif;

                                        echo('        </ul>'); // end ul.civ-bonuses
                                        echo('    </a>'); // end .content
                                        echo('    <div class="border-bottom"></div>');
                                        echo('</li>'); // end aoe-civs-list-item


                                    endwhile; // end while loop $query->have_posts

                                    echo('</ul>'); // end #aoe-civs-list

                                endif; // $query have_posts() for aoe civs list

                                ?>

                            </div><!-- // end aoe-civs-list-frame content -->
                        </div><!-- //end aoe-civs-list-frame border-inside -->
                    </div><!-- //end aoe-civs-list-frame background -->
                </div><!-- //end aoe-civs-list-frame border-outside -->
            </div><!-- //end aoe-civs-list-frame-wrapper -->

        </div><!-- //end content section--padding-bottom -->
    </section>


@endsection




