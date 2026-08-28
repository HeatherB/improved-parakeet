var EME = (function() {
  'use strict';

  var settings;

  function prettyDate(time) {
      var date = new Date((time || "").replace(/-/g, "/").replace(/[TZ]/g, " ")),
          today = new Date(),
          diff = ((today.getTime() - date.getTime()) / 1000),
          day_diff = Math.floor(diff / 86400),
          month_diff = today.getMonth() - date.getMonth() + (12 * (today.getFullYear() - date.getFullYear())),
          posted = "Posted ";
      if (diff < 120) {
        // Less than 2 minutes ago
        return posted + "1 Minute Ago ";
      }
      else if (diff < 3600) {
        // Less than 1 hour ago
        return posted + Math.floor(diff / 60) + " Minutes Ago ";
      }
      else if (diff < 7200) {
        // Less than 2 hours ago
        return posted + "1 Hour Ago ";
      }
      else if (day_diff == 0) {
        return posted + Math.floor(diff / 60 / 60) + " Hours Ago ";
      }
      else if (day_diff == 1) {
        return posted + "1 Day Ago ";
      }
      else if (day_diff < 7) {
        return posted + day_diff + " Days Ago ";
      }
      else if (day_diff < 14) {
        return posted + "1 Week Ago ";
      }
      else if (month_diff == 0) {
        return posted + Math.floor(day_diff/7) + " Weeks Ago ";
      }
      else if (month_diff < 2) {
        return posted + "1 Month Ago ";
      }
      else if (month_diff < 12) {
        return posted + month_diff + " Months Ago ";
      }
      else if (month_diff < 24) {
        return posted + "1 Year Ago ";
      }
      else {
        return posted + Math.floor(month_diff/12) + " Years Ago";
      }
  }

  function updateBylines(bylines) {
    // get datetime 2014-04-15T06:24:17Z
    $.each(bylines, function() {
      var eltime = $(this).find('time.posted_at'),
          time = eltime.attr('datetime');
      eltime.html(prettyDate(time)).show();
    });
  }

  function dates(date, dayOfWeek) {
    var diff = date.getDay() - dayOfWeek;
    if (diff > 0) {
      date.setDate(date.getDate() + 6);
    } else {
      date.setDate(date.getDate() + ((-1) * diff))
    }
    return date;
  }

  function setupcatNav() {
    $('body').on('click', '.category_nav li', function(e) {
      e.preventDefault();
      $('#blog_posts_news a').removeClass('hide');
      var selectedCat = $(this).attr('data-select');
      $(this).toggleClass('selected');
      $('.category_nav li').not($(this)).removeClass('selected');

      // Hide EVERYTHING
      //$('#blog_posts_news a').hide();
      // show SELECTED
      //$('#blog_posts_news a').filter('[data-selected*="' + selectedCat + '"]').show();

      if($('.category_nav li').hasClass('selected')) {
        var selectedByCat = $('#blog_posts_news a').filter('[data-selected*="' + selectedCat + '"]');
        if(selectedByCat.length > 0) {
          $('#blog_posts_news a').not($(selectedByCat)).addClass('hide');
          $('#noPosts').hide();
        } else {
          $('#noPosts').show();
        }
        
      } else {
        $('#blog_posts_news a').removeClass('hide');
        $('#noPosts').hide();
      }

      // show ALL
      //$('#blog_posts_news a').removeClass('hide');
      // exclude by SELECTION
      //var selectedByCat = $('#blog_posts_news a').filter('[data-selected*="' + selectedCat + '"]');
      //$('#blog_posts_news a').not($(selectedByCat)).addClass('hide');


    });

  }


  function isMobileDevice() {
      return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
  }


  function mobileCheck() {
    var vw = $(window).width();
    var deviceCheck = isMobileDevice();
    /* can restrict to only actual mobile devices with the device check */
    //if(deviceCheck) {
    //  setupSwipe();
    //}

    /* can set for css mobile and tablet if wanted same behavior on devices and desktops */
    if(vw <= 1024) {
      setupSwipe();
    }
  }

  function setupSwipe() {
    var toSwipeElement = $('#posts_sidebar .article_wrapper');
    $( toSwipeElement ).gallery();
    var toSwipeContainer = $('#posts_sidebar');

  // add generic swipe
    toSwipeElement.each(function(i) {
      function swipedetect(toSwipeElement, callback) {

        var touchsurface = toSwipeElement[i],
          swipedir,
          startX,
          startY,
          dist,
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
      var el = toSwipeElement;
      swipedetect(el, function(swipedir) {
        //swipedir contains either "none", "left", "right", "top", "down"
        if (swipedir == 'left') {
          toSwipeContainer.find($('.next')).trigger('click');
        } else if (swipedir == 'right') {
          toSwipeContainer.find($('.prev')).trigger('click');
        } else if (swipedir == 'up') {
          toSwipeContainer.find($('.prev')).trigger('click');
        } else if (swipedir == 'down') {
          toSwipeContainer.find($('.next')).trigger('click');
        } else {
          //console.log('undetectable swipe');
        }
      });
    });
  }; // end of setup swipe

  return {
    init: function(initialSettings) {
      updateBylines($('section.details'));
      //setupcatNav();
      //mobileCheck();
    },

    getVersion: function () {
      return settings.version;
    }
  };
}());

$(function() {
  EME.init();
});