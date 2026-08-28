
// splash
// jquery should be loaded, doing this inline to show this right away, before the page shows.

var Splash = {
  show: null,
  splashKey: false,
  showing: false,
  onSplashShow: null,
  showAgeGateCalc: function () {
    return !($.cookie('of_age') && $.cookie('of_age') == 'true');
  },
  showSplashCalc: function () {
    return !($.cookie('splash') && $.cookie('splash') == Splash.current);
  },
  current: '',
  acknowledgeSplash: function () {
    $('#page-content').show();
    $('footer').css('position', 'static');
    Splash.setSplashCookie();
    $('#full-splash').fadeOut('slow');
  },
  showSplashPage: function () {
    Splash.showing = true;
    if (Splash.onSplashShow !== null) {
      Splash.onSplashShow();
    }
    $('#full-splash').show();
  },
  setSplashCookie: function () {
    $.cookie('splash', Splash.current, {expires: 365, path: '/'});
  },
  turnKey: function (keyname) {
    if (keyname === "splash-ready") {
      Splash.splashKey = true;
    }
    if (Splash.splashKey && (showAgeGate || showSplash)) {
      Splash.hideContent();
      Splash.splashKey = false;
    }
  },
  hideContent: function () {
    $('#page-content').hide();
  },
  checkAge: function (form) {
    var month = parseInt(form.find('[name=mm]').val(), 10) - 1;
    var year = parseInt(form.find('[name=yyyy]').val(), 10) + 17;
    var date = parseInt(form.find('[name=dd]').val(), 10);

    var doa = new Date(year, month, date);
    of_age = doa <= (new Date());
    if(of_age) {
      $.cookie('of_age', true, {expires: 365, path: '/'});
      if (showSplash){
        Splash.showSplashPage();
      } else {
        $('#page-content').show();
      }
      $('#full-age-gate').fadeOut('slow');
    } else {
      $.cookie('of_age', false, {expires: 1, path: '/'});
      Splash.checkAgeFailed();
    }
  },
  checkAgeFailed: function () {
    window.location.replace(document.domain + "/age-gate-fail");
  }
};
