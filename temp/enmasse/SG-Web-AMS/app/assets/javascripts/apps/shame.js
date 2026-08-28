var GameMenu = {
  wrapper: $("#games"),
  trigger: $('#games .trigger'),
  menu: $("#games ul.eme-menu"),
  open: false,

  closeGameMenu: function(e) {
    e.stopPropagation();
    $("#games").removeClass('open');
    $("#games ul.eme-menu").hide();
    GameMenu.unbindDocument();
  },

  openGameMenu: function(e) {
    e.preventDefault();
    e.stopPropagation();
    AccountMenu.closeAccountMenu(e);
    $("#games").addClass('open');
    $("#games ul.eme-menu").slideDown(300);
    GameMenu.bindDocument();
  },

  bindDocument: function() {
    $('#games .trigger').off('click', GameMenu.openGameMenu);
    $('#games .trigger').on('click', GameMenu.closeGameMenu);
    $(document).on('click', null, GameMenu.closeGameMenu);
  },

  unbindDocument: function() {
    $('#games .trigger').off('click', GameMenu.closeGameMenu);
    $('#games .trigger').on('click', null, GameMenu.openGameMenu);
    $(document).off('click', GameMenu.closeGameMenu);
  },

  toggleGameMenu: function(e) {
    e.preventDefault();
  },

  init: function() {
    $('#games .trigger').on('click', null, GameMenu.openGameMenu);
  }
};

var AccountMenu = {
  wrapper: $("#accounts"),
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
    $("#account").addClass('open');
    $("#account ul").slideDown(300);
    AccountMenu.bindDocument();
  },

  bindDocument: function() {
    $('#account .trigger').off('click', AccountMenu.openAccountMenu);
    $('#account .trigger').on('click', AccountMenu.closeAccountMenu);
    $(document).on('click', null, AccountMenu.closeAccountMenu);
  },

  unbindDocument: function() {
    $('#account .trigger').off('click', AccountMenu.closeAccountMenu);
    $('#account .trigger').on('click', null, AccountMenu.openAccountMenu);
    $(document).off('click', AccountMenu.closeAccountMenu);
  },

  toggleAccountMenu: function(e) {
    e.preventDefault();
  },

  init: function() {
    $('#account .trigger').on('click', null, AccountMenu.openAccountMenu);
  }
};

var LoginMenus = {
  showRegLogin: function(e) {
    $('.regular_in').show();
    $('.in_our_out').hide();
    $('.console_in').hide();
  },
  
  showConsoleLogin: function(e) {
    $('.console_in').show();
    $('.regular_in').hide();
    $('.in_our_out').hide();
  }
};

$(function() {
  GameMenu.init();
  AccountMenu.init();

  $('.showRegLogin').on('click', LoginMenus.showRegLogin);
  $('.backRegLogin').on('click', LoginMenus.showRegLogin);
  $('.console-callout').on('click', LoginMenus.showConsoleLogin);
});
