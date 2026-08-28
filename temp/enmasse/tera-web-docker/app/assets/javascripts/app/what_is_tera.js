var VideoSection = {

  loadVideos: function() {
    if ( document.getElementById('mmo-video') ) {
      $('.mmo-video .video-wrapper').append('<video autoplay poster="https://eme04.enmasse-game.com/images/tera/what-is-tera/what_tera_poster.jpg" loop><source src="//eme04.enmasse-game.com/videos/tera/action_thumb.mp4" type="video/mp4"><source src="//eme04.enmasse-game.com/videos/tera/action_thumb.webm" type="video/webm"></video><img id="mmo_vid" src="/assets/icons/play-sidebyside.png" alt="" data-video="https://www.youtube.com/embed/2Le_VBtChpc?rel=0" />');
    }

    //VideoSection.loadVideoClicks();
  },

  /*loadVideoClicks: function() {
    console.log('loadVideoClicks');
    $('.mmo-video .video-wrapper').on('click', function() {
      console.log('load that other video');
    });
  },*/

} // end video section


var AboutCharacters = {
  classlist: $('#character-nav li'),
  characterselect: $('#character-nav span'),
  anchorselect: $('#character-nav a'),
  previewselect: $('#character-blocks .character-block'),
  heroinner: $('#highlight-character'),
  heroinnerIMG: $('#highlight-character span'),
  navScrubberR: $('#nav-scrubber-right'),
  navScrubberL: $('#nav-scrubber-left'),

  selectClass: function(e) {
    e.preventDefault();
    AboutCharacters.classlist.removeClass('active');

    $(this).parent().addClass('active');

    selectedClass = $(this).parent().data('select');
    var animationEvent = 'webkitAnimationEnd oanimationend msAnimationEnd animationend';

    AboutCharacters.previewselect.css('visibility', 'visible').animate({opacity: 0 }, 250, function() {
      AboutCharacters.previewselect.removeClass('active');

      AboutCharacters.heroinnerIMG.removeClass().addClass('hero-inner transitioning');
    });
    
    AboutCharacters.heroinnerIMG.one(animationEvent, function(event) {
      AboutCharacters.heroinnerIMG.removeClass();
      AboutCharacters.heroinner.removeClass();
      AboutCharacters.heroinner.addClass('hero-inner ' + selectedClass);

      AboutCharacters.heroinnerIMG.addClass('transit');
      AboutCharacters.heroinnerIMG.one(animationEvent, function(event) {
        AboutCharacters.loadPreview(selectedClass);
      });
      
    });

  },


  scrollNavR: function(e) {
    e.preventDefault();
    AboutCharacters.checkNavBtn('right');
    $('#character-nav').animate({scrollLeft:'+=200'}, 200);
  },
  scrollNavL: function(e) {
    e.preventDefault();
    AboutCharacters.checkNavBtn('left');
    $('#character-nav').animate({scrollLeft:'-=200'}, 200);
  },

  checkNavBtn: function(direction) {
    if(direction == 'right') {
      if($('#character-nav').scrollLeft() + $('#character-nav').innerWidth() == $(document).width()) {
        AboutCharacters.navScrubberL.show();
      }
      if($('#character-nav').scrollLeft() + $('#character-nav').innerWidth() >= $('#character-nav')[0].scrollWidth - 200) {
        AboutCharacters.navScrubberR.hide();
        AboutCharacters.navScrubberL.show();
      }
    }
    if(direction == 'left') {
      AboutCharacters.navScrubberR.show();
     if($(document).width() >= $('#character-nav').scrollLeft() + $('#character-nav').innerWidth() - 200) {
        AboutCharacters.navScrubberL.hide();
      }
    }

  },


  loadPreview: function(selectedClass) {
    selectedPreview = AboutCharacters.previewselect.filter('[data-id=' + selectedClass + ']');
    selectedPreview.addClass('active').animate({opacity: 1 }, 250);
  },

  init: function() {
    AboutCharacters.characterselect.on('click', null, AboutCharacters.selectClass);
    AboutCharacters.navScrubberR.on('click', null, AboutCharacters.scrollNavR);
    AboutCharacters.navScrubberL.on('click', null, AboutCharacters.scrollNavL);
  }
}

$(document).ready(function() {
    VideoSection.loadVideos();
    AboutCharacters.init();
});

