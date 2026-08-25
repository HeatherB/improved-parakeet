export default class CivPageSlickSlider {

    constructor() {
        this.init();
    }

    init() {
        // Slick slider code below:
        // https://kenwheeler.github.io/slick/
        /**
         * Variables
         */
        // One slide slideshow displaying at a time
        let slider1 = $('.slide-show-1') || null;

        // Three slides slideshow displaying at a time in a 4 or more slide section.
        // If on table 2 slides slideshow displaying 
        // and if on mobile 1 slide slideshow displaying.
        // Also scenarios in three slides section if there
        // are 2 or 3 slides displaying.
        // In three slides section if there is 1 slide displaying JS doesn't
        // manipulate the DOM of that single slide.
        let slider3 = $('.slide-show-3') || null;
        let slider3With3Slides = $('.sections-3.slider3') || null;
        let slider3With2Slides = $('.sections-2.slider3') || null;

        if(slider1 === null || slider3 === null || slider3With3Slides === null || slider3With2Slides === null || slider3With2Slides === null) {
            return;
        }
        
        // Window width on load
        let widthOnLoad = $(window).outerWidth();

        if(slider1) {
            slider1.slick({
                speed: 700,
            });
        }

        // On load show display 3 slides if window width 1024px or above
        // or if less than that display 1 slide
        function slider3OnLoad(width, elem, numSlides = null) {
            if(elem === null) {
                return;
            }

            if(width >= 1280 && numSlides === null) {
                elem.slick({
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    speed: 700,
                });
            } else if(width < 1280 && width > 1024 && (numSlides === null || numSlides === 3)) {
                elem.slick({
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    speed: 700,
                });
            } else if(width <= 1024 && (numSlides === null || numSlides <= 3)) {
                elem.slick({
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    speed: 700,
                });                    
            }
        }

        slider3OnLoad(widthOnLoad, slider3);
        slider3OnLoad(widthOnLoad, slider3With3Slides, 3);
        slider3OnLoad(widthOnLoad, slider3With2Slides, 2);

        // Position prev next btns for 1 slide or 3 slides slide show
        function slidesBtnStyles(elem, width, sliderType = null) {
            let prevBtn = elem.find('.slick-prev') || null;
            let prevBtnBgImgStr = prevBtn.css('background-image') || null;
            let nextBtn = elem.find('.slick-next') || null;
            let nextBtnBgImgStr = nextBtn.css('background-image') || null;

            let activeSlides = elem.find('.slick-list .slick-slide.slick-active') || null;

            if(prevBtnBgImgStr === null && nextBtnBgImgStr === null) {
                return;
            }

            let prevBtnImgPath = prevBtnBgImgStr.slice(5, -2);
            let nextBtnImgPath = nextBtnBgImgStr.slice(5, -2);

            if( prevBtn.find('img').length === 0 ) {
                prevBtn.append('<img src="' + prevBtnImgPath + '" alt="" />');   
            }
            if( nextBtn.find('img').length === 0 ) {
                nextBtn.append('<img src="' + nextBtnImgPath + '" alt="" />');   
            }

            // Slide prev and slick next wrappers needed to 
            // fix horizontal positioning of 
            // btn.slick-prev and btn.slick-next
            if(!prevBtn.parent().hasClass('slick-prev-wrapper')) {
                prevBtn.wrap('<div class="slick-prev-wrapper"></div>');
            }
            let prevBtnWrapper = elem.find('.slick-prev-wrapper');

            if(!nextBtn.parent().hasClass('slick-next-wrapper')) {
                nextBtn.wrap('<div class="slick-next-wrapper"></div>');
            }
            let nextBtnWrapper = elem.find('.slick-next-wrapper');
            
            // Below is math that works to correctly position slick slider
            // prev & next btns exactly on left or right edge of 
            // a single slide or group of slides and
            // in the middle of slide's top image
            let slideImgClass = null;
            let heightVal = null;
            let slide1InnerHeight = null;
            let activeSlideImgHeight = null;

            if(width > 767) {
                slideImgClass = 'img.tease-desktop-image';
            } else {
                slideImgClass = 'img.tease-mobile-image';
            }

            if(sliderType === 'show1Slider' && width > 1024) {
                slide1InnerHeight = $('.slide-show-1 .slick-slide.slick-active .tease .bg').first().outerHeight();
                heightVal = (slide1InnerHeight / 4);
            } else {
                activeSlideImgHeight = activeSlides.first().find('.bg').find(slideImgClass).height();
                heightVal = ( activeSlideImgHeight ) + ( parseInt(activeSlides.find('.tease.civs-template').first().css('border-image-slice')) * 2 );
            }

            let elemPaddingLf = ( parseInt(elem.css('padding-left')) * -1 ) + 'px';

            let topVal = ( heightVal / 2 ) + 'px';

            if(sliderType === 'show1Slider') {
                prevBtnWrapper.css({
                    height: heightVal,
                });
    
                nextBtnWrapper.css({
                    height: heightVal,
                    left: elemPaddingLf,
                });

                prevBtn.css({
                    top: topVal,
                });
    
                nextBtn.css({
                    top: topVal,
                });
            } else {
                prevBtnWrapper.css({
                    height: heightVal,
                });
    
                nextBtnWrapper.css({
                    height: heightVal,
                    left: elemPaddingLf,
                });
    
                prevBtn.css({
                    top: topVal,
                });
    
                nextBtn.css({
                    top: topVal,
                });
            }
        }

   
        slidesBtnStyles(slider3, widthOnLoad);
        slidesBtnStyles(slider1, widthOnLoad, 'show1Slider');

        if(widthOnLoad < 1280 && widthOnLoad > 1024) {
            slidesBtnStyles(slider3With3Slides, widthOnLoad);
        } else if(widthOnLoad <= 1024) {
            slidesBtnStyles(slider3With3Slides, widthOnLoad);
            slidesBtnStyles(slider3With2Slides, widthOnLoad); 
        }

        // In window on resize jQuery function below do NOT use
        // a reusable function call that changes the slick slider 
        // in the resizeTimer reassignments as this DOES NOT WORK
        let resizeTimer = null;

        $(window).on('resize', function() {
            let width = $(window).outerWidth();

            let slider3 = $('.slide-show-3') || null;
            let slider3With3Slides = $('.sections-3.slider3') || null;
            let slider3With2Slides = $('.sections-2.slider3') || null;

            function slickSliderOnResize(elem, slides) {
                if(!elem && !slides) {
                    return;
                }

                switch(slides) {
                    case 3:
                        elem.slick({
                            slidesToShow: 3,
                            slidesToScroll: 1,
                            speed: 700,
                        });   
                        return;   
                    case 2:
                        elem.slick({
                            slidesToShow: 2,
                            slidesToScroll: 1,
                            speed: 700,
                        });   
                        return;   
                    case 1:
                        elem.slick({
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            speed: 700,
                        });
                        return;
                }

            }

            if(resizeTimer !== null) {
                resizeTimer = clearTimeout(resizeTimer);
            }

            if(width >= 1280) {
                resizeTimer = setTimeout(function() {
                    slider3.slick('unslick');
                    if(slider3With3Slides.hasClass('slick-initialized')) {
                        slider3With3Slides.slick('unslick');
                    }
                    if(slider3With2Slides.hasClass('slick-initialized')) {
                        slider3With2Slides.slick('unslick');
                    }
                    
                    slickSliderOnResize(slider3, 3);
                    slidesBtnStyles(slider3, width);
                    slidesBtnStyles(slider1, width, 'show1Slider');
                }, 120);
            } else if(width < 1280 && width > 1024) {
                resizeTimer = setTimeout(function() {
                    slider3.slick('unslick');
                    if(slider3With3Slides.hasClass('slick-initialized')) {
                        slider3With3Slides.slick('unslick');
                    }
                    if(slider3With2Slides.hasClass('slick-initialized')) {
                        slider3With2Slides.slick('unslick');
                    }

                    slickSliderOnResize(slider3, 2);
                    slickSliderOnResize(slider3With3Slides, 2);

                    slidesBtnStyles(slider3, width);
                    slidesBtnStyles(slider3With3Slides, width);
                    slidesBtnStyles(slider1, width, 'show1Slider');
                }, 120);
            } else if(width <= 1024 & width > 767) {               
                resizeTimer = setTimeout(function() {
                    slider3.slick('unslick');
                    if(slider3With3Slides.hasClass('slick-initialized')) {
                        slider3With3Slides.slick('unslick');
                    }
                    if(slider3With2Slides.hasClass('slick-initialized')) {
                        slider3With2Slides.slick('unslick');
                    }

                    slickSliderOnResize(slider3, 1);
                    slickSliderOnResize(slider3With3Slides, 1);
                    slickSliderOnResize(slider3With2Slides, 1);

                    slidesBtnStyles(slider3, width);
                    slidesBtnStyles(slider3With3Slides, width);
                    slidesBtnStyles(slider3With2Slides, width);
                    slidesBtnStyles(slider1, width, 'show1Slider');
                }, 120);
            } else if(width <= 767) {
                resizeTimer = setTimeout(function() {
                    slider3.slick('unslick');
                    if(slider3With3Slides.hasClass('slick-initialized')) {
                        slider3With3Slides.slick('unslick');
                    }
                    if(slider3With2Slides.hasClass('slick-initialized')) {
                        slider3With2Slides.slick('unslick');
                    }

                    slickSliderOnResize(slider3, 1);
                    slickSliderOnResize(slider3With3Slides, 1);
                    slickSliderOnResize(slider3With2Slides, 1);

                    slidesBtnStyles(slider3, width);
                    slidesBtnStyles(slider3With3Slides, width);
                    slidesBtnStyles(slider3With2Slides, width);
                    slidesBtnStyles(slider1, width, 'show1Slider');
                }, 120);
            }

        });
    }
 }