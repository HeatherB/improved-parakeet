
<?php 

if(have_posts()): while(have_posts()): the_post(); 

    $slug = get_post_field( 'post_name', get_post());

    // get ACF group field
    $options = get_field('hero_options');   

    // check if a logo was chosen   
    $hasLogo = false;

    if ($options['logo'] !== "none") {
        $hasLogo = true;
    }  

    $imageSet = [];

    foreach($options['image'] as $row) {
        array_push($imageSet,$row['background_image']);
    };

    $imageCollection = collect($imageSet)->sortBy("width");

    $streamData = [];
?>

@include('partials.get-stream-data')
    <?php $streamData = getStreamData() ?>
<?php wp_reset_query(); wp_reset_postdata() ?>
 

<div class="hero-header @if($streamData['online'])--streaming @else --offline @endif" @if( $hasLogo )data-has-logo @endif>

    @include('partials.hero-picture', ['options' => $options])

    @if($streamData['online'])
        @include('partials.header-stream-overlay', ['streamData' => $streamData])
    @endif

    <div class="hero-header__content text--{{$options['text_color']}}">

        @if ( $hasLogo )
            <?php
                switch ($options['logo']) {
                    case 'age1':
                        $logoSource = App\asset_path('images/landinglogo-i.png'); 
                        break;
                    case 'age2':
                        $logoSource = App\asset_path('images/hero-logo-age2.png'); 
                        break;
                    case 'age3':
                        $logoSource = App\asset_path('images/landinglogo-iii.png'); 
                        break;
                    case 'age4':
                        $logoSource = App\asset_path('images/hero-logo-age4.png'); 
                        break;
                    case 'myth':
                        $logoSource = App\asset_path('images/landinglogo-myth.png');
                        break; 
                }
            ?>

            <img class="hero-header__logo" src="{{$logoSource}}" data-source="{{$logoSource}}" alt="<?php echo the_title(); ?>">
        @endif

        @if ($options['title_type'] !== "none")
            
            <h1 class="hero-header__title">
                @if ($options['title_type'] !== "text_only")
                    <?php 
                        $titleHref = "";

                        switch($options['title_type']) {
                            case 'blog_article':
                                $titleHref = get_permalink($options['article']->ID);
                                break;
                            case 'page_internal':
                                $titleHref = $options['page'];
                                break;
                            case 'page_external':
                                $titleHref = $options['external_page_url'];
                                break;
                        }
                    ?>
                    <a href="{{$titleHref}}">
                @endif

                {{$options['title']}}

                @if ($options['title_type'] !== "text_only")
                    </a>
                @endif
            </h1>
        @endif

        @if ($options['subtitle']) 
            <div class="hero-header__subtitle">
                {!!$options['subtitle']!!}
            </div> 
        @endif

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
                @if ($button['type'] == 'video_modal_youtube') 
                    <button type="button" class="btn-aoe--cta btn-aoe--cta--large hero-video-modal"
                        data-btn-open="hero-video-modal" data-video-src="{{$button['video_id']}}" data-video-type="youtube" data-video-muted="1">{{$button['button_text']}}</button>
                @else
                    <a class="btn-aoe--cta btn-aoe--cta--large" href="{{$buttonHref}}">{{$button['button_text']}}</a>
                @endif
            @endforeach
        @endif

    </div>
</div>  
 
{{-- use frank border on age2 branded pages and home --}}
@if(is_front_page() || $slug == "aoeiide" || $slug == "age-of-empires-ii-de")
    <div class="modal-frank" id="hero-video-modal" data-reveal data-close-on-click="true">
        <div class="frame"></div>
        <div class="responsive-embed widescreen"></div>
        <button class="close-button" data-close aria-label="Close modal" type="button">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
{{-- use egypt border everywhere else --}}
@else
    <div class="reveal borders-egyptian" id="hero-video-modal" data-reveal data-close-on-click="true">
        <div id="modal-content__container">
            <div class="responsive-embed widescreen"></div>
        </div>
        <div class="modal-border top"></div>
        <div class="modal-border bottom"></div>
        <div class="modal-border left"></div>
        <div class="modal-border right"></div>
        <div class="modal-corner top left"></div>
        <div class="modal-corner top right"></div>
        <div class="modal-corner bottom left"></div>
        <div class="modal-corner bottom right"></div>

        <button class="close-button" data-close aria-label="Close modal" type="button">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
@endif




<?php endwhile; endif; ?>