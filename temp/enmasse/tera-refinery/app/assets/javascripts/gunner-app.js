//= require vendor/waypoints.js
//= require vendor/velocity.min.js
//= require vendor/konami.js
//= require vendor/snow.js

var GunnerApp = {
  s: {
    nav: $('#main-nav'),
    vid: $('#trailer'),
    intro: $('.intro'),
    gunner: $('#gunner'),
    skillCheck: $('#skill-check'),
    tools: $('#tools'),
    appendix: $('#appendix'),
    achievements: $('#cheevo'),
    skills: $('#skills'),
    passive: $('#passive'),
    companion: $('#companion'),
    close: $('#close'),
    btnPlay: $('a.play'),
    url: window.location.href.toString().split('http://')[1].split('?')[0],
    navOffset: -54
  },
  init: function(settings) {
    var s = GunnerApp.s;
    s = $.extend(s, settings);
    GunnerApp.bindEvents();
    Scenes.bindEvents();
  },
  bindEvents: function() {
    var s = GunnerApp.s;
    // set up the scrolling menu waypoint
    $(window).waypoint(function() {
      GunnerApp.toggleMainNav();
    }, {offset: s.navOffset});
    // set up new world toggle waypoint
    $(s.intro).waypoint(function(direction) {
      GunnerApp.toggleSelectedMenuItem('#nav-top', direction);
    });
    // set up gunner class toggle waypoint
    $(s.gunner).waypoint(function(direction) {
      GunnerApp.toggleSelectedMenuItem('#gunner', direction);
      GunnerApp.triggerGAEvent('Reached Page Section', 'Gunner');
    });
    $(s.tools).waypoint(function(direction) {
      GunnerApp.toggleSelectedMenuItem('#tools', direction);
      GunnerApp.triggerGAEvent('Reached Page Section', 'Tools');
    });
    $(s.appendix).waypoint(function(direction) {
      GunnerApp.toggleSelectedMenuItem('#appendix', direction);
      GunnerApp.triggerGAEvent('Reached Page Section', 'Appendix');
    });
    // set up achievements toggle waypoint
    $(s.achievements).waypoint(function(direction) {
      GunnerApp.triggerGAEvent('Reached Page Section', 'Achievements');
    });
    // set up skills toggle waypoint
    $(s.skills).waypoint(function(direction) {
      GunnerApp.triggerGAEvent('Reached Page Section', 'Skills');
    });
    // set up passive toggle waypoint
    $(s.passive).waypoint(function(direction) {
      GunnerApp.triggerGAEvent('Reached Page Section', 'Passive');
    });
    // set up companion toggle waypoint
    $(s.companion).waypoint(function(direction) {
      GunnerApp.triggerGAEvent('Reached Page Section', 'Companion');
    });
    // set up footer toggle waypoint
    $(s.close).waypoint(function(direction) {
      GunnerApp.toggleSelectedMenuItem('#close', direction);
      GunnerApp.triggerGAEvent('Reached Page Section', 'Ankle CTA');
    });
    // custom scroller
    $(s.skillCheck).on('click', function() {
      $($(this).attr('href')).velocity("scroll", {duration: 1000, easing: 'ease-in-out', offset: -54});
      GunnerApp.triggerGAEvent('Reached Page Section', 'Fill Skills Listing');
    });
    // set up click listeners on the menu buttons 
    s.nav.on('click', 'a', GunnerApp.handleNavClick);
    s.vid.on('click', GunnerApp.handleVideoClick);
    s.btnPlay.on('click', GunnerApp.handlePlayClick);
    $('.cta-sign-up').on('click', GunnerApp.handleSignUpClick);
    GunnerApp.createPageTimers();
    GunnerApp.setUpKonamiCode();
  },
  handlePlayClick: function(e) {
    e.stopPropagation();
    GunnerApp.triggerGAEvent('Clicked Button', 'Play for FREE Button');
  },
  handleSignUpClick: function(e) {
    e.stopPropagation();
    GunnerApp.triggerGAEvent('Clicked Link', 'Sign up now');
  },
  createPageTimers: function() {
    // 1 minute on page
    setTimeout(function() {
      GunnerApp.triggerGAEvent('Spent 1 minute on page', ' ');
    }, 1 * 60 * 1000);
    // 2 minutes on page
    setTimeout(function() {
      GunnerApp.triggerGAEvent('Spent 2 minutes on page', ' ');
    }, 2 * 60 * 1000);
    // 5 minutes on page
    setTimeout(function() {
      GunnerApp.triggerGAEvent('Spent 5 minutes on page', ' ');
    }, 5 * 60 * 1000);
  },
  setUpKonamiCode: function() {
    // GunnerApp.s.easter_egg = new Konami(function() {GunnerApp.createParticleSystem()});
  },
  createParticleSystem: function() {
    $(document).snow({SnowImage: "/assets/icons/emp.png" });
  },
  toggleMainNav: function() {
    var s = GunnerApp.s;
    s.nav.toggleClass('scroll');
    s.intro.toggleClass('scroll');
  },
  handleVideoClick: function(e) {
    Lightbox.loadVideo({
      width: 1200,
      height: 675,
      id: 'http://www.youtube.com/embed/8CEojAE3CS0'
    }, function() {
      if (Core.supportsVideo()) {
        $("#vidPreview")[0].play();
      }
    });
    Lightbox.setFrameDimensions(1218, 678, 70);
    if (Core.supportsVideo()) {
      $("#vidPreview")[0].pause();
    }
    GunnerApp.triggerGAEvent('Clicked Button', 'Video Play Button');
    e.preventDefault();
  },
  toggleSelectedMenuItem: function(selected, direction) {
    var s = GunnerApp.s;
    s.nav.find('a').removeClass("selected");
    $(selected).addClass("selected");
  },
  handleNavClick: function(e) {
    var target = $(this).attr('href'),
        id = '#' + this.id,
        external = (target.lastIndexOf('#',0) < 0);
    if (external) {
      if (target == '/') {
        GunnerApp.triggerGAEvent('Clicked Button', 'Back to Tera - Menu');
      } else {
        GunnerApp.triggerGAEvent('Clicked Button', 'Get Started - Menu');
      }
    } else {
      e.preventDefault();
      $(target).velocity("scroll", {duration: 1000, easing: 'ease-in-out', offset: -54});
    }
  },
  triggerGAEvent: function(action, label ) {
    // If Google Analytics is configured, trigger an event
    if (_gaq) {
      if (label != ' ') {
        _gaq.push(['_trackEvent', 'Landing Pages', action, GunnerApp.s.url + ' - ' + label]);
      } else {
        _gaq.push(['_trackEvent', 'Landing Pages', action, GunnerApp.s.url]);
      }
    }
  }
}

