/* eslint-disable */

function comparison(){

    var dragging = false,
        scrolling = false,
        resizing = false;

    //cache jQuery objects
    var comparisonContainers = $('.comparison-container');
    //check if the .comparison-container is in the viewport
    //if yes, animate it
    checkPosition(comparisonContainers);
    $(window).on('scroll', function(){
        if( !scrolling) {
            scrolling =  true;
            ( !window.requestAnimationFrame )
                ? setTimeout(function(){checkPosition(comparisonContainers);}, 100)
                : requestAnimationFrame(function(){checkPosition(comparisonContainers);});
        }
    });

    //make the .comparison-bar element draggable and modify .resizable-container width according to its position
    comparisonContainers.each(function(){
        var actual = $(this);
        drags(actual.find('.comparison-bar'), actual.find('.resizable-container'), actual, actual.find('.comparison-label[data-type="before"]'), actual.find('.comparison-label[data-type="after"]'));
        configureSizes();
    });

    // upadate .resizable-container width
    // and check if mobile then disable draggable
    $(window).on('resize', function(){
        configureSizes();
        if($(window).width <= 640) {
            dragging = false;
        }
    });

    function checkPosition(container) {
        container.each(function(){
            var actualContainer = $(this);
            if( $(window).scrollTop() + $(window).height()*0.5 > actualContainer.offset().top) {
                actualContainer.addClass('is-visible');
            }
        });

        scrolling = false;
    }



    //draggable funtionality - from http://css-tricks.com/snippets/jquery/draggable-without-jquery-ui/
    function drags(dragElement, resizeElement, container) {
        var screenSize = $( window ).width();
        if(screenSize >= 640){
            // we are greater than mobile size
            dragElement.on("mousedown vmousedown", function(e) {

                dragElement.addClass('draggable');
                resizeElement.addClass('resizable');

                var dragWidth = dragElement.outerWidth(),
                    xPosition = dragElement.offset().left + dragWidth - e.pageX,
                    containerOffset = container.offset().left,
                    containerWidth = container.outerWidth(),
                    minLeft = containerOffset + 10,
                    maxLeft = containerOffset + containerWidth - dragWidth - 10;

                dragElement.parents().on("mousemove vmousemove", function(e) {
                    if( !dragging ) {
                        dragging =  true;
                        ( !window.requestAnimationFrame )
                            ? setTimeout(function(){animateDraggedHandle(e, xPosition, dragWidth, minLeft, maxLeft, containerOffset, containerWidth, resizeElement);}, 100)
                            : requestAnimationFrame(function(){animateDraggedHandle(e, xPosition, dragWidth, minLeft, maxLeft, containerOffset, containerWidth, resizeElement);});
                    }
                }).on("mouseup vmouseup", function(e){
                    dragElement.removeClass('draggable');
                    resizeElement.removeClass('resizable');
                });
                e.preventDefault();
            }).on("mouseup vmouseup", function(e) {
                dragElement.removeClass('draggable');
                resizeElement.removeClass('resizable');
            });

        }
    }

    function animateDraggedHandle(e, xPosition, dragWidth, minLeft, maxLeft, containerOffset, containerWidth, resizeElement) {
        var leftValue = e.pageX + xPosition - dragWidth;
        //constrain the draggable element to move inside his container
        if(leftValue < minLeft ) {
            leftValue = minLeft;
        } else if ( leftValue > maxLeft) {
            leftValue = maxLeft;
        }

        var widthValue = (leftValue + dragWidth/2 - containerOffset)*100/containerWidth+'%';

        $('.draggable').css('left', widthValue).on("mouseup vmouseup", function() {
            $(this).removeClass('draggable');
            resizeElement.removeClass('resizable');
        });

        $('.resizable').css('width', widthValue);

        // disabled updating of label visibility when
        // slide frame width is less than element width
        // and added css for .comparison-label to force no wrap
        //updateLabel(labelResizeElement, resizeElement, 'left');
        //updateLabel(labelContainer, resizeElement, 'right');
        dragging =  false;
    }



    function configureSizes(){
        var comparisonWidth = $('.comparison-container').width();
        $('.resize-container-test').css('width', comparisonWidth);
        //var comparisonHeight = $('.comparison-container').height();
        //$('.comparison-bar').css('height', comparisonHeight);
    }

    // force videos to play on iphones and other stubborn devices
    if (typeof $('#video-before').get(0) !== 'undefined') {
        $('#video-before').get(0).play();
    }
    if (typeof $('#video-after').get(0) !== 'undefined') {
        $('#video-after').get(0).play();
    }

    configureSizes();

}

jQuery(document).ready(function($){

    comparison();

    $(window).on('resize', function(){
        comparison();
    });

});