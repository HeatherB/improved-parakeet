(function ($){

  $.fn.foundationNavigation = function (options) {

    var lockNavBar = false;
    // Windows Phone, sadly, does not register touch events :(
    if (Modernizr.touch || navigator.userAgent.match(/Windows Phone/i)) {
      $(document).on('click.fndtn touchstart.fndtn', '.menu-tree .flyout-toggle', function (e) {
        e.preventDefault();
        var flyout = $(this).siblings('.flyout').first();
        if (lockNavBar === false) {
          $('.menu-tree .flyout').not(flyout).slideUp(500);
          flyout.slideToggle(500, function () {
            lockNavBar = false;
          });
        }
        lockNavBar = true;
      });
      $('.menu-tree > .has-flyout', this).addClass('is-touch');
    } else {
      $('.menu-tree .has-flyout', this).hover(function () {
        $(this).children('.flyout').show();
      }, function () {
        $(this).children('.flyout').hide();
      });
    }
  };
  $('#tera-item-menu').foundationNavigation();
  $('#tera-item-menu').foundationTopBar();
})( jQuery );