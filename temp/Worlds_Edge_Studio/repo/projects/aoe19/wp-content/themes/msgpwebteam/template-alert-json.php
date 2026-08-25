<?php
/*
Template Name: In-game Alert Json
*/

 while ( have_posts() ) : the_post(); 
 
 $fields = get_fields();

 endwhile; 
  
 echo json_encode($fields, JSON_PRETTY_PRINT);
 
 ?>