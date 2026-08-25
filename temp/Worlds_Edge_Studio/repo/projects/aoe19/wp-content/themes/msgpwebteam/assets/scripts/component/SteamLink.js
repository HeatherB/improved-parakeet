export default class SteamLink {

    constructor() {
        this.init();
    }

    init() {
        this.steamWindow;
        this.steamData;
        this._events();
    }

    _events() {
        let self = this;

        // Steam Login
        $(document).on('click', '.js-steam_connect', function (event) {

            event.preventDefault();

            // Determine New Window Size
            var width = window.innerWidth * 0.5;
            var height = width * window.innerHeight / window.innerWidth;

            // Open Window
            self.steamWindow = window.open($(event.currentTarget).attr('href'), 'steamWindow', 'width=' + width + ', height=' + height + ', top=' + ((window.innerHeight - height) / 2) + ', left=' + ((window.innerWidth - width) / 2));

            // Check For closed status
            var timer = setInterval(function () {
                if (self.steamWindow.closed) {
                    clearInterval(timer);
                    $.ajax({
                        type: "POST",
                        dataType: "JSON",
                        data: {
                            action: "steamConnect",
                        },
                        url: window.wp_object.ajaxurl,
                        success: function (response) {
                            self.steamData = response;
                            console.log('check: ' + JSON.stringify(response));
                            if(response.steam_id) {
                                $(document).trigger('steam_login_closed');
                            }
                        },
                    });
                }
            }, 1000);

        });

        // Disconnect Steam
        $(document).on('click', '.js-steam_delete', function (event) {
            event.preventDefault();

            $(this).prop('disabled',true).addClass('pending');

            let nonce = $(this).data('nonce');
            let action = "steamDelete";

            $.ajax({
                type: "POST",
                dataType: "JSON",
                data: {
                    action: action,
                    nonce: nonce,
                },
                url: window.wp_object.ajaxurl,
                success: function (response) {
                    self.steamData = {};
                    if(response.success) {
                        $(document).trigger('steam_deleted');
                    }
                },
            });

        });

    }

}