import config from '../config';
import ModsList from '../component/ModsList';
import alertNotLoggedIn from '../templates/alertNotLoggedInSteam.html';
export default {
    init() {
        let $main = $('#mods-list-main');
        if (config.userLoggedIn) {
            new ModsList({
                modsListApi: config.api.modsFind,
            });
        } else {
            $main.children(':not(.section-nav.mods-nav)').remove();
            $main.append(alertNotLoggedIn());
        }
  },
};
