var EliteStatusApp = {
  s: {
    nav: $('#eliteNavigation'),
    heading: $('#header'),
    level: $('#level'),
    travel: $('#travel'),
    tycoon: $('#tycoon'),
    privileges: $('#privileges'),
    url: window.location.href.toString().split('://')[1].split('?')[0],
    navOffset: 0,
    navnotscroll: false
  },
  init: function(settings) {
    var s = EliteStatusApp.s;
    s = $.extend(s, settings);
    EliteStatusApp.bindEvents();
  },
  bindEvents: function() {
    var s = EliteStatusApp.s;
    // set up the scrolling menu waypoint
    $(window).waypoint(function() {
      EliteStatusApp.toggleMainNav();
    }, {offset: s.navOffset});
    // setup the heading waypoint
    $(s.heading).waypoint(function(direction) {
      EliteStatusApp.toggleSelectedMenuItem('#header', direction);
      // only record event on scroll and not click
        EliteStatusApp.triggerGAEvent('Reached Page Section', 'Header Offer');
    });
    // setup the level waypoint
    $(s.level).waypoint(function(direction) {
      EliteStatusApp.toggleSelectedMenuItem('#level', direction);
      if(s.navnotscroll == false) {
        EliteStatusApp.triggerGAEvent('Reached Page Section', 'Level Up Like A Boss');
      }
    });
    // setup the travel waypoint
    $(s.travel).waypoint(function(direction) {
      EliteStatusApp.toggleSelectedMenuItem('#travel', direction);
      if(s.navnotscroll == false) {
        EliteStatusApp.triggerGAEvent('Reached Page Section', 'Travel the World in First Class');
      }
    });
    // setup the tycoon waypoint
    $(s.tycoon).waypoint(function(direction) {
      EliteStatusApp.toggleSelectedMenuItem('#tycoon', direction);
      if(s.navnotscroll == false) {
        EliteStatusApp.triggerGAEvent('Reached Page Section', 'Become a TERA Tycoon');
      }
    });
    // setup the privileges waypoint
    $(s.privileges).waypoint(function(direction) {
      EliteStatusApp.toggleSelectedMenuItem('#privileges', direction);
      EliteStatusApp.triggerGAEvent('Reached Page Section', 'The Privileges of Membership');
    });
    // track Button clicking
    $('.get-elite-btn').on('click', EliteStatusApp.handleSignUpClick);
    $('.manage-elite-btn').on('click', EliteStatusApp.handleSignInClick);
    s.nav.on('click', 'a', EliteStatusApp.handleNavClick);
    // other
    EliteStatusApp.createPageTimers();
  },
  createPageTimers: function() {
    // 1 minute on page
    setTimeout(function() {
      EliteStatusApp.triggerGAEvent('Spent 1 minute on page', ' ');
    }, 1 * 60 * 1000);
    // 2 minutes on page
    setTimeout(function() {
      EliteStatusApp.triggerGAEvent('Spent 2 minutes on page', ' ');
    }, 2 * 60 * 1000);
    // 5 minutes on page
    setTimeout(function() {
      EliteStatusApp.triggerGAEvent('Spent 5 minutes on page', ' ');
    }, 5 * 60 * 1000);
  },
  handleSignUpClick: function(e) {
    //e.stopPropagation();
    EliteStatusApp.triggerGAEvent('Clicked Link', 'Get Elite Now');
  },
  handleSignInClick: function(e) {
    e.stopPropagation();
    EliteStatusApp.triggerGAEvent('Clicked Link', 'Manage Elite Status');
  },
  toggleSelectedMenuItem: function(selected, direction) {
    var s = EliteStatusApp.s;
    s.nav.find('a').removeClass("selected");
    $(selected).addClass("selected");
  },
  toggleMainNav: function() {
    var s = EliteStatusApp.s;
    s.nav.toggleClass('scroll');
  },
  handleNavClick: function(e) {
    var s = EliteStatusApp.s;
    var link = $(this);
    var target = $(this).attr('href'),
        id = '#' + this.id,
        external = (target.lastIndexOf('#',0) < 0);
    if (external) {
      if (target == '/') {
        EliteStatusApp.triggerGAEvent('Clicked Button', 'Back to Tera - Menu');
      } else {
        EliteStatusApp.triggerGAEvent('Clicked Button', 'Get Started - Menu');
      }
    } else {
      e.preventDefault();
      // set var to stop ga recording 
      s.navnotscroll = true;
      $(target).velocity("scroll", {duration: 1000, easing: 'ease-in-out', offset: 0,
      complete: function() {
        $('.nav a').removeClass('active');
        $(link).addClass('active');
        EliteStatusApp.triggerGAEvent('Clicked Internal Navigation - ', 'section (' + target + ')' );
        s.navnotscroll = false;
      }});
    }
  },
  triggerGAEvent: function(action, label ) {
    // If Google Analytics is configured, trigger an event
    if (_gaq) {
      if (label != ' ') {
        _gaq.push(['_trackEvent', 'Landing Pages', action, EliteStatusApp.s.url + ' - ' + label]);
      } else {
        _gaq.push(['_trackEvent', 'Landing Pages', action, EliteStatusApp.s.url]);
      }
    }
  }
}


$(document).ready(function() {
  EliteStatusApp.init();
});
