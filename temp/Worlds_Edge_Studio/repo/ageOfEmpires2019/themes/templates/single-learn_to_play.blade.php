@extends('layouts.base')

@section('content')
    @while(have_posts()) @php(the_post())   
        @include('partials.banner', ['class' => "learn_to_play"])



        <section id="learn-to-play" class="block-content section--divider-frank-mid background--rock content {{$associated_game}}" data-postid="{{$this_post_ID}}"> 

            <div class="section--padding ltp-toc">
                <div class="row column">
                    <div class="border--gold">
                        @include('partials.ltp-table-of-contents', ['class' => "learn_to_play"])
                    </div>
                </div>
            </div> 



            <!-- test section for user progress -->
            <?php
                
                echo ' $ltp_progress ' ;
                var_dump($ltp_progress);

                /*foreach($ltp_progress as $key => $value) {
                    echo 'key is ' . $key. ' ';
                    
                    if(is_array($value)) {
                        foreach($value as $sec_key => $sec_value) {
                            echo '$sec_key is ' . $sec_key . ' ';
                            echo '$sec_value is ';
                            var_dump($sec_value);
                            echo ' ';
                        }
                    } else {
                        echo 'value is ';
                        var_dump($value);
                    }
                }*/

            
            ?>
            <!-- end test section -->

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
                                <h5 class="lesson_heading" id="{{$lesson_heading_map}}"> {{$section['map_group']['map_lesson']}}</h5>
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

                        @if(!empty($section['video_group']['video_url']) || !empty($section['video_group']['youtube_id']))
                        <div class="section--padding ltp-section js-ltpSection js-progressTrack">
                            <div class="row column">
                                @if(!empty($section['video_group']['video_lesson']))
                                <?php
                                    $lesson_heading_video = preg_replace('/ /', '_', $section['video_group']['video_lesson']);
                                    $lesson_heading_video = strtolower($lesson_heading_video);
                                ?>
                                <h5 class="lesson_heading" id="{{$lesson_heading_video}}"> {{$section['video_group']['video_lesson']}}</h5>
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
                        <div class="section--padding ltp-section js-ltpSection">
                            <div class="row column">
                                @if(!empty($section['content_group']['content_lesson']))
                                <?php
                                    $lesson_heading_section = preg_replace('/ /', '_', $section['content_group']['content_lesson']);
                                    $lesson_heading_section = strtolower($lesson_heading_section);
                                ?>
                                <h5 class="lesson_heading" id="{{$lesson_heading_section}}"> {{$section['content_group']['content_lesson']}}</h5>
                                @endif
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
                                                    <a href="#learn-to-play">Top</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        @endif

                    @endif
                @endforeach
            @endif

        </section>
    @endwhile
@endsection

