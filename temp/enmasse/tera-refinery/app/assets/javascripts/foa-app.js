//= require vendor/waypoints.js
//= require vendor/velocity.min.js
//= require vendor/konami.js
//= require vendor/snow.js

var FoaApp = {
  s: {
    nav: $('#main-nav'),
    nw: $('#new-world'),
    vid: $('#trailer'),
    guilds: $('#guilds'),
    lvl65: $('#level-65'),
    coliseum: $('#coliseum'),
    enhance: $('#enhancements'),
    learnMore: $('#foa-footer'),
    keyArt: $('.key-art'),
    btnMore: $('a.learn-more'),
    url: window.location.href.toString().split('http://')[1],
    navOffset: -46
  },
  init: function(settings) {
    var s = FoaApp.s;
    s = $.extend(s, settings);
    FoaApp.bindEvents();
    FoaApp.loadBgVideo();
    Map.init();
    Dungeons.init();
    ClassSelector.initialize();
  },
  bindEvents: function() {
    var s = FoaApp.s;
    // set up the scrolling menu waypoint
    $(window).waypoint(function() {
      FoaApp.toggleMainNav();
    }, {offset: s.navOffset});
    // set up new world toggle waypoint
    $(s.keyArt).waypoint(function(direction) {
      FoaApp.toggleSelectedMenuItem('#nav-top', direction);
    });
    $(s.nw).waypoint(function(direction) {
      FoaApp.toggleSelectedMenuItem('#nav-new-world', direction);
      FoaApp.triggerGAEvent('Reached Page Section', 'New World');
    }, {offset: 60});
    // Set up guilds toggle waypoint
    $(s.guilds).waypoint(function(direction) {
      FoaApp.toggleSelectedMenuItem('#nav-guilds', direction);
      FoaApp.triggerGAEvent('Reached Page Section', 'Guilds');
    }, {offset: 60});
    // Set up level 65 toggle waypoint
    $(s.lvl65).waypoint(function(direction) {
      FoaApp.toggleSelectedMenuItem('#nav-level-65', direction);
      FoaApp.triggerGAEvent('Reached Page Section', 'Level 65');
    }, {offset: 60});
    // Set up Coliseum waypoint
    $(s.coliseum).waypoint(function(direction) {
      FoaApp.toggleSelectedMenuItem('#nav-coliseum', direction);
      FoaApp.triggerGAEvent('Reached Page Section', 'Coliseum');
    }, {offset: 60});
    // Set up enhancements waypoint
    $(s.enhance).waypoint(function(direction) {
      FoaApp.toggleSelectedMenuItem('#nav-enhancements', direction);
      FoaApp.triggerGAEvent('Reached Page Section', 'Enhancements');
    }, {offset: 60});
    // Set up offer waypoint
    $(s.learnMore).waypoint(function(direction) {
      FoaApp.triggerGAEvent('Reached Page Section', 'Learn More Area');
    }, {offset: 60});
    // set up click listeners on the menu buttons 
    s.nav.on('click', 'a', FoaApp.handleNavClick);
    s.vid.on('click', FoaApp.handleVideoClick);
    s.btnMore.on('click', FoaApp.handleLearnMoreClick);
    $('.cta-sign-up a').on('click', FoaApp.handleSignUpClick);
    FoaApp.createPageTimers();
    FoaApp.setUpKonamiCode();
  },
  handleLearnMoreClick: function(e) {
    e.stopPropagation();
    FoaApp.triggerGAEvent('Clicked Button', 'Learn more Button');
  },
  handleSignUpClick: function(e) {
    e.stopPropagation();
    FoaApp.triggerGAEvent('Clicked Link', 'Sign up now');
  },
  createPageTimers: function() {
    // 1 minute on page
    setTimeout(function() {
      FoaApp.triggerGAEvent('Spent 1 minute on page', ' ');
    }, 1 * 60 * 1000);
    // 2 minutes on page
    setTimeout(function() {
      FoaApp.triggerGAEvent('Spent 2 minutes on page', ' ');
    }, 2 * 60 * 1000);
    // 5 minutes on page
    setTimeout(function() {
      FoaApp.triggerGAEvent('Spent 5 minutes on page', ' ');
    }, 5 * 60 * 1000);
  },
  setUpKonamiCode: function() {
    FoaApp.s.easter_egg = new Konami(function() {FoaApp.createParticleSystem()});
  },
  createParticleSystem: function() {
    $(document).snow({SnowImage: "/assets/icons/emp.png" });
  },
  loadBgVideo: function() {
    $('#level-65').prepend('<video id="lvl65-video" autoplay="autoplay" width="1000" height="546" loop>' +
      '<source src="/videos/level65.webm" type="video/webm">' +
      '<source src="/videos/level65.mp4" type="video/mp4">' +
    '</video>');
    $('video').bind('ended', function() {
      $(this)[0].play();
    });
  },
  toggleMainNav: function() {
    var s = FoaApp.s;
    s.nav.toggleClass('scroll');
    s.keyArt.toggleClass('scroll');
  },
  handleVideoClick: function(e) {
    Lightbox.loadVideo({
      width: 1200,
      height: 675,
      id: 'http://www.youtube.com/embed/AAEj6pwPk_Q'
    }, function() {
      if (Core.supportsVideo()) {
        $("#vidPreview")[0].play();
      }
    });
    Lightbox.setFrameDimensions(1216, 691, 70);
    if (Core.supportsVideo()) {
      $("#vidPreview")[0].pause();
    }
    FoaApp.triggerGAEvent('Clicked Button', 'Video Play Button');
    e.preventDefault();
  },
  toggleSelectedMenuItem: function(selected, direction) {
    var s = FoaApp.s;
    s.nav.find('a').removeClass("selected");
    $(selected).addClass("selected");
  },
  handleNavClick: function(e) {
    var target = $(this).attr('href'),
        id = '#' + this.id,
        external = (target.lastIndexOf('#',0) < 0);
    if (external) {
      if (target == '/') {
        FoaApp.triggerGAEvent('Clicked Button', 'Back to Tera - Menu');
      } else {
        FoaApp.triggerGAEvent('Clicked Button', 'Get Started - Menu');
      }
    } else {
      e.preventDefault();
      $(target).velocity("scroll", {duration: 1000, easing: 'ease-in-out', offset: -60, complete: function() {
        FoaApp.toggleSelectedMenuItem(id);
      }});
    }
  },
  triggerGAEvent: function(action, label ) {
    // If Google Analytics is configured, trigger an event
    if (_gaq) {
      if (label != ' ') {
        _gaq.push(['_trackEvent', 'Landing Pages', action, FoaApp.s.url + ' - ' + label]);
      } else {
        _gaq.push(['_trackEvent', 'Landing Pages', action, FoaApp.s.url]);
      }
    }
  }
}

