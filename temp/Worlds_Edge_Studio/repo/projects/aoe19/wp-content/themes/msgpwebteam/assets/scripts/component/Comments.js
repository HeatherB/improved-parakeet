import Loading from './Loading';
import ajaxGet from '../util/ajaxGet';
import commentsTemplate from '../templates/commentsTemplate.html';
import commentForm from '../templates/commentForm.html';

export default class Comments {
    constructor(objOptions = {}) {
        this.init(objOptions)
    }

    init(objOptions) {
        this.options = Object.assign({
            $page   : 1,
        }, objOptions);

        this.ui = {
            $container          : $('.comment-content'),
            $modal:             $('#sign-in-steam'),
            $currCommentNum     : $('.js-current-comment-num'),
            $totalCommentCount  : $('.js-total-comment-count'),
            $commentForm        : $('.e-commentForm'),
            $commentBox         : $('.e-commentBox'),
            $commentSubmit      : $('.e-commentSubmit'),
            $commentCancel      : $('.e-commentCancel'),
            $commentList        : $('#comment-list-main'),
            $reply              : $('.e-reply'),
            reply               : '.e-reply',
            $loadMore           : $('.e-load-more'),
        }
        this.commentForm = $('#comment-form');
        this.commentLoader = new Loading({
            // container: this.ui.$container,
        });

        this._updateCurrCommentNum();
        this._addEventListeners();
    }

    _addEventListeners() {
        var self = this;
        this.ui.$commentForm.on('focus', '.e-commentBox', function (e) {
            if (window.wp_object.user_logged_in.status != true) return self._promptLogin();
            e.preventDefault();
        });
        this.ui.$commentSubmit.on('click', function (e) {
            if (window.wp_object.user_logged_in.status != true) return self._promptLogin();
            self._postComment(self.ui.$commentBox.val());
            e.preventDefault();
        })
        this.ui.$commentList.on('click', this.ui.reply, function (e) {
            if (window.wp_object.user_logged_in.status != true) return self._promptLogin();
            if ($(this).closest('.comment--parent').find('.comment-form-wrapper').length !== 0) {
                $('html, body').animate({
                    scrollTop: $(this).closest('.comment--parent').find('.comment-list--children').offset().top + $(this).closest('.comment--parent').find('.comment-list--children').height(),
            }, 500);
                return;
            } else {
                $('.comment-form-wrapper').remove();
                let commentId = $(this).closest('.comment--parent').attr('data-id');
                let data = {
                    avatar: window.wp_object.avatar,
                    comment_id: commentId,
                }
                $('html, body').animate({
                    scrollTop: $(this).closest('.comment--parent').find('.comment-list--children').offset().top + $(this).closest('.comment--parent').find('.comment-list--children').height(),
                }, 500);
                $(this).closest('.comment--parent').find('.js-comment-form-mount').append(commentForm(data))
                self.ui.$commentCancel = $('.e-commentCancel');
                self.ui.$commentChildSubmit = $(this).closest('.comment').find('.e-commentSubmit');
                self.ui.$commentCancel.on('click', function (e) {
                    $(this).closest('.comment-form-wrapper').remove();
                    e.preventDefault();
                });
                self.ui.$commentChildSubmit.on('click', function (e) {
                    let childCommentContent = $(this).closest('.comment-form--children').find('.e-commentBox').val();
                    $(this).closest('.comment-form--children').find('.e-commentBox').val('');
                    let parentId = $(this).closest('.comment--parent').attr('data-id');
                    self._postComment(childCommentContent, 1, parentId, $(this).closest('.comment--parent').find('.comment-list--children'));
                    e.preventDefault();
                })
            }
            e.preventDefault();
        })
        this.ui.$loadMore.on('click', function (e) {
            let offset = self._getOffset();
            self._loadComments(offset)
            e.preventDefault();
        })
    }
    _postComment(commentContent, number = 1, commentId = null, commentMount = null) {
        let mount = (null !== commentMount) ? commentMount : null;
        let mountType = (null !== mount) ? 'append' : 'prepend';
        this.commentLoader.show();

        let xhrs = [
            ajaxGet({
                url: window.wp_object.ajaxurl,
                data: {
                    action: 'post_comment',
                    number: number,
                    post_ID: window.wp_object.post_ID,
                    comment_content: commentContent,
                    comment_parent: commentId,
                    security: window.wp_object.ajax_nonce,
                },
            }),
        ];
        Promise.all(xhrs).then((response) => {
            if (response) {
                this._renderComments(response, mountType, mount);
            } else {
                this._error();
            }
            this.commentLoader.hide();
            $('#comment-form')[0].reset();
        }).catch(() => {
            this._error();
            this.ui.$reply = $('.reply');
            this.commentLoader.hide();
        });
    }

    _loadComments(offset = null, commentId = 0) {
        this.commentLoader.show();
        let xhrs = [
            ajaxGet({
                url: window.wp_object.ajaxurl,
                data: {
                    action: 'load_comments',
                    offset: offset,
                    post_ID: window.wp_object.post_ID,
                    comment_parent: commentId,
                    security: window.wp_object.ajax_nonce,
                },
            }),
        ];
        Promise.all(xhrs).then((response) => {
            if (response) {
                this._renderComments(response, "append");
            } else {
                this._error();
            }
            this.commentLoader.hide();
            $('#comment-form')[0].reset();
        }).catch(() => {
            this._error();
            this.commentLoader.hide();
        });
    }

    _renderComments(response, mountType, commentMount = null) {
        let data = {
            comments: response[0]['comments'],
            comment_count: response[0]['comment_count'],
            comment_offset: response[0]['comment_offset'],
            comment_parent: response[0]['comment_parent'],
        }
        if (mountType == 'prepend') {
            if(null !== commentMount) {
                console.log(commentMount);
                commentMount.prepend(commentsTemplate(data));
            } else {
                this.ui.$commentList.prepend(commentsTemplate(data));
            }
        } else if(mountType == 'append') {
            if(null !== commentMount) {
                commentMount.append(commentsTemplate(data));
            } else {
                this.ui.$commentList.append(commentsTemplate(data));
            }
        }
        this._updateCurrCommentNum(data);
        this._updateTotalCommentCount(data.comment_count);
        if((data.comment_count - data.comment_offset) < 10 ){
          $('.e-load-more').remove();
        }
    }

    _getOffset(){
        let commentNumberToOffset = $( 'ul#comment-list-main > li.comment' ).length;
        return commentNumberToOffset;
    }

    _updateCurrCommentNum(data = null) {

        this.ui.$currCommentNum.html(this._getOffset());
        if(data) {
            if (data.comment_count && data.comment_offset) {
                let comment_count = data.comment_count;
                let comment_offset = data.comment_offset;
                if (comment_count == comment_offset) {
                    $('.e-load-more').remove();
                }
            }
        }

    }

    _updateTotalCommentCount(count) {
        this.ui.$totalCommentCount.html(count);
    }

    _promptLogin() {
        this.ui.$modal.foundation('open');
        return false;
    }

    _error() {
        //handle error
    }
}