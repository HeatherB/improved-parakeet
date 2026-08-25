<?php
/**
 * Template Name: Insider Landing
 * Insider Landing Page.
 *
 */

?>

@extends('layouts.app')

@section('content')

<h2 class="insiders__page__title page__title">
	<span class="page__title__text">
		{{ get_field('page_heading') ? get_field('page_heading') : the_title()}}
	</span>
</h2>	

@endsection