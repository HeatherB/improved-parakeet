$.widget( "eme.lightbox", {

  // default options
  options: {
    slides: null,
    autoSlide: false,
    slideTime: 3000,
    transition: 'fade'
  },

  _create: function() {

    var slides = this.options.slides;
    var autoSlide = this.options.autoSlide;
    var slideTime = this.options.slideTime;
    var slideTransition = this.options.transition;
    var counter = this.options.counter;
    var galleryContainer = this.element;

    if(slides) {
        this.stuffSlides(slides, galleryContainer);
        var items = slides,
            amount = items.length,
            active = items[0];
    } else {
        var items = galleryContainer.children();
            amount = items.length,
            active = items[0];

        items.addClass('eme_slide');

        if(amount > 1) {
          this.initNav();
          this.initPager();
        };
    }

    if(this.options.autoSlide == true) {
      this.autoPause(slideTime);
    };

    if(slideTransition) {
      $(galleryContainer).addClass(slideTransition);
    };

    this.initLightbox();

    $(galleryContainer).addClass('emeGallery_wrapper');
  },

  stuffSlides: function(slides, galleryContainer) {
    $.getJSON(slides, function(data){
      var loadedSlides = "";
      $(data).each(function(i) {
        var img = "<img src='"+data[i].image_url+"' />";
        if(data[i].link_type == "search"){
          loadedSlides += "<div class='search-by' data-search-by='"+data[i].link_url+"'>"+img+"</div>";
        } else if(data[i].link_type == "filter") {
          loadedSlides += "<div class='filter-by' data-filter-by='"+data[i].link_url+"'>"+img+"</div>";
        } else {
          loadedSlides += "<div><a href='"+data[i].link_url+"'>"+img+"</a></div>";
        }
      });
      $( galleryContainer ).append(loadedSlides);
      var items = data,
            amount = items.length,
            active = items[0];
    });
  },

  initNav: function() {
    $('<div class="buttons"><button class="prev">&lsaquo; <span class="offscreen">prev</span></button><button class="next"><span class="offscreen">next</span> &rsaquo;</button></div><!-- end of buttons -->').prependTo(this.element);
    navigate(0);
    var counter  = 0;
  },

  autoPause: function(slideTime) {
    var galleryContainer = this.element;

    $(galleryContainer).on('mouseenter', function() {
      clearInterval(carouselInterval);
    });

    $(galleryContainer).on('mouseleave', function() {
      carouselInterval = setInterval(autoPlay, slideTime);
    });

    var carouselInterval = setInterval(function() {
      autoPlay();
    }, slideTime);

    function autoPlay() {
      galleryContainer.find($('.next')).trigger('click');
    }; 
  },

  initPager: function() {
    //console.log('did we init');
    var galleryContainer = this.element;
    galleryContainer.each(function() {
      $('<div class="pagers"></div><!-- end of pagers -->').prependTo($(this));
      var items = $(this).find('.eme_slide'); // actual slides
      pWrapper = $(this).find('.pagers');
      items.each(function(i) {
        var pagerCount = i + 1;
        $('<button/>', {
          'class': 'carouselpager',
          'data-pager': pagerCount,
        }).appendTo(pWrapper);
        $(this).attr('data-slide', pagerCount);
      });
      //$('.pagers button:first-child()').addClass('active');
      pWrapper.children().first().addClass('active');

      $(document).on('click', '#emelightbox-content .carouselpager', function (event) {
        event.preventDefault();
        $(this).siblings('.carouselpager').removeClass('active');
        var selectedPager = $(this).attr('data-pager');
        $(this).addClass('active');
        var carouselItems = $('#emelightbox-content').find('.eme_slide');
        var selectedSlide = carouselItems.filter(function() {
          return $(this).data('slide') == selectedPager;
        });
        $(this).parent().nextAll('.eme_slide').removeClass('active');
        selectedSlide.addClass('active');
      });
    }); // end gallery container each

  },

  initLightbox: function() {
    //console.log('lightbox again');
    var lightboxContainer = this.element;
    $(lightboxContainer).wrap("<div class='emelightbox-pop'></div>");

    function closeLightBox(closeThis) {
      $(document.body).removeClass('emelightbox-open');
      $('#blackout').hide();
      $('#bg_sheer').remove();
      $(closeThis).closest('#emelightbox-wrapper').remove();
      $('.emelightbox-pop').find('.eme_slide').removeClass('active');
      $('.emelightbox-pop').find('.carouselpager').removeClass('active');
    };

    $(document).on('click', '.emelightbox-close', function() {
      var closeThis = $(this);
      closeLightBox(closeThis);
    });
    
    $(document).on('click', '#blackout', function() {
      var closeThis = $('#emelightbox-wrapper');
      closeLightBox(closeThis);
    }); 
  }

}); // end the widget

