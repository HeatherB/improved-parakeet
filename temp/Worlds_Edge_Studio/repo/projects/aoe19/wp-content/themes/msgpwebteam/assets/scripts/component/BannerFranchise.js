/* eslint-disable */
// -----------------------------------------------------
// Hero Header Beam
// -----------------------------------------------------
// if you do not append the iFrame AFTER the document has loaded
// it will break the layout.  It is a Beam thing.

function bannerFranchise(){
    $(document).on('touchstart click', '#banner-franchise__container .banner-franchise-arrow', function () {
        $('#banner-franchise__container').fadeOut("slow", function(){
            $('#banner-franchise__container').remove();
        });
    });
}

$(document).ready(function(){
    bannerFranchise();
});

/* eslint-enable */