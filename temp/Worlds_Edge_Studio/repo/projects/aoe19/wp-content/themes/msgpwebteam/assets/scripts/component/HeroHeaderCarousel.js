/* eslint-disable */

// -----------------------------------------------------
// Hero Header Carousel
// -----------------------------------------------------
function heroHeaderCarousel() {

    // initial variable setup
    var heroCarouselTimer = 5000,
        heroCarouselProgressTimerInterval = 10,
        heroCarouselTicker = null,
        heroCarouselPercentTime = 0,
        activeSlideIndex = 0,
        heroCarouselPaused = false,
        heroCarouselModalActive = false,
        heroCarouselAutoPlayDisabled = false;

    // add active slide class to clickable progress bar
    function addActiveSlideClass(){
        activeSlideIndex = getHeroCarouselSlideIndex();
        $('#hero-carousel span.hero-carousel-progress-bar[data-slide-index="' + activeSlideIndex + '"]').addClass('active').removeClass('inactive');
    }

    // start the progress bar
    function startProgressBar(){
        if(heroCarouselAutoPlayDisabled === false) {
            clearTimeout(heroCarouselTicker);
            resetProgressbars();
            heroCarouselPercentTime = 0;
            //activeSlideIndex = getHeroCarouselSlideIndex();
            //$('#hero-carousel span.hero-carousel-progress-bar[data-slide-index="' + activeSlideIndex + '"]').addClass('active');
            addActiveSlideClass();
            heroCarouselTicker = setInterval(showProgression, heroCarouselProgressTimerInterval);
        }
    }


    // show progress meter in current slide progress bar
    function showProgression(){
        if(heroCarouselPaused === false &&  heroCarouselModalActive === false) {
            heroCarouselPercentTime += (heroCarouselProgressTimerInterval / (heroCarouselTimer)) * 100;
            $('#hero-carousel span.hero-carousel-progress-bar[data-slide-index="' + activeSlideIndex + '"] span.hero-carousel-slide-progress').css({width: heroCarouselPercentTime+'%'});
            if (heroCarouselPercentTime > 100){
                clearTimeout(heroCarouselTicker);
                $('#hero-carousel').slick('slickNext');
            }
            // this is an aweful hack to get edge to play that first video on init
            if(activeSlideIndex == 0 && heroCarouselPercentTime < 10){
                $('#hero-carousel .slick-active .hero-background-video-container video').each(function () {
                    this.play();
                });
                // use this for MS Edge only, but mind you, problem exists in Chrome, too, so we hit all active videos
                // #hero-carousel .slick-active .hero-background-video-container.--ms_edge video
            }
        }
    }

    // pause hero carousel
    function heroCarouselPause(){
        heroCarouselPaused = true;
        clearTimeout(heroCarouselTicker);
        resetProgressbars();
    }

    // restart hero carousel
    /*
    function heroCarouselRestart(){
        heroCarouselPaused = false;
        startProgressBar();
    }
    */

    // resets all progress bars
    function resetProgressbars() {
        $('#hero-carousel span.hero-carousel-progress-bar').removeClass('active').addClass('inactive');
        $('#hero-carousel span.hero-carousel-progress-bar span.hero-carousel-slide-progress').css({
            width: 0 + '%'
        });
    }

    // get current slide index
    function getHeroCarouselSlideIndex(){
        var activeSlide = $('#hero-carousel .slick-track .slick-slide.slick-active');
        return activeSlide.data('slick-index');
    }

   /*
    // pause mechanism 1
    $('#hero-carousel').on({
        mouseenter: function() {
            if(heroCarouselModalActive === false){
                heroCarouselPause();
            }

        },
        mouseleave: function() {
            if(heroCarouselModalActive === false){
                heroCarouselRestart();
            }
        }
    });
    */


    function heroCarouselAutoPlayDisable(){
        heroCarouselAutoPlayDisabled = true;
        $('div#hero-carousel-progress-bars').addClass('auto-play-disabled');
        heroCarouselPause();
    }


    // Hero Video Modal Open and Pause Hero Carousel
    $(document).on(
        'open.zf.reveal', '#hero-video-modal[data-reveal]', function () {
            //heroCarouselModalActive = true;
            //heroCarouselPause();
            heroCarouselAutoPlayDisable();
        }
    );

    // Hero Video Modal Close and Restart Hero Carousel
    $(document).on(
        'closed.zf.reveal', '#hero-video-modal[data-reveal]', function () {
            //heroCarouselRestart();
            addActiveSlideClass();
        }
    );

    // make progress bars clickable and to to correct hero slide index
    // because span.hero-carousel-progress-bar was added after DOM was ready
    $(document).on('touchstart click', 'span.hero-carousel-progress-bar', function () {
        heroCarouselAutoPlayDisable(); // permanently disable autoplay
        var gotoHeroSlideIndex = $(this).data('slide-index');
        $('#hero-carousel').slick('slickGoTo', parseInt(gotoHeroSlideIndex) );
    });



    // Pause all slides' background videos
    function slideBackgroundVideosPause(){
        $('#hero-carousel video').each(function () {
            this.pause();
        });
    }

    // Play only the current active slides' background video
    function slideBackgroundVideoCurrentPlay(){
        $('#hero-carousel .slick-active video').each(function () {
            this.play();
        });

    }



    // do this before the slide changes
    $('#hero-carousel').on('beforeChange', function(event, slick, currentSlide, nextSlide){
        resetProgressbars();
        slideBackgroundVideosPause();
    });

    // do this after the slide has changed
    $('#hero-carousel').on('afterChange', function(event, slick, currentSlide){
        startProgressBar();
        if(heroCarouselAutoPlayDisabled === true){
            addActiveSlideClass();
        }
        slideBackgroundVideoCurrentPlay();
    });

    // fix video resize for edge and chrome
    $( window ).resize(function() {
        var hbvcHTML = $( '#hero-carousel .slick-current.slick-active .hero-background-video-container' ).html();
        $( '#hero-carousel .slick-current.slick-active .hero-background-video-container' ).empty().append(hbvcHTML);
    });




    $('#hero-carousel').on('init', function(ev, el){
        // make hero carousel visible after initializing
        $('#hero-carousel').css({visibility: 'visible'});

    });

    // initiate hero carousel
    $('#hero-carousel').slick({
        autoplay: false,
        arrows: false,
        infinite: true,
        pauseOnHover: true,
        waitForAnimate: true,
        draggable: true,
        adaptiveHeight: false
    });


    // initial insertion of the hero carousel progress bar container
    var progressBarsHTML = '<div id="hero-carousel-progress-bars-container"><div id="hero-carousel-progress-bars"></div></div>';
    $('#hero-carousel').append(progressBarsHTML);

    // insert individual progress bars with slide index data attributes
    var hhcCarousel = $('#hero-header-carousel');
    var heroSlidesCount = hhcCarousel.data('hero-slides-count');
    //alert('heroSlidesCount = ' + heroSlidesCount);
    for(hsc = 0; hsc < heroSlidesCount; hsc++){
        $('div#hero-carousel-progress-bars').append('<span class="hero-carousel-progress-bar inactive"' +
            ' data-slide-index="' + hsc + '" ><span class="hero-carousel-slide-progress"></span></span>');
    }


    // kick off the progress bar
    startProgressBar();





}


$(document).ready(function(){
    var heroType = null;
    var hhc = $('#hero-header-carousel');
    heroType = hhc.data('hero-type');
    //alert('hero-type = ' + heroType);
    if ( heroType == 'hero-carousel'){
        heroHeaderCarousel();
    }

});

/* eslint-enable */