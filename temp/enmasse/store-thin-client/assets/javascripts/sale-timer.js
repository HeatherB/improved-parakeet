var Timer = function(target, serverTime){
  var targetSelector = target;
  var serverLoadTime = new Date(serverTime);
  var clientLoadTime = new Date();
  var serverOffset = parseInt((serverLoadTime - clientLoadTime)/1000);
  var displayCountdown = function(){
    var displayTime = new Date();
    displayTime.setSeconds(displayTime.getSeconds() + serverOffset);
    var passedSeconds = displayTime.getHours()*3600 + displayTime.getMinutes()*60 + displayTime.getSeconds();
    var remainingTime = 86400 - passedSeconds;
    var remainingHours =  parseInt(remainingTime / 3600);
    var remainingMinutes = parseInt((remainingTime - remainingHours*3600) / 60);
    var remainingSeconds = parseInt(remainingTime % 60);
    if(remainingTime > 0) {
      $(targetSelector).html("" + twoDigit(remainingHours) + ":" + twoDigit(remainingMinutes) + ":" + twoDigit(remainingSeconds));
    } else {
      $(targetSelector).html("NONE");
      clearInterval(intervalId);
    }
  };
  var twoDigit = function(num){
    if(num < 10){
      return "0" + num;
    }
    return num;
  };
  var intervalId = setInterval(displayCountdown, 999);
};
