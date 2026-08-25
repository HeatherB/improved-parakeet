export default class AzureMediaModal {


    constructor() {
        this.init();
    }


    init() {

        this.ui = {
            player: $('#azuremediaplayer'),
        };

        if (this.ui.player.length) {
            this._buildPlayer();
            this._eventHandlers();
            this._watermark();
        }

    }


    _buildPlayer() {

        var self = this;

        var myOptions = {
            "nativeControlsForTouch": false,
            controls: true,
            autoplay: false,
            fluid: true,
        }
        // amp funtion is located in external js from CDN
        /* eslint-disable */
        self.ui.AMPPlayer = amp(self.ui.player.attr("id"), myOptions);
        /* eslint-enable */

        self._getVideos();

    }


    _eventHandlers() {

        var self = this;

        // Disable right click
        $('#video_player').bind("contextmenu", function (e) {
            return false;
        });

        $('#video-modal[data-reveal]').on('closed.zf.reveal', function () {
            self.ui.AMPPlayer.dispose();
            $(document).trigger('followup');
        });

    }


    _watermark() {

        $.ajax({
            type: "POST",
            data: {
                action: "watermark",
            },
            url: window.wp_object.ajaxurl,
            success: function (response) {
                $('.vjs-text-track-display').css('background', 'url("data:image/png;base64,' + response + '")');
            },
        });

    }


    _getVideos() {

        var self = this;

        $.ajax({
            type: "POST",
            data: {
                action: "getVideoByID",
                video_id: $(self.ui.player).data('video'),
                nonce: $(self.ui.player).data('nonce'),
            },
            url: window.wp_object.ajaxurl,
            success: function (response) {

                var videoData = JSON.parse(response);

                var src = [{
                    "src": videoData.stream_src.replace(/(^\w+:|^)\/\//, '//'),
                    "type": "application/vnd.ms-sstr+xml",
                }];

                if (videoData.caption_src){
                    var captions = [{
                        "src": videoData.caption_src,
                        "srclang": "en-us",
                        "label": "English",
                        "kind": "captions",
                    }];
                    self.ui.AMPPlayer.src(src,captions);
                } else {
                    self.ui.AMPPlayer.src(src);
                }


            },
        });

    }

}
