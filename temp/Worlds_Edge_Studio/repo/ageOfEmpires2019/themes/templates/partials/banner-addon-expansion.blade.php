<div class="banner mods-banner mods-all-banner @if($class) {{$class}} @endif @if( $header_block['addon_expansion_hero_banner_title'] || $header_block['addon_expansion_hero_banner_copy']) copy-block @endif">
    <div class="row column text-center">
        <h1 class="light">{!! App\title() !!}</h1>
    
    @if( $header_block['addon_expansion_hero_banner_title'] || $header_block['addon_expansion_hero_banner_copy'])
    <div class="banner-block border--gold--thin">
    	<div class="inner">
    		@if($header_block['addon_expansion_hero_banner_title'])
    		<h2>{{$header_block['addon_expansion_hero_banner_title']}}</h2>
    		@endif
    		@if($header_block['addon_expansion_hero_banner_copy'])
    		{!! $header_block['addon_expansion_hero_banner_copy'] !!}
    		@endif
    @endif
    @if ($heroButtons)
  	<div class="addon_expansion_hero_banner_buttons buttons">
      	@foreach ($heroButtons as $button)
          	<?php 
              $buttonHref = "";

              switch($button['addon_expansion_hero_banner_button_type']) {
                  case 'blog_article':
                      $buttonHref = get_permalink($button['addon_expansion_hero_banner_button_blog_article']->ID);
                      break;
                  case 'page_internal':
                      $buttonHref = $button['addon_expansion_hero_banner_button_web_page_internal'];
                      break;
                  case 'page_external':
                      $buttonHref = $button['addon_expansion_hero_banner_button_web_page_external'];
                      break;
              }
          	?>

          	<a class="btn-aoe--cta" href="{{$buttonHref}}">{{$button['addon_expansion_hero_banner_button_text']}}</a>
      	@endforeach
  	</div>
	@endif
	@if($header_block)
		</div><!-- end of inner -->
	</div><!-- end of banner block -->
    @endif
</div></div>