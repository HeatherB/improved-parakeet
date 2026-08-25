<?php
/**
 * Template Name: Cookie Cutter
 * Clears all domain cookies
 *
 */

$redirect = $_GET['redirect'];

$cookies_cleared = false;
?>

@extends('layouts.base')

@section('content')
    <section class="content">
        <div class="substance teasers">
            <p>
                <ul>
            <?php
            if (isset($_SERVER['HTTP_COOKIE'])) {
                $cookies = explode(';', $_SERVER['HTTP_COOKIE']);
                foreach($cookies as $cookie) {
                    $parts = explode('=', $cookie);
                    $name = trim($parts[0]);
                    setcookie($name, '', time()-1000);
                    setcookie($name, '', time()-1000, '/');
                    $cookies_cleared = true;
                    echo  "<li>Cookie Unset: " . $name . "</li>";
                }
            }
            session_destroy();
            if(!empty($redirect)){
                wp_redirect($redirect);
            }
            ?>
                </ul>
            </p>

        </div>>
    </section>

@endsection
