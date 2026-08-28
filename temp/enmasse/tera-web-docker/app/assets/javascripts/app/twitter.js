/*var sizeTwitterWidget = {
  init: function() {
    sizeTwitterWidget.setHeight();
    $(window).resize(function() {
      delay(function() {
          sizeTwitterWidget.setHeight();
      }, 400);
    });
  },
  setHeight: function() {
    var getHeight = $('#news-posts').height();
    var newsHeight = getHeight;
    // + 'px !important';
    console.log('newsHeight ', newsHeight);
    //var twitterWidget = $('#content_side_body');
    //$("body").get(0).style.setProperty('--twitter-widget-height', newsHeight);
    //$('#twitter-widget-0').css( "height", newsHeight);
  },
  delay: (function(){
    var timer = 0;
    return function(callback, ms){
      clearTimeout (timer);
      timer = setTimeout(callback, ms);
    };
  })()
};

$(document).ready(function() {
  sizeTwitterWidget.init();
});
*/