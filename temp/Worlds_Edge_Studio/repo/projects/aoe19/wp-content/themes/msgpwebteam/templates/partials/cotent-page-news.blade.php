<div class="news-preview-wrapper">
    <div class="news-preview news-preview--vr <?php echo ( !empty($news_post['featured_image_url']) ) ? '' : 'news-preview--no-img'; ?>">
        <div class="news-preview__feat-img-wrapper">
            <div class="news-preview__feat-img-bg" style="background: url('@asset('images/knight.jpg')'); background-size:cover;">
                <img class="news-preview__feat-img" src="{{$news_post['featured_image_url']}}" alt="">
            </div>
        </div>
        <div class="news-preview__content">
            <div class="news-preview__content-wrapper">
                <div class="news-preview__content-header">
                    <div class="news-preview__cats news-preview__vr-bottom">
                        {{--@php(var_dump($news_post['cats']))--}}
                        {{--<div class="news-preview__cat"><span>{{ $news_post['cats'] }}</span></div>--}}
                        @forelse($news_post['cats'] as $cat)
                            <div class="news-preview__cat"><a href="{{ $cat['link'] }}"><span>{{ $cat['name'] }}</span></a></div>
                        @empty
                        @endforelse
                    </div>
                    <div class="news-preview__comment-count">
                        <span>01/15/2017</span>
                        <!--<span>17 <i class="fa fa-comment" aria-hidden="true"></i></span>-->
                    </div>
                </div>
                <div class="news-preview__content-text">
                    <div class="news-preview__title-wrapper">
                        <h4 class="news-preview__entry-title h3--entry-title"><a href="{{$news_post['permalink']}}">{{ $news_post['headline'] }}</a></h4>
                    </div>
                    <div class="news-preview__excerpt">
                        {{ $news_post['excerpt'] }}
                    </div>
                </div>
                <div class="news-preview__content-footer">
                    <div class="news-preview__content-footer-wrapper">
                        <div class="news-preview__date">
                        {{$news_post['paged']}}
                        <!--<span>01/15/2017</span>-->
                        </div>
                        <div class="news-preview__game-logo">
                            <!--<span class="font--header"><i class="icon-age4-01"></i></span>-->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>