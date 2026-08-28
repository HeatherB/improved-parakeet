//= require vendor/waypoints.js
//= require vendor/velocity.min.js
//= require vendor/konami.js
//= require vendor/snow.js

var PromoPageApp = {
  s: {
    nav: $('#v62 #main-nav'),
    intro: $('#v62 .hero'),
    highlights: $('#v62 #class_overview_wrapper'),
    guide: $('.raceclass #class_video_wrapper'),
    skills: $('.raceclass #class_skill_wrapper'),
    footer: $('.raceclass .eme-footer'),
    actions: $('.raceclass #class_extra_wrapper'),
    shareFacebook: $('.raceclass #share-facebook'),
    shareTwitter: $('.raceclass #share-twitter'), 
    //navOffset: -645,
    navOffset: -1 * ($('#v62 .hero').height() + 52),
    navnotscroll: false
  },
  init: function(settings) {
    var s = PromoPageApp.s;
    s = $.extend(s, settings);
    PromoPageApp.bindEvents();
  },
  bindEvents: function() {
    var s = PromoPageApp.s;
    // set up the scrolling menu waypoint
    $(window).waypoint(function() {
      PromoPageApp.toggleMainNav();
    }, {offset: s.navOffset});
    // set up new world toggle waypoint
    $(s.intro).waypoint(function(direction) {
      // only record event on scroll and not click
      if(s.navnotscroll == false) {
        PromoPageApp.triggerGAEvent('Reached Page Section', 'Hero top of Page');
      }
    $('#main-nav a').removeClass('active');
    });
    // set up Brawler class toggle waypoint
    $(s.highlights).waypoint(function(direction) {
      PromoPageApp.toggleSelectedMenuItem('#class_overview_wrapper', direction);
      // only record event on scroll and not click
      if(s.navnotscroll == false) {
        PromoPageApp.triggerGAEvent('Reached Page Section', 'Class Overview');
      }
         //PromoPageApp.moveBarRight();
      $('#main-nav a').removeClass('active');
      $('#main-nav a#nav-class_overview_wrapper').toggleClass('active');
    });
    $(s.guide).waypoint(function(direction) {
      PromoPageApp.toggleSelectedMenuItem('#class_video_wrapper', direction);
      // only record event on scroll and not click
      if(s.navnotscroll == false) {
        PromoPageApp.triggerGAEvent('Reached Page Section', 'Class Overview Video');
      }
      $('#main-nav a').removeClass('active');
      $('#main-nav a#nav-class_video_wrapper').toggleClass('active');
    });
    $(s.skills).waypoint(function(direction) {
      PromoPageApp.toggleSelectedMenuItem('#class_skill_wrapper', direction);
      // only record event on scroll and not click
      if(s.navnotscroll == false) {
        PromoPageApp.triggerGAEvent('Reached Page Section', 'Skills and Glyphs');
      }
      $('#main-nav a').removeClass('active');
      $('#main-nav a#nav-class_skill_wrapper').toggleClass('active');
    });
    $(s.footer).waypoint(function(direction) {
      PromoPageApp.triggerGAEvent('Reached Page Section', 'Footer');
    });
    $(s.actions).waypoint(function(direction) {
      PromoPageApp.triggerGAEvent('Reached Page Section', 'Actions - Downlaod Game and Server Status');
    });
    // set up click listeners on the menu buttons 
    s.nav.on('click', 'a', PromoPageApp.handleNavClick);
    //new
    s.shareFacebook.on('click', PromoPageApp.handleFacebookShareClick);
    s.shareTwitter.on('click', PromoPageApp.handleTwitterShareClick);
    //end
    $('.cta-sign-up').on('click', PromoPageApp.handleSignUpClick);
    PromoPageApp.createPageTimers();
    PromoPageApp.setUpKonamiCode();
  },
  handlePlayClick: function(e) {
    e.stopPropagation();
    PromoPageApp.triggerGAEvent('Clicked Button', 'Play for FREE Button');
  },
  handleSignUpClick: function(e) {
    e.stopPropagation();
    PromoPageApp.triggerGAEvent('Clicked Link', 'Sign up now');
  },
  /* new tracking events */
  handleFacebookShareClick: function(e) {
    e.stopPropagation();
    PromoPageApp.triggerGAEvent('Clicked Button', 'Share This Facebook Button');
  },
  handleTwitterShareClick: function(e) {
    e.stopPropagation();
    PromoPageApp.triggerGAEvent('Clicked Button', 'Share This Twitter Button');
  },
  /* end new tracking events */
  createPageTimers: function() {
    // 1 minute on page
    setTimeout(function() {
      PromoPageApp.triggerGAEvent('Spent 1 minute on page', ' ');
    }, 1 * 60 * 1000);
    // 2 minutes on page
    setTimeout(function() {
      PromoPageApp.triggerGAEvent('Spent 2 minutes on page', ' ');
    }, 2 * 60 * 1000);
    // 5 minutes on page
    setTimeout(function() {
      PromoPageApp.triggerGAEvent('Spent 5 minutes on page', ' ');
    }, 5 * 60 * 1000);
  },
  setUpKonamiCode: function() {
    // PromoPageApp.s.easter_egg = new Konami(function() {PromoPageApp.createParticleSystem()});
  },
  createParticleSystem: function() {
    $(document).snow({SnowImage: "/assets/icons/emp.png" });
  },
  toggleMainNav: function() {
    var s = PromoPageApp.s;
    s.nav.toggleClass('scroll');
    //s.intro.toggleClass('scroll');
  },
  toggleSelectedMenuItem: function(selected, direction) {
    var s = PromoPageApp.s;
    s.nav.find('a').removeClass("selected");
    $(selected).addClass("selected");
  },
  handleNavClick: function(e) {
    var s = PromoPageApp.s;
    var link = $(this);
    var target = $(this).attr('href'),
        id = '#' + this.id,
        external = (target.lastIndexOf('#',0) < 0);
    if (external) {
      if (target == '/') {
        PromoPageApp.triggerGAEvent('Clicked Button', 'Back to Tera - Menu');
      } else {
        PromoPageApp.triggerGAEvent('Clicked Button', 'Get Started - Menu');
      }
    } else {
      e.preventDefault();
      // set var to stop ga recording 
      s.navnotscroll = true;
      $(target).velocity("scroll", {duration: 1000, easing: 'ease-in-out', offset: -54,
      complete: function() {
        $('#main-nav a').removeClass('active');
        $(link).addClass('active');
        PromoPageApp.triggerGAEvent('Clicked Internal Navigation - ', 'section (' + target + ')' );
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
        ga('send', 'event', 'Landing Pages', action, PromoPageApp.surl + ' - ' + label, {'nonInteraction': 1});
      } else {
        ga('send', 'event', 'Landing Pages', action, PromoPageApp.surl, {'nonInteraction': 1});
      }
    }
  }
}



var delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();

var layoutsBySize = {
  init: function() {
    layoutsBySize.isDesktop();
    $(window).resize(function() {
      delay(function() {
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
      //var menuBTN = $('#mobile-nav-btn');
      //menuBTN.on('click', layoutsBySize.mobileDropdown);
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
  /*mobileNav: function() {
    var navChildren = document.querySelectorAll(".has-flyout");
    var menuBTN = document.getElementById('mobile-nav-btn');

    menuBTN.addEventListener("click", function(e) {
      e.preventDefault();
      document.body.classList.toggle('menuopen');
      //layoutsBySize.stripNav(navChildren);
    }, false);

    for(i = 0; i < navChildren.length; i++) {
      if(navChildren[i].children.length > 1) {
        navChildren[i].addEventListener("click", function(e) {
          if (this.classList.contains('open')) {
          } else {
            e.preventDefault();
            this.classList.toggle('open');
          }
          
        }, false);
      }
    };
  },*/
  /*stripNav: function(navChildren) {
    for(i = 0; i < navChildren.length; i++) {
      if(navChildren[i].children.length > 1) {
        navChildren[i].classList.remove('open');
      }
    }
  },*/
  delay: (function(){
    var timer = 0;
    return function(callback, ms){
      clearTimeout (timer);
      timer = setTimeout(callback, ms);
    };
  })()


};

$(document).ready(function() {
  PromoPageApp.init();
  //layoutsBySize.init();
});
