//= require vendor/waypoints.js
//= require vendor/velocity.min.js
//= require vendor/konami.js
//= require vendor/snow.js

var BerserkApp = {
  url: window.location.href.toString().split('http://')[1],
  nav: $('#main-nav'),
  navOffset: -46,
  waypoints: {
    skills:     { el: $('.skills'),     label: 'Berserker Skills', read: false},
    timescape:  { el: $('.timescape'),  label: 'Timescape', read: false},
    akeron:     { el: $('.akeron'),     label: 'Akeron\'s Inferno', read: false},
    gridiron:   { el: $('.gridiron'),   label: 'Gridiron', read: false},
    dressing:   { el: $('.dressing'),   label: 'Dressing Room', read: false},
    gear:       { el: $('.gear'),       label: 'Tier 7 Gear', read: false},
    kaprima:    { el: $('.kaprima'),    label: 'Vault of Kaprima', read: false}
  },
  init: function() {
    BerserkApp.bindEvents();
  },
  bindEvents: function() {
    $(window).waypoint(function() {
      BerserkApp.toggleMainNav();
    }, {offset: BerserkApp.navOffset});
    $.each(BerserkApp.waypoints, function() {
      var _this = this;
      $(this.el).waypoint(function() {
        if (!_this.read){
          BerserkApp.triggerGAEvent('Reached Page Section', _this.label);
        }
        _this.read = true;
      }, {offset: 100});
    });
    $('.download').on('click', function(){
      BerserkApp.triggerGAEvent('Clicked Link', 'Download');
    });
    $('.play-now').on('click', function(){
      BerserkApp.triggerGAEvent('Clicked Button', 'Play Now');
    });
    $('.intro .video').on('click', function(){
      BerserkApp.triggerGAEvent('Play video', 'Go Berserk Teaser video');
    });
    $('.dressing .video').on('click', function(){
      BerserkApp.triggerGAEvent('Play video', 'Dressing room video');
    });
    BerserkApp.createPageTimers();
    BerserkApp.nav.on('click', 'a', BerserkApp.handleNavClick);
  },
  toggleMainNav: function() {
    BerserkApp.nav.toggleClass('scroll');
  },
  createPageTimers: function() {
    // 1 minute on page
    setTimeout(function() {
      BerserkApp.triggerGAEvent('Spent 1 minute on page', ' ');
    }, 1 * 60 * 1000);
    // 2 minutes on page
    setTimeout(function() {
      BerserkApp.triggerGAEvent('Spent 2 minutes on page', ' ');
    }, 2 * 60 * 1000);
    // 5 minutes on page
    setTimeout(function() {
      BerserkApp.triggerGAEvent('Spent 5 minutes on page', ' ');
    }, 5 * 60 * 1000);
  },
  toggleSelectedMenuItem: function(selected, direction) {
    BerserkApp.nav.find('a').removeClass("selected");
    $(selected).addClass("selected");
  },
  handleNavClick: function(e) {
    var target = $(this).attr('href'),
        id = '#' + this.id,
        external = (target.lastIndexOf('#',0) < 0);
    if (external) {
      if (target == '/') {
        BerserkApp.triggerGAEvent('Clicked Button', 'Back to Tera - Menu');
      } else {
        BerserkApp.triggerGAEvent('Clicked Button', 'Get Started - Menu');
      }
    } else {
      e.preventDefault();
      $(target).velocity("scroll", {duration: 1000, easing: 'ease-in-out', offset: -60, complete: function() {
        BerserkApp.toggleSelectedMenuItem(id);
      }});
    }
  },
  triggerGAEvent: function(action, label ) {
    // If Google Analytics is configured, trigger an event
    if (_gaq) {
      if (label != ' ') {
        _gaq.push(['_trackEvent', 'Landing Pages', action, BerserkApp.url + ' - ' + label]);
      } else {
        _gaq.push(['_trackEvent', 'Landing Pages', action, BerserkApp.url]);
      }
    }
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
      '" src="http://www.youtube.com/embed/' + objEmbed.id + '?showinfo=0&amp;wmode=transparent&amp;vq=hd720&amp;rel=0&amp;modestbranding=1&amp;autohide=1&autoplay=1" frameborder="0" allowfullscreen="allowfullscreen"></iframe>')
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
  BerserkApp.init();
  $('.overlay').on('click', function(e){
    var embed = $(this).data('embed');
    e.preventDefault();
    Lightbox.loadVideo({
      width: 1200,
      height: 675,
      id: embed
    });
    Lightbox.setFrameDimensions(1218, 678, 70);
  });
  $('.screens a').on('click', function(e){
    e.preventDefault();
    Lightbox.loadContent('<img src="'+$(this).attr('href')+'" >');
    Lightbox.setFrameDimensions( ((window.innerWidth / 10) * 9), ((window.innerHeight / 10) * 9) );
  })
});
