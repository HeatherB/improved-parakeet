export default class ModsMenu {
    constructor() {
        this.init();
    }

    init() {
        this.ui = {
            menu : '.mods__mobile-menu',
            menu_sub : '.mods__subnav-block',
            menu_sub_options : '.mods__subnav-options',
        }

        this.$bpIndicator = $('.js-bp-indicator');

        this._setupMenu();
    }

    _getBreakpoint() {
        // the nav-break breakpoint is 5
        return parseInt(this.$bpIndicator.css('z-index'));
    }


    _setupMenu() {
        let self = this;

        let gameChoices = Array.prototype.slice.call(document.querySelectorAll(self.ui.menu_sub_options));
        let subMenus = Array.prototype.slice.call(document.querySelectorAll(self.ui.menu_sub));
        
        /* hide game option by default */
        gameChoices.forEach(gameChoice => {
            gameChoice.hidden = true;
        });


        /* hide sub menu for mobile */
        if ( self._getBreakpoint() < 5 ) {
            subMenus.forEach(subMenu => {
                subMenu.hidden = true;
            });

        }

    }

}