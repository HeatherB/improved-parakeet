<?php
/**
 * Template Name: D365 Steam Login
 * Capture Steam Info for D365
 *
 */

if(isset($_GET['link_steam'])){
    header(\Roots\Insiders\Insider::login_steam());
}

if($_GET['action'] === "login_steam" && $_GET['success'] ){
    echo "<script>window.close();</script>";
}


?>