var Scenes = {
  init: function() {
    Scenes.bindEvents();
  },
  bindEvents: function() {
    $('.slides').delegate("a", "click", function(e) {
      Lightbox.loadContent(this.id);
      Lightbox.setFrameDimensions(1080, 600);
      // Trigger dungeon click
      GunnerApp.triggerGAEvent('Clicked Button', 'Gunnder (' + this.id + ')');
      e.preventDefault();
    });
  }
};

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

var Lightbox = {
  initialized: false,
  element: null,
  callback: null,
  contentType: "image",
  config: {
    showTitle: false,
    includeControls: false
  },
  build: function() {
    Lightbox.element = $("#lightbox");
    Lightbox.container = $('#lightbox-container');
    Lightbox.content = $('#lightbox-content');
    
  },
  bindEvents: function() {
    Lightbox.anchor = $('.lightbox-close').on('click', Lightbox.close);
  }, 
  initialize: function() {
    Blackout.initialize();
    Lightbox.build();
    Lightbox.bindEvents();
    Lightbox.initialized = true;
  },
  emptyContent: function() {
    Lightbox.content.removeAttr("style").empty();
    Lightbox.container.removeAttr("class");
  },
  loadContent: function(content, type) {
    if (!Lightbox.initialized) {
      Lightbox.initialize();
    }
    Lightbox.setContent(content);
  },
  /**
  * Loads a YouTube video
  * 
  * @param video object
  *
  * Example:
  * { title: "Video Title Text", // Optional
  *   width: 890,
  *   height: 500,
  *   id: 'a0Ft2_nhalU'
  * };
  */
  loadVideo: function(objEmbed, callback) {
    if (!Lightbox.initialized) {
      Lightbox.initialize();
    }
    Lightbox.callback = callback;
    Lightbox.setEmbed(objEmbed);
  },
  setEmbed: function(objEmbed) {
    Lightbox.emptyContent();
    Lightbox.container.addClass("video");
    $('<iframe class="lightbox-vid" width="' + objEmbed.width +'" height="' + objEmbed.height +
      '" src="' + objEmbed.id + '?showinfo=0&amp;wmode=transparent&amp;vq=hd720&amp;rel=0&amp;modestbranding=1&amp;autohide=1&autoplay=1" frameborder="0" allowfullscreen="allowfullscreen"></iframe>')
      .appendTo(Lightbox.content);
    Lightbox.show();
  },
  setContent: function(content) {
    Lightbox.emptyContent();
    var node = $('.info.' + content);
    node.clone().appendTo(Lightbox.content);

    Lightbox.setFrameDimensions(750);
    Lightbox.show();
  },
  setFrameDimensions: function(width, height, offset) {
    // Explicityly set content container to content height
    Lightbox.content.css({
      height: height + "px"
    });
    var scrollTop = window.pageYOffset || window.document.documentElement.scrollTop;
    //scrollTop -= height/2;
    scrollTop -= offset || 0;

    Lightbox.container.css({
      top: scrollTop + "px",
      width: width + "px",
      height: height + "px"
    });
  },
  show: function() {
    Blackout.show(function() {
      Lightbox.container[0].style.display = "block";
      Lightbox.element.show();
    }, Lightbox.close);
  },
  close: function() {
    Lightbox.emptyContent();
    if (Lightbox.callback != null) {
      Lightbox.callback();
      Lightbox.callback = null;
    }
    Blackout.hide(Lightbox.container.hide());
  }
};

$(document).ready(function() {
  GunnerApp.init();
});
