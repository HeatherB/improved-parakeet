<?php

$default_args = array(
  	"post_type" => 'games',
  	"post_status" => 'publish',
  	"posts_per_page" => -1,
  	"meta_key"	=> 'game_info_radio_button_value',
	"orderby"	=> 'meta_value',
  	"order" => 'ASC',
);

$games = new WP_Query($default_args);

$data = '<option value="all"  selected>All Games</option>';

while ($games->have_posts()) : $games->the_post();
  $data .= '<option value="' . get_field('game_info_radio_button_value') . '">' . get_the_title() . '</option>';
endwhile;

echo $data;
