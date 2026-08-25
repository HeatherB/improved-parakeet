@extends('layouts.base')

@section('content')
    @while(have_posts()) @php(the_post())   
        @include('partials.banner', ['class' => "learn_to_play"])



        <section id="learn-to-play" class="block-content section--divider-frank-mid background--rock content {{$associated_game}}" data-postid="{{$this_post_ID}}"> 

            <div class="section--padding ltp-toc">
                <div class="row column">
                    <div class="lesson_groups_nav">
                        <ul>
                            <li>
                                <a href="/learn-to-play/getting-started-aoe2/" class="btn">
                                    Getting Started
                                </a>
                            </li>
                            <li>
                                <a href="/learn-to-play/defending-your-empires-aoe2/" class="btn">
                                    Building &amp; Defending
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="section--padding ltp-toc">
                <div class="row column">
                    <div class="border--gold">
                        @include('partials.ltp-table-of-contents', ['class' => "learn_to_play"])
                    </div>
                </div>
            </div> 

            @if( !empty( get_the_content() ) )
            <div class="section--padding ltp-section js-ltpSection">
                <div class="row column">
                    <div class="border--gold">
                        <div class="wrapper">
                            <div class="bg">
                                <div class="content_inner">
                                    @php(the_content())
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
             @endif

            @if(!empty($sections))
                @foreach($sections as $section)
                    @if(!empty($section))

                        @if(!empty($section['map_group']['map_img']))
                        <div class="section--padding ltp-section js-ltpSection js-progressTrack">
                            <div class="row column">
                                @if(!empty($section['map_group']['map_lesson']))
                                <?php
                                    $lesson_heading_map = preg_replace('/ /', '_', $section['map_group']['map_lesson']);
                                    $lesson_heading_map = strtolower($lesson_heading_map);
                                ?>
                                <h5 class="lesson_heading" id="{{$lesson_heading_map}}"> {{$section['map_group']['map_lesson']}}
                                </h5>
                                @else
                                    <?php
                                        $no_heading_counter = rand();
                                        $no_heading_declared = 'no_heading_declared_' . $no_heading_counter;
                                    ?>
                                <h5 class="lesson_heading" id="{{$no_heading_declared}}"></h5>
                                @endif
                                <div class="section_wrapper">
                                    <div class="section_scroller js-sectionScroller">
                                        <button class="to_next_section js-toNextSection"></button>
                                        <button class="to_prev_section js-toPrevSection"></button>
                                    </div>
                                    @include('partials.learn-to-play-map')
                                </div>
                            </div>
                        </div>
                        @endif

                        @if( !empty($section['video_group']) &&  ($section['video_group']['video_lesson'] || $section['video_group']['video_url'] || $section['video_group']['video_points']))
                        <div class="section--padding ltp-section js-ltpSection js-progressTrack">
                            <div class="row column">
                                @if(!empty($section['video_group']['video_lesson']))
                                <?php
                                    $lesson_heading_video = preg_replace('/ /', '_', $section['video_group']['video_lesson']);
                                    $lesson_heading_video = strtolower($lesson_heading_video);
                                ?>
                                <h5 class="lesson_heading" id="{{$lesson_heading_video}}"> {{$section['video_group']['video_lesson']}}</h5>
                                @else
                                    <?php
                                        $no_heading_counter = rand();
                                        $no_heading_declared = 'no_heading_declared_' . $no_heading_counter;
                                    ?>
                                <h5 class="lesson_heading" id="{{$no_heading_declared}}"></h5>
                                @endif
                                <div class="section_wrapper">
                                    <div class="section_scroller js-sectionScroller">
                                        <button class="to_next_section js-toNextSection"></button>
                                        <button class="to_prev_section js-toPrevSection"></button>
                                    </div>
                                @include('partials.learn-to-play-video')
                                </div>
                            </div>
                        </div>
                        @endif

                        @if(!empty($section['content_group']['section_content']))
                        <div class="section--padding ltp-section js-ltpSection js-progressTrack">
                            <div class="row column">
                                @if(!empty($section['content_group']['content_lesson']))
                                <?php
                                    $lesson_heading_section = preg_replace('/ /', '_', $section['content_group']['content_lesson']);
                                    $lesson_heading_section = strtolower($lesson_heading_section);
                                ?>
                                <h5 class="lesson_heading" id="{{$lesson_heading_section}}"> {{$section['content_group']['content_lesson']}}</h5>
                                @else
                                    <?php
                                        $no_heading_counter = rand();
                                        $no_heading_declared = 'no_heading_declared_' . $no_heading_counter;
                                    ?>
                                <h5 class="lesson_heading" id="{{$no_heading_declared}}"></h5>
                                @endif

                                <?php
                                    $content_section_label = $lesson_heading_section ? $lesson_heading_section : $no_heading_declared;
                                    $content_complete_value = 0;

                                    if(!empty($page_points)) {
                                        foreach($page_points as $page_points_key => $page_points_value) {
                                            if($page_points_key == $section['content_group']['content_lesson']) {
                                                $content_complete_value = $page_points_value;
                                            }
                                        }
                                    }
                                ?>
                                <div class="section_wrapper">
                                    <div class="section_scroller js-sectionScroller">
                                        <button class="to_next_section js-toNextSection"></button>
                                        <button class="to_prev_section js-toPrevSection"></button>
                                    </div>
                                    <div class="border--gold">
                                        <div class="wrapper">
                                            <div class="bg">
                                                <div class="content_inner">
                                                    {!! $section['content_group']['section_content'] !!}
                                                </div>
                                                <div class="section_footer">
                                                    <!-- for tracking -->
                                                    <ol class="js-pointsWrapper">
                                                        <li class="pointsWrapperItem mark_self_complete js-mark_self_complete" data-completed="{{$content_complete_value}}">
                                                            @if($content_complete_value == 1)
                                                            <span class="content_section_completed">
                                                                Completed
                                                            </span>
                                                            @else
                                                            <input type="checkbox" name="completed_section_{{$content_section_label}}" id="completed_section_{{$content_section_label}}" value="completed_section_{{$content_section_label}}" />
                                                            <label for="completed_section_{{$content_section_label}}">
                                                                Got it - mark me complete!
                                                            </label>
                                                            @endif
                                                        </li>
                                                    </ol>
                                                    <!-- end for tracking -->
                                                    <a href="#learn-to-play">Top</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        @endif
                        
                        <!-- new slide section -->
                        @if(!empty($section['slides_group']['slide_group']))
                        <div class="section--padding ltp-section js-ltpSection js-progressTrack">
                            <div class="row column">
                                @if(!empty($section['slides_group']['slide_lesson']))
                                <?php
                                    $lesson_heading_slide = preg_replace('/ /', '_', $section['slides_group']['slide_lesson']);
                                    $lesson_heading_slide = strtolower($lesson_heading_slide);
                                ?>
                                <h5 class="lesson_heading" id="{{$lesson_heading_slide}}"> {{$section['slides_group']['slide_lesson']}}
                                </h5>
                                @else
                                    <?php
                                        $no_heading_counter = rand();
                                        $no_heading_declared = 'no_heading_declared_' . $no_heading_counter;
                                    ?>
                                <h5 class="lesson_heading" id="{{$no_heading_declared}}"></h5>
                                @endif
                                <div class="section_wrapper">
                                    <div class="section_scroller js-sectionScroller">
                                        <button class="to_next_section js-toNextSection"></button>
                                        <button class="to_prev_section js-toPrevSection"></button>
                                    </div>
                                    @include('partials.learn-to-play-slides')
                                </div>
                            </div>
                        </div>
                        @endif
                        <!-- end slide section -->

                    @endif
                @endforeach
            @endif

        </section>
    @endwhile
@endsection