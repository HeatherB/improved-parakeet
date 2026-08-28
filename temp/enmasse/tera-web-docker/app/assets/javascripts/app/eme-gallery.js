(function ( $ ) {

  'use strict';

  $.fn.gallery = function( options ) {

    var galleryContainer = this;

    return galleryContainer.each(function() {

      var items = $(this).children(),
          counter = 0,
          amount = items.length,
          active = items[0];
          //active = items.find('active');

      $(items[0]).addClass('active');

      items.addClass('eme_slide');

      if(amount > 1) {
        initNav();
        initPager();
        setupSwipe();
      }

      function initNav() {
        $('<div class="buttons"><button class="prev"><span class="offscreen"></span></button><button class="next"><span class="offscreen"></span></button></div><!-- end of buttons -->').prependTo(galleryContainer);
        $(document).on("click", '.next', function(event) {
          event.preventDefault();
          var activatedGallery = $(this).parent().parent();
          navigate(1, activatedGallery);
        });
        $(document).on("click", '.prev', function(event) {
          event.preventDefault();
          var activatedGallery = $(this).parent().parent();
          navigate(-1, activatedGallery);
        });
        navigate(0);
      } // end initNav

      function initPager() {
        $('<div class="pager_slider"><span class="prev"></span><div class="inner swipe_trigger"><span class="pager_slide"></span></div><span class="next"></span></div><div class="pagers"></div><!-- end of pagers -->').prependTo(galleryContainer);

        $.each(galleryContainer, function() {
          $.each($(this), function() {
            var items = $(this).find('.eme_slide'); // actual slides
            var these_items = items.length; 

            var correctGallery = $(this).find('.pagers');

            items.each(function() {
              var pagerCount = $(this).index() - 1;
              var pager_label = $(this).data('label');
              $('<a class="carouselpager" data-pager=' + pagerCount +' href="#"><span></span></a>').appendTo(correctGallery);
              /*$('<a/>', {
                'class': 'carouselpager',
                'data-pager': pagerCount,
                'href': '#'
              }).appendTo(correctGallery);*/
              $(this).attr('data-slide', pagerCount);
            });
            $(correctGallery).children().first().addClass('active');


            $(correctGallery).on("click", "a", function(event) {
              event.preventDefault();
              $(correctGallery).find('a').removeClass('active');
              var selectedPager = $(this).attr('data-pager');
              $(this).addClass('active');
              window.pagerIndex = $(this).index();

              var selectedSlide = items.filter(function() {
                return $(this).data('slide') == selectedPager;
              });
              items.removeClass('active');
              selectedSlide.addClass('active');
            });

          })
        })

      } // end initPager

      //gallery carousel - https://www.christianheilmann.com/2015/04/08/keeping-it-simple-coding-a-carousel/
      function navigate(direction, activatedGallery) {
        var items = $(activatedGallery).find('.eme_slide'),
          amount = items.length,
          active = items.find('.active');

        items.removeClass('active');

        if (typeof pagerIndex === 'undefined') {
          counter = counter + direction;
          //console.log('undefined counter = ' + counter);
        } else {
          counter = pagerIndex + direction;
          window.pagerIndex = undefined;
          //console.log('else counter = ' + counter);
        }
        if (direction === -1 && counter < 0) { 
          counter = amount - 1; 
        }
        if (direction === 1 && !items[counter]) { 
          counter = 0;
        }
        active = items[counter];


        var percentToSlide = counter * (100 / (amount -1));
        var correctSlider = $(activatedGallery).find('.pager_slide');

        if(correctSlider) {
          //if(percentToSlide === 0) {
          //  correctSlider.css('left', 0);
          //} else {
            correctSlider.css('left', percentToSlide + '%');
          //}
       }
        
        //active.classList.add('active');
        $(active).addClass('active');
        updatePager(active, activatedGallery);
      } // end navigate

      function updatePager(active, activatedGallery) {
        var updatedSlide = $(activatedGallery).find($(active)).attr('data-slide');
        var correctPagers = $(activatedGallery).find('.pagers a');
        var updatedPager = $(correctPagers).filter(function() {
          return $(this).data('pager') == updatedSlide;
          //var cat = $(this).data('pager') == updatedSlide;
          //console.log(cat);
        });

        $(activatedGallery).find($('.pagers a')).removeClass('active');
        $(updatedPager).addClass('active');
      }

     /* function autoPlay() {
        $('.next').trigger('click');
      }

      function autoPause() {
        $(galleryContainer).on('mouseenter', function() {
          clearInterval(carouselInterval);
        });

        $(galleryContainer).on('mouseleave', function() {
          carouselInterval = setInterval(autoPlay, 6000);
        })
      }
      autoPause();

      var carouselInterval = setInterval(function() {
        autoPlay()
      }, 6000);*/

      function setupSwipe() {
        $.each(galleryContainer, function() {
          $.each($(this), function() {
            var loadedSlides = $(this).find('.swipe_trigger'); // actual slides
        
            var popupContainer = $(this);

        // add generic swipe
          loadedSlides.each(function(i) {
            function swipedetect(loadedSlides, callback) {

              var touchsurface = loadedSlides[i],
                swipedir,
                startX,
                startY,
                distX,
                distY,
                dist,
                threshold = 25, // required min distance traveled to be considered swipe
                restraint = 300, // maximum distance allowed at the same time in perpendicular direction
                allowedTime = 300,
                elapsedTime,
                startTime,
                handleswipe = callback || function(swipedir) {}


              touchsurface.addEventListener('touchstart', function(e) {
                var touchobj = e.changedTouches[0];
                swipedir = 'none';
                dist = 0;
                startX = touchobj.pageX;
                startY = touchobj.pageY;
                startTime = new Date().getTime(); // record time when finger first makes contact with surface
                e.preventDefault();
              }, false)

              touchsurface.addEventListener('touchmove', function(e) {
                e.preventDefault() // prevent scrolling when inside DIV
              }, false)

              touchsurface.addEventListener('touchend', function(e) {
                var touchobj = e.changedTouches[0]
                distX = touchobj.pageX - startX // get horizontal dist traveled by finger whiel in contact with surface
                distY = touchobj.pageY - startY // get vertical dist traveled by finger whiel in contact wit hsurface
                elapsedTime = new Date().getTime() - startTime // get time elapsed
                if (elapsedTime <= allowedTime) { // first condition for swipe met
                  if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) { // 2nd condition for horizontal swipe met
                    swipedir = (distX < 0)? 'left' : 'right' // if dist traveled is negative, it indices left swipe
                  } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) { // 2nd condition for vertical swipe met
                    swipedir = (distY < 0)? 'up' : 'down' // id dist traveled is negative, it indicates up swipe
                  }
                }
                handleswipe(swipedir)
                e.preventDefault()
              }, false) 
            }

            // usage
            var el = loadedSlides;
            swipedetect(el, function(swipedir) {
              //swipedir contains either "none", "left", "right", "top", "down"
              if (swipedir == 'left') {
                popupContainer.find($('.next')).trigger('click');
              } else if (swipedir == 'right') {
                popupContainer.find($('.prev')).trigger('click');
              } else if (swipedir == 'up') {
                popupContainer.find($('.prev')).trigger('click');
              } else if (swipedir == 'down') {
                popupContainer.find($('.next')).trigger('click');
              } else {
                console.log('undetectable swipe');
              }
            });
          }); // end loaded slides
        });
        });
      }; // end of setup swipe

    }); 
  };
 
}( jQuery ));


$(document).ready(function() {
  // Usage example:
  //$( "#shop_slidesshow" ).gallery();
  $( "#encounters-gallery" ).gallery();
  $( "#fantasy-gallery" ).gallery();
});