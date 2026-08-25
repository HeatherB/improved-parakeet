<?php
// Extra markup area
// attached to page data through games
// get ACF group field
$options = get_field('game_fc_options'); 

echo '$options';
var_dump($options);

?>

@if(!empty($options['image']) || !empty($options['fc_logo']['url']) || !empty($options['fc_content']) || !empty($options['button']))
<div class="row">
    <div class="columns">
    	<!-- output content here -->
    	<div class="border--gold--thin extra_fc">
    		@if(!empty($options['image']))
    		@include('partials.hero-picture', ['options' => $options])
    		@endif

			<div class="sheer medium-6 inner">
				@if(!empty($options['fc_logo']['url']))
				<img alt="Age of Empires" class="fc_logo" src="<?php echo $options['fc_logo']['url']; ?>"/>
				@endif

				@if(!empty($options['fc_content']))
				{!! $options['fc_content'] !!}
				@endif

				@if(!empty($options['button']))
		            @foreach($options['button'] as $button) 
		                <?php 
		                    $buttonHref = "";

		                    switch($button['type']) {
		                        case 'blog_article':
		                            $buttonHref = get_permalink($button['article']->ID);
		                            break;
		                        case 'page_internal':
		                            $buttonHref = $button['page'];
		                            break;
		                        case 'page_external':
		                            $buttonHref = $button['external_page_url'];
		                            break;
		                    }
		                ?>
		                <a 
		                    @if ($button['type'] == 'video_modal_youtube') 
		                        class="btn-aoe--cta hero-video-modal"
		                        data-open="hero-video-modal" data-video-src="{{$button['video_id']}}" data-video-type="youtube" data-video-muted="1"
		                    @else
		                        class="btn-aoe--cta btn-aoe--cta--large" href="{{$buttonHref}}"
		                    @endif >{{$button['button_text']}}
		                </a>
		            @endforeach
		        @endif
			</div>
    	</div>
    	<!-- end of fetched content -->
    </div>
</div>
@endif


