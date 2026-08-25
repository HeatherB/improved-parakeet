export default class Header {

    constructor() {
        this.init();       
    }

    init() {
        this.activeClass = 'is-open';
        this.$overlay = $('.js-overlay');
        this.animTime = 200;
        this.$bpIndicator = $('.js-bp-indicator');
        this.gamesClass = '--games';
        this.hiddenClass = 'is-hidden';

        this.nav = {
            container: '.js-nav',
            toggle: '.js-nav-toggle',
            back: '.js-back-menu-item',
            parentMenuItems: '.js-parent-nav-item',
            level: 0,
            dropdown: '.js-dropdown',
        }

        this.search = {
            container: '.js-search',
            input: '.js-search-input',
            toggle: '.js-search-toggle',
        };

        this.share = {
            container: '.js-share',
            toggle: '.js-share-toggle',
        }

        this.profile = {
            container: '.js-profile',
            toggle: '.js-profile-toggle',
            mToggle: '.js-profile-toggle-mobile',
        }

        this.header = '.js-header';
        this.headerMenu = '.js-header-menu';

        this.events();
    }

    _getBreakpoint() {
        // the nav-break breakpoint is 5
        return parseInt(this.$bpIndicator.css('z-index'));
    }

    _close(menus) {
        let self = this;

        $.each(menus, function(index, value) {
            switch (value) {
                case 'search':
                    $(self.search.container).removeClass(self.activeClass);
                    break;
                case 'share':
                    $(self.share.container).removeClass(self.activeClass);
                    break;
                case 'nav':
                    $(self.nav.container).removeClass(self.activeClass);
                    $(self.nav.toggle).removeClass(self.activeClass);
                    break;
                case 'profile':
                    $(self.profile.container).removeClass(self.activeClass);
                    $(self.profile.toggle).removeClass(self.activeClass);
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

            if ( $(self.search.container).hasClass(self.activeClass) ) { // turn off
                $(this).children('.screen-reader-only').html('Open Search');

            } else { //turn on
                $(this).children('.screen-reader-only').html('Close Search');
                self._close(['share']);
                // focus is finnicky because it's transitioning visibility on click. 
                // adding setTimeout with no time makes it work consistently
                setTimeout(function() {
                    $(self.search.input).focus();
                });
            }

            $(self.search.container).toggleClass(self.activeClass);
        });

        // handle share toggle
        $(document).on('click', self.share.toggle, function() {
            $(this).unbind();

            if ( $(self.share.container).hasClass(self.activeClass) ) { // turn off
                $(this).children('.screen-reader-only').html('Open Share');

            } else { //turn on
                $(this).children('.screen-reader-only').html('Close Share');
                self._close(['search']);
            }

            $(self.share.container).toggleClass(self.activeClass);
        });


        // handle main nav toggle on mobile
        $(document).on('click', self.nav.toggle, function() {

            if ( $(self.nav.container).hasClass(self.activeClass) ) { // if on, toggle off
                self.$overlay.fadeOut(self.animTime);
                $(self.profile.toggle).attr('tabindex', 0);
            } else { // if off, toggle on
                self._close(['profile']);
                self.$overlay.fadeIn(self.animTime);
                $(self.profile.toggle).attr('tabindex', -1);
            }

            $(self.nav.container).toggleClass(self.activeClass);
            $(self.nav.toggle).toggleClass(self.activeClass);
        });
        

        // handle profile menu toggle
        $(document).on('click', self.profile.toggle, function() {

            if( $(self.profile.toggle).hasClass(self.activeClass) ) {// turn off
                self.$overlay.fadeOut(self.animTime);
            } else { //turn on
                self._close(['nav']);
                self.$overlay.fadeIn(self.animTime);
            }

            $(self.profile.toggle).toggleClass(self.activeClass);
            $(self.profile.container).toggleClass(self.activeClass);
        });

        function toggleHeaderMenu(show) {
            // wait for the menu slide animation before showing
            setTimeout(function() {
                if (show) {
                    $(self.headerMenu).addClass(self.hiddenClass);
                } else {
                    $(self.headerMenu).removeClass(self.hiddenClass);
                }
                
            }, self.animTime);
        }


        // handle parent menu items on mobile
        $(document).on('click', self.nav.parentMenuItems, function(e) {

            if ( self._getBreakpoint() < 5 ) {
                e.stopPropagation(); // without this, the parentMenuItem click event triggers again

                self.nav.level ++;
                $(self.nav.container).attr('data-state', 'lvl-' + self.nav.level);

                $(this).children('.js-dropdown').fadeIn();

                if ($(this).hasClass(self.gamesClass)) {
                    toggleHeaderMenu(true);
                } else {
                    toggleHeaderMenu(false);
                }
            }
            
        });

        

        // handle mobile menu back buttons
        $(document).on('click', self.nav.back, function(e) {
            e.stopPropagation(); // without this, the parentMenuItem click event triggers and nothing happens

            $(this).parent('.js-dropdown').fadeOut();

            // if the back button will take us to the lvl-1 games menu toggle visibility on the header menu
            // otherwise, make sure it's not hidden
            if ( $(this).parents('.' + self.gamesClass).length && self.nav.level == 2) {
                toggleHeaderMenu(true);
            } else {
                toggleHeaderMenu(false);
            }

            self.nav.level --;
            $(self.nav.container).attr('data-state', 'lvl-' + self.nav.level);
        });

        $(window).load(function() {
            self.onDocReady();
        });
    }

    onDocReady() {
        let self = this;

        self.currentBp = self._getBreakpoint();

        // move the header menu out of the mobile menu on nav break
        // on resize, move it back
        // we need to put this in a finalize function so it will run after the DOM has loaded
        // otherwise, sometimes the js fires before the element exists, resulting in a broken layout 
        if (self.currentBp >= 5) {
            $(self.header).append($(self.headerMenu));
        }

        $(window).resize(function() {
            self.currentBp = self._getBreakpoint();

            if (self.currentBp >= 5 && !$(self.header + ' ' + self.headerMenu).length) {
                $(self.header).append($(self.headerMenu));
                self.$overlay.fadeOut(self.animTime);
            } 

            if (self.currentBp < 5 && $(self.header + ' ' + self.headerMenu).length) {
                $(self.nav.container).append($(self.headerMenu));
            }
        });
    }
}
