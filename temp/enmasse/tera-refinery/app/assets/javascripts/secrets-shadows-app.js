//= require vendor/waypoints.js
//= require vendor/velocity.min.js
//= require vendor/konami.js
//= require vendor/snow.js

var SecretsShadowsApp = {
  s: {
    nav: $('#main-nav'),
    vid: $('#trailer'),
    secret: $('#trailerSecret'),
    demokron: $('#trailerFactory'),
    sanguine: $('#trailerSanguine'),
    flying: $('#trailerMounts'),
    hero: $('.hero'),
    about: $('#aboutninja'),
    shadow: $('#shadow'),
    factory: $('#factory'),
    sanguinary: $('#sanguinary'),
    arena: $('#arena'),
    mounts: $('#mounts'),
    close: $('#foot'),
    factoryslides: $('#factory .slides'),
    sanguinaryslides: $('#sanguinary .slides'),
    slides: $('.slides'),
    btnPlay: $('a.play'),
    shareFacebook: $('#share-facebook'),
    shareTwitter: $('#share-twitter'), 
    url: window.location.href.toString().split('http://')[1].split('?')[0],
    navOffset: -645,
    navnotscroll: false
  },
  init: function(settings) {
    var s = SecretsShadowsApp.s;
    s = $.extend(s, settings);
    SecretsShadowsApp.bindEvents();
    Scenes.bindEvents();
  },
  bindEvents: function() {
    var s = SecretsShadowsApp.s;
    // set up the scrolling menu waypoint
    $(window).waypoint(function() {
      SecretsShadowsApp.toggleMainNav();
    }, {offset: s.navOffset});
    // set up new world toggle waypoint
    $(s.hero).waypoint(function(direction) {
      SecretsShadowsApp.toggleSelectedMenuItem('.hero', direction);
      // only record event on scroll and not click
      if(s.navnotscroll == false) {
        SecretsShadowsApp.triggerGAEvent('Reached Page Section', 'Hero top of Page');
      }
    $('#main-nav a').removeClass('active');
    });


    $(s.about).waypoint(function(direction) {
      SecretsShadowsApp.toggleSelectedMenuItem('#aboutninja', direction);
      // only record event on scroll and not click
      if(s.navnotscroll == false) {
        SecretsShadowsApp.triggerGAEvent('Reached Page Section', 'About Ninja');
      }
      $('#main-nav a').removeClass('active');
      $('#main-nav a#nav-aboutninja').toggleClass('active');
    });

    $(s.shadow).waypoint(function(direction) {
      SecretsShadowsApp.toggleSelectedMenuItem('#shadow', direction);
      // only record event on scroll and not click
      if(s.navnotscroll == false) {
        SecretsShadowsApp.triggerGAEvent('Reached Page Section', 'In The Shadow of Fate');
        
      }
      $('#main-nav a').removeClass('active');
      $('#main-nav a#nav-shadow').toggleClass('active');
    });

    $(s.factory).waypoint(function(direction) {
      SecretsShadowsApp.toggleSelectedMenuItem('#factory', direction);
      // only record event on scroll and not click
      if(s.navnotscroll == false) {
        SecretsShadowsApp.triggerGAEvent('Reached Page Section', 'Demokron Factory');
      }
      $('#main-nav a').removeClass('active');
      $('#main-nav a#nav-factory').toggleClass('active');
    });

    $(s.sanguinary).waypoint(function(direction) {
      SecretsShadowsApp.triggerGAEvent('Reached Page Section', 'Shadow Sanguinary');
    });

    $(s.arena).waypoint(function(direction) {
      SecretsShadowsApp.toggleSelectedMenuItem('#arena', direction);
      // only record event on scroll and not click
      if(s.navnotscroll == false) {
        SecretsShadowsApp.triggerGAEvent('Reached Page Section', 'Celestial Arena');
      }
      $('#main-nav a').removeClass('active');
      $('#main-nav a#nav-arena').toggleClass('active');
    });

     $(s.mounts).waypoint(function(direction) {
      SecretsShadowsApp.toggleSelectedMenuItem('#mounts', direction);
      // only record event on scroll and not click
      if(s.navnotscroll == false) {
        SecretsShadowsApp.triggerGAEvent('Reached Page Section', 'Flying Mounts');
      }
      $('#main-nav a').removeClass('active');
      $('#main-nav a#nav-mounts').toggleClass('active');
    });
    
    // set up footer toggle waypoint
    $(s.close).waypoint(function(direction) {
      SecretsShadowsApp.triggerGAEvent('Reached Page Section', 'Ankle CTA');
    });
    // set up click listeners on the menu buttons 
    s.nav.on('click', 'a', SecretsShadowsApp.handleNavClick);
    s.vid.on('click', SecretsShadowsApp.handleVideoClick);
    s.secret.on('click', SecretsShadowsApp.handleVideoClick);
    s.demokron.on('click', SecretsShadowsApp.handleVideoClick);
    s.sanguine.on('click', SecretsShadowsApp.handleVideoClick);
    s.flying.on('click', SecretsShadowsApp.handleVideoClick);
    //s.btnPlay.on('click', SecretsShadowsApp.handlePlayClick);
    //new
    s.shareFacebook.on('click', SecretsShadowsApp.handleFacebookShareClick);
    s.shareTwitter.on('click', SecretsShadowsApp.handleTwitterShareClick);
    //end
   // $('.cta-sign-up').on('click', SecretsShadowsApp.handleSignUpClick);
    SecretsShadowsApp.createPageTimers();
    SecretsShadowsApp.setUpKonamiCode();
  },
  handlePlayClick: function(e) {
    e.stopPropagation();
    SecretsShadowsApp.triggerGAEvent('Clicked Button', 'Play for FREE Button');
  },
  handleSignUpClick: function(e) {
    e.stopPropagation();
    SecretsShadowsApp.triggerGAEvent('Clicked Link', 'Sign up now');
  },
  /* new tracking events */
  handleFacebookShareClick: function(e) {
    e.stopPropagation();
    SecretsShadowsApp.triggerGAEvent('Clicked Button', 'Share This Facebook Button');
  },
  handleTwitterShareClick: function(e) {
    e.stopPropagation();
    SecretsShadowsApp.triggerGAEvent('Clicked Button', 'Share This Twitter Button');
  },
  /* end new tracking events */
  createPageTimers: function() {
    // 1 minute on page
    setTimeout(function() {
      SecretsShadowsApp.triggerGAEvent('Spent 1 minute on page', ' ');
    }, 1 * 60 * 1000);
    // 2 minutes on page
    setTimeout(function() {
      SecretsShadowsApp.triggerGAEvent('Spent 2 minutes on page', ' ');
    }, 2 * 60 * 1000);
    // 5 minutes on page
    setTimeout(function() {
      SecretsShadowsApp.triggerGAEvent('Spent 5 minutes on page', ' ');
    }, 5 * 60 * 1000);
  },
  setUpKonamiCode: function() {
    // SecretsShadowsApp.s.easter_egg = new Konami(function() {SecretsShadowsApp.createParticleSystem()});
  },
  toggleMainNav: function() {
    var s = SecretsShadowsApp.s;
    s.nav.toggleClass('scroll');
   // $('#red-bar').toggleClass('scroll');
    //s.hero.toggleClass('scroll');
  },
  handleVideoClick: function(e) {
    /*var whichVideo = this.id;
    var vidClass = '.' + whichVideo;*/
    Lightbox.loadVideo({
      width: 1200,
      height: 675,
      id: this.getAttribute('data-url')
      /*id: 'https://www.youtube.com/embed/4r7wHMg5Yjg'*/
    }, function() {
      if (Core.supportsVideo()) {
        //$(".vidPreview")[0].play();
      }
    });
    Lightbox.setFrameDimensions(1218, 678, 70);
    if (Core.supportsVideo()) {
      //$(".vidPreview")[0].pause();
    }
    SecretsShadowsApp.triggerGAEvent('Clicked Button', 'Video Play Button ' + this.id);
    e.preventDefault();
  },
  toggleSelectedMenuItem: function(selected, direction) {
    var s = SecretsShadowsApp.s;
    s.nav.find('a').removeClass("selected");
    $(selected).addClass("selected");
  },
  handleNavClick: function(e) {
    var s = SecretsShadowsApp.s;
    var link = $(this);
    var target = $(this).attr('href'),
        id = '#' + this.id,
        external = (target.lastIndexOf('#',0) < 0);
    if (external) {
      if (target == '/') {
        SecretsShadowsApp.triggerGAEvent('Clicked Button', 'Back to Tera - Menu');
      } else {
        SecretsShadowsApp.triggerGAEvent('Clicked Button', 'Get Started - Menu');
      }
    } else {
      e.preventDefault();
      // set var to stop ga recording 
      s.navnotscroll = true;
      $(target).velocity("scroll", {duration: 1000, easing: 'ease-in-out', offset: -54,
      complete: function() {
        $('#main-nav a').removeClass('active');
        $(link).addClass('active');
        SecretsShadowsApp.triggerGAEvent('Clicked Internal Navigation - ', 'section (' + target + ')' );
        s.navnotscroll = false;
      }});
    }
  },
  triggerGAEvent: function(action, label ) {
    // If Google Analytics is configured, trigger an event
    if (_gaq) {
      if (label != ' ') {
        _gaq.push(['_trackEvent', 'Landing Pages', action, SecretsShadowsApp.s.url + ' - ' + label]);
      } else {
        _gaq.push(['_trackEvent', 'Landing Pages', action, SecretsShadowsApp.s.url]);
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
      e.preventDefault();
      Lightbox.loadContent(this.id);
      Lightbox.setFrameDimensions(1080, 600);
      // Trigger dungeon click
      SecretsShadowsApp.triggerGAEvent('Clicked Button', 'Secrets and Shadows (' + this.id + ')');
      //e.preventDefault();
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
     // $(".vidPreview")[0].pause();
    }
    //$(".vidPreview").css('display','none');
  }
};

$(document).ready(function() {
  SecretsShadowsApp.init();
});