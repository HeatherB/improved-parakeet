@php
$display_dynasties = $civs_page['display_dynasties'] ?? null;    
$dynasty_section = $civs_page['dynasty_section'] ?? null;
@endphp

@if( !empty($display_dynasties) && !empty($dynasty_section) )
    @php
    $dynasty_bg_pattern = $dynasty_section['dynasty_bg_pattern'] ?? null;
    $dynasty_imgs = $dynasty_section['dynasty_imgs'] ?? null;

    $mobile_img = $dynasty_imgs['mobile_img'] ?? null;
    $desktop_img = $dynasty_imgs['desktop_img'] ?? null;
    // 4k image is $fourk_image
    $fourk_img = $dynasty_imgs['fourk_image'] ?? null;

    $dynasty_section_heading = $dynasty_section['dynasty_section_heading'] ?? null;
    $dynasty_section_text = $dynasty_section['dynasty_section_text'];

    $single_dynasty = $dynasty_section['single_dynasty'] ?? null;
    @endphp

    <section class="block-content section--divider {{$dynasty_bg_pattern === 'rocks' ? 'background--rock' : ''}} civs-template__wrapper">

        <div class="substance teasers">

            <div class="tease addon_expansion civs-template">

                @if(!empty($mobile_img) && !empty($desktop_img) && !empty($fourk_img))
                    {{-- 
                    For below, <picture> tag doesn't work in IE11 
                    and it's good to use <img> tag alt attributes for accessibility
                    --}}
                    <div class="dynasty-section-banner-img">
                        <img class="mobile-img" src="{{$mobile_img['url']}}" alt="{{$mobile_img['alt']}}" />
                        <img class="desktop-img" src="{{$desktop_img['url']}}" alt="{{$desktop_img['alt']}}" />
                        <img class="fourk-img" src="{{$fourk_img['url']}}" alt="{{$fourk_img['alt']}}" />
                    </div>
                @endif

                <div class="bg bg__min-height-auto dynasty-section-content">

                    <div class="text civs-template__dark-blue-gradient">
    
                        <div class="text-inner">
    
                            @if(!empty($dynasty_section_heading))
                                <h4 class="title">{{$dynasty_section_heading}}</h4>
                            @endif

                            @if(!empty($dynasty_section_text))
                                {!! $dynasty_section_text !!}
                            @endif

                            @if(!empty($single_dynasty))
                                @php
                                $single_dynasty_count = count($single_dynasty) ?? null;
                                $single_dynasty_style = '';

                                switch($single_dynasty_count) {
                                    case 1:
                                        $single_dynasty_style = 'dynasty-1';
                                        break;
                                    case 2:
                                        $single_dynasty_style = 'dynasty-2';
                                        break;
                                    case 3:
                                        $single_dynasty_style = 'dynasty-3';
                                        break;
                                    case 4:
                                        $single_dynasty_style = 'dynasty-4';
                                        break;
                                }                                
                                @endphp
                                @if($single_dynasty_count <= 4 && $single_dynasty_count >= 1)
                                    <div class="single-dynasty-wrapper {{$single_dynasty_style}}">
                                        @foreach($single_dynasty as $item)
                                            <div class="single-dynasty civs-template__light-blue-gradient">
                                                @if(!empty($item['heading']))
                                                    <h5>{{$item['heading']}}</h5>
                                                @endif
                                                
                                                @if(!empty($item['heading']))
                                                    <h6>{{$item['sub_heading']}}</h6>
                                                @endif
                                                
                                                @if(!empty($item['heading']) && !empty($item['sub_heading']))
                                                    <hr />
                                                @endif

                                                @if(!empty($item['text_content']))
                                                    <div class="text-content">
                                                        {!! $item['text_content'] !!}
                                                    </div>
                                                @endif
                                            </div>    
                                        @endforeach
                                    </div>
                                @endif
                            @endif    
    
                        </div>
                        
                    </div>

                </div>

            </div>    

        </div>    

    </section>    

@endif