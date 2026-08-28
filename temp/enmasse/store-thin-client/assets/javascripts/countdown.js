var Countdown = {

	getTimeRemaining: function(endtime){
	  var t = Date.parse(endtime) - Date.parse(new Date());
	  var seconds = Math.floor( (t/1000) % 60 );
	  var minutes = Math.floor( (t/1000/60) % 60 );
	  var hours = Math.floor( (t/(1000*60*60)) % 24 );
	  var days = Math.floor( t/(1000*60*60*24) );
	  return {
	    'total': t,
	    'days': days,
	    'hours': hours,
	    'minutes': minutes,
	    'seconds': seconds
	  };
	},

	initializeClock: function(id, endtime){
	  var clock = document.getElementById(id);
	  /*var clock_days = document.getElementById('countdown_days');
	  var clock_hours = document.getElementById('countdown_hours');
	  var clock_minutes = document.getElementById('countdown_minutes');
	  var clock_seconds = document.getElementById('countdown_seconds');*/
	  var timeinterval = setInterval(function(){
	    var t = Countdown.getTimeRemaining(endtime);
	    clock.innerHTML = 
	    '<div><p> Time Remaining: ' + t.days + ' days ' + t.hours + ' hours ' + t.minutes + ' minutes ' + t.seconds + ' seconds ' + '</p></div>';
	   /* clock.innerHTML = 
	    		'<div class="daysLeft"> <span id="dayCount"> ' + t.days + '</span> days </div>'
              + '<div class="hoursLeft"> <span id="hourCount"> ' + t.hours + '</span> hours </div>'
              + '<div class="minutesLeft"> <span id="minuteCount"> ' + t.minutes + '</span> minutes </div>'
              + '<div class="secondsLeft"> <span id="secondCount"> ' + t.seconds + '</span> seconds </div>';*/

        /*clock_days.innerHTML = t.days;
        clock_hours.innerHTML = t.hours;
        clock_minutes.innerHTML = t.minutes;
        clock_seconds.innerHTML = t.seconds;*/

	    if(t.total<=0){
	      clearInterval(timeinterval);
	    }
	  },1000);
	}
}


$(document).ready(function() {
	if($('.empKey').length) {
		var deadline = 'September 17 2019 12:59:00 GMT-0800';
		Countdown.initializeClock('countdown', deadline);
	}
	
});


/* https://www.sitepoint.com/build-javascript-countdown-timer-no-dependencies/ */
