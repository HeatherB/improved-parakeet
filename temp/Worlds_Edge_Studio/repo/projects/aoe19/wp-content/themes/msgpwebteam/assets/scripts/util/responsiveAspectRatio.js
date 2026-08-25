/* eslint-disable */

function responsiveAspectRatio() {

// formula:  (height / width) x (element width) = (element height)
    var apectRatioData = null;
    var aspectRatio = null;
    var elementWidth = null;
    var elementHeight = null;

    // each data aspect ratio should be formatted as wxh
    // example data-aspect-ratio="16x9"
    $('[data-aspect-ratio]').each(function( index ) {


        // reset any inline css styles for width or height
        $(this).css({ 'height': 'auto'});

        // get aspect ratio data
        apectRatioData = $(this).data('aspect-ratio');

        // get aspect ratio width and height
        aspectRatio = apectRatioData.split('x');

        // convert aspect ratio to number float
        for(i = 0; i < aspectRatio.length; i++){
            aspectRatio[i] = parseFloat(aspectRatio[i]);
        }

        // get element width including padding and borders
        elementWidth = $(this).outerWidth();

        // be sure we have a width and height and the data are actual numbers
        // then if the element qualifies we can get the element height
        if(aspectRatio.length == 2 && typeof(aspectRatio[0]) != "boolean" && !isNaN(aspectRatio[0]) && typeof(aspectRatio[1]) != "boolean" && !isNaN(aspectRatio[1])){

            if(aspectRatio[0] != aspectRatio[1]){
                // orientation is landscape or portrait
                elementHeight = Math.round((aspectRatio[1] / aspectRatio[0]) * elementWidth);
            } else if(aspectRatio[0] == aspectRatio[1]) {
                // orientation is square
                elementHeight = elementWidth;
            }

            // set the element height
            $(this).css({ 'height': elementHeight});

        }

    });

}


$(document).ready(function(){

    // if element exists
    if ($('[data-aspect-ratio]').length > 0) {

        // set initial aspect ratios
        responsiveAspectRatio();

        // update aspect ratios on window resize
        $( window ).resize(function() {
            responsiveAspectRatio();
        });

    }

});

/* eslint-enable */
