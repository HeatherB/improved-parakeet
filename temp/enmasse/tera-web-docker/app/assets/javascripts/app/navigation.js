var layoutsBySize = {
  init: function() {
    layoutsBySize.isDesktop();
    $(window).resize(function() {
      layoutsBySize.delay(function() {
          layoutsBySize.isDesktop();
      }, 400);
    });
  },
  isDesktop: function() {
    var w = window.outerWidth;
    if( w >= 1024) {
      if($(".deskSeperator")[0]) {
        // already provided
      } else {
        $('#class_selector_wrapper').children('.class_tile:last-child').addClass('lastChild');
        $('#class_selector_wrapper').children('.class_tile').not(':last-child').wrapAll('<div class="deskSeperator" />');
      }
    } else {
      if($(".deskSeperator")[0]) {
        $('#class_selector_wrapper').children('.deskSeperator').children().unwrap();
        $('#class_selector_wrapper').children('.lastChild').removeClass('lastChild');
      }
      $('#mobile-nav-btn').on('click', layoutsBySize.exposeNav);
    }
  },
  mobileDropdown: function(e) {
    if ($("body").hasClass("menuopen")) {
      var nav = $(e.target).parent().find("ul");
      if ($(e.target).parent().find("ul").length != 0) {
        e.preventDefault();
      }
      $(nav[0]).toggleClass('open');
    }

  },
  exposeNav: function(e) {
      e.preventDefault();
      $('body').toggleClass("menuopen");
      $('#menu').on('click', layoutsBySize.mobileDropdown);
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
  layoutsBySize.init();

  //first body load
  // cleanup animation deferral
    setTimeout(function(){
      document.body.classList.remove('preload');
    },500);
});
