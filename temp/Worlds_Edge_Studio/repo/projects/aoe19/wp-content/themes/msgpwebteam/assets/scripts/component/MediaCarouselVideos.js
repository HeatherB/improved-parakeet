/* eslint-disable */

function mediaCarouselVideos(){

  ( function() {

    var youtube = document.querySelectorAll( ".youtube" );

    for (var i = 0; i < youtube.length; i++) {

      youtube[i].addEventListener( "click", function() {

        var iframe = document.createElement( "iframe" );

        iframe.setAttribute( "frameborder", "0" );
        iframe.setAttribute( "allowfullscreen", "" );
        iframe.setAttribute( "src", "https://www.youtube.com/embed/"+ this.dataset.embed +"?rel=0&showinfo=0&autoplay=1" );

        this.innerHTML = "";
        this.appendChild( iframe );
      } );  
    };

  } )();

    // initiate slick carousel videos display
    $('#media-carousel-videos-display').slick({
      lazyLoad: 'ondemand',
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: true,
      asNavFor: '#media-carousel-videos-nav'
    });

    // initiate slick carousel videos nav
    $('#media-carousel-videos-nav').slick({
      lazyLoad: 'ondemand',
      slidesToShow: 4,
      slidesToScroll: 1,
      asNavFor: '#media-carousel-videos-display',
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

    function mediaFilterVideosCarouselUrlParam(){

      var urlParamName = 'filter';
      var urlParamPresent = checkForUrlParam(urlParamName);

      if(urlParamPresent === true){

       var urlParamValue = new RegExp('[\?&]' + urlParamName + '=([^&#]*)').exec(window.location.href);

       var mediaFilterVideoGame = urlParamValue[1];

           // filter videos

           var videoCarousel = '#media-carousel-videos-nav';

           // NOTE:  slickFilter uses :has(.elementClass)
           //        as SlickSlider 1.8.1 uses jQuery filter.
           //        See URL: http://api.jquery.com/filter/
           //        Discussion: https://github.com/kenwheeler/slick/issues/3161
           switch (mediaFilterVideoGame) {
             case 'all':
             $(videoCarousel).slick('slickUnfilter');
             break;
             case 'aoe':
             $(videoCarousel).slick('slickUnfilter');
             $(videoCarousel).slick('slickFilter',':has(.aoe)');
             break;
             case 'aoe2':
             $(videoCarousel).slick('slickUnfilter');
             $(videoCarousel).slick('slickFilter',':has(.aoe2)');
             break;
             case 'aoe2de':
             $(videoCarousel).slick('slickUnfilter');
             $(videoCarousel).slick('slickFilter',':has(.aoe2de)');
             break;
             case 'aoe3':
             $(videoCarousel).slick('slickUnfilter');
             $(videoCarousel).slick('slickFilter',':has(.aoe3)');
             break;
             case 'aoe4':
             $(videoCarousel).slick('slickUnfilter');
             $(videoCarousel).slick('slickFilter',':has(.aoe4)');
             break;
             case 'aom':
             $(videoCarousel).slick('slickUnfilter');
             $(videoCarousel).slick('slickFilter',':has(.aom)');
             break;
             case 'aup':
             $(videoCarousel).slick('slickUnfilter');
             $(videoCarousel).slick('slickFilter',':has(.aup)');
             break;
             default:
             console.log = 'Video filter choice not in list.';
           }

           // change the display to match the nav
           var videoCarouselDisplay = '#media-carousel-videos-display';
           var videoCarouselCurrentSlide = $(videoCarousel + ' .slick-current').data('slick-index');
           $(videoCarouselDisplay).slick('slickGoTo', videoCarouselCurrentSlide);

           // change the selected property on carousel filter
           $('#media-videos__container select#video-options option').prop("selected", false);
           $('#media-videos__container select#video-options option[value="' + mediaFilterVideoGame + '"]').prop("selected", true);


         }

       }

    // filter videos if url parameter exists
    mediaFilterVideosCarouselUrlParam();


    function mediaFilterVideosCarousel(){

      var videoCarousel = '#media-carousel-videos-nav';

      var mediaFilterVideoGame = $( 'select#video-options' ).val();

        // NOTE:  slickFilter uses :has(.elementClass)
        //        as SlickSlider 1.8.1 uses jQuery filter.
        //        See URL: http://api.jquery.com/filter/
        //        Discussion: https://github.com/kenwheeler/slick/issues/3161
        switch (mediaFilterVideoGame) {
          case 'all':
          $(videoCarousel).slick('slickUnfilter');
          break;
          case 'aoe':
          $(videoCarousel).slick('slickUnfilter');
          $(videoCarousel).slick('slickFilter',':has(.aoe)');
          break;
          case 'aoe2':
          $(videoCarousel).slick('slickUnfilter');
          $(videoCarousel).slick('slickFilter',':has(.aoe2)');
          break;
          case 'aoe2de':
          $(videoCarousel).slick('slickUnfilter');
          $(videoCarousel).slick('slickFilter',':has(.aoe2de)');
          break;
          case 'aoe3':
          $(videoCarousel).slick('slickUnfilter');
          $(videoCarousel).slick('slickFilter',':has(.aoe3)');
          break;
          case 'aoe4':
          $(videoCarousel).slick('slickUnfilter');
          $(videoCarousel).slick('slickFilter',':has(.aoe4)');
          break;
          case 'aom':
          $(videoCarousel).slick('slickUnfilter');
          $(videoCarousel).slick('slickFilter',':has(.aom)');
          break;
          case 'aup':
          $(videoCarousel).slick('slickUnfilter');
          $(videoCarousel).slick('slickFilter',':has(.aup)');
          break;
          default:
          console.log = 'Video filter choice not in list.';
        }

        // change the display to match the nav
        var videoCarouselDisplay = '#media-carousel-videos-display';
        var videoCarouselCurrentSlide = $(videoCarousel + ' .slick-current').data('slick-index');
        $(videoCarouselDisplay).slick('slickGoTo', videoCarouselCurrentSlide);


      }

      $('select#video-options').change( mediaFilterVideosCarousel );

    // make sure the video stops before next slide
    // do this before the slide changes
    $('#media-carousel-videos-display').on('beforeChange', function(event, slick, currentSlide, nextSlide){
      var videoCarouselDisplayCurrentiFrameSrc = $('#media-carousel-videos-display  .slick-current iframe').attr('src');
      $('#media-carousel-videos-display  .slick-current iframe').attr('src', 'none').attr('src', videoCarouselDisplayCurrentiFrameSrc);
    });

  }

  $(document).ready(function(){
    mediaCarouselVideos();
  });





/* eslint-enable */