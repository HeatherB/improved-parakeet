
export default class MobileHero {
  constructor() {
    this.init();
  }

  init() {
    this.ui = {
      slidesContainer : '.js-slides-wrapper',
    }

    this.$bpIndicator = $('.js-bp-indicator');

    this._addEventListeners();
  }

  _getBreakpoint() {
      // the nav-break breakpoint is 5
      return parseInt(this.$bpIndicator.css('z-index'));
  }

  _enableCarousel() {
    let self = this;

    $(self.ui.slidesContainer).slick({
      dots: true,
      speed: 500,
      arrows: false,
      centerMode: true,
    });
  }

  _addEventListeners() {
    let self = this;

    if ( self._getBreakpoint() < 5 ) {
      self._enableCarousel();
    }

    var delay = (function(){
      var timer = 0;
      return function(callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
      };
    })();

    $(window).resize(function() {
      delay(function() {

        if ( self._getBreakpoint() < 5 ) {
          /* desktop to device */
          self._enableCarousel();
        } else if ( self._getBreakpoint() >= 5 ) {
          /* device to desktop */
          if($(self.ui.slidesContainer).hasClass('slick-initialized')) {
            $(self.ui.slidesContainer).slick('unslick');
          }
        }
      }, 400);
    });
  
  }

}