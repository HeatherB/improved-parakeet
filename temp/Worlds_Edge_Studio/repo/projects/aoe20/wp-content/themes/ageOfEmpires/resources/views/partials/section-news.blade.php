<section class="news-section">
    <div class="page-container">
        <div class="news-section__content">
            <h2 class="section__title">@if(isset($game_name)){{$game_name}} @else Recent @endif News</h2>
            <a class="section__title__more" href="#morenews">Read More {{icon('pointer-right')}}</a>

            @if (!isset($game_name))
                @include('partials.news-filters')
            @endif

            {{-- !!todo!! if a game variable is passed to this template, filter news --}}
            {{-- !!todo!! probably a better way to limit the number of posts --}}
            <div class="news-section__listing">
                @if(isset($limit))
                    <?php $i = 0; ?>
                    @while($i < $limit)
                        @include ('partials.content-post', ['post_content' => $news_posts[$i]])
                        <?php $i++; ?>
                    @endwhile
                @else
                    @forelse($news_posts as $news_post)
                        @include ('partials.content-post', ['post_content' => $news_post])
                    @empty
                        {{-- display no posts message --}}
                    @endforelse
                @endif
            </div>
        </div>
    </div>
</section>