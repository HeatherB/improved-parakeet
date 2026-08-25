export default class Accordion {

    constructor() {
       this.init();
    }

    init() {
        // See an accessiblity accordion at
        // https://www.w3.org/TR/wai-aria-practices-1.1/examples/accordion/accordion.html
        // for what this code was based on
        const accordionWrapper = document.querySelectorAll('.accessible-accordion-wrapper') || null;
        const accordionBtn = document.querySelectorAll('.accessible-accordion-wrapper > button') || null;
        const accordionContent = document.querySelectorAll('.accessible-accordion-wrapper > .accessible-accordion-content') || null;

        if(
            !accordionWrapper &&
            !accordionBtn &&
            !accordionContent
        ) {
            return;
        }

        /*
        Assign a large random number (100 to 199) to a variable
        to use in the .accordion-wrapper > .accordion-item > button element
        for loop below to generate unique values
        for id, aria-controls, and aria-labelledby attributes
        for said button element and sibling .accordion-wrapper > .accordion-item > .accordion-content
        element
        */
        const randNum = Math.floor( (Math.random() * 100) + 100 );
        // elem.closest() doesn't work in IE browser so this polyfill is needed.
        // For browser support see:
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
        let closest = (elem, selector) => {
            try {
             if(elem.matches(selector)) {
               return elem;
             }

             elem.parentNode;

             while(!elem.matches(selector)) {
               elem = elem.parentNode;
             }
             return elem;

             } catch(err) {
               return null;
             }
        }

        let showHideElems = (elem, boolean) => {

            for(let i = 0; i < elem.length; i++) {

                let accordionBtnId = 'accordion-btn-id-' + randNum + '-' + [i];

                if(boolean === true) {
                    console.log('bool true ');
                    elem[i].setAttribute('aria-hidden', 'false');
                    elem[i].classList.remove('active');
                    elem[i].setAttribute('style', 'max-height: ' + elem[i].scrollHeight + 'px');
                    elem[i].removeAttribute('aria-labelledby');

                    accordionBtn[i].setAttribute('aria-expanded', 'false');
                    accordionBtn[i].setAttribute('aria-pressed', 'false');
                } else {
                    console.log('bool false');
                    let getTransitionTime =  closest(elem[i], '.accessible-accordion-wrapper').getAttribute('data-transition-time-ms') || 500;

                    elem[i].setAttribute('aria-hidden', 'true');
                    elem[i].setAttribute('style', 'overflow: hidden; max-height: 0px; transition: max-height ' + getTransitionTime + 'ms ease-in;');
                    elem[i].setAttribute('aria-labelledby', accordionBtnId);

                    accordionBtn[i].setAttribute('aria-expanded', 'false');
                    accordionBtn[i].setAttribute('aria-pressed', 'false');
                }
            }
        }

        let showHidePerViewportWidth = () => {
            let viewportWidth = window.innerWidth;
            for(let i = 0; i < accordionWrapper.length; i++) {
                let getShowOnWidthVal = Number(accordionWrapper[i].getAttribute('data-width-always-show')) || null;
                if(!getShowOnWidthVal) {
                    break;
                }

                let accordionContent = accordionWrapper[i].querySelectorAll('.accessible-accordion-content');

                if(viewportWidth >= getShowOnWidthVal) {
                    showHideElems(accordionContent, true);
                } else {
                    showHideElems(accordionContent, false);
                }
            }
        }

        const accordionBtnOnClick = (e) => {
            const accordionBtnClicked = e.target;
            const accordionBtnContent = accordionBtnClicked.nextElementSibling;

            let getTransitionTime =  closest(accordionBtnClicked, '.accessible-accordion-wrapper').getAttribute('data-transition-time-ms') || 500;

            if(accordionBtnClicked.getAttribute('aria-expanded') === 'false') {
                console.log('first');
                accordionBtnClicked.setAttribute('aria-expanded', 'true');
                accordionBtnClicked.setAttribute('aria-pressed', 'true');

                accordionBtnContent.setAttribute('style', 'overflow: hidden; max-height:' + accordionBtnContent.scrollHeight + 'px; transition: max-height ' + getTransitionTime + 'ms ease-in;');
                accordionBtnContent.classList.add('active');
                accordionBtnContent.setAttribute('aria-hidden', 'false');
            } else {
                console.log('else');
                accordionBtnClicked.setAttribute('aria-expanded', 'false');
                accordionBtnClicked.setAttribute('aria-pressed', 'false');

                accordionBtnContent.setAttribute('style', 'overflow: hidden; max-height: 0px; transition: max-height ' + getTransitionTime + 'ms ease-in;');
                accordionBtnContent.classList.remove('active');
                accordionBtnContent.setAttribute('aria-hidden', 'true');
            }
        };

        for(let i = 0; i < accordionBtn.length; i++) {
            let singleAccordionBtn = accordionBtn[i];
            const singleAccordionContent = singleAccordionBtn.nextElementSibling || null;

            if(!singleAccordionContent) {
                return;
            }

            // See an accessiblity accordion at
            // https://www.w3.org/TR/wai-aria-practices-1.1/examples/accordion/accordion.html
            // for what this code was based on
            let accordionBtnId = 'accordion-btn-id-' + randNum + '-' + [i];
            let accordionContentId = 'accordion-content-id-' + randNum + '-' + [i];

            singleAccordionBtn.setAttribute('id', accordionBtnId);
            singleAccordionBtn.setAttribute('aria-controls', accordionContentId);

            singleAccordionContent.setAttribute('id', accordionContentId);
            singleAccordionContent.setAttribute('aria-labelledby', accordionBtnId);

            singleAccordionBtn.addEventListener('click', accordionBtnOnClick);
        }

        window.addEventListener('resize', () => {
            for(let i = 0; i < accordionWrapper.length; i++) {
                let getShowOnWidthVal = Number(accordionWrapper[i].getAttribute('data-width-always-show')) || null;
                if(!getShowOnWidthVal) {
                    break;
                }

                showHidePerViewportWidth();
            }
        });

        showHidePerViewportWidth();
    }
 }
