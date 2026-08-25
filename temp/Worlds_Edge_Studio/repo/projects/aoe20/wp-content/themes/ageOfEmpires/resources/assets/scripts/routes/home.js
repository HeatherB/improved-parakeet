import GetAjaxPosts from '../components/GetAjaxPosts';
import MobileHero from '../components/MobileHero';
import CommunityConnections from '../components/CommunityConnections';

export default {
  init() {
    new GetAjaxPosts();
    new MobileHero();
    new CommunityConnections();
    // JavaScript to be fired on the home page
  },
  finalize() {
    // JavaScript to be fired on the home page, after the init JS
  },
};
