{{-- !!temp!! this whole file is just for testing --}}
@extends('layouts.app')

@section('content')

<section>
	<div class="page-container">
		<h2>This is a test page for testing</h2>

		<?php 
			$icon = "forum"; 
			$path = 'images/ui/icons/forum.svg';
			$class= "icon";
		?>

		1. {{icon($icon, $class)}}
		2. {{svg('images/defaults/default-avatar.svg', 'alt="avatar"')}}
	</div>
</section>

@endsection

