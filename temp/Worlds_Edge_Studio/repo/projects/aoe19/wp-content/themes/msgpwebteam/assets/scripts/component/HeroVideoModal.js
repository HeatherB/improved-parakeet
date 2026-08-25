/* eslint-disable */

// -----------------------------------------------------
// HERO Video Modal
// -----------------------------------------------------
function heroVideoModal(){
    // find the buttons assigned to open a hero video modal
    var hvmTrigger = $("body").find('[data-open="hero-video-modal"]');
    var altHvmTrigger = $("body").find('[data-btn-open="hero-video-modal"]');

    // user clicks the button and triggers the hero video modal
    hvmTrigger.click(function () {

        // get the video type which currently can only be YouTube (planning for mp4, etc in future)
        var videoType = $(this).data("video-type");

        if(videoType == 'youtube'){
            // currently only YouTube type is available
            var ytEmbedPrefix = 'https://www.youtube.com/embed/';
            var ytEmbedOptions = '?rel=0&autoplay=1&loop=0&mute=0&controls=1&fs=0&showinfo=0&modestbranding=1&autohide=1&wmode=opaque';
            var ytVideoID = $(this).data("video-src");
            var ytVideoUrl = ytEmbedPrefix + ytVideoID + ytEmbedOptions;
            var heroVideoModal = '#hero-video-modal .responsive-embed';
            $(heroVideoModal).append('<iframe id="hero-video-modal-youtube" allowfullscreen="1" title="YouTube video player" src="' + ytVideoUrl + '" frameborder="0" height="100%" width="100%" allow="autoplay"></iframe>');

            // Stop the video when modal is closed
            $(document).on(
                'closed.zf.reveal', '#hero-video-modal[data-reveal]', function () {
                    // empty the responsive embed in case later we inject an mp4 or somethind different
                    $(heroVideoModal).empty();
                    // if background video present and paused then restart it here
                }
            );

        } // end if videoType == 'youtube'

    }); // end hvmTrigger.click

    // user clicks the button and triggers the hero video modal
    altHvmTrigger.click(function () {
        
        // get the video type which currently can only be YouTube (planning for mp4, etc in future)
        var videoType = $(this).data("video-type");
        if(videoType == 'youtube'){
            // moving around foudation requires re-popping
            $('#hero-video-modal').closest('.reveal-overlay').show();
            $('#hero-video-modal').show();
            // currently only YouTube type is available
            var ytEmbedPrefix = 'https://www.youtube.com/embed/';
            var ytEmbedOptions = '?rel=0&autoplay=1&loop=0&mute=0&controls=1&fs=0&showinfo=0&modestbranding=1&autohide=1&wmode=opaque';
            var ytVideoID = $(this).data("video-src");
            var ytVideoUrl = ytEmbedPrefix + ytVideoID + ytEmbedOptions;
            var heroVideoModal = '#hero-video-modal .responsive-embed';
            $(heroVideoModal).append('<iframe id="hero-video-modal-youtube" allowfullscreen="1" title="YouTube video player" src="' + ytVideoUrl + '" frameborder="0" height="100%" width="100%" allow="autoplay"></iframe>');
            // move focus to popup
            setTimeout(function() { $('#hero-video-modal-youtube').focus() },1000);
            
            // moving around foundation requires re-close of popping
            $('#hero-video-modal').find('.close-button').on('click', function() {
                $('#hero-video-modal').closest('.reveal-overlay').hide();
                $('#hero-video-modal').hide();
                $(heroVideoModal).empty();
            });

            // Stop the video when modal is closed
            $(document).on(
                'closed.zf.reveal', '#hero-video-modal[data-reveal]', function () {
                    // empty the responsive embed in case later we inject an mp4 or somethind different
                    $(heroVideoModal).empty();
                    // if background video present and paused then restart it here
                }
            );

        } // end if videoType == 'youtube'

    }); // end hvmTrigger.click

}

$(document).ready(function(){
    heroVideoModal();
});

/* eslint-enable */