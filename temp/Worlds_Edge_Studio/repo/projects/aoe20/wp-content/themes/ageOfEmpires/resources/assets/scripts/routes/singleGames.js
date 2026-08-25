import 'slick-carousel';
import MediaCarousel from '../components/MediaCarousel';
import MobileHero from '../components/MobileHero';


export default {
  init() {
    new MediaCarousel();
    new MobileHero();
  },
  finalize() {
    
  },
};
