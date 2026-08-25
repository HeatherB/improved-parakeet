<?php
// Extra markup area
// attached to page data through games
// get ACF group field
$options = get_field('game_fc_options');   
?>

<?php if(!empty($options['fc_logo'])){ ?>
<div class="row">
    <div class="columns">
    	<!-- output content here -->
    	<div class="border--gold--thin extra_fc">
    		@include('partials.hero-picture', ['options' => $options])
			<div class="sheer medium-6 inner">
				<img alt="Age of Empires" class="fc_logo" src="<?php echo $options['fc_logo']['url']; ?>"/>
				@if ($options['button'])
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
		                        class="btn-aoe--cta" href="{{$buttonHref}}"
		                    @endif >{{$button['button_text']}}
		                </a>
		            @endforeach
		        @endif
			</div>
    	</div>
    	<!-- end of fetched content -->
    </div>
</div>
<?php } ?>


