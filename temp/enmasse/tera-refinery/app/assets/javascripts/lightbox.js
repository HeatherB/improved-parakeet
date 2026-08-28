(function($) {
        
  $('div.form-line input').live('focus', function() { $('div.error-bottom').hide(); })

  // $(sublimevideo.load);

  var viewportWidth = $(window).width();
  var viewportHeight = $(window).height();
  
  var newPopupWidth = Math.ceil(viewportWidth * 0.8);
  var newPopupHeight = Math.ceil(viewportHeight * 0.7);
  var newPopupTopMargin = Math.ceil(viewportHeight * 0.3 / 2);
  var newItemHeight = newPopupHeight - 100;
  var newItemWidth = newPopupWidth - 120;

  if((newItemWidth * 9 /16) > newItemHeight ){
    var videoHeight = newItemHeight;
    var videoWidth = newItemHeight * 16 / 9;
    var videoLeft = (newItemWidth - videoWidth)/2+10;
    var videoTop = 0;
  } else {
    var videoHeight = newItemWidth * 9 / 16;
    var videoWidth = newItemWidth;
    var videoLeft = 0;
    var videoTop = (newItemHeight - videoHeight)/2;
  }

  // Pre loaders for images and sublime videos
  function loadItem(link, callback) {
    var type = link.data('item-type');
    itemLoaders[type](link, callback);
  }

  // Handle preparing and pre-loading different types of items
  var itemLoaders = {
    // video: function(link, callback) {
    //   var sources = link.data('video-sources').split(',');
    //   var videoWrapper = $(JST['templates/sublime_video']({sources: sources}));

    //   videoWrapper.css({ width: newItemWidth, height: newItemHeight});

    //   videoWrapper.children('video').attr({ width: videoWidth, height: videoHeight}).css({ marginTop: videoTop });


    //   videoWrapper.data('download-link', sources[0]);
    //   if(typeof callback == 'function') {
    //     callback(videoWrapper);
    //   }
    // },
    image: function (link, callback) {
      var src = link.attr('href');
      var img = new Image();
      $(img).data('download-link', src);
      
      if(typeof callback == 'function') {
        img.onload = function () {
          callback($(img));

          var h, w;
          var self = $(this);

          if ( (self.width() / self.height()) < (newItemWidth / newItemHeight) ) {
            if ( self.height() > newItemHeight ) {
              h = newItemHeight;
              w = Math.ceil( self.width() * h / self.height() );        
            } else {
              h = self.height();
              w = self.width();
            };
          } else {
            if ( self.width() > newItemWidth ) {
              var w = newItemWidth;
              var h = Math.ceil( self.height() * w / self.width() );
            } else {
              h = self.height();
              w = self.width();
            };
          };
          self.css({ height: h, width: w});
          };
      };
      img.src = src;
    }
  };

  function between (num, min, max) {
    return (typeof num == 'number' && num <= max && num >= min);
  }


  // The plugin
  $.fn.lightBox = function(settings) {

    settings = jQuery.extend({
      onSetItem: function (index) {},
      resizeDuration: 'fast',
      fadeInDuration: undefined,
      notItemWidth: 120,
      ofAgeCookie: 'of_age',
      underAgeExpDays: 1,
      ofAgeExpDays: 365,
      requiredVideoYearsOld: 18
    }, settings);

    var thumbs = this;
    var popup, overlay, itemContainer;
    var index;
    var item;

    function _open(target) {

      // Hide elements that appear on top of lightbox-overlay in IE
      $('embed, object, select').css({ 'visibility' : 'hidden' });

      _renderLightbox();
      _connectEvents();

      startIndex = thumbs.index(target);
      _setItem(startIndex, true);
    }

    function _renderLightbox() {
      var els = $(JST['templates/lightbox']()).appendTo('body'); 
      popup = els.find('.lightbox-popup');

      itemContainer = popup.find('.lightbox-item-container');

      overlay = els.filter('.lightbox-overlay');
      overlay.css({ height: $(document).height() }).fadeIn();
      overlay.click(_close);

      els.filter('.lightbox-container').css({width: newPopupWidth+20, top: newPopupTopMargin });
      $('.lightbox-popup').css({width: newPopupWidth, height: newPopupHeight});
      $('.lightbox-item-container').addClass('spinner');
      //els.filter('.lightbox-container').click(_close);
     
    }

    function _connectEvents() {
      popup.find('.lightbox-close').click(_close);

      popup.find('.lightbox-prev').click(function() {
        if(index > 0) {
          _setItem(-1);
        }
        return false;
      });
      popup.find('.lightbox-next').click(function() {
        if(index < thumbs.length - 1) {
          _setItem(1);
        }
        return false;
      });
    }

    // function _cleanUpVideo() {
    //   video = popup.find('video')[0];
    //   if(video) { sublimevideo.unprepare(video); }
    // }

    function _setItem(offset, absolute) {
      index = offset + (absolute ? 0 : index);

      if(typeof settings.onSetItem == 'function') {
        settings.onSetItem(index);
      }
      $('.lightbox-item-container').addClass('spinner');

      // _cleanUpVideo();
      itemContainer.empty();
      loadItem(thumbs.eq(index), _prepForNewItem);
    }

    function _prepForNewItem (newItem) {
      item = $(newItem);

      item.addClass('lightbox-item');
      itemContainer.append(item);

      itemContainer.children().hide();

      popup.animate({ width: newPopupWidth }, {
        complete: _showItem,
        duration: settings.resizeDuration
      });
      itemContainer.css({ height: newItemHeight, width: newItemWidth});
      popup.find('.lightbox-body .lightbox-prev, .lightbox-body .lightbox-next').animate({
        height: newItemHeight
      }, settings.resizeDuration);
      if(thumbs.eq(index).data('item-type') == 'video') {
        itemContainer.children('.videoContainer').addClass('border-box').css({ paddingLeft: videoLeft, display: "block"});
      };
    }

    // function _showVideo () {
    //   sublimevideo.prepareAndPlay(item.find('video')[0]);
    // }


    function _removeItemOverlay () {
      popup.find('.item-overlay').remove();
      popup.find('.lightbox-download-link').show();
    }
    function _setItemOverlay (overlay) {
      overlay.css({
        width: newItemWidth,
        top: (newItemHeight/2)
      });
        $('.lightbox-download-link').hide();      
    }

    function _showItem() {
      _preloadNeighborItems();
      popup.find('.lightbox-download-link').attr('href', itemContainer.find('.lightbox-item').data('download-link')).show();
      popup.find('#lightbox-title').text(thumbs.eq(index).attr('title')).show();
      // _showVideo();
      itemContainer.children().fadeIn(settings.fadeInDuration);
      $('.lightbox-item-container').removeClass('spinner');
      _updateNav();
    }

    function _updateNav() {
      popup.find('.lightbox-prev, .lightbox-next').removeClass('disabled');
      if(index <= 0) {
        popup.find('.lightbox-prev').addClass('disabled');
      }
      if(index >= thumbs.length - 1) {
        popup.find('.lightbox-next').addClass('disabled');
      }
    }

    function _preloadNeighborItems() {
      if ((thumbs.length - 1) > index) {
        loadItem(thumbs.eq(index + 1));
      }
      if (index > 0) {
        loadItem(thumbs.eq(index - 1));
      }
    }

    function _close(e) {
      e.preventDefault();
      popup.hide();
      // _cleanUpVideo();
      overlay.fadeOut(function () { 
        popup.remove();
        overlay.remove();
      });
      $('embed, object, select').css({ 'visibility' : 'visible' });
    }

    return thumbs.click(function (e) {
      e.preventDefault();
      _open($(this));
    });

  };

})(jQuery);