$(document).on('click', '.emelightbox-pop .eme_slide', function(e) {
  e.preventDefault();
  
  active = $(this);
  $(this).addClass('active');
  // GA Tracking
//  var requestedContent = $(this).find('img').attr('data-large') || $(this).find('img').attr('data-video');
//  ga('send', 'event', 'TERA Media', 'Lightbox Triggered', requestedContent, {'nonInteraction': 1});
  var selectedForLB;
  var emelightboxContent;
  
  // if button
  var is_btn =  $( e.currentTarget ).is( ":button" ) && $( e.currentTarget ).hasClass( "eme_slide" );
  if(is_btn) {
    var video_content_to_load = $(this).data('video');
    if(video_content_to_load) {
      var videoBlock = '<iframe width="1100" height="622" allowfullscreen="allowfullscreen" src="' + video_content_to_load + '" frameborder="0"></iframe>';
      selectedForLB = videoBlock;
      emelightboxContent = selectedForLB;
    }
  } else {
    selectedForLB = $(this).parent();
    emelightboxContent = selectedForLB.clone().html();
  }

  //var selectedForLB = $(this).parent();
  //var selectedForLB = $(this);
  if($('.carouselpager').length > 0) {
    var items = selectedForLB.find($('.carouselpager'));
    var selectedLBSlide = $(this).attr('data-slide');
    var selectedLBPager = items.filter(function() {
      return $(this).data('pager') == selectedLBSlide;
    });
    items.removeClass('active');
    selectedLBPager.addClass('active');

    
  };

  var attachmentPoint = $(selectedForLB).offset();
  var offsetTop = $(window).scrollTop() + 50;
  

  //var emelightboxContent = selectedForLB.clone().html();
  var pageName = $('main').attr('id') || 'default';
  var emelightboxblock = '<div id="emelightbox-wrapper" class="lb_' + pageName + '"><div id="emelightbox" style="top:' + offsetTop + 'px;"><div class="emelightbox-close"><span>X</span></div><div id="emelightbox-content">' + emelightboxContent + '</div></div></div>';
 $(document.body).append(emelightboxblock);
  //setupSwipe();

 /* for image slides and video slides */
  var loadedLB = $('#emelightbox-wrapper').find('.eme_slide img');
  loadedLB.each(function(i) {
    var toLoadSlide = $(this).data('large');
    var toLoadVideo = $(this).data('video');
    if(toLoadSlide) {
      $(this).attr('src', toLoadSlide);
    }
    if(toLoadVideo) {
      var videoBlock = '<iframe width="1100" height="622" allowfullscreen="allowfullscreen" src="' + toLoadVideo + '" frameborder="0"></iframe>';
      $(this).replaceWith(videoBlock);
    }
  }, $('body').trigger('lightbox:loaded'));
  
});

$('body').on('lightbox:loaded', function() {
  $(document.body).addClass('emelightbox-open');
  $('#blackout').show();
});

$(document).on('click', '.next', function (event) {
  event.preventDefault();
  var activatedGallery = $('#emelightbox');
  navigate(1, activatedGallery);
});
$(document).on('click', '.prev', function (event) {
  event.preventDefault();
  var activatedGallery = $('#emelightbox');
  navigate(-1, activatedGallery);
});

function navigate(direction, activatedGallery) {
  var items = $(activatedGallery).find('.eme_slide'),
    amount = items.length,
    active = $(activatedGallery).find('.eme_slide.active'),
    pagerIndex = $(activatedGallery).find('.carouselpager.active').index();

    items.removeClass('active');

  if (typeof pagerIndex === 'undefined') {
    counter = counter + direction;
  } else {
    counter = pagerIndex + direction;
    pagerIndex = undefined;
  }
  if (direction === -1 && counter < 0) { 
    counter = amount - 1; 
  }
  if (direction === 1 && !items[counter]) { 
    counter = 0;
  }
  active = items[counter];
  $(active).addClass('active');
  updatePager(active, activatedGallery);
};

function updatePager(active, activatedGallery) {
  var updatedSlide = $(activatedGallery).find($(active)).attr('data-slide');
  var correctPagers = $(activatedGallery).find('.pagers button');
  var updatedPager = $(correctPagers).filter(function() {
    return $(this).data('pager') == updatedSlide;
  });

  $(activatedGallery).find($('.pagers button')).removeClass('active');
  $(updatedPager).addClass('active');
};

function setupSwipe() {
  var loadedSlides = $('#emelightbox-content').find('.eme_slide');
  var popupContainer = $('#emelightbox-content');

// add generic swipe
  loadedSlides.each(function(i) {
    function swipedetect(loadedSlides, callback) {

      var touchsurface = loadedSlides[i],
        swipedir,
        startX,
        startY,
        distX,
        distY,
        threshold = 25, // required min distance traveled to be considered swipe
        restraint = 300, // maximum distance allowed at the same time in perpendicular direction
        allowedTime = 300,
        elapsedTime,
        startTime,
        handleswipe = callback || function(swipedir) {}


      touchsurface.addEventListener('touchstart', function(e) {
        var touchobj = e.changedTouches[0]
        swipedir = 'none'
        dist = 0
        startX = touchobj.pageX
        startY = touchobj.pageY
        startTime = new Date().getTime() // record time when finger first makes contact with surface
        e.preventDefault()
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
  });
}; // end of setup swipe

/*function triggerclicks() {
  console.log('trigger clicks');
  $('#dc_release .lb_init').trigger('click');
};*/

$(document).ready(function() {
  $( ".eme-lightbox" ).lightbox();

  $.urlParam = function (captured_queryValue) {
    var results = new RegExp('[\?&]' + captured_queryValue + '=([^&#]*)')
                      .exec(window.location.href);
    if (results == null) {
         return 0;
    }
    return results[1] || 0;
  }

  function checkForPre() {
    /* is it worth a specific value */
    //if($.urlParam('prepurchase') == 'cat') {
    /* was it used at all */
    if($.urlParam('prepurchase')) {
      //$('body').trigger('prepurchase:dct');
      $('#dc_release .lb_init').trigger('click');
    } else {
      //console.log('no passed');
    }
  }

  if($('.pre-purchase').length > 0) {
    checkForPre();
  };


});


