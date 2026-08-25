export default class InsidersVideoPortal {
    constructor() {
        this.init();
    }

    init() {

        this.videos = {}

        this.ui = {
            triggerContainer: document.getElementById('video-btns'),
            videoTriggers: '',
            videoSelection: '',
            heading: '',
            videoWrapper: document.getElementById('insider_video_wrapper'),
            btnArea: document.getElementById('video-btns'),
            contentArea: document.getElementById('video-meta'),
            selectFlight: document.getElementById('flight-selector'),
            selectCat: document.getElementById('cat-selector'),
        }
        if (this.ui.selectFlight) {
            if (this._checkParams('group')) {
                this._get_videos(this._checkParams('group'));
            } else {
                this._get_videos(this.ui.selectFlight.getElementsByTagName('option')[0].getAttribute('data-flightid'));
            }
        }
    }

    _checkParams(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return (false);
    }

    _loadFirst() {
        var self = this;
        self._loadVideo(self.ui.videoTriggers[0]);
    }

    _loadVideo(trigger) {
        var self = this;

        let thisTrigger = trigger ? trigger : event.target.closest('.flight-media-trigger');

        if (thisTrigger) {

            self.ui.videoWrapper.style.display = 'block';

            Array.from(thisTrigger.parentElement.getElementsByTagName('button')).forEach(child => child.classList = 'flight-media-trigger');
            thisTrigger.classList = 'flight-media-trigger selected';
            self.ui.heading = thisTrigger.getElementsByTagName('span')[0].innerHTML;

            self.ui.videoSelection = thisTrigger.getAttribute('data-contenttag');
            self._buildVideo();

        } else {

            self._noVideo();

        }
    }

    _noVideo() {
        var self = this;

        self.ui.contentArea.getElementsByTagName('h4')[0].innerHTML = 'No Videos';
        self.ui.contentArea.getElementsByTagName('h5')[0].innerHTML = '';

        self.ui.videoWrapper.style.display = 'none';

    }

    _buildVideo() {
        var self = this;

        self.ui.contentArea.getElementsByTagName('h4')[0].innerHTML = self.ui.heading;
        self.ui.contentArea.getElementsByTagName('h5')[0].innerHTML = self.ui.selectFlight.value;
        // AMP it included in the header through a CDN. the "amp" function is there, so disabling lint wherever it's used.
        /* eslint-disable */
        var myOptions = {
            "nativeControlsForTouch": false,
            controls: true,
            autoplay: false,
            fluid: true,
            poster: self.videos[self.ui.videoSelection]['video_poster'],
        }
        self.ui.AMPPlayer = amp("azuremediaplayer", myOptions);
        self.ui.AMPPlayer.src([
            {
                "src": self.videos[self.ui.videoSelection]['stream_src'].replace(/(^\w+:|^)\/\//, '//'),
                "type": "application/vnd.ms-sstr+xml",
            }
        ]);
        /* eslint-enable */
        self._watermark();
    }

    // Handlers
    _eventHandlers() {
        var self = this;

        self.ui.videoTriggers.forEach(function (videoTrig) {
            videoTrig.addEventListener('click', function (e) {
                e.preventDefault();
                self._loadVideo();
            })
        });

        $('#video-sidebar').one('change', '#flight-selector,#cat-selector', function (e) {
            var termID = $('#flight-selector option:selected').attr('data-flightid');
            var catID = $('#cat-selector option:selected').attr('data-catid');
            self._get_videos(termID, catID);
        });

        // Disable right click
        $('#video_player').bind("contextmenu", function (e) {
            return false;
        });

    }

    // Search Video For Attribute
    _search_videos(criteria) {
        var returnValue = 0;
        $.each(this.videos, function (index, video) {
            if (video.video_id == criteria) {
                returnValue = index;
            }
        });
        return returnValue;
    }

    // Watermark
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

    // Get Videos
    _get_videos(termID, catID = this.ui.selectCat.getElementsByTagName('option')[0].getAttribute('data-catid')) {
        var self = this;
        var videoCount = 0;

        self.ui.triggerContainer.innerHTML = "";

        $.ajax({
            type: "POST",
            dataType: 'JSON',
            async: false,
            data: {
                action: "getFlightVideos",
                termID: termID,
                category: catID,
            },
            url: window.wp_object.ajaxurl,
            success: function (response) {
                videoCount = response.length;

                if (videoCount) {
                    $.each(response, function (index, video) {
                        self.videos[index] = video;
                        self.ui.triggerContainer.innerHTML += '<button type="button" data-contenttag="' + index + '" class="flight-media-trigger"><span>' + video.video_name + '</span></button>';
                    });
                }
            },
        });

        this.ui.videoTriggers = document.querySelectorAll('.flight-media-trigger');

        if (this._checkParams('video')) {

            self._loadVideo(self.ui.videoTriggers[self._search_videos(this._checkParams('video'))]);

            $('html, body').animate({
                scrollTop: $('#video_player').offset().top + -150,
            }, 0);

        } else {
            self._loadFirst();
        }
        self._eventHandlers();
    }

}
