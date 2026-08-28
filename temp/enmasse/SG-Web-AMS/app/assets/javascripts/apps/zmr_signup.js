/*
*= require modules/velocity
*= require_self
*/

/***** Javascript for the ZMR Sign up page *****/
var ZMRSignUp = {

  s: {
    toggle: $('.js-toggle')
  },


  init: function(settings) {
    settings = $.extend(ZMRSignUp.s, settings);
    ZMRSignUp.bindEvents();
  },

  bindEvents: function() {
    ZMRSignUp.s.toggle.on('click', ZMRSignUp.showDownloadOptions);
  },

  showDownloadOptions: function(e) {
    e.preventDefault();
    $(this).velocity("fadeOut", {duration: 200});
    $('.sign-up-options')
      .velocity("fadeIn", {delay: 300, duration: 300, easing: "easeInOut"});
  }

};


$(function() {
  ZMRSignUp.init({});
});
