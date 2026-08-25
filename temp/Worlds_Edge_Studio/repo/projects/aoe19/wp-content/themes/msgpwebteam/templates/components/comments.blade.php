<ul id="comment-list-main" class="comment-list not_a_list" data-post-id="{{$post_id}}" data-current-time="{{$comment_count}}">
@if(!empty($comments))
    @forelse($comments as $comment)
        <li class="comment {{ $comment['comment_class'] }} {{ $comment['comment_has_children'] }}" data-id="{{ $comment['comment_id'] }}">
            <div class="comment__content">
                <div class="comment__header">
                    <div class="comment__avatar">
                        {!! $comment['comment_avatar'] !!}
                    </div>
                    <div class="comment__meta">
                        <span class="comment__author">{{ $comment['comment_author'] }}</span>
                        <span class="comment__date-time">{{ $comment['comment_date'] }}</span>
                       <!-- <span class="comment__delete"><a href="#" class="e-delete">Delete</a></span>-->
                    </div>
                </div>
                <div class="comment__entry">
                    <div class="comment__text">
                        {!! $comment['comment_content'] !!}
                    </div>
                </div>
                <div class="comment__actions">
                    <div class="comment__reply-wrapper">
                        <span class="e-reply"><i class="fa fa-reply"></i> Reply</span>
                    </div>
                </div>
            </div>
            <div class="comment__form-mount js-comment-form-mount">
            <ul class="comment-list comment-list--children clearfix not_a_list">
            @if(!empty($comment['comment_children']))
                @forelse($comment['comment_children'] as $comment)
                    <li class="comment {{ $comment['comment_class'] }}" data-id="{{ $comment['comment_id'] }}">
                        <div class="comment__content">
                            <div class="comment__header">
                                <div class="comment__avatar">
                                    {!! $comment['comment_avatar'] !!}
                                </div>
                                <div class="comment__meta">
                                    <span class="comment__author">{{ $comment['comment_author'] }}</span>
                                    <span class="comment__date-time">{{ $comment['comment_date'] }}</span>
                                    <!--<span class="comment__delete"><a href="#" class="e-delete">Delete</a></span>-->
                                </div>
                            </div>
                            <div class="comment__entry">
                                <div class="comment__text">
                                    {!! $comment['comment_content'] !!}
                                </div>
                            </div>
                        </div>
                    </li>
                @empty
                @endforelse
            @endif
            </ul>
            </div>
        </li>
    @empty

    @endforelse
@endif
</ul>
