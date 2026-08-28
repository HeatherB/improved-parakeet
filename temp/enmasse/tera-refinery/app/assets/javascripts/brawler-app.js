//= require vendor/waypoints.js
//= require vendor/velocity.min.js
//= require vendor/konami.js
//= require vendor/snow.js

var BrawlerApp = {
  s: {
    nav: $('#main-nav'),
    vid: $('#trailer'),
    intro: $('#intro'),
    origin: $('#origin'),
    slides: $('.slides'),
    close: $('#close'),
    btnPlay: $('a.play'),
    shareFacebook: $('#share-facebook'),
    shareTwitter: $('#share-twitter'),
    lightboxImageOne: $('#sceneone'),
    lightboxImageTwo: $('#scenetwo'),
    lightboxImageThree: $('#scenethree'),
    ankleFacebook: $('li.ft-facebook a'),
    ankleTwitter: $('li.ft-twitter a'),
    ankleYoutube: $('li.ft-youtube a'),
    ankleTwitch: $('li.ft-twitch a'),
    url: window.location.href.toString().split('http://')[1].split('?')[0],
    navOffset: -54
  },
  init: function(settings) {
    var s = BrawlerApp.s;
    s = $.extend(s, settings);
    BrawlerApp.bindEvents();
    Scenes.bindEvents();
  },
  bindEvents: function() {
    var s = BrawlerApp.s;
    // set up the scrolling menu waypoint
    $(window).waypoint(function() {
      BrawlerApp.toggleMainNav();
    }, {offset: s.navOffset});
    // set up new world toggle waypoint
    $(s.intro).waypoint(function(direction) {
      BrawlerApp.toggleSelectedMenuItem('#intro', direction);
      BrawlerApp.triggerGAEvent('Reached Page Section', 'Hero top of Page');
      //if(direction == 'up') {
      //  BrawlerApp.moveBarLeft();
      //}
      $('#main-nav a#nav-brawler').addClass('active');
    });
    // set up Brawler class toggle waypoint
    $(s.origin).waypoint(function(direction) {
      BrawlerApp.toggleSelectedMenuItem('#origin', direction);
      BrawlerApp.triggerGAEvent('Reached Page Section', 'Origin Story');
         //BrawlerApp.moveBarRight();
      $('#main-nav a#nav-brawler').removeClass('active');
      $('#main-nav a#nav-origin').toggleClass('active');
    });
    $(s.slides).waypoint(function(direction) {
      BrawlerApp.toggleSelectedMenuItem('.slides', direction);
      BrawlerApp.triggerGAEvent('Reached Page Section', 'Slides');
    });
    // set up footer toggle waypoint
    $(s.close).waypoint(function(direction) {
      BrawlerApp.toggleSelectedMenuItem('#close', direction);
      BrawlerApp.triggerGAEvent('Reached Page Section', 'Ankle CTA');
    });
    // custom scroller
    $(s.skillCheck).on('click', function() {
      $($(this).attr('href')).velocity("scroll", {duration: 1000, easing: 'ease-in-out', offset: -54});
      BrawlerApp.triggerGAEvent('Reached Page Section', 'Fill Skills Listing');
    });
    // set up click listeners on the menu buttons 
    s.nav.on('click', 'a', BrawlerApp.handleNavClick);
    s.vid.on('click', BrawlerApp.handleVideoClick);
    s.btnPlay.on('click', BrawlerApp.handlePlayClick);
    //new
    s.shareFacebook.on('click', BrawlerApp.handleFacebookShareClick);
    s.shareTwitter.on('click', BrawlerApp.handleTwitterShareClick);
    s.lightboxImageOne.on('click', BrawlerApp.handleLightboxOneGalleryClick);
    s.lightboxImageTwo.on('click', BrawlerApp.handleLightboxTwoGalleryClick);
    s.lightboxImageThree.on('click', BrawlerApp.handleLightboxThreeGalleryClick);
    s.ankleFacebook.on('click', BrawlerApp.handleAnkleFacebookClick);
    s.ankleTwitter.on('click', BrawlerApp.handleAnkleTwitterClick);
    s.ankleYoutube.on('click', BrawlerApp.handleAnkleYoutubeClick);
    s.ankleTwitch.on('click', BrawlerApp.handleAnkleTwitchClick);
    //end
    $('.cta-sign-up').on('click', BrawlerApp.handleSignUpClick);
    BrawlerApp.createPageTimers();
    BrawlerApp.setUpKonamiCode();
  },
  handlePlayClick: function(e) {
    e.stopPropagation();
    BrawlerApp.triggerGAEvent('Clicked Button', 'Play for FREE Button');
  },
  handleSignUpClick: function(e) {
    e.stopPropagation();
    BrawlerApp.triggerGAEvent('Clicked Link', 'Sign up now');
  },
  /* new tracking events */
  handleFacebookShareClick: function(e) {
    e.stopPropagation();
    BrawlerApp.triggerGAEvent('Clicked Button', 'Share This Facebook Button');
  },
  handleTwitterShareClick: function(e) {
    e.stopPropagation();
    BrawlerApp.triggerGAEvent('Clicked Button', 'Share This Twitter Button');
  },
  handleLightboxOneGalleryClick: function(e) {
    BrawlerApp.triggerGAEvent('Clicked Button', 'Lightbox Image One Launched');
  },
  handleLightboxTwoGalleryClick: function(e) {
    BrawlerApp.triggerGAEvent('Clicked Button', 'Lightbox Image Two Launched');
  },
  handleLightboxThreeGalleryClick: function(e) {
    BrawlerApp.triggerGAEvent('Clicked Button', 'Lightbox Image Three Launched');
  },
  handleAnkleFacebookClick: function(e) {
    BrawlerApp.triggerGAEvent('Clicked Button', 'Ankle CTA Facebook Button');
  },
  handleAnkleTwitterClick: function(e) {
    BrawlerApp.triggerGAEvent('Clicked Button', 'Ankle CTA Twitter Button');
  },
  handleAnkleYoutubeClick: function(e) {
    BrawlerApp.triggerGAEvent('Clicked Button', 'Ankle CTA Youtube Button');
  },
  handleAnkleTwitchClick: function(e) {
    BrawlerApp.triggerGAEvent('Clicked Button', 'Ankle CTA Twitch Button');
  },
  /* end new tracking events */
  createPageTimers: function() {
    // 1 minute on page
    setTimeout(function() {
      BrawlerApp.triggerGAEvent('Spent 1 minute on page', ' ');
    }, 1 * 60 * 1000);
    // 2 minutes on page
    setTimeout(function() {
      BrawlerApp.triggerGAEvent('Spent 2 minutes on page', ' ');
    }, 2 * 60 * 1000);
    // 5 minutes on page
    setTimeout(function() {
      BrawlerApp.triggerGAEvent('Spent 5 minutes on page', ' ');
    }, 5 * 60 * 1000);
  },
  setUpKonamiCode: function() {
    // BrawlerApp.s.easter_egg = new Konami(function() {BrawlerApp.createParticleSystem()});
  },
  createParticleSystem: function() {
    $(document).snow({SnowImage: "/assets/icons/emp.png" });
  },
  toggleMainNav: function() {
    var s = BrawlerApp.s;
    s.nav.toggleClass('scroll');
    $('#red-bar').toggleClass('scroll');
    //s.intro.toggleClass('scroll');
  },
  handleVideoClick: function(e) {
    Lightbox.loadVideo({
      width: 1200,
      height: 675,
      //id: $("#vidPreview").find('source').attr('src')
      //id: 'http://download.enmasse.com/videos/tera/Brawler_Teaser-15mbps-V1.mp4'
      id: 'https://www.youtube.com/embed/uW7z6t_yrPE'
    }, function() {
      if (Core.supportsVideo()) {
        $("#vidPreview")[0].play();
      }
    });
    Lightbox.setFrameDimensions(1218, 678, 70);
    if (Core.supportsVideo()) {
      $("#vidPreview")[0].pause();
    }
    BrawlerApp.triggerGAEvent('Clicked Button', 'Video Play Button');
    e.preventDefault();
  },
  toggleSelectedMenuItem: function(selected, direction) {
    var s = BrawlerApp.s;
    s.nav.find('a').removeClass("selected");
    $(selected).addClass("selected");
  },
  handleNavClick: function(e) {
    $('#main-nav a').removeClass('active');
    var target = $(this).attr('href'),
        id = '#' + this.id,
        external = (target.lastIndexOf('#',0) < 0);
    if (external) {
      if (target == '/') {
        BrawlerApp.triggerGAEvent('Clicked Button', 'Back to Tera - Menu');
      } else {
        BrawlerApp.triggerGAEvent('Clicked Button', 'Get Started - Menu');
      }
    } else {
      e.preventDefault();
      $(target).velocity("scroll", {duration: 1000, easing: 'ease-in-out', offset: -54});
    }
    $(this).addClass('active');
    var fromLink = $(this).attr('id')
    //BrawlerApp.moveBarWhere(fromLink);
  },
  //moveBarWhere: function(fromLink) {
  //  if(fromLink == 'nav-origin') {
  //    BrawlerApp.moveBarRight();
  //  } else if(fromLink == 'nav-brawler') {
  //    BrawlerApp.moveBarLeft();
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
        _gaq.push(['_trackEvent', 'Landing Pages', action, BrawlerApp.s.url + ' - ' + label]);
      } else {
        _gaq.push(['_trackEvent', 'Landing Pages', action, BrawlerApp.s.url]);
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
      BrawlerApp.triggerGAEvent('Clicked Button', 'Brawler (' + this.id + ')');
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
      $("#vidPreview")[0].pause();
    }
    $("#vidPreview").css('display','none');
  }
};

$(document).ready(function() {
  BrawlerApp.init();
});