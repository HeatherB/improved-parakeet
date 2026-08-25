import config from '../config';
import ModDetail from '../component/ModDetail';
import alertNotLoggedIn from '../templates/alertNotLoggedInSteam.html';
export default {
    init() {
        let $main = $('#mod-detail-main');
        if (config.userLoggedIn) {
            new ModDetail();
        } else {
            $main.children(':not(.section-nav.mods-nav)').remove();
            $main.append(alertNotLoggedIn());
        }
  },
};
