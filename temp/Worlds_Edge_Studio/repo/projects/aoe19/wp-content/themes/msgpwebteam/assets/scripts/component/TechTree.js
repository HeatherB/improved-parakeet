/* eslint-disable */

function buildTechTree(){


    // Set some variables
    var techTreeImageUnscaled = getTechTreeImageValues();
    var techTreeImageScaled = getTechTreeImageValues('scaled');
    var techTreeMaxWidth = techTreeImageUnscaled[0];
    var techTreeMaxHeight = techTreeImageUnscaled[1];
    var techTreeMinWidth = techTreeImageScaled[0];
    var techTreeMinHeight = techTreeImageScaled[1];
    var techTreeCurrentWidth = techTreeMinWidth;
    var techTreeCurrentHeight = techTreeMinHeight;
    var techTreeZoomStep = Math.round(techTreeMaxWidth * .10);
    var techTreeMinZoom = true;
    var techTreeMaxZoom = false;
    var startingPosTop = 0;
    var startingPosLeft = 0;
    //var posTop = startingPosTop;
    //var posLeft = startingPosLeft;


    // reset the tech tree width and position
    resetTechTree(techTreeMinWidth, startingPosLeft, startingPosTop);

    techTreeZooming();



    //techTreePanning();

    // make draggable so we can pan around
    //$('#tech-tree-container').draggable();

    $('#tech-tree-container').draggable({
        start: function( event, ui ) {
            $(this).addClass('moving').removeClass('transition-style');
        },
        stop: function( event, ui ) {
            $(this).removeClass('moving').addClass('transition-style');
            stayInTheLines();
        }
    });

    // temporary
    tempMainContainerHack();

    // add the current starting zoom level
    zoomLevelStatus(techTreeCurrentWidth);


    // the functions to do all this stuff
    // -----------------------------------------------------------

    function resetTechTree(w, x, y){
        // set initial tech tree container width
        $('section#tech-tree #tech-tree-container').css('width',w).css('left', x).css('top', y);
    }

    function getTechTreeImageValues(returnType){

        var techTreeImage = $('section#tech-tree #tech-tree-image > img');
        var techTreeImageWidth = 0;
        var techTreeImageHeight = 0;

        if(returnType == 'scaled'){
            // get the current scaled size image dimensions
            techTreeImageWidth = Math.round(techTreeImage.width());
            techTreeImageHeight = Math.round(techTreeImage.height());

        } else {
            // get the unscaled exact full size image dimensions

            // create new offscreen image to test
            var unscaledImage = new Image();
            unscaledImage.src = techTreeImage.attr('src');

            // get accurate measurements from that
            techTreeImageWidth = unscaledImage.width;
            techTreeImageHeight = unscaledImage.height;

        }



        return [techTreeImageWidth, techTreeImageHeight];

    }

    function zoomLevelStatus(w){
        var currentZoomLevel = Math.round((w / techTreeMaxWidth) * 100);
        $('#tt-zoom-status .percentage .value').empty().append(currentZoomLevel + '%');

        if(currentZoomLevel >= 100){
            $('#tt-zoom-status .status').empty().append('( Max Zoom Level )');
            $('#tt-zoom-status').addClass('status-message');
        } else if(w <= techTreeMinWidth){
            $('#tt-zoom-status .status').empty().append('( Min Zoom Level )');
            $('#tt-zoom-status').addClass('status-message');
        } else {
            $('#tt-zoom-status').removeClass('status-message');
        }


    }

    function techTreeZoom(zoom){

        var currentTechTreePosLeft = parseInt($('section#tech-tree #tech-tree-container').css('left'));
        var currentTechTreePosTop = parseInt($('section#tech-tree #tech-tree-container').css('top'));
        var newTechTreeContainerWidth = 0;
        var origTechTreeContainerWidth = Math.round(parseInt($('section#tech-tree #tech-tree-image > img').width()));
        var origTechTreeContainerHeight = Math.round(parseInt($('section#tech-tree #tech-tree-image > img').height()));


        // Zoom In
        if(zoom == 'zoom-in'){
            newTechTreeContainerWidth = Math.round(origTechTreeContainerWidth + techTreeZoomStep);

            // check for maximum zoom level
            if(newTechTreeContainerWidth >= techTreeMaxWidth) {
                newTechTreeContainerWidth = techTreeMaxWidth;
                techTreeMaxZoom = true;
            } else {
                techTreeMaxZoom = false;
            }

            techTreeMinZoom = false;

        }

        // Zoom Out
        if (zoom == 'zoom-out') {

            newTechTreeContainerWidth = Math.round(origTechTreeContainerWidth - techTreeZoomStep);

            // check for minimum zoom level
            if(newTechTreeContainerWidth <= techTreeMinWidth) {
                newTechTreeContainerWidth = techTreeMinWidth;
                techTreeMinZoom = true;
            } else {
                techTreeMinZoom = false;
            }

            techTreeMaxZoom = false;

        }

        // calculate new positions
        var newTechTreeContainerHeight = Math.round((newTechTreeContainerWidth / techTreeMaxWidth) * techTreeMaxHeight);
        var newPosLeft = Math.round(((origTechTreeContainerWidth - newTechTreeContainerWidth) / 2) + currentTechTreePosLeft);
        var newPosTop = Math.round(((origTechTreeContainerHeight - newTechTreeContainerHeight) / 2) + currentTechTreePosTop);

        // check for min zoom and if so position at starting positions
        if(techTreeMinZoom == true){
            newPosLeft = startingPosLeft;
            newPosTop = startingPosTop;
        }


        // Right Side
        var techTreeWrapperWidth = parseInt($('#tech-tree-wrapper').width());
        var techTreePosLeftMax = (newTechTreeContainerWidth - techTreeWrapperWidth) * -1;

        // Bottom Side
        var techTreeWrapperHeight = parseInt($('#tech-tree-wrapper').height());
        var techTreePosTopMax = (newTechTreeContainerHeight - techTreeWrapperHeight) * -1;


        // temp check to make sure we stay in bound

        if(newPosLeft > 0){
            newPosLeft = 0;
        }
        if(newPosTop > 0){
            newPosTop = 0;
        }
        if(newPosLeft < techTreePosLeftMax){
            newPosLeft = techTreePosLeftMax;
        }
        if(newPosTop < techTreePosTopMax){
            newPosTop = techTreePosTopMax;
        }

        // insert the new tech tree zoom level percentage
        zoomLevelStatus(newTechTreeContainerWidth);

        $('section#tech-tree #tech-tree-container').css('width',newTechTreeContainerWidth).css('top', newPosTop).css('left',newPosLeft);




        // testing
        //stayInTheLines();

    }

    function techTreeZooming(){

        // zoom in
        $(document).on('touchstart click', '#tt-zoom-in', function () {
            techTreeZoom('zoom-in');
        });

        // zoom out
        $(document).on('touchstart click', '#tt-zoom-out', function () {
            techTreeZoom('zoom-out');
        });

        // zoom compress to starting size
        $(document).on('touchstart click', '#tt-compress', function () {
            resetTechTree(techTreeMinWidth, startingPosLeft, startingPosTop);
            zoomLevelStatus(techTreeMinWidth);
        });


        $('section#tech-tree #tech-tree-wrapper').on('wheel', function(e){
            $('body').css('overflow','hidden');
            $('section#tech-tree #tech-tree-container').removeClass('transition-style');
            if(e.originalEvent.deltaY < 0) {
                //console.log('scrolling up ! deltaY = ' + e.originalEvent.deltaY);
                techTreeZoom('zoom-in');
            } else{
                //console.log('scrolling down ! deltaY = ' + e.originalEvent.deltaY);
                techTreeZoom('zoom-out');
            }
            $('section#tech-tree #tech-tree-container').addClass('transition-style');
        });

        $( 'section#tech-tree #tech-tree-wrapper' ).hover(
            function() {
                //console.log('ENTERED AREA');
            }, function() {
                //console.log('LEFT AREA');
                $('body').css('overflow','auto');
            }
        );


        
    }

    function stayInTheLines(){

        // base vars
        var techTreeImageScaled = getTechTreeImageValues('scaled');
        var techTreeImageWidth = techTreeImageScaled[0];
        var techTreeImageHeight = techTreeImageScaled[1];

        // Left Side
        var currentTechTreePosLeft = parseInt($('section#tech-tree #tech-tree-container').css('left'));

        // Top Side
        var currentTechTreePosTop = parseInt($('section#tech-tree #tech-tree-container').css('top'));

        // Right Side
        var techTreeWrapperWidth = parseInt($('#tech-tree-wrapper').width());
        var techTreePosLeftMax = (techTreeImageWidth - techTreeWrapperWidth) * -1;

        // Bottom Side
        var techTreeWrapperHeight = parseInt($('#tech-tree-wrapper').height());
        var techTreePosTopMax = (techTreeImageHeight - techTreeWrapperHeight) * -1;

        // checks to make sure the tech tree is in bounds

        // Check Left Side
        if(currentTechTreePosLeft > 0) {
            $('section#tech-tree #tech-tree-container').css('left','0');
        }

        // Check Top Side
        if(currentTechTreePosTop > 0){
            $('section#tech-tree #tech-tree-container').css('top','0');
        }

        // Check Right Side
        if(currentTechTreePosLeft < techTreePosLeftMax){
            $('section#tech-tree #tech-tree-container').css('left',techTreePosLeftMax);
        }

        // Check Bottom Side
        if(currentTechTreePosTop < techTreePosTopMax){
            $('section#tech-tree #tech-tree-container').css('top',techTreePosTopMax);
        }

    }

    function tempMainContainerHack(){
        var techTreeTabsHeight = parseInt($('section#tech-tree #tech-tree-tabs').height());
        var civBonusWrapperHeight = parseInt($('section#tech-tree #civ-bonus-wrapper').height());
        var techTreeInfoBarHeight = parseInt($('section#tech-tree #tech-tree-info-bar').height());
        var techTreeWrapperHeight = parseInt($('section#tech-tree #tech-tree-container #tech-tree-image > img').height());
        var techTreeContentContainerTotalHeight = techTreeTabsHeight + civBonusWrapperHeight + techTreeInfoBarHeight + techTreeWrapperHeight;
        $('section#tech-tree #tech-tree-frame-wrapper .tech-tree-frame.content').css('height', techTreeContentContainerTotalHeight);

        // NEED THIS to make top max (bottom border) check work.
        $('section#tech-tree #tech-tree-wrapper').css('height', techTreeWrapperHeight);
    }

    // not using the panning function anymore
    // utilized draggable instead as it now works with touch
    function techTreePanning(){

        // dragging the tech tree so do this
        $(document).on('touchstart mousedown', 'section#tech-tree #tech-tree-container', function () {
            $(this).addClass('moving').removeClass('transition-style');
        });

        // stopped dragging the tech tree so do this
        $(document).on('touchend mouseup', 'section#tech-tree #tech-tree-container', function () {
            $(this).removeClass('moving').addClass('transition-style');

            // testing
            //stayInTheLines();

        });

    }







}











jQuery(document).ready(function() {

    // test to see if we have a tech tree present
    if($('section#tech-tree').length > 0) {

        // Image Version
        buildTechTree();

    }

});


/* eslint-enable */