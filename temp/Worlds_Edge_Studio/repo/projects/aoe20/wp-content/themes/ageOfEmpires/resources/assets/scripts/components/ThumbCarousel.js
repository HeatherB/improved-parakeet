
export default class ThumbCarousel {
    constructor() {
        this.init();
    }

  init() {
    console.log('thumb should be doing something');
    /* slick creates two galleries to handle a row of thumbnails that trigger a target */

        /* the gallery of targets */
        $('.js-thumbCarousel-targets').slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          fade: true,
          asNavFor: '.js-thumbCarousel-triggers',
        });

        /* the gallery of thumbnail triggers */
        $('.js-thumbCarousel-triggers').slick({
          slidesToShow: 4,
          slidesToScroll: 1,
          asNavFor: '.js-thumbCarousel-targets',
          dots: true,
          centerMode: true,
          focusOnSelect: true,
        });
    }
}
