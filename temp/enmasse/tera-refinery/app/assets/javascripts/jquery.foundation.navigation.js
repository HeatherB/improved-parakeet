(function ($){

  $.fn.foundationNavigation = function (options) {
    // remove foxus when leave site

    var lockNavBar = false;
    // Windows Phone, sadly, does not register touch events :(
    if (Modernizr.touch || navigator.userAgent.match(/Windows Phone/i)) {
      $(document).on('click.fndtn touchstart.fndtn', '.nav-bar .flyout-toggle', function (e) {
        e.preventDefault();
        var flyout = $(this).siblings('.flyout').first();
        if (lockNavBar === false) {
          $('.nav-bar .flyout').not(flyout).slideUp(500);
          flyout.slideToggle(500, function () {
            lockNavBar = false;
          });
        }
        lockNavBar = true;
      });
      $('.nav-bar>li.has-flyout', this).addClass('is-touch');
    } else {
      $('.nav-bar li.has-flyout', this).hover(function () {
        //hide all others - needed for mobile safari, when use back button to return to site
        $(this).siblings().children('.flyout').hide();
        $(this).children('.flyout').show();
      }, function () {
        $(this).children('.flyout').hide();
      });
    }

  };

})( jQuery );

(function ($) {
  $(function(){
    $(document).foundationNavigation();
  });
})(jQuery);
