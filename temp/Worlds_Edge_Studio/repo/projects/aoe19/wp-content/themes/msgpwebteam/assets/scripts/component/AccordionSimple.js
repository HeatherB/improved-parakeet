export default class AccordionSimple {

    constructor() {
       this.init();
    }

    init() {
        this.ui = {
            accordionBtn     : document.getElementById('civ_subnav_mobile_btn'),
        }
        this.$bpIndicator = $('.breakpoint-indicator');

        if(!this.ui.accordionBtn) {
            return;
        }

        this._events();

    }

    _toggleMenu() {
        let self = this;
        const accordionBtnContent = event.target.nextElementSibling;
        const accordionBtnClicked = event.target;

        if(event.target.getAttribute('aria-expanded') === 'false') {
            console.log('first');
            accordionBtnClicked.setAttribute('aria-expanded', 'true');
            accordionBtnClicked.setAttribute('aria-pressed', 'true');

            accordionBtnContent.classList.add('active');
            accordionBtnContent.setAttribute('aria-hidden', 'false');
        } else {
            console.log('else');
            accordionBtnClicked.setAttribute('aria-expanded', 'false');
            accordionBtnClicked.setAttribute('aria-pressed', 'false');

            accordionBtnContent.classList.remove('active');
            accordionBtnContent.setAttribute('aria-hidden', 'true');
        }
    }

    _events() {
        let self = this;

        self.ui.accordionBtn.addEventListener('click', this._toggleMenu);
    }
 }
