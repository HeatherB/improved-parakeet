/* eslint-disable */



function mediaCarouselWallpapers(){

    // initiate slick carousel wallpapers display
    $('#media-carousel-wallpapers-display').slick({
        lazyLoad: 'ondemand',
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        asNavFor: '#media-carousel-wallpapers-nav'
    });

    // initiate slick carousel wallpapers nav
    $('#media-carousel-wallpapers-nav').slick({
        lazyLoad: 'ondemand',
        slidesToShow: 4,
        slidesToScroll: 1,
        asNavFor: '#media-carousel-wallpapers-display',
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

    function mediaFilterWallpapersCarouselUrlParam(){

        var urlParamName = 'filter';
        var urlParamPresent = checkForUrlParam(urlParamName);

        if(urlParamPresent === true){

            var urlParamValue = new RegExp('[\?&]' + urlParamName + '=([^&#]*)').exec(window.location.href);

            var mediaFilterWallpaperGame = urlParamValue[1];

            // filter wallpapers
            var wallpaperCarousel = '#media-carousel-wallpapers-nav';

            // NOTE:  slickFilter uses :has(.elementClass)
            //        as SlickSlider 1.8.1 uses jQuery filter.
            //        See URL: http://api.jquery.com/filter/
            //        Discussion: https://github.com/kenwheeler/slick/issues/3161
            switch (mediaFilterWallpaperGame) {
                case 'aoe':
                    $(wallpaperCarousel).slick('slickUnfilter');
                    $(wallpaperCarousel).slick('slickFilter',':has(.aoe)');
                    break;
                case 'aoe2':
                    $(wallpaperCarousel).slick('slickUnfilter');
                    $(wallpaperCarousel).slick('slickFilter',':has(.aoe2)');
                    break;
                case 'aoe2de':
                    $(wallpaperCarousel).slick('slickUnfilter');
                    $(wallpaperCarousel).slick('slickFilter',':has(.aoe2de)');
                    break;
                case 'aoe3':
                    $(wallpaperCarousel).slick('slickUnfilter');
                    $(wallpaperCarousel).slick('slickFilter',':has(.aoe3)');
                    break;
                case 'aoe4':
                    $(wallpaperCarousel).slick('slickUnfilter');
                    $(wallpaperCarousel).slick('slickFilter',':has(.aoe4)');
                    break;
                case 'aom':
                    $(wallpaperCarousel).slick('slickUnfilter');
                    $(wallpaperCarousel).slick('slickFilter',':has(.aom)');
                    break;
                default:
                    console.log = 'Wallpaper filter choice not in list.';
            }

            // change the display to match the nav
            var wallpaperCarouselDisplay = '#media-carousel-wallpapers-display';
            var wallpaperCarouselCurrentSlide = $(wallpaperCarousel + ' .slick-current').data('slick-index');
            $(wallpaperCarouselDisplay).slick('slickGoTo', wallpaperCarouselCurrentSlide);

            // change the selected property on carousel filter
            $('#media-wallpapers__container select#wallpaper-options').prop("selected", false);
            $('#media-wallpapers__container select#wallpaper-options option[value="' + mediaFilterWallpaperGame + '"]').prop("selected", true);

        }


    }

    // filter wallpapers if url parameter exists
    mediaFilterWallpapersCarouselUrlParam();

    function mediaFilterWallpapersCarousel(){

        var wallpaperCarousel = '#media-carousel-wallpapers-nav';

        var mediaFilterWallpaperGame = $( 'select#wallpaper-options' ).val();

        // NOTE:  slickFilter uses :has(.elementClass)
        //        as SlickSlider 1.8.1 uses jQuery filter.
        //        See URL: http://api.jquery.com/filter/
        //        Discussion: https://github.com/kenwheeler/slick/issues/3161
        switch (mediaFilterWallpaperGame) {
            case 'all':
                $(wallpaperCarousel).slick('slickUnfilter');
                break;
            case 'aoe':
                $(wallpaperCarousel).slick('slickUnfilter');
                $(wallpaperCarousel).slick('slickFilter',':has(.aoe)');
                break;
            case 'aoe2':
                $(wallpaperCarousel).slick('slickUnfilter');
                $(wallpaperCarousel).slick('slickFilter',':has(.aoe2)');
                break;
            case 'aoe2de':
                $(wallpaperCarousel).slick('slickUnfilter');
                $(wallpaperCarousel).slick('slickFilter',':has(.aoe2de)');
                break;
            case 'aoe3':
                $(wallpaperCarousel).slick('slickUnfilter');
                $(wallpaperCarousel).slick('slickFilter',':has(.aoe3)');
                break;
            case 'aoe4':
                $(wallpaperCarousel).slick('slickUnfilter');
                $(wallpaperCarousel).slick('slickFilter',':has(.aoe4)');
                break;
            case 'aom':
                $(wallpaperCarousel).slick('slickUnfilter');
                $(wallpaperCarousel).slick('slickFilter',':has(.aom)');
                break;
            default:
                console.log = 'Wallpaper filter choice not in list.';
        }

        // change the display to match the nav
        var wallpaperCarouselDisplay = '#media-carousel-wallpapers-display';
        var wallpaperCarouselCurrentSlide = $(wallpaperCarousel + ' .slick-current').data('slick-index');
        $(wallpaperCarouselDisplay).slick('slickGoTo', wallpaperCarouselCurrentSlide);



    }

    $('select#wallpaper-options').change( mediaFilterWallpapersCarousel );



    // open and close download container
    // touch or click event will stop autoplay and manually switch franchise games
    // because span.hero-carousel-progress-bar was added after DOM was ready
    $(document).on('touchstart click', 'span.download-btn', function () {
        //console.log('triggered download-btn');

        var theParentElement = $( this ).parent().get(0).tagName;
        // fade in the Hero Franchise Featured FadeOut Elements
        $(theParentElement + ' .download__container').fadeToggle();
        // added nav buttons at last minute
        // they cover up the download container
        // z-indexing is not an option so fade toggle them
        // with the download container
        $('#media-carousel-wallpapers-nav .nav-arrow').fadeToggle();

    });

    // make sure all download containers are closed before next slide
    // do this before the slide changes
    $('#media-carousel-wallpapers-display').on('beforeChange', function(event, slick, currentSlide, nextSlide){
        $('#media-wallpapers__container .download__container').css('display','none');
        // added nav buttons at last minute
        // they cover up the download container
        // z-indexing is not an option so make them display
        // with the download container before slide changes
        $('#media-carousel-wallpapers-nav .nav-arrow').css('display','block');
    });

}


$(document).ready(function(){
    mediaCarouselWallpapers();
});



/* eslint-enable */