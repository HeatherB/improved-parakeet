var EMEPOST = (function() {
  'use strict';

  var settings;

  function prettyDate(time) {
      var date = new Date((time || "").replace(/-/g, "/").replace(/[TZ]/g, " ")),
          today = new Date(),
          diff = ((today.getTime() - date.getTime()) / 1000),
          day_diff = Math.floor(diff / 86400),
          month_diff = today.getMonth() - date.getMonth() + (12 * (today.getFullYear() - date.getFullYear()));
      if (diff < 120) {
        // Less than 2 minutes ago
        return {
          time: 1,
          ago: "Minute Ago"
        };
      }
      else if (diff < 3600) {
        // Less than 1 hour ago
        return {
          time: Math.floor(diff / 60),
          ago: "Minutes Ago"
        };
      }
      else if (diff < 7200) {
        // Less than 2 hours ago
        return {
          time: 1,
          ago: "Hour Ago"
        };
      }
      else if (day_diff == 0) {
        return {
          time: Math.floor(diff / 60 / 60),
          ago: "Hours Ago"
        };
      }
      else if (day_diff == 1) {
        return {
          time: 1,
          ago: "Day Ago"
        };
      }
      else if (day_diff < 7) {
        return {
          time: day_diff,
          ago: "Days Ago"
        };
      }
      else if (day_diff < 14) {
        return {
          time: 1,
          ago: "Week Ago"
        };
      }
      else if (month_diff == 0) {
        return {
          time: Math.floor(day_diff/7),
          ago: "Weeks Ago"
        };
      }
      else if (month_diff < 2) {
        return {
          time: 1,
          ago: "Month Ago"
        };
      }
      else if (month_diff < 12) {
        return {
          time: month_diff,
          ago: "Months Ago"
        };
      }
      else if (month_diff < 24) {
        return {
          time: 1,
          ago: "Year Ago"
        };
      }
      else {
        return {
          time: Math.floor(month_diff/12),
          ago: "Years Ago"
        };
      }
  }

  function updateBylines(bylines) {
    // get datetime 2014-04-15T06:24:17Z
    $.each(bylines, function() {
      var eltime = $(this).find('time.posted_at'),
          time = eltime.attr('datetime'),
          obj = prettyDate(time),
          author = $(this).find('em.author'),
          authorName = author.text();
      author.remove();
      eltime.html(obj['time']).before('<strong>Posted</strong>').after('<span>' + obj.ago + '<br><em>' + authorName + '</em></span>').show();
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

  return {
    init: function(initialSettings) {
      updateBylines($('section.details'));
    },

    getVersion: function () {
      return settings.version;
    }
  };
}());

$(function() {
  EMEPOST.init();
});