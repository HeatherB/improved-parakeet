<?php
    /*
    * Template Name: Release Notes
    * Template Post Type: post
    */
?>
@extends('layouts.base-alt')

@section('content')
    @while(have_posts()) @php(the_post())

    <?php $sections = get_field('sections'); ?>

    <div class="banner clans-banner clans-detail-banner">
        <div class="row column text-center">
            <div class="clans-banner__name-motto">
                <h1 class="light">{{ get_the_title() }}</h1>
            </div>
        </div>
    </div>

    <div class="content section--divider-frank-mid background--rock single-layout">
        <div class="row">
            <main class="clans-detail-content main section--padding-top section--padding-lr-med-only">
                <div class="row">
                    <div class="columns small-12 medium-4 medium-push-8">
                        <div class="js-fixedSidebar mobile_hide_topics">
                            <div class="frame-box__inner--secondary frame-box__inner--light js-toggleSubNavigation">
                                <span class="toggle_sub_navigation">Show Topics</span>
                            </div>    
                            <div class="frame-box frame-box--toc">
                                <div class="frame-box__inner frame-box__inner--dark">
                                    <div class="toc__header js-toTop">
                                        <h4>{{get_field('release_title')}}</h4>
                                        <span class="to-top" id="to-top"><i class="fa fa-angle-double-up"></i>Top</span>
                                    </div>
                                    <ol class="toc__list" id="toc">
                                        @foreach($sections as $section)

                                            <?php 
                                                $sectionID = $section['id'] ? $section['id'] : $section['header']; 
                                                $sectionID = str_replace(' ','-',$sectionID);
                                                $sectionID = preg_replace('/[^A-Za-z0-9\-]/','',$sectionID)
                                            ?>

                                            <li class="toc__list__item">
                                                <a data-id="{{$sectionID}}">{{$section['header']}}</a>

                                                @if($section['subsections'])
                                                    <ol class="toc__list toc__list--sub">
                                                        @foreach($section['subsections'] as $subsection)

                                                            <?php 
                                                                $subID = $subsection['id'] ? $subsection['id'] : $subsection['header']; 
                                                                $subID = str_replace(' ','-',$subID);
                                                                $subID = preg_replace('/[^A-Za-z0-9\-]/','',$subID)
                                                            ?>

                                                            <li class="toc__list__item">
                                                                <a data-id="{{$sectionID}}_{{$subID}}">{{$subsection['header']}}</a>
                                                            </li>
                                                        @endforeach
                                                    </ol>
                                                @endif
                                            </li>
                                        @endforeach
                                        
                                    </ol>
                                     @if(isset($discussion_link) && !empty($discussion_link))
                                    <div class="toc__footer js-toDiscussion">
                                        <span class="to-top" id="to-discussion"><i class="fa fa-angle-double-down"></i>Discuss</span>
                                    </div>
                                    @endif
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="columns small-12 medium-8 medium-pull-4">
                        <div class="single-content js-mainContent">
                            <div class="frame-box frame-box--card">
                                <div class="frame-box__inner frame-box__inner--dark">
                                    <div class="single-content__byline">
                                        <div class="single-content__pp">
                                            <?php echo get_avatar( get_the_author_meta('user_email'), $size = '60'); ?>
                                        </div>
                                        <div class="single-content__post-info">
                                            <div class="single-content__author-name">
                                                <span>{{ get_the_author() }}</span>
                                            </div>
                                            <div class="single-content__meta">
                                                <div class="single-content__date">
                                                    <span>{{ get_the_date() }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="frame-box__inner frame-box__inner--light">
                                    @php(the_content())
                                </div>
                            </div>

                            @foreach($sections as $section)
                                <?php 
                                    $sectionID = $section['id'] ? $section['id'] : $section['header']; 
                                    $sectionID = str_replace(' ','-',$sectionID);
                                    $sectionID = preg_replace('/[^A-Za-z0-9\-]/','',$sectionID)
                                ?>

                                <div class="frame-box frame-box--card">
                                    <div class="frame-box__inner frame-box__inner--light">
                                        <h3 id="{{$sectionID}}" class="anchor">{{$section['header']}}</h2>
                                        {!! $section['content'] !!}

                                        @if($section['subsections'])
                                            @foreach($section['subsections'] as $subsection)
                                                <?php 
                                                    $subID = $subsection['id'] ? $subsection['id'] : $subsection['header']; 
                                                    $subID = str_replace(' ','-',$subID);
                                                    $subID = preg_replace('/[^A-Za-z0-9\-]/','',$subID)
                                                ?>

                                                <div class="frame-box__inner frame-box__inner--no-border frame-box__inner--card">
                                                    <h4 id="{{$sectionID}}_{{$subID}}" class="anchor">{{$subsection['header']}}</h3>
                                                    {!! $subsection['content'] !!}
                                                </div>
                                            @endforeach
                                        @endif
                                    </div>
                                </div>
                            @endforeach

                        <section class="comments js-join-discussion">

                            @if(isset($discussion_link) && !empty($discussion_link))
                                <a href="{{$discussion_link}}" target="_blank" class="sandbutton linkreset">Join the discussion</a>
                            @endif

                        </section>
                        </div>
                    </div>
                    
                </div>
            </main>
        </div>
    </div>
    @endwhile
@endsection
