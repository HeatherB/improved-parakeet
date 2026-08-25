@extends('layouts.base-alt')

@section('content')
    @while(have_posts()) @php(the_post())
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
                    <div class="columns medium-8">
                        <div class="single-content">
                            <div class="frame-box clans-manifesto">
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
                            <section class="comments">
                                @include('partials.comments')
                            </section>
                        </div>
                    </div>
                    <div class="columns medium-4">
                        <div class="frame-box clans-stats single-related">
                            <div class="frame-box__inner frame-box__inner--dark">
                                <div class="single-related__header">
                                        <h2 style="margin-bottom: 0;" class="h3 h3--light">Related Articles</h2>
                                </div>
                            </div>
                        </div>
                        @if($related && isset($related['news_posts']))
                            @foreach($related['news_posts'] as $news_post)
                             @include('partials.related-posts')
                            @endforeach
                        @endif

                    </div>
                </div>
            </main>
        </div>
    </div>
    @endwhile
@endsection
