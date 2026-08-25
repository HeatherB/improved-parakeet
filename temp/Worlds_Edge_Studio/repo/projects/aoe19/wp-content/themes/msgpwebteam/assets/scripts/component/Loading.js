/**
 * Loading
 * @description
 * Render a loading overlay and icon for a given container element.
 */
import TweenMax from 'gsap';

export default class Loading {
  constructor(objOptions) {
    this.init(objOptions);
  }

  init(objOptions) {
    this.options = Object.assign({
      container : $('body'),                               // default container is the body
      overlay   : $('<div class="loader-overlay"></div>'), // element for the overlay
      spinner   : $('<div class="loader-spinner"></div>'), // element for the spinner icon
      animSpeed : 0.5,                                     // (s) TweenMax animation speed
      animEase  : 'Quad.easeOut',                          // TweenMax animation ease
    }, objOptions);

    this.ui = {
      container : this.options.container,
      overlay   : null,
      spinner   : null,
    }
  }

  /**
   * Create the elements and append them to the container
   */
  show() {
    this.ui.overlay = this.options.overlay;
    this.ui.spinner = this.options.spinner;

    // Set position fixed if overlay covers the entire page so it doesn't scroll away.
    if (this.ui.container.is('body')) {
      this.ui.overlay.css('position', 'fixed');
    }

    this.ui.overlay.append(this.ui.spinner);
    this.ui.container.append(this.ui.overlay);

    // Animate overlay into view
    TweenMax.fromTo(this.ui.overlay, this.options.animSpeed, {
      autoAlpha : 0,
    }, {
      autoAlpha : 1,
      ease      : this.options.animEase,
    });
  }

  /**
   * Remove the loader
   */
  hide() {
    this.ui.overlay.remove();
  }
}
