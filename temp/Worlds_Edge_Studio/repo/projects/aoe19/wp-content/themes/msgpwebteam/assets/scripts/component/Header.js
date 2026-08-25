export default class Header {

    constructor() {
        this.init();       
    }

    init() {
        this.header = $(".header");
        this.activeClass = 'is-open';
        this.$overlay = $('.overlay');
        this.animTime = 200;
        this.$bpIndicator = $('.breakpoint-indicator');
        this.level = 1;

        this.nav = {
            $container: $('.header__navigation'),
            $toggle: $('.header__menu-toggle'),
            toggle: '.header__menu-toggle',
        }

        this.search = {
            $container: $('.js-search'),
            $toggle: $('.js-search-toggle'),
            $input: $('#search-input'),
            toggle: '.js-search-toggle',
        };

        this.profile = {
            $container: $('.js-profile'),
            $toggle: $('.js-profile-toggle'),
            $profileLink: $('.js-profile-link'),
            toggle: '.js-profile-toggle',
        }

        this.events();
    }

    _close(menus) {
        let self = this;

        $.each(menus, function(index, value) {
            switch (value) {
                case 'search':
                    self.search.$container.removeClass(self.activeClass);
                    break;
                case 'nav':
                    self.nav.$container.removeClass(self.activeClass);
                    self.nav.$toggle.removeClass(self.activeClass);
                    break;
                case 'profile':
                    self.profile.$toggle.removeClass(self.activeClass);
                    break;
                default: break;
            }
        });
    }

    events() {
        let self = this;

        // handle search toggle
        $(document).on('click', self.search.toggle, function() {
            $(this).unbind();

            if ( self.search.$container.hasClass(self.activeClass) ) { // turn off
                $(this).children('.visually-hidden').html('Open Search');
            } else { //turn on
                self._close(['nav', 'profile']);
                self.$overlay.fadeOut(self.animTime);
                $(this).children('.visually-hidden').html('Close Search');

                // focus is finnicky because it's transitioning visibility on click. 
                // adding setTimeout with no time makes it work consistently
                setTimeout(function() {
                    self.search.$input.focus();
                });
            }

            self.search.$container.toggleClass(self.activeClass);
        });


        // handle main nav toggle on mobile
        $(document).on('click', self.nav.toggle, function() {

            if ( self.nav.$container.hasClass(self.activeClass) ) { // turn off
                self.$overlay.fadeOut(self.animTime);
            } else { //turn on
                self._close(['search', 'profile']);
                self.$overlay.fadeIn(self.animTime);
            }

            self.nav.$container.toggleClass(self.activeClass);
            $(this).toggleClass(self.activeClass);
        });
        

        // handle profile menu toggle
        $(document).on('click', self.profile.toggle, function() {

            if( self.profile.$toggle.hasClass(self.activeClass) ) {// turn off
                self.$overlay.fadeOut(self.animTime);
            } else { //turn on
                self._close(['search', 'nav']);
                self.$overlay.fadeIn(self.animTime);
            }

            $(this).toggleClass(self.activeClass);
        });


    }
}
