
@forelse($news_posts as $news_post)
  <article class="news-preview__result frame-box search-results mods-search-results">
        <div class="frame-box__inner frame-box__inner--light frame-box__inner--no-pad frame-box__inner--loading">

            <div class="news-preview">
                    
                @if(!empty($news_post['featured_image_url']))
                    <div class="news-preview__thumbnail">
                        <img src='{{$news_post['featured_image_url']}}' role="presentation" alt="'{{ $news_post['headline'] }}' thumbnail" />
                    </div>
                @endif

                <div class="news-preview__content">
                    <div class="news-preview__content__body">

                        <ul class="news-preview__categories not_a_list" aria-label="Categories">
                            <span class="visually-hidden">
                                Categories
                            </span>

                            @forelse($news_post['cats'] as $cat)
                                <li>
                                    <a class="news-preview__category" href="{{ $cat['link'] }}">{{ $cat['name'] }}</a>
                                </li>
                            @empty
                            @endforelse
                        </ul>

                        <h4 class="news-preview__title">
                            <a class="news-preview__link" href="{{$news_post['permalink']}}">@if(!empty($lang_title)) {!! $lang_title !!} @endif {{ $news_post['headline'] }}</a>
                        </h4>
                                
                        <div class="news-preview__excerpt">{{ $news_post['excerpt'] }}</div>
                    </div>

                    <div class="news-preview__content__footer">
                        <div class="news-preview__byline">
                            Posted 
                            @if($news_post['author'])
                                by {{$news_post['author']}} 
                            @endif
                            <span class="news-preview__timestamp">{{$news_post['date']}}</span>
                        </div>

                        <ul class="news-preview__game-tags not_a_list">
                            @foreach($news_post['tax'] as $tax)
                                @if($tax['svg'])
                                    <li>
                                        <a class="news-preview__game-link" href="{{ $current_base }}?game={{$tax['slug']}}">
                                            <span class="visually-hidden">{{getAriaPhrase($tax['slug'])}} News</span>
                                            {!! $tax['svg'] !!}
                                        </a>
                                    </li>
                                @endif
                            @endforeach
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </article>

@empty
    <p>No results found.</p>
@endforelse
