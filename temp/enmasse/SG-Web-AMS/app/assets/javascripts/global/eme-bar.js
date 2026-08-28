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
    AccountMenu.closeAccountMenu(e);
    GameMenu.wrapper.addClass('open');
    GameMenu.menu.slideDown(300);
    GameMenu.bindDocument();
  },

  bindDocument: function() {
    GameMenu.trigger.off('click', GameMenu.openGameMenu);
    GameMenu.trigger.on('click', GameMenu.closeGameMenu);
    $(document).on('click', null, GameMenu.closeGameMenu);
  },

  unbindDocument: function() {
    GameMenu.trigger.off('click', null, GameMenu.closeGameMenu);
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
var AccountMenu = {
  wrapper: $("#account"),
  trigger: $('#account .trigger'),
  menu: $("#account ul"),
  open: false,

  closeAccountMenu: function(e) {
    e.stopPropagation();
    $("#account").removeClass('open');
    $("#account ul").hide();
    AccountMenu.unbindDocument();
  },

  openAccountMenu: function(e) {
    e.preventDefault();
    e.stopPropagation();
    GameMenu.closeGameMenu(e);
    AccountMenu.wrapper.addClass('open');
    AccountMenu.menu.slideDown(300);
    AccountMenu.bindDocument();
  },

  bindDocument: function() {
    AccountMenu.trigger.off('click', AccountMenu.openAccountMenu);
    AccountMenu.trigger.on('click', AccountMenu.closeAccountMenu);
    $(document).on('click', null, AccountMenu.closeAccountMenu);
  },

  unbindDocument: function() {
    AccountMenu.trigger.off('click', AccountMenu.closeAccountMenu);
    AccountMenu.trigger.on('click', null, AccountMenu.openAccountMenu);
    $(document).off('click', AccountMenu.closeAccountMenu);
  },

  toggleAccountMenu: function(e) {
    e.preventDefault();
  },

  init: function() {
    AccountMenu.trigger.on('click', null, AccountMenu.openAccountMenu);
  }
}


$(function() {
  LoginBox.init();
  GameMenu.init();
  AccountMenu.init();
});
