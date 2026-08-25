/**
 * ProgressAnim
 *
 * @description
 * Utility for animating progress bars and numbers when they are scrolled into view.
 * For circle stats, the actual circle animation happens in _progress-circle.scss. Only the number animates here.
 */

import TweenMax from 'gsap';

export default class ProgressAnim {
  constructor($container, objOptions) {
    this.init($container, objOptions);
  }

  init($container, objOptions) {
    this.options = Object.assign({
      selectorBar       : '.progress-bar__bar',     // progress bar element
      selectorNumber    : '.progress-bar__number',  // element to display current progress number
      dataAttr          : 'progress',               // data attribute on container for the number value
      animSpeed         : 1,                        // (s) TweenMax animation speed
      animEase          : 'Quad.easeOut',           // TweenMax animation ease
      viewportPercent   : 1,                     // (0-1) percentage of viewport height to trigger animations
      isBar             : true,                     // is this a bar graph? (as opposed to circle graph)
      circleClassPrefix : 'progress-circle__',      // class prefix to add to container with number appended for circle anim
      totalUsage        : 0,
    }, objOptions);

    this.ui = {
      window         : $(window),
      container      : $container,
      bar            : $container.find(this.options.selectorBar),
      number         : $container.find(this.options.selectorNumber),
    };

    this.state = {
      origPlayed       : null,  // number to animate
      origWon          : null,  // number to animate
      doAnimation      : true,  // should we trigger the animation?
      max              : null,  // should we trigger the animation?
    };

    if (this.ui.container.length) {
      // Delay init to allow CSS to load in dev
      setTimeout(() => {
        // Get the number to animate

        this.state.origPlayed = this.ui.container.attr('data-progress-played');
        this.state.origWon = this.ui.container.attr('data-progress-wins');

        // Make sure we start animation from 0
        if (this.options.isBar) {
          this.ui.bar.val(0);
        }

        this._addEventListeners();
        this._checkScrollPos();
      }, 1000);
    }
  }

  /**
   * Animate the bar graph and number.
   * Add the animation class to circle graphs to trigger the CSS animation.
   */
  _animValue() {
    let self = this;
    let counter  = { value : 0 };
    let count = '';

    TweenMax.to(counter, this.options.animSpeed, {
      roundProps : 'value',
      ease       : this.options.animEase,
      onUpdate   : () => {
        this.ui.number.text(counter.value);
      },
    });

    if (this.options.isBar) {
      this.ui.bar.each((i,el)=> {
        if ($(el).hasClass('won')) {
          count = Math.round((self.state.origWon / self.state.origPlayed) * 100);
          $(el).attr('data-param', ' ' + Math.round((self.state.origWon / self.state.origPlayed) * 100) + '%');
        } else {
          count = self.state.origPlayed;
          $(el).attr('data-param', ' ' + Math.round((self.state.origPlayed / self.options.totalUsage) * 100) + '%');
        }

        $(el).addClass('show_data');

        TweenMax.to(el, this.options.animSpeed, {
          value: count,
          ease: this.options.animEase,
        });
      });
    }

  }

  /**
   * Run the animation if the container is within the viewport.
   */
  _checkScrollPos() {
    if (this.state.doAnimation) {
      let topPos    = this.ui.container.offset().top;
      let scrollTop = this.ui.window.scrollTop();
      let winHeight = this.ui.window.height() * this.options.viewportPercent;

      if (winHeight + scrollTop > topPos) {
        this._animValue();
        this.state.doAnimation = false;
      }
    }
  }

  _addEventListeners() {
    this.ui.window.on('scroll', this._checkScrollPos.bind(this));
  }
}
