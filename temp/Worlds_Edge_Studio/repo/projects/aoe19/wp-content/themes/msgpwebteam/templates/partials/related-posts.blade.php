
<div class="frame-box related-card">
    @if($news_post['featured_image_url'])
        <div class="related-card__thumb" style="background-image: url('{{$news_post['featured_image_url']}}');"></div>
    @endif
    <div class="frame-box__inner frame-box__inner--light">
        <h4 class="related-card__title"><a title="{{ $news_post['headline'] }}" href="{{$news_post['permalink']}}">{{ $news_post['headline'] }}</a></h4>
        <span class="related-card__date">{{$news_post['date']}}</span>
    </div>
</div>
