export default class InsiderLanding {
    constructor() {
        this.init();
    }

    init() {

        this.card = {
            container: '.js-event-card',
            face: '.js-card-face',
            cardTurner: '.js-card-turner',
            flip: '--flipped',
            backflip: '--backflip',
            revealContainer: '.js-event-keys',
            revealKey: '.js-reveal-key',
            revealed: '--revealed',
            obscured: '--obscured',
            xboxHub: '.js-xbox-hub',
            hubLink: 'ms-windows-store://pdp/?ProductId=9pldpg46g47z',
        };

        this.forumLatest = {
            container: '.js-forum-latest',
            url: "https://forums.ageofempires.com/t/",
        }

        if ( $(this.forumLatest.container).length ) {
            this._getForumsLatest();
        }

        this.events();
    }

    _getForumsLatest() {

        let self = this;

        // Get Latest Post
        $.ajax({
            type: "POST",
            dataType: 'JSON',
            data: {
                action: "forums_get_latest",
            },
            url: window.wp_object.ajaxurl,
            success: function(response) {
                $.each(response, function( index, value ) {

                    if(index >= 3){
                        return;
                    }

                    let DateCreate = new Date(value.created_at);

                    let DateFormat = DateCreate.getMonth() + '/' + DateCreate.getDate() + '/' + DateCreate.getFullYear();
                    $(self.forumLatest.container).prepend('<li><span class="forum-latest__date">' + DateFormat + '</span> &ndash; <a class="forum-latest__link" href="'+ self.forumLatest.url + value.slug +'" target="_blank">' + value.title + '</a></li>');
                });
            },
        });
    }

    events() {
        let self = this;

        $(document).on('click', self.card.xboxHub, function(e) {
            e.stopPropagation();
            window.location.href = self.card.hubLink;
        });

        $(document).on('click', self.card.revealKey, function(e) {
             e.stopPropagation();
             let $parent = $(this).parents(self.card.revealContainer);

            if($parent.hasClass(self.card.revealed)) {
                $parent.addClass(self.card.obscured);

                setTimeout(function() {
                  $parent.removeClass(self.card.revealed + ' ' + self.card.obscured);
                }, 500);

              } else {
                $parent.addClass(self.card.revealed);
              }
        });

        $(document).on('click', self.card.cardTurner, function(e) {
            e.stopPropagation();
            let $parent = $(this).parents(self.card.container);

            if($parent.hasClass(self.card.flip)) {
                $parent.addClass(self.card.backflip);

                setTimeout(function() {
                  $parent.removeClass(self.card.flip + ' ' + self.card.backflip);
                }, 500);

              } else {
                $parent.addClass(self.card.flip);
              }
        });

        // modal is opened via foundation data attribute in the html
    }
}
