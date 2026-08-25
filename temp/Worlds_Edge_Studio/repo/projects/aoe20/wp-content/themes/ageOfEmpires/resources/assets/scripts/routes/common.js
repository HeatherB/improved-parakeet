import Header from '../components/Header';
import ButtonAnimation from '../components/ButtonAnimation';
import Accordion from '../components/Accordion';

export default {
  init() {
    // JavaScript to be fired on all pages
    new ButtonAnimation();
    new Header();
    new Accordion();
  },
  finalize() {
    // JavaScript to be fired on all pages, after page specific JS is fired
    
    if ('ontouchstart' in document.documentElement) {
        $('html').addClass('has-touch');
    }
  },
};
