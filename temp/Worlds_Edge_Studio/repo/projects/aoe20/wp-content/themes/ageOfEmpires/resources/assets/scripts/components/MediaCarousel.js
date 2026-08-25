
export default class MediaCarousel {
  constructor() {
    this.init();
  }

  init() {
    this.ui = {
      sliders         : '.js-media-slider',
      controlPrev     : '.js-media-control-prev',
      controlNext     : '.js-media-control-next',
      toggles         : '.js-media-toggle',
    }

    this.activeSliderClass = '--is-active';

    this.slickOptions = {
      mobileFirst: true,
      arrows: true,
      infinite: true,
      slidesToShow: 1,
      prevArrow: this.ui.controlPrev,
      nextArrow: this.ui.controlNext,

      responsive: [{
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {  
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {  
        breakpoint: 1400,
        settings: {
          slidesToShow: 4,
        },
      }],
    }

    $(this.ui.sliders).first().slick(this.slickOptions);


    this.events();
  }

  events() {
    let self = this;

    $(self.ui.sliders).first().addClass(self.activeSliderClass);

    $(document).on('click', self.ui.toggles, function() {
      let type = $(this).attr('data-type');
      $(self.ui.sliders).removeClass(self.activeSliderClass);

      $(self.ui.sliders + '.slick-initialized').slick('unslick');

      $(self.ui.sliders).each(function() {
        if($(this).attr('data-type') == type) {
          $(this).slick(self.slickOptions);
          $(this).toggleClass(self.activeSliderClass);
        }
      });
    });

  }
}