/* eslint-disable */



function mediaCarouselScreenshots(){

    // initiate slick carousel screenshots display
    $('#media-carousel-screenshots-display').slick({
        lazyLoad: 'ondemand',
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        asNavFor: '#media-carousel-screenshots-nav'
    });

    // initiate slick carousel screenshots nav
    $('#media-carousel-screenshots-nav').slick({
        lazyLoad: 'ondemand',
        slidesToShow: 4,
        slidesToScroll: 1,
        asNavFor: '#media-carousel-screenshots-display',
        dots: false,
        focusOnSelect: true,
        waitForAnimate: true,
        draggable: true,
        infinite: true,
        centerMode: false,
        arrows: true,
        nextArrow: '<span class="nav-arrow nav-arrow-next fa fa-angle-right"></span>',
        prevArrow: '<span class="nav-arrow nav-arrow-prev fa fa-angle-left"></span>',
        responsive: [
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    centerMode: true,
                    arrows: false
                }
            }
        ]
    });


    function checkForUrlParam(urlParamName){
        var currentUrl = window.location.href;
        if(currentUrl.indexOf('?' + urlParamName + '=') != -1)
            return true;
        else if(currentUrl.indexOf('&' + urlParamName + '=') != -1)
            return true;
        return false
    }

    function mediaFilterScreenshotsCarouselUrlParam(){

        var urlParamName = 'filter';
        var urlParamPresent = checkForUrlParam(urlParamName);

        if(urlParamPresent === true){

            var urlParamValue = new RegExp('[\?&]' + urlParamName + '=([^&#]*)').exec(window.location.href);

            var mediaFilterScreenshotGame = urlParamValue[1];

            // filter screenshots

            var screenshotCarousel = '#media-carousel-screenshots-nav';


            // NOTE:  slickFilter uses :has(.elementClass)
            //        as SlickSlider 1.8.1 uses jQuery filter.
            //        See URL: http://api.jquery.com/filter/
            //        Discussion: https://github.com/kenwheeler/slick/issues/3161
            switch (mediaFilterScreenshotGame) {
                case 'aoe':
                    $(screenshotCarousel).slick('slickUnfilter');
                    $(screenshotCarousel).slick('slickFilter',':has(.aoe)');
                    break;
                case 'aoe2':
                    $(screenshotCarousel).slick('slickUnfilter');
                    $(screenshotCarousel).slick('slickFilter',':has(.aoe2)');
                    break;
                case 'aoe2de':
                    $(screenshotCarousel).slick('slickUnfilter');
                    $(screenshotCarousel).slick('slickFilter',':has(.aoe2de)');
                    break;
                case 'aoe3':
                    $(screenshotCarousel).slick('slickUnfilter');
                    $(screenshotCarousel).slick('slickFilter',':has(.aoe3)');
                    break;
                case 'aoe3de':
                    $(screenshotCarousel).slick('slickUnfilter');
                    $(screenshotCarousel).slick('slickFilter',':has(.aoe3de)');
                    break;
                case 'aoe4':
                    $(screenshotCarousel).slick('slickUnfilter');
                    $(screenshotCarousel).slick('slickFilter',':has(.aoe4)');
                    break;
                case 'aom':
                    $(screenshotCarousel).slick('slickUnfilter');
                    $(screenshotCarousel).slick('slickFilter',':has(.aom)');
                    break;
                default:
                    console.log = 'Screenshot filter choice not in list.';
            }

            // change the display to match the nav
            var screenshotCarouselDisplay = '#media-carousel-screenshots-display';
            var screenshotCarouselCurrentSlide = $(screenshotCarousel + ' .slick-current').data('slick-index');
            $(screenshotCarouselDisplay).slick('slickGoTo', screenshotCarouselCurrentSlide);

            // change the selected property on carousel filter
            $('#media-screenshots__container select#screenshot-options option').prop("selected", false);
            $('#media-screenshots__container select#screenshot-options option[value="' + mediaFilterScreenshotGame + '"]').prop("selected", true);

        }





    }

    // filter screenshots if url parameter exists
    mediaFilterScreenshotsCarouselUrlParam();


    function mediaFilterScreenshotsCarousel(){

        var screenshotCarousel = '#media-carousel-screenshots-nav';

        var mediaFilterScreenshotGame = $( 'select#screenshot-options' ).val();

        // NOTE:  slickFilter uses :has(.elementClass)
        //        as SlickSlider 1.8.1 uses jQuery filter.
        //        See URL: http://api.jquery.com/filter/
        //        Discussion: https://github.com/kenwheeler/slick/issues/3161
        switch (mediaFilterScreenshotGame) {
            case 'all':
                $(screenshotCarousel).slick('slickUnfilter');
                break;
            case 'aoe':
                $(screenshotCarousel).slick('slickUnfilter');
                $(screenshotCarousel).slick('slickFilter',':has(.aoe)');
                break;
            case 'aoe2':
                $(screenshotCarousel).slick('slickUnfilter');
                $(screenshotCarousel).slick('slickFilter',':has(.aoe2)');
                break;
            case 'aoe2de':
                $(screenshotCarousel).slick('slickUnfilter');
                $(screenshotCarousel).slick('slickFilter',':has(.aoe2de)');
                break;
            case 'aoe3':
                $(screenshotCarousel).slick('slickUnfilter');
                $(screenshotCarousel).slick('slickFilter',':has(.aoe3)');
                break;
            case 'aoe3de':
                $(screenshotCarousel).slick('slickUnfilter');
                $(screenshotCarousel).slick('slickFilter',':has(.aoe3de)');
                break;
            case 'aoe4':
                $(screenshotCarousel).slick('slickUnfilter');
                $(screenshotCarousel).slick('slickFilter',':has(.aoe4)');
                break;
            case 'aom':
                $(screenshotCarousel).slick('slickUnfilter');
                $(screenshotCarousel).slick('slickFilter',':has(.aom)');
                break;
            default:
                console.log = 'Screenshot filter choice not in list.';
        }

        // change the display to match the nav
        var screenshotCarouselDisplay = '#media-carousel-screenshots-display';
        var screenshotCarouselCurrentSlide = $(screenshotCarousel + ' .slick-current').data('slick-index');
        $(screenshotCarouselDisplay).slick('slickGoTo', screenshotCarouselCurrentSlide);




    }



    $('select#screenshot-options').change( mediaFilterScreenshotsCarousel );



}


$(document).ready(function(){
    mediaCarouselScreenshots();
});



/* eslint-enable */