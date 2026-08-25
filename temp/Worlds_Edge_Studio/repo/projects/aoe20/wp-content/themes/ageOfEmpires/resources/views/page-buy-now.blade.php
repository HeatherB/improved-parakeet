@extends('layouts.app')

@section('content')

<?php
	$products = get_field('products');
	$allowed_tags = '<b><a><i><em><strong><ul><ol><li>';
?>

<h2 class="buy__page__title">
	<span class="page__title__text">
		{{ get_field('page_heading') ? get_field('page_heading') : the_title()}}
	</span>
</h2>

@foreach ($products as $product)
	<?php $product_title = get_the_title($product['game']); ?>
	
	<article class="product" data-game="{{$product_title}}">
		<div class="product__banner"></div>

		<div class="page-container">

    		<div class="product__card">

    			<div class="product__layout">

    				<div class="product__img-wrapper">
    					{!!wp_get_attachment_image($product['product_image'],'medium', false, array('class' => 'product__thumbnail', 'role' => 'presentation'))!!}
    				</div>

    				<div class="product__info">
    					<h3 class="product__title"><span class="product__title__text">{{$product_title}}</span></h3>
    					<p class="product__description">
    						{!! strip_tags($product['description'], $allowed_tags)!!}
    					</p>
		    			

		    			<div class="product__system-reqs">
		    				@if ($product['minimum_system_requirements'])
					    		<div class="product__system-reqs__block">
						    		<h4 class="product__system-reqs__header">Minimum System Requirements</h4>
						    		<ul class="product__system-reqs__list">
						    			@foreach($product['minimum_system_requirements'] as $req)
						    				<li class="product__system-req">
						    					@if ($req['requirement_label'])
						    						<b>{{$req['requirement_label']}}:</b>&nbsp;
						    					@endif
						    					{{$req['requirement']}}
						    				</li>
						    			@endforeach
						    		</ul>
						    	</div>
					    	@endif

					    	@if($product['recommended_system_requirements'])
				    			<div class="product__system-reqs__block">
						    		<h4 class="product__system-reqs__header">Recommended</h4>
					    			<ul class="product__system-reqs__list">
						    			@foreach($product['recommended_system_requirements'] as $req)
						    				<li class="product__system-req">
						    					@if ($req['requirement_label'])
						    						<b>{{$req['requirement_label']}}:</b>&nbsp;
						    					@endif
						    					{{$req['requirement']}}
						    				</li>
						    			@endforeach
						    		</ul>
					    		</div>
					    	@endif
		    			</div>
    				</div>
		    		
		    		<div class="product__purchase-options">
		    			@if($product['purchase_options'])
				    		@foreach ($product['purchase_options'] as $purchase_option)
				    			<?php
				    				$button_aria = "Buy " . $product_title . " on " . $purchase_option['label'];

		    						switch ($purchase_option['value']) {
		    							case 'pre-order': 
		    								$button_aria = "Pre-order " . $product_title;
		    								break;
		    							case 'amazon':
		    								$button_image = "images/logos/amazon.svg";
		    								break;
		    							case 'windows_store':
		    								$button_image = "images/logos/getitonwindows.svg";
		    								break;
		    							case 'gamestop':
		    								$button_image = "images/logos/gamestop.svg";
		    								break;
		    							case 'steam':
		    								$button_image = "images/logos/steam.svg";
		    								break;
		    						}
				    			?>

				    			<a class="purchase__option {{$purchase_option['value']}}" href="{{$product[$purchase_option['label'] . '_url']}}" aria="{{$button_aria}}">
				    				@if($purchase_option['value'] === 'pre-order') 
				    					Pre-order
				    				@else
				    					<img class="purchase__option__image" src="@asset($button_image)" alt="{{$purchase_option['label']}}">
				    				@endif
				    			</a>
				    		@endforeach
				    	@endif
			    	</div>			    	

			    	@if($product['expansions'])
			    		<div class="product__expansions">
				    		<h3 class="product__expansions__header">Expansions</h3>
					    	@foreach($product['expansions'] as $expac)
					    		<div class="product__expansion">
					    			
					    			{{-- we can't use wp_get_attachment_image because it outputs width and height attributes, which mess up the layout --}}
					    			<img class="product__expansion__thumbnail" src="{{wp_get_attachment_image_url($expac['image'])}}" role="presentation" />

					    			<div class="product__expansion__info">
					    				<h5 class="product__expansion__title">{{$expac['title']}}</h5>
							    		<p class="product__expansion__description">
							    			{!! strip_tags($expac['description'],$allowed_tags) !!}
							    		</p>
					    			</div>
						    		
					    		</div>
					    	@endforeach
					    </div>
				    @endif
				</div>
			</div>
		</div>
	</article>	
@endforeach


@endsection




