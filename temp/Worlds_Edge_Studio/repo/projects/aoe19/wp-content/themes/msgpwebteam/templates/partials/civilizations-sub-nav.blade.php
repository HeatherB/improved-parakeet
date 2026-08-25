@if(
    !empty($civs_page['civs_sub_nav_post_type_url']) ||
    !empty($civs_archive_page['build_civs_sub_nav']) ||
    !empty($age4_display_civ_sub_nav_content_area)
)
    @php
    if(!empty($civs_archive_page['build_civs_sub_nav'])):
        $build_civs_sub_nav = $civs_archive_page['build_civs_sub_nav'];
    endif;

    $content_areas = null;
    $add_padding_under_civ_sub_nav = false;
    $single_civ_page = false;

    if(!empty($civs_archive_page['build_civs_sub_nav'])):
        $add_padding_under_civ_sub_nav = true;
    endif;

    if(!empty($civs_page['content_area'])):
        $content_areas = $civs_page['content_area'];
    elseif(!empty($age4_content_areas)):
        $content_areas = $age4_content_areas;
    endif;
    @endphp
    <div class="block-content section--divider background--rock content {{!empty($build_civs_sub_nav) ? 'teasers' : ''}} civs-template__wrapper">

        @if(!empty($civs_archive_page['build_civs_sub_nav']) ||  !empty($civs_page['civs_sub_nav_post_type_url']) || !empty($age4_civs_sub_nav_from_url))
            @php
            $civs_sub_nav_heading = null;
            $civilizations_get_sub_nav_from_url_post_id = null;

            function civs_sub_nav_heading_from_url_post_id_func($civs_sub_nav_post_type_url) {
                $civs_sub_nav_built_from_post_id_from_url = url_to_postid($civs_sub_nav_post_type_url);
                $civs_sub_nav_heading = get_field('civilizations_sub_nav_heading', $civs_sub_nav_built_from_post_id_from_url);

                return $civs_sub_nav_heading;
            }

            function civilizations_get_sub_nav_from_url_post_id_func($civs_sub_nav_post_type_url) {
                $civs_sub_nav_built_from_post_id_from_url = url_to_postid($civs_sub_nav_post_type_url);
                $civilizations_get_sub_nav_from_url_post_id = get_field('civilizations_sub_nav', $civs_sub_nav_built_from_post_id_from_url);

                return $civilizations_get_sub_nav_from_url_post_id;
            }

            if(!empty($civs_archive_page['civs_sub_nav_heading'])):
                $civs_sub_nav_heading = $civs_archive_page['civs_sub_nav_heading'];
            elseif(!empty($civs_page['civs_sub_nav_post_type_url'])):
                $civilizations_get_sub_nav_from_url_post_id = civilizations_get_sub_nav_from_url_post_id_func($civs_page['civs_sub_nav_post_type_url']);
                $civs_sub_nav_heading = civs_sub_nav_heading_from_url_post_id_func($civs_page['civs_sub_nav_post_type_url']);
                $single_civ_page = true;
            elseif(!empty($age4_civs_sub_nav_from_url)):
                $civilizations_get_sub_nav_from_url_post_id = civilizations_get_sub_nav_from_url_post_id_func($age4_civs_sub_nav_from_url);
                $civs_sub_nav_heading = civs_sub_nav_heading_from_url_post_id_func($age4_civs_sub_nav_from_url);
            endif;
            @endphp

            <div class="substance teasers civ_subnav_wrapper {{ $add_padding_under_civ_sub_nav ? 'margin-padding-bottom-0-imp' : '' }}">
                <div class="tease civs-template no-border-imp">
                        <h2 class="accessible-accordion-heading parchment-font">{{$civs_sub_nav_heading}}</h2>
                        @if($civs_sub_nav_heading && $single_civ_page)
                          <div class="accessible-accordion-wrapper" data-width-always-show="960" data-transition-time-ms="200">
                              <button aria-expanded="false" aria-pressed="false" id="civ_subnav_mobile_btn">{{$civs_sub_nav_heading}}</button>
                              <div class="accessible-accordion-content" aria-hidden="true">
                        @endif
                                <nav class="civs-template__nav">
                                    <ul>
                                        @if(!empty($civs_archive_page['build_civs_sub_nav']))
                                            @foreach($civs_archive_page['civs_sub_nav'] as $item)

                                                @if(!empty($item['sub_nav_link']))
                                                <li>
                                                    <a class="{{$item['nav_item_background_image_style']}} nav-img-lg" href="{{$item['sub_nav_link']}}">
                                                        {{-- Desktop and mobile images --}}
                                                        @if(!empty($item['desk']) && !empty($item['mobile']))
                                                        @php
                                                        $desk_img = $item['desk'];
                                                        $mobile_img = $item['mobile'];
                                                        @endphp
                                                            <span class="nav-img-lg-wrapper">
                                                                <img class="desk-img" src="{{$desk_img['url']}}" alt="{{$item['sub_nav_text']}}" />
                                                                <img class="mobile-img" src="{{$mobile_img['url']}}" alt="{{$item['sub_nav_text']}}" width="960" />
                                                            </span>
                                                        @endif
                                                        <img class="civs-template__nav-hover-img" alt="" role="presentation" src="@asset('images/civilizations/buttons/icon-pointer-right-normal.svg')" /><span class="nav-item-text">{{$item['sub_nav_text']}}</span>
                                                    </a>
                                                </li>
                                                @else
                                                <li>
                                                    <div class="{{$item['nav_item_background_image_style']}} nav-img-lg no_anchor">
                                                        {{-- Desktop and mobile images --}}
                                                        @if(!empty($item['desk']) && !empty($item['mobile']))
                                                        @php
                                                        $desk_img = $item['desk'];
                                                        $mobile_img = $item['mobile'];
                                                        @endphp
                                                            <span class="nav-img-lg-wrapper">
                                                                <img class="desk-img" src="{{$desk_img['url']}}" alt="{{$item['sub_nav_text']}}" />
                                                                <img class="mobile-img" src="{{$mobile_img['url']}}" alt="{{$item['sub_nav_text']}}" width="960" />
                                                            </span>
                                                        @endif
                                                        <img class="civs-template__nav-hover-img" alt="" role="presentation" src="@asset('images/civilizations/buttons/icon-pointer-right-normal.svg')" /><span class="nav-item-text">{{$item['sub_nav_text']}}</span>
                                                    </div>
                                                </li>
                                                @endif


                                            @endforeach
                                        @elseif(!empty($age4_display_civ_sub_nav_content_area))
                                            @foreach($civilizations_get_sub_nav_from_url_post_id as $item)
                                                @if(!empty($item['sub_nav_link']))
                                                <li>
                                                    <a class="{{$item['nav_item_background_image_style']}} nav-img-lg" href="{{$item['sub_nav_link']}}">
                                                        {{-- Desktop and mobile images --}}
                                                        @if(!empty($item['desk']) && !empty($item['mobile']))
                                                        @php
                                                        $desk_img = $item['desk'];
                                                        $mobile_img = $item['mobile'];
                                                        @endphp
                                                            <span class="nav-img-lg-wrapper">
                                                                <img class="desk-img" src="{{$desk_img['url']}}" alt="{{$item['sub_nav_text']}}" />
                                                                <img class="mobile-img" src="{{$mobile_img['url']}}" alt="{{$item['sub_nav_text']}}" width="960" />
                                                            </span>
                                                        @endif
                                                        <img class="civs-template__nav-hover-img" alt="" role="presentation" src="@asset('images/civilizations/buttons/icon-pointer-right-normal.svg')" /><span class="nav-item-text">{{$item['sub_nav_text']}}</span>
                                                    </a>
                                                </li>
                                                @else
                                                <li>
                                                    <div class="{{$item['nav_item_background_image_style']}} nav-img-lg no_anchor">
                                                        {{-- Desktop and mobile images --}}
                                                        @if(!empty($item['desk']) && !empty($item['mobile']))
                                                        @php
                                                        $desk_img = $item['desk'];
                                                        $mobile_img = $item['mobile'];
                                                        @endphp
                                                            <span class="nav-img-lg-wrapper">
                                                                <img class="desk-img" src="{{$desk_img['url']}}" alt="{{$item['sub_nav_text']}}" />
                                                                <img class="mobile-img" src="{{$mobile_img['url']}}" alt="{{$item['sub_nav_text']}}" width="960" />
                                                            </span>
                                                        @endif
                                                        <img class="civs-template__nav-hover-img" alt="" role="presentation" src="@asset('images/civilizations/buttons/icon-pointer-right-normal.svg')" /><span class="nav-item-text">{{$item['sub_nav_text']}}</span>
                                                    </div>
                                                </li>
                                                @endif


                                            @endforeach
                                        @elseif(!empty($civs_page['display_content_area']))
                                            @php
                                            $current_permalink = get_permalink($civs_page['post_id']);
                                            @endphp
                                            @foreach($civilizations_get_sub_nav_from_url_post_id as $item)
                                                @if(!empty($item['sub_nav_link']))
                                                <li>
                                                    <a class="{{$item['nav_item_background_image_style']}} {{ $current_permalink === $item['sub_nav_link'] ? 'active' : ''}} nav-img-lg" href="{{$item['sub_nav_link']}}">
                                                        <img class="civs-template__nav-hover-img" alt="" role="presentation" src="@asset('images/civilizations/buttons/icon-pointer-right-normal.svg')" /><span class="nav-item-text">{{$item['sub_nav_text']}}</span>
                                                    </a>
                                                </li>
                                                @else
                                                <li class="no_anchor">
                                                    <div class="{{$item['nav_item_background_image_style']}} {{ $current_permalink === $item['sub_nav_link'] ? 'active' : ''}} nav-img-lg no_anchor">
                                                        <img class="civs-template__nav-hover-img" alt="" role="presentation" src="@asset('images/civilizations/buttons/icon-pointer-right-normal.svg')" /><span class="nav-item-text">{{$item['sub_nav_text']}}</span>
                                                    </div>
                                                </li>
                                                @endif
                                            @endforeach
                                        @endif
                                    </ul>
                                </nav>
                         
                        @if($civs_sub_nav_heading && $single_civ_page)        
                            </div>
                        </div>
                        @endif

                    </div>
                </div>

            </div>

        @endif

    </div>
@endif
