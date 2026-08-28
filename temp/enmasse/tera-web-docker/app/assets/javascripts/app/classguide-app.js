//= require vendor/waypoints.js
//= require vendor/velocity.min.js
//= require vendor/konami.js
//= require vendor/snow.js

var ClassGuideApp = {
  s: {
    nav: $('.raceclass #main-nav'),
    intro: $('.raceclass #class_hero_wrapper'),
    highlights: $('.raceclass #class_overview_wrapper'),
    guide: $('.raceclass #class_video_wrapper'),
    skills: $('.raceclass #class_skill_wrapper'),
    footer: $('.raceclass .eme-footer'),
    actions: $('.raceclass #class_extra_wrapper'),
    shareFacebook: $('.raceclass #share-facebook'),
    shareTwitter: $('.raceclass #share-twitter'), 
    //navOffset: -645,
    navOffset: -1 * ($('#class_hero_wrapper').height() + 52),
    navnotscroll: false
  },
  init: function(settings) {
    var s = ClassGuideApp.s;
    s = $.extend(s, settings);
    ClassGuideApp.bindEvents();
  },
  bindEvents: function() {
    var s = ClassGuideApp.s;
    // set up the scrolling menu waypoint
    $(window).waypoint(function() {
      ClassGuideApp.toggleMainNav();
    }, {offset: s.navOffset});
    // set up new world toggle waypoint
    $(s.intro).waypoint(function(direction) {
      // only record event on scroll and not click
      if(s.navnotscroll == false) {
        ClassGuideApp.triggerGAEvent('Reached Page Section', 'Hero top of Page');
      }
    $('#main-nav a').removeClass('active');
    });
    // set up Brawler class toggle waypoint
    $(s.highlights).waypoint(function(direction) {
      ClassGuideApp.toggleSelectedMenuItem('#class_overview_wrapper', direction);
      // only record event on scroll and not click
      if(s.navnotscroll == false) {
        ClassGuideApp.triggerGAEvent('Reached Page Section', 'Class Overview');
      }
         //ClassGuideApp.moveBarRight();
      $('#main-nav a').removeClass('active');
      $('#main-nav a#nav-class_overview_wrapper').toggleClass('active');
    });
    $(s.guide).waypoint(function(direction) {
      ClassGuideApp.toggleSelectedMenuItem('#class_video_wrapper', direction);
      // only record event on scroll and not click
      if(s.navnotscroll == false) {
        ClassGuideApp.triggerGAEvent('Reached Page Section', 'Class Overview Video');
      }
      $('#main-nav a').removeClass('active');
      $('#main-nav a#nav-class_video_wrapper').toggleClass('active');
    });
    $(s.skills).waypoint(function(direction) {
      ClassGuideApp.toggleSelectedMenuItem('#class_skill_wrapper', direction);
      // only record event on scroll and not click
      if(s.navnotscroll == false) {
        ClassGuideApp.triggerGAEvent('Reached Page Section', 'Skills and Glyphs');
      }
      $('#main-nav a').removeClass('active');
      $('#main-nav a#nav-class_skill_wrapper').toggleClass('active');
    });
    $(s.footer).waypoint(function(direction) {
      ClassGuideApp.triggerGAEvent('Reached Page Section', 'Footer');
    });
    $(s.actions).waypoint(function(direction) {
      ClassGuideApp.triggerGAEvent('Reached Page Section', 'Actions - Downlaod Game and Server Status');
    });
    // set up click listeners on the menu buttons 
    s.nav.on('click', 'a', ClassGuideApp.handleNavClick);
    //new
    s.shareFacebook.on('click', ClassGuideApp.handleFacebookShareClick);
    s.shareTwitter.on('click', ClassGuideApp.handleTwitterShareClick);
    //end
    $('.cta-sign-up').on('click', ClassGuideApp.handleSignUpClick);
    ClassGuideApp.createPageTimers();
    ClassGuideApp.setUpKonamiCode();
  },
  handlePlayClick: function(e) {
    e.stopPropagation();
    ClassGuideApp.triggerGAEvent('Clicked Button', 'Play for FREE Button');
  },
  handleSignUpClick: function(e) {
    e.stopPropagation();
    ClassGuideApp.triggerGAEvent('Clicked Link', 'Sign up now');
  },
  /* new tracking events */
  handleFacebookShareClick: function(e) {
    e.stopPropagation();
    ClassGuideApp.triggerGAEvent('Clicked Button', 'Share This Facebook Button');
  },
  handleTwitterShareClick: function(e) {
    e.stopPropagation();
    ClassGuideApp.triggerGAEvent('Clicked Button', 'Share This Twitter Button');
  },
  /* end new tracking events */
  createPageTimers: function() {
    // 1 minute on page
    setTimeout(function() {
      ClassGuideApp.triggerGAEvent('Spent 1 minute on page', ' ');
    }, 1 * 60 * 1000);
    // 2 minutes on page
    setTimeout(function() {
      ClassGuideApp.triggerGAEvent('Spent 2 minutes on page', ' ');
    }, 2 * 60 * 1000);
    // 5 minutes on page
    setTimeout(function() {
      ClassGuideApp.triggerGAEvent('Spent 5 minutes on page', ' ');
    }, 5 * 60 * 1000);
  },
  setUpKonamiCode: function() {
    // ClassGuideApp.s.easter_egg = new Konami(function() {ClassGuideApp.createParticleSystem()});
  },
  createParticleSystem: function() {
    $(document).snow({SnowImage: "/assets/icons/emp.png" });
  },
  toggleMainNav: function() {
    var s = ClassGuideApp.s;
    s.nav.toggleClass('scroll');
    $('#red-bar').toggleClass('scroll');
    //s.intro.toggleClass('scroll');
  },
  handleVideoClick: function(e) {
    /*var whichVideo = this.id;
    var vidClass = '.' + whichVideo;*/
    Lightbox.loadVideo({
      width: 1200,
      height: 675,
      id: this.getAttribute('data-url')
      /*id: 'https://www.youtube.com/embed/4r7wHMg5Yjg'*/
    });
    Lightbox.setFrameDimensions(1218, 678, 70);
    ClassGuideApp.triggerGAEvent('Clicked Button', 'Video Play Button ' + this.id);
    e.preventDefault();
  },
  toggleSelectedMenuItem: function(selected, direction) {
    var s = ClassGuideApp.s;
    s.nav.find('a').removeClass("selected");
    $(selected).addClass("selected");
  },
  handleNavClick: function(e) {
    var s = ClassGuideApp.s;
    var link = $(this);
    var target = $(this).attr('href'),
        id = '#' + this.id,
        external = (target.lastIndexOf('#',0) < 0);
    if (external) {
      if (target == '/') {
        ClassGuideApp.triggerGAEvent('Clicked Button', 'Back to Tera - Menu');
      } else {
        ClassGuideApp.triggerGAEvent('Clicked Button', 'Get Started - Menu');
      }
    } else {
      e.preventDefault();
      // set var to stop ga recording 
      s.navnotscroll = true;
      $(target).velocity("scroll", {duration: 1000, easing: 'ease-in-out', offset: -54,
      complete: function() {
        $('#main-nav a').removeClass('active');
        $(link).addClass('active');
        ClassGuideApp.triggerGAEvent('Clicked Internal Navigation - ', 'section (' + target + ')' );
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
        ga('send', 'event', 'Landing Pages', action, ClassGuideApp.surl + ' - ' + label, {'nonInteraction': 1});
      } else {
        ga('send', 'event', 'Landing Pages', action, ClassGuideApp.surl, {'nonInteraction': 1});
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
  ClassGuideApp.init();
  //layoutsBySize.init();
});
