var Countdown = {

  c: {
    days: null,
    hours: null,
    minutes: null
  },
   
  countdown: function(endDate, markuppiece) {
    var c = Countdown.c;


    endDate = new Date(endDate).getTime();

    
    if (isNaN(endDate)) {
    return;
    }
    
    calculate();
    setInterval(calculate, 60000);
    
    function calculate() {
      var startDate = new Date();
      startDate = startDate.getTime();
      
      var timeRemaining = parseInt((endDate - startDate) / 1000);

      
      if (timeRemaining >= 0) {
        c.days = parseInt(timeRemaining / 86400);
        timeRemaining = (timeRemaining % 86400);
        
        c.hours = parseInt(timeRemaining / 3600);
        timeRemaining = (timeRemaining % 3600);
        
        c.minutes = parseInt(timeRemaining / 60);
        timeRemaining = (timeRemaining % 60);
        
        c.seconds = parseInt(timeRemaining);
        
       /* document.getElementById("seconds").innerHTML = ("0" + seconds).slice(-2);*/

        document.getElementById("limited-time-days" + markuppiece).innerHTML = parseInt(c.days, 10);
        document.getElementById("limited-time-hours" + markuppiece).innerHTML = ("0" + c.hours).slice(-2);
        document.getElementById("limited-time-minutes" + markuppiece).innerHTML = ("0" + c.minutes).slice(-2);
      } else {
        return;
      }
    }
  }

}




$(document).ready(function() {
   if($('#timerHere').length) {
    var initialdate = $('#init-date').text();
    //var initialdate = '4/23/2019 10:00:01 AM -07:00';
    var convert_initialdate = new Date(initialdate);
    var blockname = '';

    /* get todays date and time as a utc value */
    var now = new Date();
    now.toUTCString();
    now = new Date(now.toUTCString());
    var millis = now.getTime() + (now.getTimezoneOffset() * 60000);
    now.setTime(millis - (now.getTimezoneOffset() * 60000));

    var crossed_date = now - convert_initialdate;
    var sign = Math.sign(crossed_date);
    // negative value or -1 means not passed
    // positive value or 1 means we have crossed date threshold

    if((initialdate.length > 0) && sign == -1) {
      Countdown.countdown(initialdate, blockname);
    } else {
      //Countdown.countdown('4/23/2019 12:00:01 AM -08:00');

    }
  }
  /* second */
  if($('#timerHere_gate2').length) {
    //var initialdate = $('#init-date_gate2').text();
    var initialdate = '4/5/2019 10:00:01 AM -07:00';
    var convert_initialdate = new Date(initialdate);
    var blockname = '_gate2';

    /* get todays date and time as a utc value */
    var now = new Date();
    now.toUTCString();
    now = new Date(now.toUTCString());
    var millis = now.getTime() + (now.getTimezoneOffset() * 60000);
    now.setTime(millis - (now.getTimezoneOffset() * 60000));

    var crossed_date = now - convert_initialdate;
    var sign = Math.sign(crossed_date);
    // negative value or -1 means not passed
    // positive value or 1 means we have crossed date threshold

    if((initialdate.length > 0) && sign == -1) {
      Countdown.countdown(initialdate, blockname);
    } else {
    }
  }

  /* third */
  if($('#timerHere_gate3').length) {
    //var initialdate = $('#init-date_gate3').text();
    var initialdate = '4/9/2019 10:00:01 AM -07:00';
    var convert_initialdate = new Date(initialdate);
    var blockname = '_gate3';

    /* get todays date and time as a utc value */
    var now = new Date();
    now.toUTCString();
    now = new Date(now.toUTCString());
    var millis = now.getTime() + (now.getTimezoneOffset() * 60000);
    now.setTime(millis - (now.getTimezoneOffset() * 60000));

    var crossed_date = now - convert_initialdate;
    var sign = Math.sign(crossed_date);
    // negative value or -1 means not passed
    // positive value or 1 means we have crossed date threshold

    if((initialdate.length > 0) && sign == -1) {
      Countdown.countdown(initialdate, blockname);
    } else {
      //Countdown.countdown('4/23/2019 12:00:01 AM -08:00');

    }
  }

  /* fourth */
  if($('#timerHere_gate4').length) {
    //var initialdate = $('#init-date_gate4').text();
    var initialdate = '4/12/2019 10:00:01 AM -07:00';
    var convert_initialdate = new Date(initialdate);
    var blockname = '_gate4';

    /* get todays date and time as a utc value */
    var now = new Date();
    now.toUTCString();
    now = new Date(now.toUTCString());
    var millis = now.getTime() + (now.getTimezoneOffset() * 60000);
    now.setTime(millis - (now.getTimezoneOffset() * 60000));

    var crossed_date = now - convert_initialdate;
    var sign = Math.sign(crossed_date);
    // negative value or -1 means not passed
    // positive value or 1 means we have crossed date threshold

    if((initialdate.length > 0) && sign == -1) {
      Countdown.countdown(initialdate, blockname);
    } else {
      //Countdown.countdown('4/23/2019 12:00:01 AM -08:00');

    }
  }


});

