var LoginBox = {
  box: $("#login-box"),
  address: "https://account.enmasse.com/remote_logins",
  showLoginBox: function(e) {
    e.preventDefault();
    $('#login-box iframe').attr('src', LoginBox.address);
    $('#blackout').show();
    $('#login-box').show();
  },
  init: function(){
    $(document).on("click", ".login-popup-link", null, LoginBox.showLoginBox);
    $('#blackout').click( function(){ $(this).hide(); $('#login-box').hide(); } );
    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

    eventer(messageEvent,function(e) {
      if (e.data === "loggedIn") {
        location.reload(true);
      }
    }, false);
  }
}
var GameMenu = {
  wrapper: $("#games"),
  trigger: $('#games .trigger'),
  menu: $("#games ul.eme-menu"),
  open: false,

  closeGameMenu: function(e) {
    e.stopPropagation();
    GameMenu.wrapper.removeClass('open');
    GameMenu.menu.hide();
    GameMenu.unbindDocument();
  },

  openGameMenu: function(e) {
    e.preventDefault();
    e.stopPropagation();
    GameMenu.wrapper.addClass('open');
    GameMenu.menu.slideDown(300);
    GameMenu.bindDocument();
  },

  bindDocument: function() {
    GameMenu.trigger.off('click', GameMenu.openGameMenu);
    $(document).on('click', null, GameMenu.closeGameMenu);
  },

  unbindDocument: function() {
    GameMenu.trigger.on('click', null, GameMenu.openGameMenu);
    $(document).off('click', GameMenu.closeGameMenu);
  },

  toggleGameMenu: function(e) {
    e.preventDefault();
  },

  init: function() {
    GameMenu.trigger.on('click', null, GameMenu.openGameMenu);
  }
}

$(function() {
  LoginBox.init();
  GameMenu.init();
});
