@if (isset($post_content))

<article class="post">
    <a class="post__link" href="{!! $post_content['permalink'] !!}">
       
        <div class="post__thumbnail">
            @if(has_post_thumbnail())
                {!! $post_content['featured_image'] !!}
            @endif
        </div>
        
        <div class="post__info">
            <div class="post__type">
                <span class="post__type__text">
                    @forelse($post_content['cats'] as $cat)
                        {!! $cat['name'] !!}
                    @empty
                    @endforelse
                </span>
            </div>

            <h3 class="post__title" title="{{$post_content['headline']}}">
                
                <span class="post__title__text">
                    {!! $post_content['headline'] !!}
                </span>
                
            </h3>
        </div>
    </a>
</article>

@endif


