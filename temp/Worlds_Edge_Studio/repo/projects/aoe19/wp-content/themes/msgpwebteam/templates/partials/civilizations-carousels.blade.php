@if( !empty($civs_page['display_carousels']) && !empty( $civs_page['carousel']) )
    @foreach($civs_page['carousel'] as $item)
        @php
        $carousel_slider_num = $item['carousel_slider_num'] ?? null;
        $content_area_bg_pattern = $item['content_area_bg_pattern'] ?? null;
        $carousel_heading = $item['carousel_heading'] ?? null;
        $carousel_slide = $item['carousel_slide'] ?? null;

        switch($carousel_slider_num) {
            case 'default':
                $carousel_slider_num = 'show-1';
                break;
            case 'three':
                $carousel_slider_num = 'show-3';
                break;
        }

        $carousel_slide_count = count($carousel_slide) ?? null;
        $slide_count_style = null;

        if($carousel_slide_count):
            $slide_count_style = 'sections-1';
        endif;
        @endphp
        <section class="block-content section--divider {{$content_area_bg_pattern === 'rocks' ? 'background--rock' : ''}} civs-template__wrapper {{ $carousel_slide_count ? $slide_count_style : '' }}">

            {{-- Show 1 slidehow if 2 or more slides present --}}
            @if($carousel_slider_num && $carousel_slider_num === 'show-1')
                @if($carousel_heading)
                    <div class="substance teasers">
                        <h2 class="title {{$content_area_bg_pattern === 'rocks' ? 'light' : 'dark'}} slide-show-heading">{{$carousel_heading}}</h2>
                    </div>
                @endif

                <div class="substance teasers slick-slider-teasers slider-wrapper {{$carousel_slide_count <= 1 ? 'show-1-no-slide-show slider1' : 'slider1 slide-show-1' }}">
                    @foreach( $carousel_slide as $slide )
                        @php
                        $content_area_text_float = $slide['content_area_text_float'] ?? null;

                        $content_area_imgs = $slide['content_area_imgs'] ?? null;
                        $desktop_image = $content_area_imgs['desktop_image'] ?? null;
                        $mobile_image = $content_area_imgs['mobile_image'] ?? null;

                        $content_area_bg_color = $slide['content_area_bg_color'] ?? null;

                        switch($content_area_bg_color) {
                            case 'light blue gradient':
                            $content_area_bg_color = 'civs-template__light-blue-gradient';
                            break;
                            case 'dark blue gradient':
                            $content_area_bg_color = 'civs-template__dark-blue-gradient';
                            break; 
                        }                        

                        $content_area_text_bg_img = $slide['content_area_text_bg_img'] ?? null;
                        if(empty($content_area_text_bg_img) || $content_area_text_bg_img === 'default'):
                            $content_area_text_bg_img = false;
                        endif;

                        $content_area_heading = $slide['content_area_heading'] ?? null;
                        $content_area_text = $slide['content_area_text'] ?? null;
                        @endphp

                        <div class="tease addon_expansion civs-template {{$content_area_text_float}}">
                            <div>
                                <div class="bg bg__min-height-auto tease-custom-bg-image">
                                    
                                    @include('partials.bg-picture', ['options' => $slide])

                                    
                                    <div class="text {{$content_area_text_bg_img ? $content_area_text_bg_img : $content_area_bg_color}}">
                                        <div class="text-inner">
                                            @if($content_area_heading)
                                                <h4 class="title">{!! $content_area_heading !!}</h4>
                                            @endif
                                            @if($content_area_text)
                                                {!! $content_area_text !!}
                                            @endif
                                        </div>
                                    </div>
                                   
                                </div>

                            </div>    
                        </div>
                    @endforeach
                </div> 
            
            {{-- Show 3 slidehow if 4 or more slides present --}}
            @elseif($carousel_slider_num && $carousel_slider_num === 'show-3')
                @if($carousel_heading)
                    <div class="substance teasers">
                        <h2 class="title {{$content_area_bg_pattern === 'rocks' ? 'light' : 'dark'}} slide-show-heading">{{$carousel_heading}}</h2>
                    </div>
                @endif
                @php
                // Styles for show 3 slideshow slides if less than 4 slides
                $slide_count_style = null;
                switch($carousel_slide_count) {
                    case 1:
                        $slide_count_style = 'sections-1 slider3 show-3-no-slide-show';
                        break;
                    case 2:
                        $slide_count_style = 'sections-2 slider3';
                        break;    
                    case 3:
                        $slide_count_style = 'sections-3 slider3';
                        break; 
                    default:
                        $slide_count_style = 'slider3 slide-show-3';
                        break;
                }                 
                @endphp
                <div class="substance teasers slick-slider-teasers slider-wrapper {{$slide_count_style}}">
                    @foreach( $carousel_slide as $slide )

                        @php
                        $content_area_text_float = $slide['content_area_text_float'] ?? null;

                        $content_area_imgs = $slide['content_area_imgs'] ?? null;
                        $desktop_image = $content_area_imgs['desktop_image'] ?? null;
                        $mobile_image = $content_area_imgs['mobile_image'] ?? null;

                        $content_area_bg_color = $slide['content_area_bg_color'] ?? null;

                        switch($content_area_bg_color) {
                            case 'light blue gradient':
                            $content_area_bg_color = 'civs-template__light-blue-gradient';
                            break;
                            case 'dark blue gradient':
                            $content_area_bg_color = 'civs-template__dark-blue-gradient';
                            break; 
                        }                        

                        $content_area_text_bg_img = $slide['content_area_text_bg_img'] ?? null;
                        if(empty($content_area_text_bg_img) || $content_area_text_bg_img === 'default'):
                            $content_area_text_bg_img = false;
                        endif;

                        $content_area_heading = $slide['content_area_heading'] ?? null;
                        $content_area_text = $slide['content_area_text'] ?? null;
                        @endphp

                        <div class="tease addon_expansion civs-template {{$content_area_text_float}}">
                            <div class="bg_wrapper">
                                <div class="bg bg__min-height-auto tease-custom-bg-image">

                                    @include('partials.bg-picture', ['options' => $slide])
                                    
                                    

                                    <div class="text {{$content_area_text_bg_img ? $content_area_text_bg_img : $content_area_bg_color}}">
                                        <div class="text-inner">
                                            @if($content_area_heading)
                                                <h4 class="title">{!! $content_area_heading !!}</h4>
                                            @endif
                                            @if($content_area_text)
                                                {!! $content_area_text !!}
                                            @endif
                                        </div>
                                    </div>
                                </div>    
                            </div>    
                        </div>
                       
                    @endforeach
                </div> 

            @endif

        </section>    

    @endforeach

@endif