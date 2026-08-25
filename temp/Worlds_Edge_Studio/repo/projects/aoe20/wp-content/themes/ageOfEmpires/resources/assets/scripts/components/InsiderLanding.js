export default class InsiderLanding {
    constructor() {
        this.init();
    }

    init() {

        this.forumLatest = {
            container: '.js-forum-latest',
            url: 'https://forums.ageofempires.com/t/',
        }

        if ( $(this.forumLatest.container).length ) {
            this._getForumsLatest();
        }
    }

    _getForumsLatest() {

        let self = this;

        // Get Latest Post
        $.ajax({
            type: 'POST',
            dataType: 'JSON',
            data: {
                action: 'forums_get_latest',
            },
            url: window.wp_object.ajaxurl,
            success: function(response) {
                $.each(response, function( index, value ) {

                    if(index >= 3){
                        return;
                    }

                    let DateCreate = new Date(value.created_at);

                    let DateFormat = DateCreate.getMonth() + '/' + DateCreate.getDate() + '/' + DateCreate.getFullYear();
                    $(self.forumLatest.container).prepend('<li class="insiders__forum-entry"><span class="insiders__forum-date">' + DateFormat + '</span> &ndash; <a class="link" href="'+ self.forumLatest.url + value.slug +'" target="_blank">' + value.title + '</a></li>');
                });
            },
        });
    }
}
