//= require vendor/waypoints.js
//= require vendor/velocity.min.js
//= require vendor/konami.js
//= require vendor/snow.js

var RaceGuideApp = {
  s: {
    nav: $('.raceclass #main-nav'),
    intro: $('.raceclass #content_article_header'),
    highlights: $('.raceclass #content_wide_body'),
    guide: $('.raceclass #content_body'),
    lore: $('.raceclass #content_side_body'),
    footer: $('.raceclass .eme-footer'),
    actions: $('.raceclass #content_article_footer'),
    shareFacebook: $('.raceclass #share-facebook'),
    shareTwitter: $('.raceclass #share-twitter'), 
    //navOffset: -582,
    navOffset: -1 * ($('#race_hero_wrapper').height() + 52),
    navnotscroll: false
  },
  init: function(settings) {
    var s = RaceGuideApp.s;
    s = $.extend(s, settings);
    RaceGuideApp.bindEvents();
  },
  bindEvents: function() {
    var s = RaceGuideApp.s;
    // set up the scrolling menu waypoint
    $(window).waypoint(function() {
      RaceGuideApp.toggleMainNav();
    }, {offset: s.navOffset});
    // set up new world toggle waypoint
    $(s.intro).waypoint(function(direction) {
      // only record event on scroll and not click
      if(s.navnotscroll == false) {
        RaceGuideApp.triggerGAEvent('Reached Page Section', 'Hero top of Page');
      }
    $('#main-nav a').removeClass('active');
    });
    // set up Brawler class toggle waypoint
    $(s.highlights).waypoint(function(direction) {
      RaceGuideApp.toggleSelectedMenuItem('#race_overview_wrapper', direction);
      // only record event on scroll and not click
      if(s.navnotscroll == false) {
        RaceGuideApp.triggerGAEvent('Reached Page Section', 'Race Overview');
      }
         //RaceGuideApp.moveBarRight();
      $('#main-nav a').removeClass('active');
      $('#main-nav a#nav-race_overview_wrapper').toggleClass('active');
    });
    $(s.guide).waypoint(function(direction) {
      RaceGuideApp.toggleSelectedMenuItem('#nav-race_video_wrapper', direction);
      // only record event on scroll and not click
      if(s.navnotscroll == false) {
        RaceGuideApp.triggerGAEvent('Reached Page Section', 'Race Overview Video');
      }
      $('#main-nav a').removeClass('active');
      $('#main-nav a#nav-race_video_wrapper').toggleClass('active');
    });
    $(s.lore).waypoint(function(direction) {
      RaceGuideApp.toggleSelectedMenuItem('#nav-race_lore_wrapper', direction);
      // only record event on scroll and not click
      if(s.navnotscroll == false) {
        RaceGuideApp.triggerGAEvent('Reached Page Section', 'Race Lore');
      }
      $('#main-nav a').removeClass('active');
      $('#main-nav a#nav-race_lore_wrapper').toggleClass('active');
    });
    $(s.footer).waypoint(function(direction) {
      RaceGuideApp.triggerGAEvent('Reached Page Section', 'Footer');
    });
    $(s.actions).waypoint(function(direction) {
      RaceGuideApp.triggerGAEvent('Reached Page Section', 'Actions - Downlaod Game and Server Status');
    });
    // set up click listeners on the menu buttons 
    s.nav.on('click', 'a', RaceGuideApp.handleNavClick);
    //new
    s.shareFacebook.on('click', RaceGuideApp.handleFacebookShareClick);
    s.shareTwitter.on('click', RaceGuideApp.handleTwitterShareClick);
    //end
    $('.cta-sign-up').on('click', RaceGuideApp.handleSignUpClick);
    RaceGuideApp.createPageTimers();
    RaceGuideApp.setUpKonamiCode();
  },
  handlePlayClick: function(e) {
    e.stopPropagation();
    RaceGuideApp.triggerGAEvent('Clicked Button', 'Play for FREE Button');
  },
  handleSignUpClick: function(e) {
    e.stopPropagation();
    RaceGuideApp.triggerGAEvent('Clicked Link', 'Sign up now');
  },
  /* new tracking events */
  handleFacebookShareClick: function(e) {
    e.stopPropagation();
    RaceGuideApp.triggerGAEvent('Clicked Button', 'Share This Facebook Button');
  },
  handleTwitterShareClick: function(e) {
    e.stopPropagation();
    RaceGuideApp.triggerGAEvent('Clicked Button', 'Share This Twitter Button');
  },
  /* end new tracking events */
  createPageTimers: function() {
    // 1 minute on page
    setTimeout(function() {
      RaceGuideApp.triggerGAEvent('Spent 1 minute on page', ' ');
    }, 1 * 60 * 1000);
    // 2 minutes on page
    setTimeout(function() {
      RaceGuideApp.triggerGAEvent('Spent 2 minutes on page', ' ');
    }, 2 * 60 * 1000);
    // 5 minutes on page
    setTimeout(function() {
      RaceGuideApp.triggerGAEvent('Spent 5 minutes on page', ' ');
    }, 5 * 60 * 1000);
  },
  setUpKonamiCode: function() {
    // RaceGuideApp.s.easter_egg = new Konami(function() {RaceGuideApp.createParticleSystem()});
  },
  createParticleSystem: function() {
    $(document).snow({SnowImage: "/assets/icons/emp.png" });
  },
  toggleMainNav: function() {
    var s = RaceGuideApp.s;
    s.nav.toggleClass('scroll');
    $('#red-bar').toggleClass('scroll');
    //s.intro.toggleClass('scroll');
  },
  toggleSelectedMenuItem: function(selected, direction) {
    var s = RaceGuideApp.s;
    s.nav.find('a').removeClass("selected");
    $(selected).addClass("selected");
  },
  handleNavClick: function(e) {
    var s = RaceGuideApp.s;
    var link = $(this);
    var target = $(this).attr('href'),
        id = '#' + this.id,
        external = (target.lastIndexOf('#',0) < 0);
    if (external) {
      if (target == '/') {
        RaceGuideApp.triggerGAEvent('Clicked Button', 'Back to Tera - Menu');
      } else {
        RaceGuideApp.triggerGAEvent('Clicked Button', 'Get Started - Menu');
      }
    } else {
      e.preventDefault();
      // set var to stop ga recording 
      s.navnotscroll = true;
      $(target).velocity("scroll", {duration: 1000, easing: 'ease-in-out', offset: -54,
      complete: function() {
        $('#main-nav a').removeClass('active');
        $(link).addClass('active');
        RaceGuideApp.triggerGAEvent('Clicked Internal Navigation - ', 'section (' + target + ')' );
        s.navnotscroll = false;
      }});
    }
  },
  triggerGAEvent: function(action, label ) {
    // If Google Analytics is configured, trigger an event
    if (location.protocol == 'https:') {
      var surl = window.location.href.toString().split('https://')[1].split('?')[0]
    } else if (location.protocol == 'http:') {
      var surl = window.location.href.toString().split('http://')[1].split('?')[0]
    }
    if (ga) {
      if (label != ' ') {
        ga('send', 'event', 'Landing Pages', action, RaceGuideApp.surl + ' - ' + label, {'nonInteraction': 1});
      } else {
        ga('send', 'event', 'Landing Pages', action, RaceGuideApp.surl, {'nonInteraction': 1});
      }
    }
  }
}

var Blackout = {
  initialized: false,
  element: null,
  initialize: function() {
    Blackout.element = $('<div/>', {id: 'lb-blackout'});
    Blackout.element.on('click', Core.stopPropagation)
                    .on('keyup', Blackout.listen);
    $('body').append(Blackout.element);

    Blackout.initialized = true;
  },
  listen: function(e) {
    if (e.which === KeyCode.esc) {
      Blackout.hide();
    }
  },
  show: function(callback, onClick, transparent) {
    if (!Blackout.initialized) {
      Blackout.initialize();
    };
    Blackout.element.show();
    if (Core.isCallback(callback)) {
      callback();
    }
    if (Core.isCallback(onClick)) {
      Blackout.element.click(onClick);
    }
  },

  hide: function(callback) {
    Blackout.element.hide();
    if (Core.isCallback(callback)) {
      callback();
    }
    Blackout.element.unbind('click');
  }
}

var Core = {
  isCallback: function(callback) {
    return (callback && typeof callback === 'function');
  },
  stopPropagation: function(e) {
    e.stopPropagation();
  },
  supportsVideo: function() {
    return !!document.createElement('video').canPlayType;
  }
};


$(document).ready(function() {
  RaceGuideApp.init();
});
