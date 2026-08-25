/* eslint-disable */

// -----------------------------------------------------
// HERO Franchise Video Modal
// -----------------------------------------------------
function mediaCarouselScreenshotsModal(){
    // find the buttons assigned to open a hero video modal
    var mcsmTrigger = $("body").find('[data-open="media-carousel-screenshots-modal"]');

    // user clicks the button and triggers the hero video modal
    mcsmTrigger.click(function () {

        // get image url for screenshot
        var mediaCarouselScreenshotImageUrl = $(this).data("img-src");
        var mediaCarouselScreenshotsModalImg = '#media-carousel-screenshots-modal img#modal-screenshot';
        $(mediaCarouselScreenshotsModalImg).attr( 'src', mediaCarouselScreenshotImageUrl );

        // Empty the responsive embed container when modal is closed
        $(document).on(
            'closed.zf.reveal', '#media-carousel-screenshots-modal[data-reveal]', function () {
                // empty the responsive embed container
                //$(mediaCarouselScreenshotsModal).empty();
            }
        );


    }); // end mcsmTrigger.click



}

function mediaCarouselScreenshotsModalDisable(){

    // remove modal trigger if on mobile screen width 640px or less
    var windowWidth = $(window).width();

    if (windowWidth < 640){
        $('#media-carousel-screenshots-display .screenshot a').removeAttr("data-open");
    }

    // on window resizing...
    $( window ).resize(function() {
        // remove modal trigger if on mobile screen width 640px or less
        var windowWidth = $(window).width();
        if (windowWidth < 640){
            $('#media-carousel-screenshots-display .screenshot a').removeAttr("data-open");
        }
    });

}



$(document).ready(function(){
    mediaCarouselScreenshotsModalDisable();
    mediaCarouselScreenshotsModal();

});

/* eslint-enable */