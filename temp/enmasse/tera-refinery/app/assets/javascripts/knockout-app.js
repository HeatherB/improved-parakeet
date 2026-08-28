//= require vendor/waypoints.js
//= require vendor/velocity.min.js
//= require vendor/konami.js
//= require vendor/snow.js

var KnockoutApp = {
  s: {
    nav: $('#main-nav'),
    vid: $('.trailer'),
    intro: $('#intro'),
    brawlersection: $('#aboutbrawler'),
    brawlerclass: $('.more-info a'),
    armor: $('#armor'),
    forsaken: $('#forsaken'),
    kalivan: $('#kalivan'),
    close: $('.ankle'),
    btnPlay: $('a.play'),
    shareFacebook: $('#share-facebook'),
    shareTwitter: $('#share-twitter'),
    url: window.location.href.toString().split('http://')[1].split('?')[0],
    navOffset: -640,
    navnotscroll: false
  },
  init: function(settings) {
    var s = KnockoutApp.s;
    s = $.extend(s, settings);
    KnockoutApp.bindEvents();
    Scenes.bindEvents();
    //console.log('page loaded with navnotscroll set to ' + s.navnotscroll);
  },
  bindEvents: function() {
    var s = KnockoutApp.s;
    // set up the scrolling menu waypoint
    $(window).waypoint(function() {
      KnockoutApp.toggleMainNav();
    }, {offset: s.navOffset});
    // set up new world toggle waypoint
    $(s.intro).waypoint(function(direction) {
      KnockoutApp.toggleSelectedMenuItem('#intro', direction);
      //console.log('as we scroll the intro ' + s.navnotscroll);
      // only record event on scroll and not click
      if(s.navnotscroll == false) {
        KnockoutApp.triggerGAEvent('Reached Page Section', 'Hero top of Page');
      }
      $('#main-nav a').removeClass('active');
    });
    // set up Knockout class toggle waypoint
    $(s.brawlersection).waypoint(function(direction) {
      KnockoutApp.toggleSelectedMenuItem('#aboutbrawler', direction);
      // only record event on scroll and not click
      if(s.navnotscroll == false) {
        KnockoutApp.triggerGAEvent('Reached Page Section', 'Brawler About');
      }
        $('#main-nav a').removeClass('active');
        $('#main-nav a#nav-aboutbrawler').toggleClass('active');
    });
    $(s.armor).waypoint(function(direction) {
      KnockoutApp.toggleSelectedMenuItem('#armor', direction);
      // only record event on scroll and not click
      if(s.navnotscroll == false) {
        KnockoutApp.triggerGAEvent('Reached Page Section', 'Armor');
      }
        $('#main-nav a').removeClass('active');
        $('#main-nav a#nav-armor').toggleClass('active');
    });
    $(s.forsaken).waypoint(function(direction) {
      KnockoutApp.toggleSelectedMenuItem('#forsaken', direction);
      // only record event on scroll and not click
      if(s.navnotscroll == false) {
        KnockoutApp.triggerGAEvent('Reached Page Section', 'Forsaken');
      }
        $('#main-nav a').removeClass('active');
        $('#main-nav a#nav-forsaken').toggleClass('active');
    });
    $(s.kalivan).waypoint(function(direction) {
      KnockoutApp.toggleSelectedMenuItem('#kalivan', direction);
      // only record event on scroll and not click
      if(s.navnotscroll == false) {
        KnockoutApp.triggerGAEvent('Reached Page Section', 'Kalivans Dreadnaught');
      }
        $('#main-nav a').removeClass('active');
        $('#main-nav a#nav-kalivan').toggleClass('active');
    });
    $(s.brawlerclass).on('click', function() {
      //KnockoutApp.toggleSelectedMenuItem('.more-info a', direction);
      KnockoutApp.triggerGAEvent('Reached Page Section', 'BTN - Launched Brawler Class Page');
    });
    // set up footer toggle waypoint
    $(s.close).waypoint(function(direction) {
      KnockoutApp.toggleSelectedMenuItem('#close', direction);
      KnockoutApp.triggerGAEvent('Reached Page Section', 'Ankle');
    });
    // custom scroller
    $(s.skillCheck).on('click', function() {
      $($(this).attr('href')).velocity("scroll", {duration: 1000, easing: 'ease-in-out', offset: -54});
      KnockoutApp.triggerGAEvent('Reached Page Section', 'Fill Skills Listing');
    });
    // set up click listeners on the menu buttons 
    s.nav.on('click', 'a', KnockoutApp.handleNavClick);
    s.vid.on('click', KnockoutApp.handleVideoClick);
    s.btnPlay.on('click', KnockoutApp.handlePlayClick);
    //new
    s.shareFacebook.on('click', KnockoutApp.handleFacebookShareClick);
    s.shareTwitter.on('click', KnockoutApp.handleTwitterShareClick);
    //end
    $('.cta-sign-up').on('click', KnockoutApp.handleSignUpClick);
    KnockoutApp.createPageTimers();
    KnockoutApp.setUpKonamiCode();
  },
  handlePlayClick: function(e) {
    e.stopPropagation();
    KnockoutApp.triggerGAEvent('Clicked Button', 'Play for FREE Button');
  },
  handleSignUpClick: function(e) {
    e.stopPropagation();
    KnockoutApp.triggerGAEvent('Clicked Link', 'Sign up now');
  },
  /* new tracking events */
  handleFacebookShareClick: function(e) {
    e.stopPropagation();
    KnockoutApp.triggerGAEvent('Clicked Button', 'Share This Facebook Button');
  },
  handleTwitterShareClick: function(e) {
    e.stopPropagation();
    KnockoutApp.triggerGAEvent('Clicked Button', 'Share This Twitter Button');
  },
  /* end new tracking events */
  createPageTimers: function() {
    // 1 minute on page
    setTimeout(function() {
      KnockoutApp.triggerGAEvent('Spent 1 minute on page', ' ');
    }, 1 * 60 * 1000);
    // 2 minutes on page
    setTimeout(function() {
      KnockoutApp.triggerGAEvent('Spent 2 minutes on page', ' ');
    }, 2 * 60 * 1000);
    // 5 minutes on page
    setTimeout(function() {
      KnockoutApp.triggerGAEvent('Spent 5 minutes on page', ' ');
    }, 5 * 60 * 1000);
  },
  setUpKonamiCode: function() {
    // KnockoutApp.s.easter_egg = new Konami(function() {KnockoutApp.createParticleSystem()});
  },
  createParticleSystem: function() {
    $(document).snow({SnowImage: "/assets/icons/emp.png" });
  },
  toggleMainNav: function() {
    var s = KnockoutApp.s;
    s.nav.toggleClass('scroll');
    //$('#red-bar').toggleClass('scroll');
    //s.intro.toggleClass('scroll');
  },
  handleVideoClick: function(e) {
    Lightbox.loadVideo({
      width: 1200,
      height: 675,
      id: 'https://www.youtube.com/embed/UdxWUyl4Znk'
    }, function() {
      if (Core.supportsVideo()) {
        $(".vidPreview")[0].play();
      }
    });
    Lightbox.setFrameDimensions(1218, 678, 70);
    if (Core.supportsVideo()) {
      $(".vidPreview")[0].pause();
    }
    KnockoutApp.triggerGAEvent('Clicked Button', 'Video Play Button');
    e.preventDefault();
  },
  toggleSelectedMenuItem: function(selected, direction) {
    var s = KnockoutApp.s;
    s.nav.find('a').removeClass("selected");
    $(selected).addClass("selected");
  },
  handleNavClick: function(e) {
    var s = KnockoutApp.s;
    var link = $(this);
    var target = $(this).attr('href'),
        id = '#' + this.id,
        external = (target.lastIndexOf('#',0) < 0);
    if (external) {
      if (target == '/') {
        KnockoutApp.triggerGAEvent('Clicked Button', 'Back to Tera - Menu');
      } else {
        KnockoutApp.triggerGAEvent('Clicked Button', 'Get Started - Menu');
      }
    } else {
      e.preventDefault();
      // set var to stop ga recording 
      s.navnotscroll = true;
      //console.log('page click set navnotscroll to  ' + s.navnotscroll);
      $(target).velocity("scroll", {duration: 1000, easing: 'ease-in-out', offset: -54,
      complete: function() {
        $('#main-nav a').removeClass('active');
        $(link).addClass('active');
        KnockoutApp.triggerGAEvent('Clicked Internal Navigation - ', 'section (' + target + ')' );
        s.navnotscroll = false;
      }});
      
    }
    //var fromLink = $(this).attr('id')
    //KnockoutApp.moveBarWhere(fromLink);
  },
  //moveBarWhere: function(fromLink) {
  //  if(fromLink == 'nav-brawler') {
  //    KnockoutApp.moveBarRight();
  //  } else if(fromLink == 'nav-Knockout') {
  //    KnockoutApp.moveBarLeft();
  //  } 
  //},
  //moveBarRight: function() {
  //  $("#red-bar #inner-bar").animate({left: '70%', width: '48px'});
  //},
  //moveBarLeft: function() {
  //  $("#red-bar #inner-bar").animate({left: '0%', width: '65px'});
  //},
  triggerGAEvent: function(action, label ) {
    // If Google Analytics is configured, trigger an event
    if (_gaq) {
      if (label != ' ') {
        _gaq.push(['_trackEvent', 'Landing Pages', action, KnockoutApp.s.url + ' - ' + label]);
      } else {
        _gaq.push(['_trackEvent', 'Landing Pages', action, KnockoutApp.s.url]);
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
      KnockoutApp.triggerGAEvent('Clicked Button', 'Knockout (' + this.id + ')');
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
    if (Core.supportsVideo()) {
      $(".vidPreview")[0].pause();
    }
    $(".vidPreview").css('display','none');
  }
};

$(document).ready(function() {
  KnockoutApp.init();
});