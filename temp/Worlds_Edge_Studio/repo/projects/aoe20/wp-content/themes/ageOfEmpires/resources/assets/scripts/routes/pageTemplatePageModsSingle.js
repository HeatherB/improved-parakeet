import config from '../config';
import ModDetail from '../components/ModDetail';
import ModDiscussion from '../components/ModDiscussion';
import ModsMenu from '../components/ModsMenu';
import ThumbCarousel from '../components/ThumbCarousel';
//import alertNotLoggedIn from '../templates/alertNotLoggedInSteam.html';

export default {
	init() {

		//let $main = $('#mod-detail');
        if (config.userLoggedIn) {
            new ModDetail();
            new ModDiscussion();
            new ModsMenu();
			new ThumbCarousel();
        } //else {
            //$main.children(':not(.section-nav.mods-nav)').remove();
            //$main.append(alertNotLoggedIn());
        //}
	},
};