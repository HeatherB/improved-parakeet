<?php
/**
 * Template Name: Style Guide
 * Testing and reference for site components. Not for use in Prod.
 *
 */

?>

@extends('layouts.app')

@section('content')

<h2 class="page__title" id="SGTop">
	<span class="page__title__text">
		Style Guide
	</span>
</h2>	

<section id="SGAccordion">
	<div class="page-container">
	    <h3 class="section__title">Accordion</h3>

	    <?php 
	    	$test_accordion_content = array(
	    		array(
	    			'title' => 'Basic Accordion',
	    			'content' => 'Test accordion content. Lorem ipsum dolor sit amet consectetur adipiscing elit',
	    		),
	    		array(
	    			'title' => 'Open Accordion With Custom Class',
	    			'content' => 'This accordion should start open. It also has an extra custom class to demonstrate how that works.',
	    			'state' => 'open',
	    			'class' => 'SG__custom-accordion-class'
	    		),
	    		array(
	    			'title' => 'Disabled Accordion',
	    			'content' => 'This accordion is disabled by default, so you probably can\'t see this',
	    			'state' => 'disabled',
	    		),
	    		array(
	    			'title' => 'Content Comes From A Partial',
	    			'content' => 'partials.insider-subscribe',
	    		),
	    		array(
	    			'title' => 'Content Is HTML',
	    			'content' => '<h4>Simulation of html content</h4><p>This is just <a href="#" class="link">typed out</a> as a string, but it\'s similar to what you\'d get from an ACF field or the_content().</p><a href="#SGAccordion" class="button">Button Example</a>',
	    		),
	    	);
	    ?>

	    @foreach($test_accordion_content as $accordion)
	    	@include('partials.components.accordion', [
	    		'title' => $accordion['title'],
	    		'content' => $accordion['content'],
	    		'id' => $loop->index,
	    		'state' => isset($accordion['state']) ? $accordion['state'] : null,
	    		'class' => isset($accordion['class']) ? $accordion['class'] : null,
	    		])
	    @endforeach
	    
	    <a class="link" href="#SGTop">Top</a>
	</div>
</section>

<section id="SGButtons">
	<div class="page-container">
		<h3 class="section__title">Buttons</h3>
		<h4 class="h4">Types</h4>
		<div class="button-group">
			<button class="button">Standard Button</button>
			<button class="hollow-button">Hollow Button</button>
			<button class="cta-button js-cta-button">CTA Button</button>
		</div>
		<h4 class="h4">Color options</h4>
		<div class="button-group">
			<button class="button">Primary Button</button>
			<button class="button --secondary">Secondary Button</button>
			<button class="button --destruct">Destruct Button</button>
		</div>
		<div class="button-group">
			<button class="hollow-button">Primary Hollow</button>
			<button class="hollow-button --secondary">Secondary Hollow</button>
			<button class="hollow-button --destruct">Destruct Hollow</button>
		</div>

		<h4 class="h4">Disabled</h4>
		<div class="button-group">
			<button class="button" disabled>Primary Disabled</button>
			<button class="button --secondary" disabled>Secondary Disabled</button>
			<button class="button --destruct" disabled>Destruct Disabled</button>
		</div>
		<div class="button-group">
			<button class="hollow-button" disabled>Primary Hollow</button>
			<button class="hollow-button --secondary" disabled>Secondary Hollow</button>
			<button class="hollow-button --destruct" disabled>Destruct Hollow</button>
		</div>
		<div class="button-group">
			<button class="cta-button js-cta-button" disabled>Disabled CTA</button>
		</div>

		<h4 class="h4">Size Options</h4>
		<div class="button-group">
			<button class="button --small">Small Button</button>
			<button class="button">Medium Button</button>
			<button class="button --large">Large Button</button>
		</div>

		<h4 class="h4">Button Groups</h4>
		<h5 class="h5">Standard / Justify Start / Align Left</h5>
		<div class="button-group">
			<button class="button">Button One</button>
			<button class="button">Button Two</button>
			<button class="button">Button Three</button>
		</div>

		<h5 class="h5">Justify End / Align Right</h5>
		<div class="button-group --justify-end">
			<button class="button">Button One</button>
			<button class="button">Button Two</button>
			<button class="button">Button Three</button>
		</div>

		<h5 class="h5">Justify Center / Align Center</h5>
		<div class="button-group --justify-center">
			<button class="button">Button One</button>
			<button class="button">Button Two</button>
			<button class="button">Button Three</button>
		</div>

		<h5 class="h5">Stacked</h5>
		<div class="button-group --stacked">
			<button class="button">Button One</button>
			<button class="button">Button Two</button>
			<button class="button">Button Three</button>
		</div>
		<a class="link" href="#SGTop">Top</a>
	</div>
