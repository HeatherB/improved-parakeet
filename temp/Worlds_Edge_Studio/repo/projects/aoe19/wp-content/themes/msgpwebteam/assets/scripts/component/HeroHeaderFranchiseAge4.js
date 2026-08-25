/* eslint-disable */

function heroHeaderFranchiseCarousel(){


    // initiate hero carousel
    $('#hero-franchise-carousel').slick({
        autoplay: false,
        autoplaySpeed: 5000,
        infinite: true,
        pauseOnHover: true,
        waitForAnimate: true,
        draggable: true,
        adaptiveHeight: false,
        waitForAnimate: true,
        arrows: false,
        dots: true,
        dotsClass: 'slick-dots',
        fade: true
    });

    // add visual delight to buttons
    var franchiseButtons = ''
        + '<div class="button__container">'
        + '  <div class="relative__container">'
        + '    <div class="hero__background --background-unselected"></div>'
        + '    <div class="hero__background --background-selected-or-hover"></div>'
        + '    <div class="hero__button-border"></div>'
        + '  </div>'
        + '</div>'
        + '<div class="franchise__progress-bar">'
        + '  <div class="progress-bar-percent"></div>'
        + '</div>';

    $('#hero-franchise-carousel ul.slick-dots li').append(franchiseButtons);


    // this adds the right side border to the last button border in the list
    $('#hero-franchise-carousel ul.slick-dots li:last-of-type .hero__button-border').addClass('--end-cap');


    // fetch background data slide 00
    var heroBackgroundCanvas00 = $('#hero-franchise-slide-00').data('hero-background-canvas');
    var heroSelectedCanvas00 = $('#hero-franchise-slide-00').data('hero-selected-canvas');

    // add background data to button 00
    $('#slick-slide00 .hero__background.--background-unselected').css('background-image', 'url("' + heroBackgroundCanvas00 + '")');
    $('#slick-slide00 .hero__background.--background-selected-or-hover').css('background-image', 'url("' + heroSelectedCanvas00 + '")');

    // fetch background data slide 01
    var heroBackgroundCanvas01 = $('#hero-franchise-slide-01').data('hero-background-canvas');
    var heroSelectedCanvas01 = $('#hero-franchise-slide-01').data('hero-selected-canvas');

    // add background data to button 01
    $('#slick-slide01 .hero__background.--background-unselected').css('background-image', 'url("' + heroBackgroundCanvas01 + '")');
    $('#slick-slide01 .hero__background.--background-selected-or-hover').css('background-image', 'url("' + heroSelectedCanvas01 + '")');

    // fetch background data slide 02
    var heroBackgroundCanvas02 = $('#hero-franchise-slide-02').data('hero-background-canvas');
    var heroSelectedCanvas02 = $('#hero-franchise-slide-02').data('hero-selected-canvas');

    // add background data to button 02
    $('#slick-slide02 .hero__background.--background-unselected').css('background-image', 'url("' + heroBackgroundCanvas02 + '")');
    $('#slick-slide02 .hero__background.--background-selected-or-hover').css('background-image', 'url("' + heroSelectedCanvas02 + '")');

    // fetch background data slide 03
    var heroBackgroundCanvas03 = $('#hero-franchise-slide-03').data('hero-background-canvas');
    var heroSelectedCanvas03 = $('#hero-franchise-slide-03').data('hero-selected-canvas');

    // add background data to button 03
    $('#slick-slide03 .hero__background.--background-unselected').css('background-image', 'url("' + heroBackgroundCanvas03 + '")');
    $('#slick-slide03 .hero__background.--background-selected-or-hover').css('background-image', 'url("' + heroSelectedCanvas03 + '")');

    // fetch background data slide 04
    var heroBackgroundCanvas04 = $('#hero-franchise-slide-04').data('hero-background-canvas');
    var heroSelectedCanvas04 = $('#hero-franchise-slide-04').data('hero-selected-canvas');

    // add background data to button 04
    $('#slick-slide04 .hero__background.--background-unselected').css('background-image', 'url("' + heroBackgroundCanvas04 + '")');
    $('#slick-slide04 .hero__background.--background-selected-or-hover').css('background-image', 'url("' + heroSelectedCanvas04 + '")');


    // define button icons html for nav
    var buttonIcons_arr = [];
    buttonIcons_arr[0] = '<div class="hero__button-icon"><span class="icon-age1-01"></span></div>';
    buttonIcons_arr[1] = '<div class="hero__button-icon"><span class="icon-age2-01"></span></div>';
    buttonIcons_arr[2] = '<div class="hero__button-icon"><span class="icon-age3-01"></span></div>';
    buttonIcons_arr[3] = '<div class="hero__button-icon"><span class="icon-age4-01"></span></div>';
    buttonIcons_arr[4] = '<div class="hero__button-icon"><span class="icon-ageM-01"></span></div>';

    // add button icons to nav
    $('#hero-franchise-carousel ul.slick-dots li:nth-of-type(1) .button__container .relative__container').append(buttonIcons_arr[0]);
    $('#hero-franchise-carousel ul.slick-dots li:nth-of-type(2) .button__container .relative__container').append(buttonIcons_arr[1]);
    $('#hero-franchise-carousel ul.slick-dots li:nth-of-type(3) .button__container .relative__container').append(buttonIcons_arr[2]);
    $('#hero-franchise-carousel ul.slick-dots li:nth-of-type(4) .button__container .relative__container').append(buttonIcons_arr[3]);
    $('#hero-franchise-carousel ul.slick-dots li:nth-of-type(5) .button__container .relative__container').append(buttonIcons_arr[4]);


    // hide or remove buttons based on carousel styles
    // .slide-style-default = normal carousel style (hide buttons)
    // .slide-style-hero = hero franchise carousel style (show buttons)

    var carouselNavButtonStyle = $('.hero-franchise-carousel-slide.slick-current.slick-active').hasClass('slide-style-default');

    if(carouselNavButtonStyle === true){
        $('#hero-franchise-carousel ul.slick-dots').addClass('nav-style-default');
    }

    // the video part
    // avoid playing videos if we are less than foundation large
    var html5VideoWindowWidthThreshold = 1024;
    var html5CurrentWindowWidth = $(window).width();
    var html5VideoCanPlay = false;
    if (html5CurrentWindowWidth >= html5VideoWindowWidthThreshold) {
        html5VideoCanPlay = true;
    }
    // deal with the resizing of a window
    $( window ).resize(function () {
        html5CurrentWindowWidth = $(window).width();
        if(html5CurrentWindowWidth >= html5VideoWindowWidthThreshold) {
            // we can play the video
            html5VideoCanPlay = true;
            var franchiseCarouselHTMLVideo = null;
            var hasHTMLVideo = $('.hero-franchise-carousel-slide.slick-current.slick-active').has('video').length ? true : false;
            if (hasHTMLVideo == true && html5VideoCanPlay == true) {
                franchiseCarouselHTMLVideo = $('.hero-franchise-carousel-slide.slick-current.slick-active video');
                franchiseCarouselHTMLVideo[0].play();
            }
        } else {
            // pause all the videos
            html5VideoCanPlay == false;
            $('.hero-franchise-carousel-slide video').each(function(){
                $(this)[0].pause();
            });
        }
    })
    // get the html5 video info if present and play it if present
    var franchiseCarouselHTMLVideo = null;
    var hasHTMLVideo = $('.hero-franchise-carousel-slide.slick-current.slick-active').has('video').length ? true : false;
    if (hasHTMLVideo == true && html5VideoCanPlay == true) {
        // we have a video and screen size is large enough to play it
        franchiseCarouselHTMLVideo = $('.hero-franchise-carousel-slide.slick-current.slick-active video');
        franchiseCarouselHTMLVideo[0].play();
    } else {
        // no video
    }
    // okay we are now done with the video stuff

    // now on to carousel transitions
    // and progress bar visual delight

    // initial variable setup
    var heroFranchiseCarouselTimer = 5000,
        heroFranchiseCarouselProgressTimerInterval = 10,
        heroFranchiseCarouselTicker = null,
        heroFranchiseCarouselPercentTime = 0,
        heroFranchiseActiveSlideIndex = 0,
        heroFranchiseCarouselPaused = false,
        heroFranchiseCarouselModalActive = false,
        heroFranchiseCarouselAutoPlayDisabled = false,
        heroFranchiseCarouselButtons = '#hero-franchise-carousel ul.slick-dots li';
    heroFranchiseProgressBarPercentAll = '#hero-franchise-carousel ul.slick-dots li .franchise__progress-bar .progress-bar-percent',
        heroFranchiseProgressBarPercentActive = '#hero-franchise-carousel ul.slick-dots li.slick-active .franchise__progress-bar .progress-bar-percent';


    // resets all progress bars
    function resetHeroFranchiseProgressbars() {
        clearTimeout(heroFranchiseCarouselTicker);
        $(heroFranchiseProgressBarPercentAll).css({
            width: 0 + '%'
        });
    }

    function heroFranchiseCarouselAutoPlayDisable(){
        heroFranchiseCarouselAutoPlayDisabled = true;
        resetHeroFranchiseProgressbars();
        // add a class to the carousel to change styles of progress bar indicators
        $('#hero-franchise-carousel').addClass('is-autoplay-disabled');
    }

    // pause hero franchise carousel
    function heroFranchiseCarouselPause(){
        // set the carousel paused status to true
        heroFranchiseCarouselPaused = true;
        // reset all carousel progress bars
        resetHeroFranchiseProgressbars();
        // add a class to the carousel to change styles of progress bar indicators
        $('#hero-franchise-carousel').addClass('is-paused');
        // pause any and all videos in the carousel
        $('.hero-franchise-carousel-slide video').each(function(){
            $(this)[0].pause();
        });
    }

    // unpuase hero franchise carousel
    function heroFranchiseCarouseUnPause(){
        // set the carousel paused status to false
        heroFranchiseCarouselPaused = false;
        // remove class to change styles of progress bar indicators
        $('#hero-franchise-carousel').removeClass('is-paused');
        // kick off the carousel transitions
        startHeroFranchiseProgressBar();
        // restart the background video if present
        franchiseCarouselHTMLVideo = null;
        hasHTMLVideo = $('.hero-franchise-carousel-slide.slick-current.slick-active').has('video').length ? true : false;
        if (hasHTMLVideo == true && html5VideoCanPlay == true) {
            // we have a video and screen size is large enough to play it
            franchiseCarouselHTMLVideo = $('.hero-franchise-carousel-slide.slick-current.slick-active video');
            franchiseCarouselHTMLVideo[0].play();
        }

    }


    // start the progress bar
    function startHeroFranchiseProgressBar(){
        if(heroFranchiseCarouselAutoPlayDisabled === false && heroFranchiseCarouselPaused === false) {
            clearTimeout(heroFranchiseCarouselTicker);
            resetHeroFranchiseProgressbars();
            heroFranchiseCarouselPercentTime = 0;
            //heroFranchiseActiveSlideIndex = getHeroFranchiseCarouselSlideIndex();
            heroFranchiseCarouselTicker = setInterval(heroFranchiseProgressBarAnimate, heroFranchiseCarouselProgressTimerInterval);
        }
    }

    // show progress meter in current slide progress bar
    function heroFranchiseProgressBarAnimate(){
        if(heroFranchiseCarouselPaused === false &&  heroFranchiseCarouselModalActive === false) {
            heroFranchiseCarouselPercentTime += (heroFranchiseCarouselProgressTimerInterval / (heroFranchiseCarouselTimer)) * 100;
            $(heroFranchiseProgressBarPercentActive).css({width: heroFranchiseCarouselPercentTime+'%'});
            if (heroFranchiseCarouselPercentTime >= 100){
                clearTimeout(heroFranchiseCarouselTicker);
                $('#hero-franchise-carousel').slick('slickNext');
            }
        }
    }

    // enable a pause function when clicking buttons
    $(document).on('touchstart click', heroFranchiseCarouselButtons, function () {
        heroFranchiseCarouselAutoPlayDisable();
    });


    // do this before the slide changes
    $('#hero-franchise-carousel').on('beforeChange', function(event, slick, currentSlide, nextSlide){
        // Check to see if we need to pause a video
        if (hasHTMLVideo == true && html5VideoCanPlay == true) {
            // pause the video before switching slides
            franchiseCarouselHTMLVideo[0].pause();
        }

        // reset all progress bars
        resetHeroFranchiseProgressbars();

    });

    // do this after the slide has changed
    $('#hero-franchise-carousel').on('afterChange', function(event, slick, currentSlide){
        // do stuff after slide changes

        // CHECK to see if buttons need to be displayed
        // then show or hide them depending on slide style
        // default = hide
        // hero = show
        carouselNavButtonStyle = $('.hero-franchise-carousel-slide.slick-current.slick-active').hasClass('slide-style-default');
        if(carouselNavButtonStyle === true){
            $('#hero-franchise-carousel ul.slick-dots').addClass('nav-style-default');

        } else {
            $('#hero-franchise-carousel ul.slick-dots').removeClass('nav-style-default');
        }

        // CHECK to see if there is a background video and if so play it
        hasHTMLVideo = $('.hero-franchise-carousel-slide.slick-current.slick-active').has('video').length ? true : false;
        if (hasHTMLVideo == true && html5VideoCanPlay == true) {
            // get the video and play it
            franchiseCarouselHTMLVideo = $('.hero-franchise-carousel-slide.slick-current.slick-active video');
            franchiseCarouselHTMLVideo[0].play();
        }

        // kick off the carousel transitions
        startHeroFranchiseProgressBar();

    });

    // Do this when Hero Franchise Video Modal opens
    $(document).on(
        'open.zf.reveal', '#hero-franchise-video-modal[data-reveal]', function () {
            // pause carousel and progress bars
            heroFranchiseCarouselPause();
        }
    );

    // Do this when Hero Franchise Video Modal closes
    $(document).on(
        'closed.zf.reveal', '#hero-franchise-video-modal[data-reveal]', function () {
            // kick off the carousel transitions
            heroFranchiseCarouseUnPause();
        }
    );

    // The carousel is initially hidden, so display it.
    $('.hero-header__container[data-hero-type="hero-franchise-carousel"]').css('display', 'block');

    // kick off the carousel transitions
    startHeroFranchiseProgressBar();




}

$(document).ready(function(){

    heroHeaderFranchiseCarousel();

});



/* eslint-enable */