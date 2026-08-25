<?php
// Coe below add custom BG images to /insiders page sections if
// the "Content Body Background Image" drop-down is not "Default".
    $sectionStyle = "";
    $tease_custom_bg_image_class = ' tease-custom-bg-image';

    if(!empty($block_section_bg_img) && $block_section_bg_img !== 'default') {
        $sectionStyle = $block_section_bg_img . $tease_custom_bg_image_class;
    } elseif (isset($style)  || (isset($style) && $sectionStyle === ' tease-custom-bg-image') ) {
        $sectionStyle = $style;
    } elseif ( !empty($content['style']) || (!empty($content['style']) && $sectionStyle === ' tease-custom-bg-image') ) {
        $sectionStyle = $content['style'];
    } else {
        $sectionStyle = 'insider';
    }

    if(!isset($align)) {
        $align = '';
    }
?>

<div class="tease insider-content-block {{$sectionStyle}} {{$align}}">
    <div class="bg">
        @if(isset($block_section_bg_img))
            @if($block_section_bg_img === 'lotw')
                <img class="tease-mobile-image" src="@asset('images/insiders/bgs/lotw/fp-bg-insider-intro-mobile.jpg')" alt="Lords of the West, Age of Empires II: Definitive Edition" />
            @elseif($block_section_bg_img === 'lotw-block-bg-img')
                <img class="tease-mobile-image" src="@asset('images/insiders/bgs/lotw/fp-bg-insider-count-mobile.jpg')" alt="Lords of the West, Age of Empires II: Definitive Edition" />
            @endif
        @endif

        <div class="text">
            <div class="text-inner">

                <h3 class="title">{{$content['title']}}</h3>

                @if(isset($content['has_counter']) && $content['has_counter'])
                    <?php
                    $pre_count = \Roots\Insiders\Insider::get_insiders_count();
                    $count = ($pre_count < 1000 ) ? $pre_count : number_format(round($pre_count,-3,PHP_ROUND_HALF_DOWN)); ?>
                    <span class="insider-count">Over {{$count}} Insiders and&nbsp;Counting</span>
                @endif

                @if(isset($content['has_forum_latest']) && $content['has_forum_latest'])
                    <h4>Insider Announcements</h4>
                    <ul class="insider-forum-latest js-forum-latest"></ul>
                @elseif (isset($content['content_body']))
                    <div class="words">{!! $content['content_body'] !!}</div>
                @endif

                @if (count($content['buttons']) > 0)
                    <div class="buttons">

                        @foreach ($content['buttons'] as $button)

                            <?php
                                $buttonHref = "";

                                switch($button['type']) {
                                    case 'blog_article':
                                        $buttonHref = get_permalink($button['article']->ID);
                                        break;
                                    case 'internal_page':
                                        $buttonHref = $button['page'];
                                        break;
                                    case 'url':
                                        $buttonHref = $button['url'];
                                        break;
                                    case 'sign_in':
                                        $buttonHref = "https://auth.ageofempires.com";
                                        break;
                                }
                            ?>

                            @if ($button['type'] != 'sign_in')
                                    <a class="sandbutton" href="{{$buttonHref}}">{{$button['button_text']}}</a>
                            @elseif( !is_user_logged_in())
                                    <a class="sandbutton" href="{{$buttonHref}}">{{$button['button_text']}}</a>
                            @endif

                        @endforeach
                    </div>
                @endif

            </div>

        </div>

    </div>
</div>
