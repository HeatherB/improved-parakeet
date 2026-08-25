<section class="comments section--padding-bottom">
    <section class="comment-content">
        <h3><i class="icon-break-comment"></i>Discuss @if($comment_count > 0)<span class="comment-content__count js-current-comment-num"></span><span class="comment-content__count"> of <span class="js-total-comment-count">{{$comment_count}}</span> comments</span>@else <span class="comment-content__count">Be the first to comment!</span>@endif</h3>
        <div class="comment-form">
            <form class="e-commentForm" id="comment-form">
                <div class="comment-form__row">
                    <div class="comment-form__avatar @if(!is_user_logged_in()) comment-form__avatar--logged-off @endif">
                            @if(is_user_logged_in())
                                {!! $user_avatar !!}
                            @else
                                <i class="fa fa-user"></i>
                            @endif
                    </div>
                    <div class="comment-form__comment-box">
                        <textarea class="e-commentBox"></textarea>
                    </div>
                </div>
                <div class="comment-form__row">
                    <div class="comment-form__buttons-wrapper">
                        <button class="btn-aoe e-commentSubmit" type="submit">Post Comment</button>
                    </div>
                </div>
            </form>
        </div>
        <div class="divider none"></div>
        <section class="comment-wrap">

            <div class="frame-box">
                <div class="frame-box__inner frame-box__inner--light">
                    @include('components.comments')
                </div>
            </div>
            @if($comment_count > $comment_number)
                <div class="comment-wrap__load-more">
                    <h3><i class="icon-break-comment"></i><span class="comment-content__count js-current-comment-num"></span><span class="comment-content__count"> of <span class="js-total-comment-count">{{$comment_count}}</span> comments</span></h3>
                    <button class="btn-aoe e-load-more">Load More Comments</button>
                </div>
            @endif

        </section>

    </section>
</section>