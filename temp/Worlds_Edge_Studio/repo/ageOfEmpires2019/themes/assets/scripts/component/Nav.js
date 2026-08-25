export default class Nav {

    constructor() {
        this.init();       
    }

    init() {
        this.$bpIndicator = $('.breakpoint-indicator');
        this.level = 1;
        this.$parentMenuItems = $('.menu__item.has-children');
        this.$back = $('.js-back-menu-item');
        this.$container = $('.primary-nav');
        this.$closeBTN = document.querySelector('button.header__menu-toggle');
        this.$ourWinLocation = window.location.pathname.split('/');
        this.$locationLast = parseInt(this.$ourWinLocation.length - 1);
        this.$locationString = this.$ourWinLocation[this.$locationLast];
        this.$locationHash = window.location.hash;
        this.$rebuiltUrl = '/' + this.$locationString + this.$locationHash;

        this.events();
    }

    _getBreakpoint() {
        return parseInt(this.$bpIndicator.css('z-index'));
    }

    events() {
        let self = this;

        self.$parentMenuItems.on('click', function(e) {
            if ( self._getBreakpoint() < 3 ) {
                e.stopPropagation(); // without this, the parentMenuItem click event triggers again

                    self.level ++;
                    self.$container.attr('data-state', 'lvl-' + self.level);

                    $(this).children('.dropdown').fadeIn();
                    let subnavs = $(this).find('a.menu__item__label');

                    for(var s = 0; s < subnavs.length; s++) {
                        subnavs[s].addEventListener('click', function(e) {
                            let anchorHash = e.currentTarget.getAttribute('href');

                            if(anchorHash === self.$rebuiltUrl) {
                                resetMenu();
                            }
                        });
                    }
            } 
        });

        self.$back.on('click', function(e) {
            e.stopPropagation(); // without this, the parentMenuItem click event triggers and nothing happens

            self.level --;
            self.$container.attr('data-state', 'lvl-' + self.level);

            $(this).parent('.dropdown').fadeOut();
        });

         function resetMenu() {
            if(self.$closeBTN) {
                if(self.$closeBTN.classList.contains('is-open')) {
                    self.$closeBTN.click(); /* trigger existing close menu behavior Header.js */
                    /* reset menu to page loaded state */
                    self.level = '1';
                    self.$container.attr('data-state', 'lvl-' + self.level);
                }
            }
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
            if ( self._getBreakpoint() >= 3 ) {
              resetMenu();
            }
          }, 400);
        });
    }
}
