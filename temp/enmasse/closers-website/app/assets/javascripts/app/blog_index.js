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

  return {
    init: function(initialSettings) {
      updateBylines($('section.details'));
      //setupcatNav();
    },

    getVersion: function () {
      return settings.version;
    }
  };
}());

$(function() {
  EME.init();
});