</section>

<section id="SGCards">
	<div class="page-container">
		<h3 class="section__title">Cards</h3>
		<div class="card">
			<h4 class="card__title">Default Card</h4>
			<p>Test card content</p>
		</div>
		<div class="card --light">
			<h4 class="card__title">Light Card</h4>
			<p>Test card content</p>
		</div>
		<div class="card --dark">
			<h4 class="card__title">Dark Card</h4>
			<p>Test card content</p>
		</div>
		<div class="card --tight">
			<h4 class="card__title">Tight Card</h4>
			<p>Test card content</p>
		</div>
		<div class="card --flat">
			<h4 class="card__title">Flat Card</h4>
			<p>Test card content</p>
		</div>
		<div class="card --solid">
			<h4 class="card__title">Solid Card</h4>
			<p>Test card content</p>
		</div>
		<a class="link" href="#SGTop">Top</a>
	</div>
</section>

<section id="SGForms">
	<div class="page-container">
		<h3 class="section__title">Forms (unfinished)</h3>
		
		<form>
			<label>Text Input</label>
			<input type="text" name="textInput" placeholder="placeholder">

			<label>Select</label>
			<select>
				<option>Option 1</option>
				<option>Option 2</option>
				<option>Option 3</option>
			</select>

			<label>Textarea</label>
			<textarea></textarea>

			<h4 class="h4">Checkboxes</h4>
			<div class="form-row">
				<div class="form-group">
					<input type="checkbox" id="SGcb1" tabindex="0" name="sg-checkboxes">
	    			<label for="SGcb1">Checkbox option 1</label>

	    			<input type="checkbox" id="SGcb2" tabindex="0" name="sg-checkboxes">
	    			<label for="SGcb2">Checkbox option 2</label>

	    			<input type="checkbox" id="SGcb3" tabindex="0" name="sg-checkboxes">
	    			<label for="SGcb3">Checkbox option 3</label>
				</div>
			</div>

			<h4 class="h4">Radio Buttons</h4>
			<div class="form-row">
				<div class="form-group">
					<input type="radio" id="SGrd1" tabindex="0" name="sg-radios">
	    			<label for="SGrd1">Radio option 1</label>

	    			<input type="radio" id="SGrd2" tabindex="0" name="sg-radios">
	    			<label for="SGrd2">Radio option 2</label>

	    			<input type="radio" id="SGrd3" tabindex="0" name="sg-radios">
	    			<label for="SGrd3">Radio option 3</label>
				</div>
			</div>

			<h4 class="h4">Toggle</h4>
			<input class="toggle" type="checkbox" id="SGtoggle" name="SGtoggle">
			<label for="SGToggle">Toggle</label>

			<input type="submit" name="Submit Input">
		</form>
		<a class="link" href="#SGTop">Top</a>
	</div>
</section>

<section id="SGTypography">
	<div class="page-container">
		<h3 class="section__title">Typography</h3>

		<h1 class="h1">Header One</h1>
		<p>Paragraph Text. Lorem ipsum dolor sit amet consectetur adipiscing elit.</p>
		<h2 class="h2">Header Two</h2>
		<p>Paragraph Text. Lorem ipsum dolor sit amet consectetur adipiscing elit.</p>
		<h3 class="h3">Header Three</h3>
		<p>Paragraph Text. Lorem ipsum dolor sit amet consectetur adipiscing elit.</p>
		<h4 class="h4">Header Four</h4>
		<p>Paragraph Text. Lorem ipsum dolor sit amet consectetur adipiscing elit.</p>
		<h5 class="h5">Header Five</h5>
		<p>Paragraph Text. Lorem ipsum dolor sit amet consectetur adipiscing elit.</p>
		<h6 class="h6">Header Six</h6>
		<p>Paragraph Text. Lorem ipsum dolor sit amet consectetur adipiscing elit.</p>

		<ul class="bulleted">
			<li>Bulleted list</li>
			<li>Lorem ipsum</li>
			<li>Dolor sit amet</li>
		</ul>

		<ul class="numbered">
			<li>Numbered list</li>
			<li>Lorem ipsum</li>
			<li>Dolor sit amet</li>
		</ul>

		<blockquote>
			<p class="quote">A burrito is a sleeping bag for ground beef.</p>
			<cite>Mitch Hedberg</cite>
		</blockquote>

		<a class="link" href="#SGTop">Top</a>
	</div>
</section>



@endsection
