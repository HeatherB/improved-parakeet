<?php

namespace App;

use Roots\Sage\Container;
use Illuminate\Contracts\Container\Container as ContainerContract;

/**
 * Get the sage container.
 *
 * @param string $abstract
 * @param array  $parameters
 * @param ContainerContract $container
 * @return ContainerContract|mixed
 * @SuppressWarnings(PHPMD.StaticAccess)
 */
function sage($abstract = null, $parameters = [], ContainerContract $container = null)
{
    $container = $container ?: Container::getInstance();
    if (!$abstract) {
        return $container;
    }
    return $container->bound($abstract)
        ? $container->make($abstract, $parameters)
        : $container->make("sage.{$abstract}", $parameters);
}

/**
 * Get / set the specified configuration value.
 *
 * If an array is passed as the key, we will assume you want to set an array of values.
 *
 * @param array|string $key
 * @param mixed $default
 * @return mixed|\Roots\Sage\Config
 * @copyright Taylor Otwell
 * @link https://github.com/laravel/framework/blob/c0970285/src/Illuminate/Foundation/helpers.php#L254-L265
 */
function config($key = null, $default = null)
{
    if (is_null($key)) {
        return sage('config');
    }
    if (is_array($key)) {
        return sage('config')->set($key);
    }
    return sage('config')->get($key, $default);
}

/**
 * @param string $file
 * @param array $data
 * @return string
 */
function template($file, $data = [])
{
    return sage('blade')->render($file, $data);
}

/**
 * Retrieve path to a compiled blade view
 * @param $file
 * @param array $data
 * @return string
 */
function template_path($file, $data = [])
{
    return sage('blade')->compiledPath($file, $data);
}

/**
 * @param $asset
 * @return string
 */
function asset_path($asset)
{
    return sage('assets')->getUri($asset);
}

/**
 * Determine whether to show the sidebar
 * @return bool
 */
function display_sidebar()
{
    static $display;
    isset($display) || $display = apply_filters('sage/display_sidebar', false);
    return $display;
}

/**
 * Page titles
 * @return string
 */
function title()
{
    if (is_home()) {
        if ($home = get_option('page_for_posts', true)) {
            return get_the_title($home);
        }
        return __('Latest Posts', 'sage');
    }
    if (is_archive()) {
        return get_the_archive_title();
    }
    if (is_search()) {
        return sprintf(__('Search Results for %s', 'sage'), get_search_query());
    }
    if (is_404()) {
        return __('Not Found', 'sage');
    }
    return get_the_title();
}


function theme_cat_link()
{
    global $post;
    $categories = get_the_category($post->ID);
    return '<a href="' . esc_url( get_category_link( $categories[0]->term_id ) ) . '">' . esc_html( $categories[0]->name ) . '</a>';

}

/**
 * Checks if url submitted is active
 * @param  string  $url String representation of url without domain
 * @return boolean      Boolean return for if link is active or not
 */
function isActive($url)
{
    $match = false;
    // if($_SERVER['REQUEST_URI'] == $url) $match = true;
    if (explode("?", $_SERVER['REQUEST_URI'])[0] == $url) $match = true;
    return $match;
}

/**
 * trims text to a space then adds ellipses if desired
 * @param string $input text to trim
 * @param int $length in characters to trim to
 * @param bool $ellipses if ellipses (...) are to be added
 * @param bool $strip_html if html tags are to be stripped
 * @return string 
 */
function trim_text($input, $length, $ellipses = true, $strip_html = true) {
    //strip tags, if desired
    if ($strip_html) {
        $input = strip_tags($input);
    }
  
    //no need to trim, already shorter than trim length
    if (strlen($input) <= $length) {
        return $input;
    }
  
    //find last space within length
    $last_space = strrpos(substr($input, 0, $length), ' ');
    $trimmed_text = substr($input, 0, $last_space);
  
    //add ellipses (...)
    if ($ellipses) {
        $trimmed_text .= '...';
    }
  
    return $trimmed_text;
}

function author_avatar(){
  global $post;
  $author_url = get_avatar_url($post->post_author, ['size'=>'160']);
  return $author_url;
}

function author_display_name(){
  global $post;
  $author_display_name = get_the_author_meta( 'display_name' , $post->post_author );
  return $author_display_name;
}


function author_title(){
  global $post;
  $author_title = get_field('author_title', 'user_'. $post->post_author );
  return $author_title;
}

function author_projects(){
  global $post;
  $author_title = get_field('projects_worked_with', 'user_'. $post->post_author );
  return $author_title;
}

function author_link(){
  global $post;
  $author_link = get_author_posts_url( get_the_author_meta( 'ID' , $post->post_author), get_the_author_meta( 'user_nicename' , $post->post_author ) );
  return $author_link;
}

function wordpress_numeric_post_nav() {
  if( is_singular() )
    return;
  global $wp_query;
  /* Stop the code if there is only a single page page */
  if( $wp_query->max_num_pages <= 1 )
    return;
  $paged = get_query_var( 'paged' ) ? absint( get_query_var( 'paged' ) ) : 1;
  $max   = intval( $wp_query->max_num_pages );
  /*Add current page into the array */
  if ( $paged >= 1 )
    $links[] = $paged;
  /*Add the pages around the current page to the array */
  if ( $paged >= 3 ) {
    $links[] = $paged - 1;
    $links[] = $paged - 2;
  }
  if ( ( $paged + 2 ) <= $max ) {
    $links[] = $paged + 2;
    $links[] = $paged + 1;
  }
  $post_start = $wp_query->post_count;
  $post_total = $wp_query->found_posts;
  echo '<div class="pagination-container">
<h4 class="pagination-title">Displaying <strong>' . $post_start . '</strong> of <strong>' . $post_total . '</strong></h4>
<ul class="pagination" role="navigation" aria-label="Pagination">' . "\n";
  /*Display Previous Post Link */
//  if ( get_previous_posts_link() )
//    printf( '<li>%s</li>' . "\n", get_previous_posts_link() );
//  /*Display Link to first page*/
  if ( ! in_array( 1, $links ) ) {
    $class = 1 == $paged ? ' class="current"' : '';
    printf( '<li%s><a href="%s">%s</a></li>' . "\n", $class, esc_url( get_pagenum_link( 1 ) ), '1' );
    if ( ! in_array( 2, $links ) )
      echo '<li>…</li>';
  }
  /* Link to current page */
  sort( $links );
  foreach ( (array) $links as $link ) {
    $class = $paged == $link ? ' class="current"' : '';
    printf( '<li%s><a href="%s">%s</a></li>' . "\n", $class, esc_url( get_pagenum_link( $link ) ), $link );
  }
  /* Link to last page, plus ellipses if necessary */
  if ( ! in_array( $max, $links ) ) {
    if ( ! in_array( $max - 1, $links ) )
      echo '<li class="pagination__ellipses">…</li>' . "\n";
    $class = $paged == $max ? ' class="current"' : '';
    printf( '<li%s><a href="%s">%s</a></li>' . "\n", $class, esc_url( get_pagenum_link( $max ) ), $max );
  }
//  /** Next Post Link */
//  if ( get_next_posts_link() )
//    printf( '<li>%s</li>' . "\n", get_next_posts_link() );
  echo '</ul></div>' . "\n";
}


