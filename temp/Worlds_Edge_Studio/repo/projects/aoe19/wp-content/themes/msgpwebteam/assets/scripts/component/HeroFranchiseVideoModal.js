/* eslint-disable */

// -----------------------------------------------------
// HERO Franchise Video Modal
// -----------------------------------------------------
function heroFranchiseVideoModal(){
    // find the buttons assigned to open a hero video modal
    var hfvmTrigger = $("body").find('[data-open="hero-franchise-video-modal"]');

    // user clicks the button and triggers the hero video modal
    hfvmTrigger.click(function () {

        // get the video type which currently can only be YouTube (planning for mp4, etc in future)
        var videoType = $(this).data("video-type");

        if(videoType == 'youtube'){
            // currently only YouTube type is available
            var ytEmbedPrefix = 'https://www.youtube.com/embed/';
            var ytEmbedOptions = '?rel=0&autoplay=1&loop=0&mute=0&controls=0&fs=0&showinfo=0&modestbranding=1&autohide=1&wmode=opaque';
            var ytVideoID = $(this).data("video-src");
            var ytVideoUrl = ytEmbedPrefix + ytVideoID + ytEmbedOptions;
            var heroFranchiseVideoModal = '#hero-franchise-video-modal .responsive-embed';
            $(heroFranchiseVideoModal).append('<iframe id="hero-franchise-video-modal-youtube" allowfullscreen="1" title="YouTube video player" src="' + ytVideoUrl + '" frameborder="0" height="100%" width="100%"></iframe>');

            // Stop the video when modal is closed
            $(document).on(
                'closed.zf.reveal', '#hero-franchise-video-modal[data-reveal]', function () {
                    // empty the responsive embed in case later we inject an mp4 or something different
                    $(heroFranchiseVideoModal).empty();
                    // if background video present and paused then restart it here
                }
            );

        } // end if videoType == 'youtube'

    }); // end hfvmTrigger.click

}


$(document).ready(function(){
    heroFranchiseVideoModal();
});

/* eslint-enable */