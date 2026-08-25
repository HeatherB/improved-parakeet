@extends('layouts.app')

@section('content')
    <div class="page-container news">
        <h2 class="page__title">
            <span class="page__title__text">
                Age of Empires {{get_the_archive_title()}}
            </span>
        </h2>

        @if(isset($featured_post))
            <section class="featured-news">

                <article class="featured-news__post">
                    <div class="featured-news__post__thumbnail">
                        <div class="featured-news__post__thumbnail__container">
                            @if(has_post_thumbnail())
                                {!! $featured_post['featured_image'] !!}
                            @endif

                            <div class="featured-news__post__type">
                                <span class="featured-news__post__type__text">
                                    @forelse($featured_post['cats'] as $cat)
                                        {!! $cat['name'] !!}
                                    @empty
                                    @endforelse
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="featured-news__post__info">
                        <h3 class="featured-news__post__title">{!! $featured_post['headline'] !!}</h3>

                        <p class="featured-news__post__excerpt">
                            {!! $featured_post['excerpt'] !!}
                        </p>
                        <a class="featured-news__post__more-button" href="{!! $featured_post['permalink'] !!}">{{icon('news')}} Read More</a>
                    </div>
                </article>
            </section>
        @endif




        <section class="news__body" id="newsPosts">

            @include('partials.news-filters')

            
            <div class="news__post-listing">
                @forelse($news_posts as $news_post)
                    @include ('partials.content-post', ['post_content' => $news_post, 'is_featured' => false])
                @empty
                    <p>No results found.</p>
                @endforelse
                <div class="flex-placeholder"></div>
                <div class="flex-placeholder"></div>
            </div>

            <div class="news__controls">
                @if($cats)
                    @include('partials.category-select')
                @endif

                @if($pagination)
                    @include('partials.pagination')
                @endif
            </div>            
        </section>
    </div>
@endsection