var Dungeons = {
  init: function() {
    Dungeons.bindEvents();
  },
  bindEvents: function() {
    $('.nw-dungeons, .dungeon-lg').delegate("a", "click", function(e) {
      Lightbox.loadContent(this.id);
      Lightbox.setFrameDimensions(1560, 884, 180);
      // Trigger dungeon click
      FoaApp.triggerGAEvent('Clicked Button', 'Dungeon (' + this.id + ')');
      e.preventDefault();
    });
  }
};

var Map = {
    init: function() {
      Map.bindEvents();
    },
    bindEvents: function() {
      $("#foa-map").delegate("area", "click", function(e) {
        // Set lightbox contents
        Lightbox.loadContent(this.id);
        Lightbox.setFrameDimensions(640, 602);
        // trigger tracking event
        FoaApp.triggerGAEvent('Clicked Button', 'Map (' + this.id + ')');
        // prevent default event
        e.preventDefault();
      });
      $("#foa-map").delegate("area", "mouseover", function() {
        $(".zone." + this.id).show();
      });
      $("#foa-map").delegate("area", "mouseout", function() {
        $(".zone." + this.id).hide();
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

var ClassSelector = {
  initialize: function() {
    ClassSelector.bindEvents();
    ClassSelector.content = $('.class-skills');
  },
  bindEvents: function() {
    $('#class-grid').on('click', 'a', ClassSelector.selectClass);
  },
  selectClass: function(e) {
    e.preventDefault();
    // Update class grid with selected class
    $('#class-grid a').removeClass('selected');
     $(this).addClass('selected');
    // Update the class preview area with the new class
    ClassSelector.replaceContent(this.id);
    // trigger tracking event
    FoaApp.triggerGAEvent('Clicked Button', 'Class Selector (' + this.id + ')');
  },
  setContent: function(content) {
    var node = $('.summary.' + content);
    node.clone().appendTo(ClassSelector.content);
    ClassSelector.content.velocity("stop").velocity("fadeIn");
  },
  replaceContent: function(content) {
    ClassSelector.content.removeAttr("style").empty();
    ClassSelector.setContent(content);
    // ClassSelector.content.velocity("fadeOut", {complete: });
  },
}

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
  FoaApp.init();
});
