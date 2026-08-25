export default class LaunchCountdown {
  constructor() {
    this.init();
  }

  init() {
    var countDownDate = new Date('2019-11-14T08:00:00').getTime();
    var serverTime = new Date($('#launch_count').attr('data-time').replace(' ', 'T'));
    // Update the count down every 1 second
    var x = setInterval(function() {

      // Decrease time
      serverTime = new Date(new Date(serverTime).getTime() + 1000);

      // Find the distance between now and the count down date
      var distance = countDownDate - serverTime;

      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Display the result in the element with id="demo"
      document.getElementById("launch_count").innerHTML = days + "d " + hours + "h "
        + minutes + "m " + seconds + "s ";

      // If the count down is finished, write some text
      if (distance < 0) {
        clearInterval(x);
        document.getElementById("launch_count").innerHTML = "RELEASED";
      }
    }, 1000);
  }
}
