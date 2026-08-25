<?php
/**
 * Template Name: Survey Errors
 *
 */

$error = $_GET['error_msg'];
?>

@extends('layouts.base-alt')

@section('content')
    @include('partials.banner')

    @if($error == 'no_xbl')
        @include('partials.survey-invalid-sign-in')
    @endif

@endsection