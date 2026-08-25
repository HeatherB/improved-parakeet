export default class Accordion {
    constructor() {
      this.init();
    }

    init() {
      this._accordionOpenClose();
    }

    _accordionOpenClose() {
      const accordionTitle = '.js-accordion-title';
      const closedClass = '--is-closed';

      if (document.querySelectorAll(accordionTitle)) {
        const accordionQuestions = Array.prototype.slice.call(document.querySelectorAll(accordionTitle));
        
        accordionQuestions.forEach(accordionQuestion => {
          let target = accordionQuestion.parentElement.nextElementSibling;
          accordionQuestion.onclick = () => {
            let expanded = accordionQuestion.getAttribute('aria-expanded') === 'true' || false;
            accordionQuestion.setAttribute('aria-expanded', !expanded);
            accordionQuestion.classList.toggle(closedClass);
            target.hidden ? target.hidden = false : target.hidden = true;
          }
        })
      } 
    }
  }
